import React from 'react';
import { AppNavContainer } from 'containers/app-nav.container';
import { BackToCreatorLinkContainer } from 'containers/back-to-creator-link.container';

const DocsBrowseView = () => {
  return (
    <>
      <AppNavContainer>
        <BackToCreatorLinkContainer />
      </AppNavContainer>
      <main className="max-w-4xl p-4 mx-auto">siema</main>
    </>
  );
};

export { DocsBrowseView };
