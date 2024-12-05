import { Button } from 'design-system/button';
import { Modal } from 'design-system/modal';
import React from 'react';
import { meta } from '../../meta';
import c from 'classnames';
import { useCookiesManagement } from 'core/use-cookies-management';

const enum ViewType {
  Intro = `intro`,
  Manage = `manage`,
}

const PrivacySection = (
  <div>
    <p className="text-sm text-justify mb-1">
      By clicking <strong>Accept All</strong>, you agree to the storing of
      cookies on your device to enhance site navigation, analyze site usage, and
      assist in our marketing efforts
    </p>
    <a
      className="text-sm underline underline-offset-2 text-blue-800 dark:text-blue-500"
      title="Go to privacy policy"
      href={meta.routes.privacyPolicy}
      target="_blank"
      rel="noreferrer"
    >
      Read our Privacy Policy
    </a>
  </div>
);

const CookiesModal = () => {
  const { accepted, preferences, accept, toggle } = useCookiesManagement();
  const [view, setView] = React.useState(ViewType.Intro);

  const goToManagement = (): void => {
    setView(ViewType.Manage);
  };

  const goToIntro = (): void => {
    setView(ViewType.Intro);
  };

  if (accepted) return null;

  return (
    <Modal>
      {view === ViewType.Intro && (
        <>
          <header className="flex items-center justify-between gap-4 mb-6">
            <h6 className="text-xl">Privacy Policy Settings</h6>
          </header>
          <p className="text-justify">
            When you visit our site, we might save a little data on your
            browser-mostly in the form of cookies. These cookies help us
            remember things like your preferences or how you interact with our
            site, so we can make your experience better. Your privacy matters to
            us, and we want you to feel confident knowing how your data is used
          </p>
          <footer className="flex flex-col space-y-3 mt-6">
            <div className="flex space-x-3 [&_button]:flex-1 mb-1">
              <Button s={2} i={1} auto onClick={goToManagement}>
                Customize
              </Button>
              <Button s={2} i={2} auto onClick={accept}>
                Accept
              </Button>
            </div>
            {PrivacySection}
          </footer>
        </>
      )}

      {view === ViewType.Manage && (
        <>
          <header className="flex items-center justify-between gap-4 mb-6">
            <h6 className="text-xl">Manage Consent Preferences</h6>
          </header>
          <div className="space-y-6">
            {Object.entries(preferences).map(([key, value], index, arr) => (
              <div
                key={key}
                className={c(`pb-4`, {
                  'border-gray-200 dark:border-gray-700 border-b':
                    index !== arr.length - 1,
                })}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium capitalize">{key} Cookies</p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only active:[&+div]:border-white"
                      checked={value}
                      onChange={() => toggle(key as keyof typeof preferences)}
                      disabled={key === `necessary`}
                    />
                    <div
                      className={c(
                        `w-11 h-6 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out after:content-[""] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`,
                        {
                          'bg-blue-600 dark:bg-blue-500 after:translate-x-5':
                            value,
                          'bg-gray-200 dark:bg-gray-500': !value,
                          'opacity-50 cursor-not-allowed': key === `necessary`,
                        },
                      )}
                    />
                  </label>
                </div>
                <p className="text-sm">
                  {key === `necessary` &&
                    `These cookies are essential for the website to function properly. They cannot be disabled`}
                  {key === `performance` &&
                    `These cookies allow us to count visits and traffic sources to measure and improve the performance of our site`}
                  {key === `functional` &&
                    `These cookies enable the website to provide enhanced functionality and personalization`}
                  {key === `marketing` &&
                    `These cookies may be set through our site by our advertising partners to build a profile of your interests`}
                </p>
              </div>
            ))}
          </div>
          <footer className="flex flex-col space-y-3 mt-3">
            <div className="flex space-x-3 [&_button]:flex-1 mb-1">
              <Button s={2} i={1} auto onClick={goToIntro}>
                Back
              </Button>
              <Button s={2} i={2} auto onClick={accept}>
                Accept
              </Button>
            </div>
            {PrivacySection}
          </footer>
        </>
      )}
    </Modal>
  );
};

export { CookiesModal };
