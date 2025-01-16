import React from 'react';

import debounce from 'lodash.debounce';
import { useToggle } from 'development-kit/use-toggle';

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

const useScrollToPreview = () => {
  const scroll = useToggle();

  const triggerScroll = (input: HTMLTextAreaElement): void => {
    if (scroll.closed) return;

    scrollToPreview(input);
  };

  React.useEffect(() => {
    return () => {
      scrollToPreview.cancel();
    };
  }, []);

  return [scroll, triggerScroll] as const;
};

export { useScrollToPreview };
