import React from 'react';

import debounce from 'lodash.debounce';

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
      element.scrollIntoView({ behavior: `smooth` });
      break;
    }
  }
}, 3000);

const useScrollToPreview = () => {
  React.useEffect(() => {
    return () => {
      scrollToPreview.cancel();
    };
  }, []);

  return [scrollToPreview] as const;
};

export { useScrollToPreview };
