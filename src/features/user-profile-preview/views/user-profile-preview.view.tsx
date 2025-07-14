import React from "react";
import { AppNavigation } from "components/app-navigation";
import { AppFooterContainer } from "containers/app-footer.container";
import { CreationLinkContainer } from "containers/creation-link.container";
import { EducationRankLinkContainer } from "containers/education-rank-link.container";
import { EducationZoneLinkContainer } from "containers/education-zone-link.container";
import { UserProfileContentContainer } from "../containers/user-profile-content.container";
import { getUserProfileAct } from "../acts/get-user-profile.act";

const UserProfilePreviewView = () => {
  React.useEffect(() => {
    getUserProfileAct();
  }, []);

  return (
    <>
      <AppNavigation>
        <CreationLinkContainer />
        <EducationRankLinkContainer />
        <EducationZoneLinkContainer />
      </AppNavigation>
      <UserProfileContentContainer />
      <AppFooterContainer />
    </>
  );
};

export { UserProfilePreviewView };
