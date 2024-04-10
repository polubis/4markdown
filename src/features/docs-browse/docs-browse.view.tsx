import React from 'react';
import { AppNavContainer } from 'containers/app-nav.container';
import { BackToCreatorLinkContainer } from 'containers/back-to-creator-link.container';
import { DocsBrowseProvider } from './providers/docs-browse.provider';
import { DocsBrowsePageContext } from 'models/pages-contexts';

interface DocsBrowseViewProps {
  context: DocsBrowsePageContext;
}

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

const ConnectedDocsBrowseView = ({ context }: DocsBrowseViewProps) => (
  <DocsBrowseProvider context={context}>
    <DocsBrowseView />
  </DocsBrowseProvider>
);

export { ConnectedDocsBrowseView as DocsBrowseView };
