import React from 'react';

const useScrollToHash = ({ containerId }: { containerId: string }) => {
  React.useLayoutEffect(() => {
    const headingsSelector = Array.from(
      { length: 6 },
      (_, i) => `#${containerId} h${i + 1}`,
    ).join(`, `);

    const scrollToHash = () => {
      const hash = window.location.hash.slice(1);

      if (!hash) return;

      const decodedHash = hash.replace(/-/g, ` `);

      const headings = window.document.querySelectorAll(headingsSelector);

      const foundHeading = Array.from(headings).find(
        (heading) => heading.textContent === decodedHash,
      );

      foundHeading?.scrollIntoView({ block: `start` });
    };

    scrollToHash();

    window.addEventListener(`hashchange`, scrollToHash);

    return () => {
      window.removeEventListener(`hashchange`, scrollToHash);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export { useScrollToHash };
