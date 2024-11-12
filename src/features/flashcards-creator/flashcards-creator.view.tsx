import { AppNavigation } from 'components/app-navigation';
import { AppFooterContainer } from 'containers/app-footer.container';
import { CreationLinkContainer } from 'containers/creation-link.container';
import { DocsBrowseLinkContainer } from 'containers/docs-browse-link.container';
import React from 'react';

const FlashcardsCreatorView = () => {
  return (
    <>
      <AppNavigation>
        <CreationLinkContainer />
        <DocsBrowseLinkContainer />
      </AppNavigation>
      <main></main>
      <AppFooterContainer />
    </>
  );
};

export { FlashcardsCreatorView };
