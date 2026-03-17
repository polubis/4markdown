import React from "react";

type HideScroll = () => void;
type ShowScroll = () => void;

type ScrollHideReturn<T extends HTMLElement> = [
  React.MutableRefObject<T | null>,
  HideScroll,
  ShowScroll,
];

type ScrollLockEntry = {
  count: number;
  overflow: string;
};

const scrollLocks = new WeakMap<HTMLElement, ScrollLockEntry>();

const useScrollHide = <T extends HTMLElement>(): ScrollHideReturn<T> => {
  const ref = React.useRef<T>(null);

  const getElement = (): HTMLElement => ref.current ?? document.body;

  const show: ShowScroll = () => {
    const element = getElement();
    const entry = scrollLocks.get(element);

    if (!entry) return;

    entry.count = Math.max(0, entry.count - 1);

    if (entry.count === 0) {
      element.style.overflow = entry.overflow;
      scrollLocks.delete(element);
    }
  };

  const hide: HideScroll = () => {
    const element = getElement();
    const entry = scrollLocks.get(element);

    if (entry) {
      entry.count += 1;
    } else {
      scrollLocks.set(element, {
        count: 1,
        overflow: element.style.overflow,
      });
    }

    element.style.overflow = `hidden`;
  };

  React.useLayoutEffect(() => {
    hide();

    return () => {
      show();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, hide, show];
};

export { useScrollHide };
