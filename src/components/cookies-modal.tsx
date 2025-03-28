import { Button } from 'design-system/button';
import { Modal } from 'design-system/modal';
import React from 'react';
import c from 'classnames';
import { getCookie, setCookie } from 'development-kit/cookies';
import { isClient } from 'development-kit/ssr-csr';
import { ACCEPTANCE_COOKIE_NAME, COOKIE_TYPE } from 'core/cookies';
import { initAnalytics } from 'core/analytics';
import { PrivacyPolicyContent } from './privacy-policy-content';
import { meta } from '../../meta';

const ONE_MONTH = 31;

const enum ViewType {
  Intro = `intro`,
  Manage = `manage`,
  Policy = `policy`,
}

const CookiesModal = () => {
  const [accepted, setAccepted] = React.useState(
    () => isClient() && getCookie(ACCEPTANCE_COOKIE_NAME) === `true`,
  );
  const [view, setView] = React.useState(ViewType.Intro);

  const [preferences, setPreferences] = React.useState(() => ({
    [COOKIE_TYPE.NECESSARY]: true,
    [COOKIE_TYPE.PERFORMANCE]: true,
    [COOKIE_TYPE.FUNCTIONAL]: true,
    [COOKIE_TYPE.MARKETING]: true,
  }));

  const goToManagement = (): void => {
    setView(ViewType.Manage);
  };

  const goToIntro = (): void => {
    setView(ViewType.Intro);
  };

  const goToPolicy = (): void => {
    setView(ViewType.Policy);
  };

  const accept = (): void => {
    const performance = preferences[COOKIE_TYPE.PERFORMANCE];

    setCookie(ACCEPTANCE_COOKIE_NAME, `true`, ONE_MONTH);
    setCookie(COOKIE_TYPE.PERFORMANCE, `` + performance, ONE_MONTH);
    setAccepted(true);
    initAnalytics();
  };

  const togglePreferences = (category: keyof typeof preferences): void => {
    if (category === COOKIE_TYPE.NECESSARY) return;

    setPreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  React.useEffect(() => {
    initAnalytics();
  }, []);

  if (accepted) return null;

  return (
    <Modal>
      {view === ViewType.Intro && (
        <>
          <Modal.Header title="Privacy Policy Settings" skipX />
          <p className="text-justify mb-2">
            By clicking <strong>Accept</strong>, you consent to the use of
            cookies and agree to the <strong>{meta.appName}</strong> privacy
            policy. These cookies are used to enhance site navigation, analyze
            usage patterns, and support our marketing efforts
          </p>
          <button
            className="text-sm font-bold underline underline-offset-2 text-blue-800 dark:text-blue-500"
            title="Read privacy policy"
            onClick={goToPolicy}
          >
            Read Our Privacy Policy
          </button>
          <footer className="flex space-x-3 [&_button]:flex-1 mt-8">
            <Button
              s={2}
              i={2}
              title="Customize cookies"
              auto
              onClick={goToManagement}
            >
              Customize
            </Button>
            <Button title="Accept cookies" s={2} i={2} auto onClick={accept}>
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
                      onChange={() =>
                        togglePreferences(key as keyof typeof preferences)
                      }
                      disabled={key === COOKIE_TYPE.NECESSARY}
                    />
                    <div
                      className={c(
                        `w-11 h-6 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out after:content-[""] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`,
                        {
                          'bg-blue-600 dark:bg-blue-500 after:translate-x-5':
                            value,
                          'bg-gray-200 dark:bg-gray-500': !value,
                          'opacity-50 cursor-not-allowed':
                            key === COOKIE_TYPE.NECESSARY,
                        },
                      )}
                    />
                  </label>
                </div>
                <p className="text-sm">
                  {key === COOKIE_TYPE.NECESSARY &&
                    `These cookies are essential for the website to function properly. They cannot be disabled`}
                  {key === COOKIE_TYPE.PERFORMANCE &&
                    `These cookies allow us to count visits and traffic sources to measure and improve the performance of our site`}
                  {key === COOKIE_TYPE.FUNCTIONAL &&
                    `These cookies enable the website to provide enhanced functionality and personalization`}
                  {key === COOKIE_TYPE.MARKETING &&
                    `These cookies may be set through our site by our advertising partners to build a profile of your interests`}
                </p>
              </div>
            ))}
          </div>
          <footer className="flex space-x-3 [&_button]:flex-1 mt-8">
            <Button
              s={2}
              i={2}
              auto
              onClick={goToIntro}
              title="Back to cookies intro"
            >
              Back
            </Button>
            <Button
              s={2}
              i={2}
              auto
              onClick={accept}
              title="Accept customized cookies"
            >
              Accept
            </Button>
          </footer>
        </>
      )}

      {view === ViewType.Policy && (
        <>
          <div className="[&>h1]:pb-3 [&>h2]:pb-1 markdown [&>h1]:text-5xl [&>h2]:text-4xl [&>*]:mb-3">
            <PrivacyPolicyContent />
          </div>
          <footer className="flex space-x-3 [&_button]:flex-1 mt-8">
            <Button
              s={2}
              i={2}
              auto
              onClick={goToIntro}
              title="Back to cookies intro"
            >
              Back
            </Button>
          </footer>
        </>
      )}
    </Modal>
  );
};

export { CookiesModal };
