import { octokit } from "./githubAuth";

const expandIssueURL = (url) => {
  const expanded = url.replace("https://", "").split("/");

  if (expanded.length !== 5 || expanded[3] !== "issues") {
    return null;
  } else {
    return {
      owner: expanded[1],
      repo: expanded[2],
      issue_number: expanded[4],
    };
  }
};

export const getIssue = async (url) => {
  const expanded = expandIssueURL(url);
  if (expanded) {
    return octokit
      .request(
        `GET /repos/${expanded.owner}/${expanded.repo}/issues/${expanded.issue_number}`,
        {
          owner: expanded.owner,
          repo: expanded.repo,
          issue_number: expanded.issue_number,
        }
      )
      .then(async (response) => {
        const timeline = await fetchGitHubApiUrl(response.data.timeline_url);
        return {
          ...response.data,
          timeline: timeline,
        };
      })
      .catch((error) => {
        return {
          isError: true,
          errorMsg:
            error?.status +
            ": " +
            (error?.response?.data?.message ?? error?.name ?? "Unknown error"),
        };
      });
  } else {
    return {
      isError: true,
      errorMsg: "Could not parse the URL",
    };
  }
};

const fetchGitHubApiUrl = (url) => {
  return octokit.request(url).then((response) => response.data);
};
