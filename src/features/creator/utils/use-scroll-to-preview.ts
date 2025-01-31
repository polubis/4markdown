import React from 'react';

import debounce from 'lodash.debounce';
import { isServer } from 'development-kit/ssr-csr';
import { useSimpleFeature } from '@greenonsoftware/first-class-hooks';

const removeMdFromLine = (value: string): string =>
  value.replace(/\*|#|`|_/g, ``).trim();

const scrollToPreview = debounce((input: HTMLTextAreaElement): void => {
  const hasScroll = input.scrollHeight > input.clientHeight;

  if (!hasScroll) return;

  const cursor = input.value
    .substring(0, input.selectionStart)
    .split(`\n`).length;
  const lines = input.value.split(`\n`);
  const content = removeMdFromLine(lines[cursor - 1]);

  const isScrollableContent = content.length >= 3;

  if (!isScrollableContent) return;

  const elements = Array.from(
    document.querySelectorAll(`.markdown > *:is(h1,h2,h3,h4,h5,h6,p)`),
  );

  for (const element of elements) {
    if (!element.textContent) continue;

    const textContent = removeMdFromLine(element.textContent);

    if (content === textContent) {
      element.scrollIntoView({ behavior: `smooth`, block: `center` });
      break;
    }
  }
}, 750);

const AUTO_SCROLL_KEY = `autoScrolling`;

const readBrowserSavedSettings = (): boolean => {
  if (isServer()) return false;

  try {
    const readedSetting = localStorage.getItem(AUTO_SCROLL_KEY);

    if (readedSetting === null) return false;

    return JSON.parse(readedSetting);
  } catch {
    return false;
  }
};

const useScrollToPreview = () => {
  const [opened] = React.useState(readBrowserSavedSettings);
  const scroll = useSimpleFeature(opened);

  const triggerScroll = (input: HTMLTextAreaElement): void => {
    if (scroll.isOff) return;

    scrollToPreview(input);
  };

  React.useEffect(() => {
    try {
      localStorage.setItem(AUTO_SCROLL_KEY, JSON.stringify(scroll.isOn));
    } catch {}
  }, [scroll.isOn]);

  React.useEffect(() => {
    return () => {
      scrollToPreview.cancel();
    };
  }, []);

  return [scroll, triggerScroll] as const;
};

export { useScrollToPreview };
