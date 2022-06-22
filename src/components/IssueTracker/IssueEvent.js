import { getDate } from "./getIssueStep";
import { Label } from "@patternfly/react-core";
import React, { useMemo } from "react";

export const IssueEvent = ({ event, ...props }) => {
  const statusLabel = useMemo(() => {
    const status = (() => {
      if (event?.source?.issue.state === "open") {
        return ["green", "OPEN"];
      } else if (event?.source?.issue?.pull_request) {
        if (event?.source?.issue?.pull_request?.merged_at) {
          return ["purple", "MERGED"];
        } else {
          return ["red", "CLOSED"];
        }
      } else {
        return ["purple", "CLOSED"];
      }
    })();

    return (
      <Label style={{ marginRight: "1rem" }} color={status[0]}>
        {status[1]}
      </Label>
    );
  }, [event]);

  return (
    <div {...props} style={{ marginTop: ".5rem", marginBottom: ".5rem" }}>
      <div style={{ fontSize: "small", color: "gray" }}>
        <b>@{event?.source?.issue?.user?.login}</b>
        {" mentioned this issue on "}
        {getDate(event?.source?.issue?.created_at)}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <a
          style={{ color: "black" }}
          href={event?.source?.issue?.html_url}
          target="_blank"
          rel="noopener noreferrer"
        >{`#${event?.source?.issue.number} ${event?.source?.issue.title}`}</a>
        {statusLabel}
      </div>
    </div>
  );
};
