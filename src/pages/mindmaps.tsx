import React from "react";
import type { HeadFC } from "gatsby";
import LogoThumbnail from "images/logo-thumbnail.png";
import Meta from "components/meta";
import { meta } from "../../meta";
import { MindmapsView } from "features/mindmaps/mindmaps.view";
import { EducationZoneLinkContainer } from "containers/education-zone-link.container";
import { CreationLinkContainer } from "containers/creation-link.container";
import { AppNavigation } from "components/app-navigation";
import { EducationRankLinkContainer } from "containers/education-rank-link.container";
import { AppFooterContainer } from "containers/app-footer.container";

const MindmapsPage = () => {
  return (
    <>
      <AppNavigation>
        <CreationLinkContainer />
        <EducationRankLinkContainer />
        <EducationZoneLinkContainer />
      </AppNavigation>
      <MindmapsView />
      <AppFooterContainer />
    </>
  );
};

export default MindmapsPage;

export const Head: HeadFC = () => {
  return (
    <Meta
      appName={meta.appName}
      title={`Your mindmaps | ${meta.appName}`}
      description={meta.description}
      url={meta.siteUrl + meta.routes.mindmaps.management}
      lang={meta.lang}
      image={meta.siteUrl + LogoThumbnail}
      robots="noindex, nofollow"
    />
  );
};
