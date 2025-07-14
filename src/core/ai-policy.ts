import { getCookie, setCookie } from "development-kit/cookies";

const confirmAIPolicy = (): void => {
  setCookie(`rewrite-assistant-policy`, `true`, 30);
};

const isAIPolicyConfirmed = (): boolean =>
  getCookie(`rewrite-assistant-policy`) === `true`;

export { confirmAIPolicy, isAIPolicyConfirmed };
