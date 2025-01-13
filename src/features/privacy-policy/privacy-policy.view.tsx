import { AppNavigation } from 'components/app-navigation';
import { AppFooterContainer } from 'containers/app-footer.container';
import { EducationZoneLinkContainer } from 'containers/education-zone-link.container';
import React from 'react';
import { CreationLinkContainer } from 'containers/creation-link.container';
import { EducationRankLinkContainer } from 'containers/education-rank-link.container';
import { PrivacyPolicyContent } from 'components/privacy-policy-content';

const PrivacyPolicyView = () => {
  return (
    <>
      <AppNavigation>
        <CreationLinkContainer />
        <EducationRankLinkContainer />
        <EducationZoneLinkContainer />
      </AppNavigation>
      <PrivacyPolicyContent />
      <AppFooterContainer />
    </>
  );
};

export { PrivacyPolicyView };
