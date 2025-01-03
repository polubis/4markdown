import { isServer } from './ssr-csr';

declare global {
  interface Window {
    gtagInitialized?: boolean;
    dataLayer?: Array<any>; // Use a specific type if you know the structure of the dataLayer elements.
    gtag?: (...args: any[]) => void;
  }
}

const initAnalytics = (): void => {
  const w = window as Window;

  if (isServer() || w.gtagInitialized || navigator?.doNotTrack === `1`) return;

  const id = process.env.GATSBY_GA_ID;

  const script = document.createElement(`script`);
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  script.async = true;
  document.head.appendChild(script);

  script.onload = () => {
    w.dataLayer = w.dataLayer || [];

    function gtag() {
      w.dataLayer?.push(arguments);
    }

    w.gtag = gtag;

    gtag(`js`, new Date());
    gtag(`config`, `GA-TRACKING-ID`, {
      anonymize_ip: true,
      allow_ad_personalization_signals: false,
      cookie_expires: 0,
      send_page_view: false,
      enhanced_measurement_settings: {
        scrolls: false,
        outbound_clicks: false,
        site_search: false,
        video_engagement: false,
        file_downloads: false,
      },
      linker: {
        domains: [],
      },
    });

    w.gtagInitialized = true;
  };
};

export { initAnalytics };
