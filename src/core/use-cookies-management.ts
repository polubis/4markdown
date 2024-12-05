import { getCookie, setCookie } from 'development-kit/cookies';
import { isServer } from 'development-kit/ssr-csr';
import React from 'react';

const enum CookieType {
  Policy = `policy`,
}

const oneYear = 365;

const verifyAcceptance = (): boolean => {
  if (isServer()) return false;

  return getCookie(CookieType.Policy) === `true`;
};

const useCookiesManagement = () => {
  const [preferences, setPreferences] = React.useState({
    necessary: true,
    performance: false,
    functional: false,
    marketing: false,
  });

  const [accepted, setAccepted] = React.useState(verifyAcceptance);

  const accept = (): void => {
    setCookie(CookieType.Policy, `true`, oneYear);
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

export { useCookiesManagement };
