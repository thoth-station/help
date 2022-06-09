import React from "react";
import {
  Flex,
  FlexItem,
  Stack,
  StackItem,
  Text,
  TextVariants,
} from "@patternfly/react-core";
import footer_logo from "./footer_logo.png";
import "./Footer.scss";

export const Footer = () => (
  <footer>
    <Flex
      className="footer"
      justifyContent={{ default: "justifyContentCenter" }}
      alignItems={{ default: "alignItemsFlexStart" }}
    >
      <FlexItem className="column">
        <img
          alt="Red Hat Sponsor Logo"
          src={footer_logo}
          style={{ height: "40px" }}
        />
      </FlexItem>
      <FlexItem className="column">
        <Stack>
          <StackItem>
            <Text component={TextVariants.h3}>Useful as</Text>
          </StackItem>
          <StackItem>
            <a
              className="footer-a"
              href="https://github.com/orgs/thoth-station/projects/"
            >
              GitHub project board
            </a>
          </StackItem>
          <StackItem>
            <a className="footer-a" href="http://bit.ly/thoth-on-youtube">
              YouTube channel
            </a>
          </StackItem>
          <StackItem>
            <a className="footer-a" href="https://twitter.com/ThothStation">
              Twitter
            </a>
          </StackItem>
          <StackItem>
            <a className="footer-a" href="https://github.com/thoth-station">
              GitHub organization
            </a>
          </StackItem>
          <StackItem>
            <a className="footer-a" href="https://www.kaggle.com/thothstation">
              Kaggle datasets
            </a>
          </StackItem>
        </Stack>
      </FlexItem>
      <FlexItem className="column">
        <Stack>
          <StackItem>
            <Text component={TextVariants.h3}>Info</Text>
          </StackItem>
          <StackItem>
            <a
              className="footer-a"
              href="https://thoth-station.ninja/docs/developers/adviser/landing_page.html#landing-page"
            >
              Thoth's landing page
            </a>
          </StackItem>
          <StackItem>
            <a
              className="footer-a"
              href="https://thoth-station.ninja/docs/developers/adviser/"
            >
              Main documentation page
            </a>
          </StackItem>
        </Stack>
      </FlexItem>
      <FlexItem className="column">
        <Stack>
          <StackItem>
            <Text component={TextVariants.h3}>Friends</Text>
          </StackItem>
          <StackItem>
            <a className="footer-a" href="https://github.com/AICoE/aicoe-ci">
              AICoE-CI
            </a>
          </StackItem>
          <StackItem>
            <a className="footer-a" href="https://www.operate-first.cloud/">
              Operate First
            </a>
          </StackItem>
          <StackItem>
            <a className="footer-a" href="http://opendatahub.io/">
              Open Data Hub
            </a>
          </StackItem>
        </Stack>
      </FlexItem>
    </Flex>
  </footer>
);
