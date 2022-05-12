import React from "react";
import {
  Flex,
  FlexItem,
  Stack,
  StackItem,
  Text,
  TextVariants
} from '@patternfly/react-core';
import footer_logo from "./footer_logo.png"
import "./Footer.scss";
import { Link } from 'gatsby';

export const Footer = () => (
    <footer>
      <Flex className="footer" justifyContent={{ default: "justifyContentCenter" }} alignItems={{default: 'alignItemsFlexStart'}}>
        <FlexItem className="column">
          <img alt="Red Hat Sponsor Logo" src={footer_logo} style={{height: "40px"}}/>
        </FlexItem>
        <FlexItem className="column">
          <Stack>
            <StackItem>
              <Text component={TextVariants.h3}>
                Useful links
              </Text>
            </StackItem>
            <StackItem>
              <Link className="footer-link" replace to="https://github.com/orgs/thoth-station/projects/">
                GitHub project board
              </Link>
            </StackItem>
            <StackItem>
              <Link className="footer-link" replace to="http://bit.ly/thoth-on-youtube">
                YouTube channel
              </Link>
            </StackItem>
            <StackItem>
              <Link className="footer-link" replace to="https://twitter.com/ThothStation">
               Twitter
              </Link>
            </StackItem>
            <StackItem>
              <Link className="footer-link" replace to="https://github.com/thoth-station">
                GitHub organization
              </Link>
            </StackItem>
            <StackItem>
              <Link className="footer-link" replace to="https://www.kaggle.com/thothstation">
                Kaggle datasets
              </Link>
            </StackItem>
          </Stack>
        </FlexItem>
        <FlexItem className="column">
        <Stack>
          <StackItem>
            <Text component={TextVariants.h3}>
              Info
            </Text>
          </StackItem>
          <StackItem>
            <Link replace className="footer-link" to="https://thoth-station.ninja/docs/developers/adviser/landing_page.html#landing-page">
              Thoth's landing page
            </Link>
          </StackItem>
          <StackItem>
            <Link replace className="footer-link" to="https://thoth-station.ninja/docs/developers/adviser/">
              Main documentation page
            </Link>
          </StackItem>
        </Stack>
        </FlexItem>
        <FlexItem className="column">
          <Stack>
            <StackItem>
              <Text component={TextVariants.h3}>
                Friends
              </Text>
            </StackItem>
            <StackItem>
              <Link className="footer-link" replace to="https://github.com/AICoE/aicoe-ci">
                AICoE-CI
              </Link>
            </StackItem>
            <StackItem>
              <Link className="footer-link" replace to="https://www.operate-first.cloud/">
                Operate First
              </Link>
            </StackItem>
            <StackItem>
              <Link className="footer-link" replace to="http://opendatahub.io/">
                Open Data Hub
              </Link>
            </StackItem>
          </Stack>
        </FlexItem>
      </Flex>
  </footer>
);
