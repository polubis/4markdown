import React from "react";
import { useLocation } from "@reach/router";
import { AppNavigation } from "components/app-navigation";
import { AppFooterContainer } from "containers/app-footer.container";
import { CreationLinkContainer } from "containers/creation-link.container";
import { EducationRankLinkContainer } from "containers/education-rank-link.container";
import { EducationZoneLinkContainer } from "containers/education-zone-link.container";
import { UserProfileContentContainer } from "../containers/user-profile-content.container";
import { getUserProfileAct } from "../acts/get-user-profile.act";
import { asUserProfileId } from "../utils/get-profile-id";

const UserProfilePreviewView = () => {
  const location = useLocation();

  React.useEffect(() => {
    getUserProfileAct(
      asUserProfileId(new URLSearchParams(location.search).get(`profileId`)),
    );
  }, [location.search]);

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
