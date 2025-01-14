import React from 'react';

import debounce from 'lodash.debounce';

const removeMdFromLine = (value: string): string =>
  value.replace(/\*|#|`|_/g, ``).trim();

const useScrollToPreview = () => {
  const scrollTimeoutRef = React.useRef<ReturnType<typeof debounce> | null>(
    null,
  );
  const highlightRef = React.useRef<ReturnType<typeof debounce> | null>(null);

  const scroll = (input: HTMLTextAreaElement): void => {
    scrollTimeoutRef.current = debounce((input: HTMLTextAreaElement): void => {
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

          element.classList.add(`animate-fade-in`);

          highlightRef.current = debounce((element: Element) => {
            element.classList.remove(`animate-fade-in`);
          }, 2000);

          highlightRef.current(element);
          break;
        }
      }
    }, 750);

    scrollTimeoutRef.current(input);
  };

  React.useEffect(() => {
    return () => {
      scrollTimeoutRef.current?.cancel();
      highlightRef.current?.cancel();
    };
  }, []);

  return [scroll] as const;
};

export { useScrollToPreview };
