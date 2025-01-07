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
    const id = process.env.GATSBY_GA_ID;

    if (!id || !trackable || initialized || navigator?.doNotTrack === `1`)
      return resolve();

    const w = window as Window;

    const script = document.createElement(`script`);

    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    script.async = true;

    document.head.appendChild(script);

    script.onload = () => {
      w.dataLayer = w.dataLayer || [];

      w.gtag = function () {
        w.dataLayer?.push(arguments);
      };

      w.gtag(`js`, new Date());
      w.gtag(`config`, id);

      initialized = true;

      resolve();
    };
  });
};

export { initAnalytics };
