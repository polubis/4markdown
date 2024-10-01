import { AppNavigation } from 'components/app-navigation';
import { AppFooterContainer } from 'containers/app-footer.container';
import { CreationLinkContainer } from 'containers/creation-link.container';
import { DocsBrowseLinkContainer } from 'containers/docs-browse-link.container';
import React from 'react';

const CreateMindmapView = () => {
  return (
    <>
      <AppNavigation>
        <CreationLinkContainer />
        <DocsBrowseLinkContainer />
      </AppNavigation>
      <main>
        <section className="min-h-screen bg-red-600 p-4">siema</section>
      </main>
      <AppFooterContainer />
    </>
  );
};

export { CreateMindmapView };
