import React from "react";
import type { HeadFC } from "gatsby";
import LogoThumbnail from "images/logo-thumbnail.png";
import Meta from "components/meta";
import { meta } from "../../meta";
import { MarkdownPostCreatorView } from "features/markdown-post-creator/markdown-post-creator.view";
import { AppNavigation } from "components/app-navigation";
import { CreationLinkContainer } from "containers/creation-link.container";
import { EducationZoneLinkContainer } from "containers/education-zone-link.container";
import { EducationRankLinkContainer } from "containers/education-rank-link.container";
import { AppFooterContainer } from "containers/app-footer.container";
import UserPopover from "components/user-popover";
import MoreNav from "components/more-nav";

const MarkdownPostCreatorPage = () => {
  return (
    <>
      <AppNavigation>
        <CreationLinkContainer />
        <EducationRankLinkContainer />
        <EducationZoneLinkContainer />
        <div className="ml-auto flex items-center gap-2">
          <UserPopover />
          <MoreNav />
        </div>
      </AppNavigation>
      <MarkdownPostCreatorView />
      <AppFooterContainer />
    </>
  );
};

export default MarkdownPostCreatorPage;

export const Head: HeadFC = () => {
  return (
    <Meta
      appName={meta.appName}
      title={`Markdown Post Creator | ${meta.appName}`}
      description="Create and publish markdown posts with a live preview editor"
      url={meta.siteUrl + meta.routes.markdownPostCreator}
      lang={meta.lang}
      image={meta.siteUrl + LogoThumbnail}
      robots="noindex, nofollow"
    />
  );
};
