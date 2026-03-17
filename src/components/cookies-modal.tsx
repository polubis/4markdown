import { Button } from "design-system/button";
import { Modal2 } from "design-system/modal2";
import { Switch } from "design-system/switch";
import React from "react";
import c from "classnames";
import { getCookie, setCookie } from "development-kit/cookies";
import { isClient } from "development-kit/ssr-csr";
import { ACCEPTANCE_COOKIE_NAME, COOKIE_TYPE } from "core/cookies";
import { initAnalytics } from "core/analytics";
import { PrivacyPolicyContent } from "./privacy-policy-content";
import { meta } from "../../meta";

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
    <Modal2>
      {view === ViewType.Intro && (
        <>
          <Modal2.Header title="Privacy Policy Settings" skipX />
          <Modal2.Body>
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
          </Modal2.Body>
          <Modal2.Footer>
            <div className="flex space-x-3 w-full [&_button]:flex-1">
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
            </div>
          </Modal2.Footer>
        </>
      )}

      {view === ViewType.Manage && (
        <>
          <Modal2.Header title="Manage Consent Preferences" skipX />
          <Modal2.Body>
            <div className="space-y-4">
              {Object.entries(preferences).map(([key, value], index, arr) => (
                <div
                  key={key}
                  className={c(`pb-4`, {
                    "border-gray-200 dark:border-gray-700 border-b":
                      index !== arr.length - 1,
                  })}
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium capitalize">{key} Cookies</p>
                    <Switch
                      checked={value}
                      onChange={() =>
                        togglePreferences(key as keyof typeof preferences)
                      }
                      disabled={key === COOKIE_TYPE.NECESSARY}
                      aria-label={`Toggle ${key} cookies`}
                      id={`cookie-switch-${key}`}
                    />
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
          </Modal2.Body>
          <Modal2.Footer className="flex space-x-3 w-full">
            <Button
              s={2}
              i={1}
              auto
              onClick={goToIntro}
              title="Back to cookies intro"
              className="flex-1"
            >
              Back
            </Button>
            <Button
              s={2}
              i={2}
              auto
              onClick={accept}
              title="Accept customized cookies"
              className="flex-1"
            >
              Accept
            </Button>
          </Modal2.Footer>
        </>
      )}

      {view === ViewType.Policy && (
        <>
          <Modal2.Body>
            <PrivacyPolicyContent />
          </Modal2.Body>
          <Modal2.Footer>
            <div className="flex space-x-3 w-full [&_button]:flex-1">
              <Button
                s={2}
                i={2}
                auto
                onClick={goToIntro}
                title="Back to cookies intro"
              >
                Back
              </Button>
            </div>
          </Modal2.Footer>
        </>
      )}
    </Modal2>
  );
};

export { CookiesModal };
