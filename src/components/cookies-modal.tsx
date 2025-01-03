import { Button } from 'design-system/button';
import { Modal } from 'design-system/modal';
import React from 'react';
import { meta } from '../../meta';
import c from 'classnames';
import { getCookie, setCookie } from 'development-kit/cookies';
import { isClient } from 'development-kit/ssr-csr';

const enum CookieType {
  Necessary = `necessary`,
  Performance = `performance`,
  Functional = `functional`,
  Marketing = `marketing`,
}

const useCookiesManagement = () => {
  const [preferences, setPreferences] = React.useState({
    [CookieType.Necessary]: true,
    [CookieType.Performance]: true,
    [CookieType.Functional]: true,
    [CookieType.Marketing]: true,
  });

  const [accepted, setAccepted] = React.useState(
    () => isClient() && getCookie(CookieType.Necessary) === `true`,
  );

  const accept = (): void => {
    const oneYear = 365;

    setCookie(CookieType.Necessary, `true`, oneYear);
    setAccepted(true);
  };

  const toggle = (category: keyof typeof preferences): void => {
    if (category === `necessary`) return;

    setPreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return {
    accepted,
    preferences,
    accept,
    toggle,
  };
};

const enum ViewType {
  Intro = `intro`,
  Manage = `manage`,
}

const CookiesModal = () => {
  const { accepted, preferences, accept, toggle } = useCookiesManagement();
  const [view, setView] = React.useState(ViewType.Intro);

  React.useEffect(() => {});

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
          <Modal.Header title="Privacy Policy Settings" skipX />
          <p className="text-justify mb-2">
            By clicking <strong>Accept All</strong>, you agree to the storing of
            cookies on your device to enhance site navigation, analyze site
            usage, and assist in our marketing efforts
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
          <footer className="flex space-x-3 [&_button]:flex-1 mt-8">
            <Button s={2} i={2} auto onClick={goToManagement}>
              Customize
            </Button>
            <Button s={2} i={2} auto onClick={accept}>
              Accept
            </Button>
          </footer>
        </>
      )}

      {view === ViewType.Manage && (
        <>
          <Modal.Header title="Manage Consent Preferences" skipX />
          <div className="space-y-4">
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
                      disabled={key === CookieType.Necessary}
                    />
                    <div
                      className={c(
                        `w-11 h-6 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out after:content-[""] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`,
                        {
                          'bg-blue-600 dark:bg-blue-500 after:translate-x-5':
                            value,
                          'bg-gray-200 dark:bg-gray-500': !value,
                          'opacity-50 cursor-not-allowed':
                            key === CookieType.Necessary,
                        },
                      )}
                    />
                  </label>
                </div>
                <p className="text-sm">
                  {key === CookieType.Necessary &&
                    `These cookies are essential for the website to function properly. They cannot be disabled`}
                  {key === CookieType.Performance &&
                    `These cookies allow us to count visits and traffic sources to measure and improve the performance of our site`}
                  {key === CookieType.Functional &&
                    `These cookies enable the website to provide enhanced functionality and personalization`}
                  {key === CookieType.Marketing &&
                    `These cookies may be set through our site by our advertising partners to build a profile of your interests`}
                </p>
              </div>
            ))}
          </div>
          <footer className="flex space-x-3 [&_button]:flex-1 mt-8">
            <Button s={2} i={2} auto onClick={goToIntro}>
              Back
            </Button>
            <Button s={2} i={2} auto onClick={accept}>
              Accept
            </Button>
          </footer>
        </>
      )}
    </Modal>
  );
};

export { CookiesModal };
