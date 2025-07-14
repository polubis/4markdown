import { getCookie } from "development-kit/cookies";
import { COOKIE_TYPE } from "./cookies";

declare global {
  interface Window {
    dataLayer?: Array<unknown>;
    gtag?: (...args: unknown[]) => void;
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

      w.gtag = (...args: unknown[]) => {
        w.dataLayer?.push(args);
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
    script.id = scriptId;

    script.onload = () => {
      triggerAnalytics();
    };

    script.onerror = () => {
      resolve();
    };

    document.head.appendChild(script);
  });
};

type EventCategory = `exceptions`;
type EventName = `exception_session_reset_clicked` | `exception_occured`;

const trackEvent = (eventName: EventName): void => {
  if (!window.gtag) return;

  const eventCategory: EventCategory = `exceptions`;

  window.gtag(`event`, eventName, {
    event_category: eventCategory,
    page_location: window.location.href,
    page_title: document.title,
    user_agent: navigator?.userAgent,
    timestamp: new Date().toISOString(),
    referrer: document.referrer || `direct`,
  });
};

export { initAnalytics, trackEvent };
