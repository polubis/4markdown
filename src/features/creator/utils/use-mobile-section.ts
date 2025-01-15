import React from 'react';
import { isMd } from 'design-system/viewports';
import debounce from 'lodash.debounce';

const useMobileSection = () => {
  const [opened, setOpened] = React.useState(true);

  React.useEffect(() => {
    let isMdViewport = isMd();

    const getScrollY = (): number =>
      window.scrollY || document.documentElement.scrollTop;

    let prevY = getScrollY();

    const manageMobileSection = debounce((): void => {
      if (isMdViewport) return;

      const y = getScrollY();

      const totalHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      const progress = Number.parseFloat(((y / totalHeight) * 100).toFixed(2));

      const isGoingTop = prevY > y;
      const isNearBottom = progress > 90;

      setOpened(isGoingTop || isNearBottom);

      prevY = y;
    }, 200);

    const determineViewport = debounce((): void => {
      isMdViewport = isMd();
      setOpened(true);
    }, 200);

    window.addEventListener(`scroll`, manageMobileSection);
    window.addEventListener(`resize`, determineViewport);

    return () => {
      window.removeEventListener(`scroll`, manageMobileSection);
      window.addEventListener(`resize`, determineViewport);
      manageMobileSection.cancel();
      determineViewport.cancel();
    };
  }, []);

  return [opened, setOpened] as const;
};

export { useMobileSection };
