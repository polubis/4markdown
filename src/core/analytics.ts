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

    console.log(`[Analytics Debug] Initializing:`, {
      trackable,
      gaId,
      initialized,
    });

    if (!gaId || !trackable || initialized || navigator?.doNotTrack === `1`) {
      console.log(`[Analytics Debug] Skipping initialization due to:`, {
        noGaId: !gaId,
        notTrackable: !trackable,
        alreadyInitialized: initialized,
        doNotTrack: navigator?.doNotTrack === `1`,
      });
      return resolve();
    }

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
      console.log(`[Analytics Debug] Successfully initialized`);

      resolve();
    };

    if (document.getElementById(scriptId)) {
      triggerAnalytics();
      return resolve();
    }

    const script = document.createElement(`script`);

    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script.async = true;
    script.id = scriptId;

    script.onload = () => {
      triggerAnalytics();
    };

    script.onerror = () => {
      console.error(`[Analytics Debug] Failed to load analytics script`);
      resolve();
    };

    document.head.appendChild(script);
  });
};

const handleExceptionViewed = (eventCategory: string): void => {
  const trackable = getCookie(COOKIE_TYPE.PERFORMANCE) === `true`;
  const gaId = process.env.GATSBY_GA_ID;

  if (!gaId || !trackable || navigator?.doNotTrack === `1` || !window.gtag)
    return;

  window.gtag(`event`, `exception`, {
    page: `exception`,
    event_category: eventCategory,
    page_location: window.location.href,
    page_path: window.location.pathname,
    user_agent: navigator.userAgent,
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    viewport_size: `${window.innerWidth}x${window.innerHeight}`,
    timestamp: new Date().toISOString(),
    referrer: document.referrer || `direct`,
    previous_page: document.referrer
      ? new URL(document.referrer).pathname
      : `none`,
  });
};

export { initAnalytics, handleExceptionViewed };
