import React from "react";
import type { HeadFC } from "gatsby";
import LogoThumbnail from "images/logo-thumbnail.png";
import Meta from "components/meta";
import { meta } from "../../meta";
import { LikedResourcesView } from "features/liked-resources/liked-resources.view";
import { EducationZoneLinkContainer } from "containers/education-zone-link.container";
import { CreationLinkContainer } from "containers/creation-link.container";
import { AppNavigation } from "components/app-navigation";
import { EducationRankLinkContainer } from "containers/education-rank-link.container";
import { AppFooterContainer } from "containers/app-footer.container";

const StarredPage = () => {
  return (
    <>
      <AppNavigation>
        <CreationLinkContainer />
        <EducationRankLinkContainer />
        <EducationZoneLinkContainer />
      </AppNavigation>
      <LikedResourcesView />
      <AppFooterContainer />
    </>
  );
};

export default StarredPage;

export const Head: HeadFC = () => {
  return (
    <Meta
      appName={meta.appName}
      title={meta.title}
      description={meta.description}
      url={meta.siteUrl + meta.routes.likedResources.management}
      lang={meta.lang}
      image={meta.siteUrl + LogoThumbnail}
      robots="noindex, nofollow"
    />
  );
};
