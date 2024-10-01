import React from 'react';

type ScrollHideStyle = Required<Pick<React.CSSProperties, 'overflow'>>;
type HideScroll = () => void;
type ShowScroll = () => void;

type ScrollHideReturn<T extends HTMLElement> = [
  React.MutableRefObject<T | null>,
  HideScroll,
  ShowScroll,
];

// @TODO[PRIO=3]: [Improve useScrollHide implementation].
const useScrollHide = <T extends HTMLElement>(): ScrollHideReturn<T> => {
  const ref = React.useRef<T>(null);
  const initialStyle = React.useRef<ScrollHideStyle>({
    overflow: `auto`,
  });

  const getElement = (): HTMLElement => ref.current ?? document.body;

  const show: ShowScroll = () => {
    const element = getElement();
    const style = initialStyle.current;

    element.style.overflow = style.overflow;
  };

  const hide: HideScroll = () => {
    const element = getElement();
    initialStyle.current.overflow = element.style.overflow;

    element.style.overflow = `hidden`;
  };

  React.useLayoutEffect(() => {
    hide();

    return show;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, hide, show];
};

export { useScrollHide };
