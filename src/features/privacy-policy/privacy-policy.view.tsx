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
      <main className="max-w-4xl p-4 my-6 mx-auto [&>h1]:pb-3 [&>h2]:pb-1 markdown [&>h1]:text-5xl [&>h2]:text-4xl [&>*]:mb-3">
        <PrivacyPolicyContent />
      </main>
      <AppFooterContainer />
    </>
  );
};

export { PrivacyPolicyView };
