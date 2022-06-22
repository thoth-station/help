import React, { useEffect, useMemo, useState } from "react";
import { getIssue } from "./getIssueData";
import {
  Alert,
  Avatar,
  Button,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormAlert,
  FormGroup,
  Label,
  List,
  ListItem,
  Popover,
  ProgressStep,
  ProgressStepper,
  TextInput,
} from "@patternfly/react-core";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExternalLinkAltIcon,
  QuestionCircleIcon,
} from "@patternfly/react-icons";
import { getDate, getIssueStep } from "./getIssueStep";
import ReactMarkdown from "react-markdown";
import { hexToHSL } from "./hexToHsl";
import { IssueEvent } from "./IssueEvent";
import { navigate } from "gatsby";
import { useLocation } from "@reach/router";
import * as queryString from "query-string";

const IssueTracker = () => {
  const [input, setInput] = useState("");
  const [issue, setIssue] = useState();
  const [issueError, setIssueError] = useState();
  const [validated, setValidated] = useState("default");
  const location = useLocation();

  const timelineInfo = useMemo(() => {
    if (issue) {
      return getIssueStep(issue);
    }
  }, [issue]);

  useEffect(() => {
    const { issue_url } = queryString.parse(location.search);
    if (issue_url) {
      handleChange(decodeURIComponent(issue_url));
      handleFetch(issue_url);
    }
  }, [location.search]);

  const handleChange = (text) => {
    setInput(text);

    if (text) {
      setValidated(
        text.match(/.*github\.com\/.*\/.*\/issues\/[0-9]*/)
          ? "success"
          : "error"
      );
    } else {
      setValidated("default");
    }
  };

  const handleFetch = (issue_url) => {
    setIssueError(undefined);
    setIssue(undefined);

    getIssue(issue_url ?? input).then((data) => {
      if (data.isError) {
        setIssueError(data.errorMsg);
      } else {
        setIssue(data);
        navigate(`?issue=${encodeURIComponent(data.html_url)}`);
      }
    });
  };

  return (
    <div>
      <Form style={{ marginBottom: "2rem" }}>
        <FormGroup
          label="GitHub Issue URL"
          type="text"
          fieldId="issueUrl"
          helperTextInvalid="Must be a valid issue URL"
          helperTextInvalidIcon={<ExclamationCircleIcon />}
          validated={validated}
        >
          {issueError && (
            <FormAlert>
              <Alert
                variant="danger"
                title={issueError}
                aria-live="polite"
                isInline
                style={{ marginBottom: "1rem" }}
              />
            </FormAlert>
          )}
          <div style={{ display: "flex" }}>
            <TextInput
              placeholder="https://github.com/org/repo/issues/123"
              validated={validated}
              value={input}
              onChange={handleChange}
              id="issue-search"
              style={{ marginRight: "1rem" }}
            />
            <Button variant="primary" onClick={() => handleFetch()}>
              Fetch
            </Button>
          </div>
        </FormGroup>
      </Form>

      {issue && (
        <div>
          <Card isRounded>
            <CardTitle>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  <Label
                    style={{ marginRight: "1rem" }}
                    color={issue.state === "open" ? "green" : "purple"}
                  >
                    {issue.state.toUpperCase()}
                  </Label>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div>{issue.title}</div>
                    <div style={{ fontSize: "small", color: "gray" }}>
                      {"Last updated on "}
                      {getDate(issue?.updated_at ?? issue?.created_at)}
                    </div>
                  </div>
                </div>
                <Button
                  component="a"
                  variant="plain"
                  href={issue.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={<ExternalLinkAltIcon />}
                />
              </div>
            </CardTitle>
            <CardBody>
              <ProgressStepper>
                {timelineInfo.map((point, i) => (
                  <ProgressStep
                    isCurrent={point.isCurrent}
                    variant={point.step}
                    description={point.description}
                    id={point.id + i}
                    titleId={point.id + i}
                    key={point.id + i}
                    popoverRender={(stepRef) => (
                      <Popover
                        headerContent={<div>Requirements for completion</div>}
                        bodyContent={
                          <>
                            {point.step === "warning" && (
                              <Alert
                                style={{ marginBottom: "1rem" }}
                                variant="warning"
                                isInline
                                title="Future steps were completed before this step met it's requirements"
                              />
                            )}
                            <List isPlain>
                              {point.criteria.map((c, index) => {
                                if (c.group !== undefined) {
                                  return (
                                    <React.Fragment key={c.title + index}>
                                      {c.group.map((g, i) => (
                                        <React.Fragment key={g.title + i}>
                                          <ListItem
                                            icon={
                                              g.status ? (
                                                <CheckCircleIcon color="#3E8635" />
                                              ) : (
                                                <QuestionCircleIcon />
                                              )
                                            }
                                          >
                                            <ReactMarkdown>
                                              {g.title}
                                            </ReactMarkdown>
                                          </ListItem>
                                          {i !== c.group.length - 1 && (
                                            <ListItem
                                              style={{ marginLeft: "2rem" }}
                                            >
                                              <b>OR</b>
                                            </ListItem>
                                          )}
                                        </React.Fragment>
                                      ))}
                                    </React.Fragment>
                                  );
                                } else {
                                  return (
                                    <ListItem
                                      key={c.title + index}
                                      icon={
                                        c.status ? (
                                          <CheckCircleIcon color="#3E8635" />
                                        ) : (
                                          <QuestionCircleIcon />
                                        )
                                      }
                                    >
                                      <ReactMarkdown>{c.title}</ReactMarkdown>
                                    </ListItem>
                                  );
                                }
                              })}
                            </List>
                          </>
                        }
                        reference={stepRef}
                        position="right"
                      />
                    )}
                  >
                    {point.title}
                  </ProgressStep>
                ))}
              </ProgressStepper>

              <div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <b>Author</b>
                  <div
                    style={{
                      display: "flex",
                      alignContent: "center",
                      marginTop: ".5rem",
                    }}
                  >
                    <Avatar
                      size="sm"
                      style={{ marginRight: "1rem" }}
                      src={issue.user.avatar_url}
                      alt="avatar"
                    />
                    {issue.user.login}
                  </div>
                </div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <b>Assignees</b>
                  {issue?.assignees?.map((assignee) => (
                    <div
                      key={assignee.login}
                      style={{
                        display: "flex",
                        alignContent: "center",
                        marginTop: ".5rem",
                        marginBottom: ".5rem",
                      }}
                    >
                      <Avatar
                        size="sm"
                        style={{ marginRight: "1rem" }}
                        src={assignee.avatar_url}
                        alt="avatar"
                      />
                      {assignee.login}
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <b>Labels</b>
                  <div>
                    <div style={{ display: "flex", marginTop: ".5rem" }}>
                      {issue?.labels?.map((label) => {
                        const hsl = hexToHSL("#" + label.color);
                        const rgb = {
                          r: hsl.r * 0.2126,
                          g: hsl.g * 0.7152,
                          b: hsl.b * 0.0722,
                        };
                        const sum = rgb.r + rgb.g + rgb.b;
                        const perceivedLightness = sum / 255;

                        return (
                          <Label
                            key={label.name}
                            style={{
                              marginRight: ".5rem",
                              backgroundColor: `#${label.color}`,
                            }}
                          >
                            <div
                              style={{
                                color: `hsl(0, 0%, calc((${perceivedLightness} - 0.5) * -10000000%))`,
                              }}
                            >
                              {label.name}
                            </div>
                          </Label>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <b>Linked Pull Requests</b>
                  {issue?.timeline?.map((event, i) => {
                    if (event?.source?.issue?.pull_request) {
                      return (
                        <IssueEvent event={event} key={i + event.updated_at} />
                      );
                    }
                    return undefined;
                  })}
                </div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <b>Linked Issues</b>
                  {issue?.timeline?.map((event, i) => {
                    if (
                      event?.source?.issue &&
                      !event?.source?.issue?.pull_request
                    ) {
                      return (
                        <IssueEvent event={event} key={i + event.updated_at} />
                      );
                    }
                    return undefined;
                  })}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};

export default IssueTracker;
