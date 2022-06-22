const goodQualityIssueLabels = [/kind\//, /priority\//, /sig\//];

export const getDate = (dateStr) => {
  const date = new Date(dateStr);
  const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
    date
  );
  return `${month} ${date.getDay()}, ${date.getFullYear()}`;
};

export const getIssueStep = (issue) => {
  const latestProjectEvent = issue.timeline
    .reverse()
    .find((e) => e.project_card);
  const currentColumn =
    latestProjectEvent?.event !== "removed_from_project"
      ? latestProjectEvent?.project_card?.column_name
      : "";

  const allPRs = issue.timeline.filter((e) => e?.source?.issue?.pull_request);

  const timelineInfo = [
    {
      id: "created",
      title: "Issue is created",
      description: `#${issue.number} opened on ${getDate(
        issue.created_at
      )} by ${issue.user.login}`,
      criteria: [
        {
          title: "Issue has been created",
          status: !!issue,
        },
      ],
    },
    {
      id: "goodIssue",
      title: "Issue is good quality",
      criteria: [
        ...goodQualityIssueLabels.map((label) => ({
          title:
            "Issue includes a `" + label.source.replace("\\/", "") + "` label",
          status: issue.labels.some((issueLabel) =>
            issueLabel.name.match(label)
          ),
        })),
        {
          group: [
            {
              title:
                "The issue's title includes story points in the format of `[3pt]`",
              status: issue.title.match(/\[[0-9]pt]/),
            },
            {
              title:
                "The issue's title includes an issue descriptor in the format of `[EPIC]` or `[SPIKE]`",
              status:
                issue.title.match(/\[EPIC]/i) ||
                issue.title.match(/\[SPIKE]/i),
            },
          ],
        },
      ],
    },
    {
      id: "triaged",
      title: "Issue is triaged",
      criteria: [
        {
          title: "Issue includes the `triage/accepted` label",
          status: issue.labels.some(
            (label) => label.name === "triage/accepted"
          ),
        },
      ],
    },
    {
      id: "planned",
      title: "Issue is planned",
      criteria: [
        {
          title: "Issue is tracked in a GitHub project board",
          status: !!currentColumn,
        },
        {
          title: "Issue has been planned for a sprint",
          status: ["next", "epics", "in progress", "done"].includes(
            currentColumn?.toLowerCase()
          ),
        },
        {
          title: "Issue has an assignee",
          status: !!issue.assignee,
        },
      ],
    },
    {
      id: "inProgress",
      title: "Issue is being worked on",
      criteria: [
        {
          group: [
            {
              title:
                "Issue is on a GitHub project board's `in progress` column",
              status: currentColumn?.toLowerCase() === "in progress",
            },
            {
              title: "Issue has an open pull request",
              status: allPRs.some(
                (pr) => !pr.source.issue.pull_request.merged_at
              ),
            },
            {
              title: "Issue includes the `lifecycle/active` label",
              status: issue.labels.some(
                (label) => label.name === "lifecycle/active"
              ),
            },
          ],
        },
      ],
    },
    {
      isCurrent: false,
      id: "done",
      title: "Issue is Done",
      description: issue.closed_at
        ? `#${issue.number} by ${issue.user.login} was closed on ${getDate(
            issue.closed_at
          )}`
        : undefined,
      criteria: [
        {
          title: "Issue has been closed",
          status: issue.closed_at,
        },
      ],
    },
  ];

  timelineInfo.forEach((point, i) => {
    timelineInfo[i].criteria.forEach((c, j) => {
      if (c.group) {
        timelineInfo[i].criteria[j]["status"] = c.group.some((g) => g.status);
      }
    });
  });

  let currentStep = -1;

  timelineInfo.forEach((point, i) => {
    if (timelineInfo[i].criteria.every((c) => c.status)) {
      point["step"] = "success";
    } else {
      if (currentStep === -1) {
        currentStep = i;
        point["isCurrent"] = true;
      }

      if (
        timelineInfo.slice(i + 1).some((p) => p.criteria.every((c) => c.status))
      ) {
        point["step"] = "warning";
      } else if (currentStep === i) {
        point["step"] = "info";
      } else {
        point["step"] = "pending";
      }
    }
  });

  return timelineInfo;
};
