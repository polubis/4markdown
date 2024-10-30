import { AppNavigation } from 'components/app-navigation';
import { AppFooterContainer } from 'containers/app-footer.container';
import { CreationLinkContainer } from 'containers/creation-link.container';
import { DocsBrowseLinkContainer } from 'containers/docs-browse-link.container';
import { Link } from 'gatsby';
import React from 'react';
import { meta } from '../../../meta';
import { SubscribeNewsletterFormContainer } from 'containers/subscribe-newsletter-form.container';

const SubscribeNewsletterView = () => {
  return (
    <>
      <AppNavigation>
        <CreationLinkContainer />
        <DocsBrowseLinkContainer />
      </AppNavigation>
      <main className="max-w-4xl p-4 my-6 mx-auto">
        <section className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:items-center mx-auto md:space-x-10 md:min-h-[500px]">
          <div>
            <h1 className="text-xl">
              Subscribe To Our Weekly Web Dev Newsletter
            </h1>
            <p className="mt-3">
              We&apos;ll send you emails when new valuable content is added to
              the platform. Typically, once per week, but if something important
              happens, you may receive additional emails. Don’t worry, we’re not
              spammers ☜(ﾟヮﾟ☜)
            </p>
            <p className="text-sm italic mt-2">
              If you ever feel overwhelmed, you can always unsubscribe. A
              dedicated link will be included in every email you receive from
              us. Read our{` `}
              <Link
                to={meta.routes.privacyPolicy}
                target="_blank"
                className="underline underline-offset-2 text-blue-800 dark:text-blue-500"
              >
                Privacy Policy
              </Link>
              {` `}
              for more information
            </p>
          </div>
          <SubscribeNewsletterFormContainer
            className="md:max-w-[40%] shrink-0"
            subscribeButtonSize={2}
          />
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

export { SubscribeNewsletterView };
