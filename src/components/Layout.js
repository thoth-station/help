import React, { useState } from "react";
import PropTypes from "prop-types";

import {
  Page,
  PageSection,
  PageSectionVariants,
  TextContent,
  Button,
} from "@patternfly/react-core";

import { Header } from "./Header";
import { NavSidebar } from "./NavSidebar";

import "@patternfly/patternfly/patternfly.css";

export const Layout = ({ location, srcLink, banner, children }) => {
  const [isNavOpen, setIsNavOpen] = useState(true);

  const onNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <Page
      header={
        <Header
          isNavOpen={isNavOpen}
          onNavToggle={onNavToggle}
          location={location}
        />
      }
      sidebar={<NavSidebar isNavOpen={isNavOpen} location={location} />}
      isManagedSidebar
      className="layout"
    >
      {banner && (
        <PageSection className="banner">
          <TextContent>
            <section dangerouslySetInnerHTML={{ __html: banner.html }} />
          </TextContent>
        </PageSection>
      )}
      {children}
      <PageSection
        isFilled
        className="ofc-text-center"
        variant={PageSectionVariants.dark}
      >
        <TextContent>
          <Button
            variant="primary"
            isLarge
            component="a"
            href={srcLink}
            target="_contribute"
          >
            Contribute to this page
          </Button>
        </TextContent>
      </PageSection>
    </Page>
  );
};

Layout.propTypes = {
  srcLink: PropTypes.string,
  children: PropTypes.node,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  banner: PropTypes.shape({
    html: PropTypes.string.isRequired,
  }),
};

export default Layout;
