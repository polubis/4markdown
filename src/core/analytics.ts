import { getCookie } from "development-kit/cookies";
import { COOKIE_TYPE } from "./cookies";

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

let initialized = false;

const initAnalytics = (): Promise<void> => {
  return new Promise((resolve) => {
    const trackable = getCookie(COOKIE_TYPE.PERFORMANCE) === `true`;
    const gaId = process.env.GATSBY_GA_ID;

    // 1. Safety Checks
    if (!gaId || !trackable || initialized || navigator?.doNotTrack === `1`) {
      return resolve();
    }

    const scriptId = `__script-analytics__`;

    // 2. Define gtag and dataLayer BEFORE loading the script
    // This ensures that even if the script loads instantly, the configuration is ready.
    window.dataLayer = window.dataLayer || [];

    // Technical Note: We use a standard function here because GA4's library
    // specifically parses the 'arguments' object, which arrow functions do not have.
    // biome-ignore lint/complexity/useArrowFunction: Google event tracking library requires arguments
    window.gtag = function () {
      // biome-ignore lint/complexity/noArguments: Google event tracking library requires arguments
      window.dataLayer?.push(arguments);
    };

    const triggerAnalytics = (): void => {
      if (initialized) return;

      window.gtag!(`js`, new Date());
      window.gtag!(`config`, gaId, {
        // Optional: ensures manual events don't double-count page views
        // if your framework handles routing manually.
        send_page_view: true,
      });

      initialized = true;
      resolve();
    };

    // 3. Handle Script Injection
    if (document.getElementById(scriptId)) {
      triggerAnalytics();
      return;
    }

    const script = document.createElement(`script`);
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script.async = true;
    script.id = scriptId;

    script.onload = () => {
      triggerAnalytics();
    };

    script.onerror = () => {
      console.error("Failed to load Google Analytics script.");
      resolve();
    };

    document.head.appendChild(script);
  });
};

type EventCategory = `exceptions`;
type EventName = `exception_session_reset_clicked` | `exception_occured`;

const trackEvent = (eventName: EventName): void => {
  // Check if gtag exists and has been initialized
  if (!window.gtag || !initialized) return;

  const eventCategory: EventCategory = `exceptions`;

  window.gtag(`event`, eventName, {
    event_category: eventCategory,
    // Note: GA4 automatically collects page_location and title,
    // but explicit overrides are fine if you need specific states.
    page_location: window.location.href,
    page_title: document.title,
    timestamp: new Date().toISOString(),
  });
};

export { initAnalytics, trackEvent };
