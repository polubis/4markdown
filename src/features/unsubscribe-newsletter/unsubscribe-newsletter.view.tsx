import { AppNavigation } from 'components/app-navigation';
import { AppFooterContainer } from 'containers/app-footer.container';
import { CreationLinkContainer } from 'containers/creation-link.container';
import { DocsBrowseLinkContainer } from 'containers/docs-browse-link.container';
import { UnsubscribeNewsletterFormContainer } from 'containers/unsubscribe-newsletter-form.container';
import { Link } from 'gatsby';
import React from 'react';
import { meta } from '../../../meta';

// Email avatar
// Additional item in privacy policy
// Describe a ticket with new content
// Add subscribe banner in education zone
// Fix tests e2e
// Write new e2e tests for new features

// @TODO[PRIO=4]: ["max-w-4xl p-4 my-6" replace it in whole app with component].
const UnsubscribeNewsletterView = () => {
  return (
    <>
      <AppNavigation>
        <CreationLinkContainer />
        <DocsBrowseLinkContainer />
      </AppNavigation>
      <main className="max-w-4xl p-4 my-6 mx-auto">
        <section className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:items-center mx-auto md:space-x-10 md:min-h-[500px]">
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
            </p>
          </div>
          <UnsubscribeNewsletterFormContainer className="md:max-w-[40%] shrink-0" />
        </section>
        <section className="mt-10 md:mt-4">
          <Link
            className="underline underline-offset-2"
            to={meta.routes.docs.educationZone}
            title="Back to education zone"
          >
            I&apos;ve Changed My Mind
          </Link>
        </section>
      </main>
      <AppFooterContainer />
    </>
  );
};

export { UnsubscribeNewsletterView };
