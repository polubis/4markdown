import { AppNavigation } from 'components/app-navigation';
import { AppFooterContainer } from 'containers/app-footer.container';
import { CreationLinkContainer } from 'containers/creation-link.container';
import { DocsBrowseLinkContainer } from 'containers/docs-browse-link.container';
import { UnsubscribeNewsletterFormContainer } from 'containers/unsubscribe-newsletter-form.container';
import { Link } from 'gatsby';
import React from 'react';
import { meta } from '../../../meta';

const UnsubscribeNewsletterView = () => {
  return (
    <>
      <AppNavigation>
        <CreationLinkContainer />
        <DocsBrowseLinkContainer />
      </AppNavigation>
      <main className="max-w-4xl p-4 my-6 mx-auto">
        <section className="flex mx-auto space-x-10">
          <div>
            <h1 className="text-xl">Unsubscribe From Our Newsletter</h1>
            <p className="mt-3">
              We&apos;ll immediately remove your email address from our database
              and stop sending you any promotional emails. Please note that
              removing your email address from backups may take up to 30 days
            </p>
            <p className="text-sm italic mt-2">
              You can read more about this in our{` `}
              <Link
                to={meta.routes.privacyPolicy}
                target="_blank"
                className="underline underline-offset-2 text-blue-800 dark:text-blue-500"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
          <UnsubscribeNewsletterFormContainer className="border max-w-[40%] bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800 p-4 rounded-md shrink-0" />
        </section>
      </main>
      <AppFooterContainer />
    </>
  );
};

export { UnsubscribeNewsletterView };
