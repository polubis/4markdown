import { getCookie } from 'development-kit/cookies';
import { COOKIE_TYPE } from './cookies';

declare global {
  interface Window {
    dataLayer?: Array<any>;
    gtag?: (...args: any[]) => void;
  }
}

let initialized = false;

const initAnalytics = (): Promise<void> => {
  return new Promise((resolve) => {
    const trackable = getCookie(COOKIE_TYPE.PERFORMANCE) === `true`;
    const gaId = process.env.GATSBY_GA_ID;

    if (!gaId || !trackable || initialized || navigator?.doNotTrack === `1`)
      return resolve();

    const w = window as Window;

    const scriptId = `__script-analytics__`;

    const triggerAnalytics = (): void => {
      w.dataLayer = w.dataLayer || [];

      w.gtag = function () {
        w.dataLayer?.push(arguments);
      };

      w.gtag(`js`, new Date());
      w.gtag(`config`, gaId);

      initialized = true;

      resolve();
    };

    if (document.getElementById(scriptId)) {
      triggerAnalytics();
      return resolve();
    }

    const script = document.createElement(`script`);

    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script.async = true;
    script.id = `analytics`;

    document.head.appendChild(script);

    script.onload = () => {
      triggerAnalytics();
    };
  });
};

export { initAnalytics };
