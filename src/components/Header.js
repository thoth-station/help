import React from "react";
import PropTypes from "prop-types";
import { Link, useStaticQuery, graphql, withPrefix } from 'gatsby';
import {
  PageHeader,
  PageHeaderTools,
  PageHeaderToolsItem,
  Nav,
  NavList,
  NavItem,
  Button,
  Brand,
  Flex,
  Text,
  TextVariants,
  FlexItem,
} from "@patternfly/react-core";
import GithubIcon from "@patternfly/react-icons/dist/esm/icons/github-icon";
import YoutubeIcon from "@patternfly/react-icons/dist/esm/icons/youtube-icon";
import TwitterIcon from "@patternfly/react-icons/dist/esm/icons/twitter-icon";

import logo from "./logo.png";

const TopNav = ({ location }) => {
  const navItems = [["documentation", "Documentation"]];

  return (
    <Nav variant="horizontal">
      <NavList>
        {navItems.map(([id, label]) => (
          <NavItem
            key={id}
            itemId={id}
            isActive={location.pathname.startsWith(`/${id}/`)}
          >
            <Link to={`/${id}/`}>{label}</Link>
          </NavItem>
        ))}
      </NavList>
    </Nav>
  );
};
TopNav.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

const HeaderTools = () => {
  const {
    site: { siteMetadata: links },
  } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            github
            youtube
            twitter
          }
        }
      }
    `
  );

  const headerTools = [
    {
      href: links.github,
      ariaLabel: "Thoth Station GitHub organization",
      icon: <GithubIcon />,
    },
    {
      href: links.youtube,
      ariaLabel: "Thoth Station YouTube",
      icon: <YoutubeIcon />,
    },
    {
      href: links.twitter,
      ariaLabel: "Thoth Station Twitter",
      icon: <TwitterIcon />,
    },
  ];

  return (
    <PageHeaderTools>
      {headerTools.map((t) => (
        <PageHeaderToolsItem key={t.href}>
          <Button
            component="a"
            variant="plain"
            href={t.href}
            target="top"
            aria-label={t.ariaLabel}
          >
            {t.icon}
          </Button>
        </PageHeaderToolsItem>
      ))}
    </PageHeaderTools>
  );
};

export const Header = ({ isNavOpen, onNavToggle, location }) => (
  <PageHeader
    className="header"
    logoProps={{ href: withPrefix("/") }}
    logo={
      <Flex alignItems={{ default: "alignItemsCenter" }}>
        <FlexItem>
          <Brand src={logo} alt="Thoth Logo" />
        </FlexItem>
        <FlexItem>
          <Text
            style={{ color: "white", fontWeight: "bolder" }}
            component={TextVariants.h1}
          >
            Project Thoth Help
          </Text>
        </FlexItem>
      </Flex>
    }
    showNavToggle={location.pathname !== "/"}
    isNavOpen={isNavOpen}
    onNavToggle={onNavToggle}
    topNav={<TopNav location={location} />}
    headerTools={<HeaderTools />}
  />
);

Header.propTypes = {
  isNavOpen: PropTypes.bool.isRequired,
  onNavToggle: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};
