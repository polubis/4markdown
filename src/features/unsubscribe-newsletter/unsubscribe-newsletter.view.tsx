import { AppNavigation } from 'components/app-navigation';
import { AppFooterContainer } from 'containers/app-footer.container';
import { CreationLinkContainer } from 'containers/creation-link.container';
import { DocsBrowseLinkContainer } from 'containers/docs-browse-link.container';
import { UnsubscribeNewsletterFormContainer } from 'containers/unsubscribe-newsletter-form.container';
import React from 'react';

const UnsubscribeNewsletterView = () => {
  return (
    <>
      <AppNavigation>
        <CreationLinkContainer />
        <DocsBrowseLinkContainer />
      </AppNavigation>
      <main className="max-w-4xl p-4 my-6 mx-auto">
        <UnsubscribeNewsletterFormContainer className="max-w-[420px] border bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800 mx-auto p-4 rounded-md" />
      </main>
      <AppFooterContainer />
    </>
  );
};

export { UnsubscribeNewsletterView };
