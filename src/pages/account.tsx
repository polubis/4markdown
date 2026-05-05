import React from "react";
import type { HeadFC } from "gatsby";
import LogoThumbnail from "images/logo-thumbnail.png";
import Meta from "components/meta";
import { meta } from "../../meta";
import { AccountView } from "features/account/account.view";
import { EducationZoneLinkContainer } from "containers/education-zone-link.container";
import { CreationLinkContainer } from "containers/creation-link.container";
import { AppNavigation } from "components/app-navigation";
import { EducationRankLinkContainer } from "containers/education-rank-link.container";
import { AppFooterContainer } from "containers/app-footer.container";

const AccountPage = () => {
  return (
    <>
      <AppNavigation>
        <CreationLinkContainer />
        <EducationRankLinkContainer />
        <EducationZoneLinkContainer />
      </AppNavigation>
      <AccountView />
      <AppFooterContainer />
    </>
  );
};

export default AccountPage;

export const Head: HeadFC = () => {
  return (
    <Meta
      appName={meta.appName}
      title={`Account | ${meta.appName}`}
      description={meta.description}
      url={meta.siteUrl + meta.routes.account}
      lang={meta.lang}
      image={meta.siteUrl + LogoThumbnail}
      robots="noindex, nofollow"
    />
  );
};
