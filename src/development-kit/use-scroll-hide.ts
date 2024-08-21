import {
  type CSSProperties,
  type MutableRefObject,
  useLayoutEffect,
  useRef,
} from 'react';

type ScrollHideStyle = Required<Pick<CSSProperties, 'overflow'>>;
type HideScroll = () => void;
type ShowScroll = () => void;

type ScrollHideReturn<T extends HTMLElement> = [
  MutableRefObject<T | null>,
  HideScroll,
  ShowScroll,
];

const useScrollHide = <T extends HTMLElement>(): ScrollHideReturn<T> => {
  const ref = useRef<T>(null);
  const initialStyle = useRef<ScrollHideStyle>({
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

  useLayoutEffect(() => {
    hide();

    return show;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, hide, show];
};

export { useScrollHide };
