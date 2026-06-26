import React from "react";

type UseInViewportOptions = {
  /** Fire only the first time the element enters the viewport. Default: true */
  once?: boolean;
  rootMargin?: string;
  threshold?: number | number[];
};

type UseInViewportResult<T extends HTMLElement> = {
  ref: React.RefObject<T | null>;
  isInViewport: boolean;
};

const useInViewport = <T extends HTMLElement = HTMLElement>(
  options?: UseInViewportOptions,
): UseInViewportResult<T> => {
  const { once = true, rootMargin, threshold } = options ?? {};
  const ref = React.useRef<T>(null);
  const [isInViewport, setIsInViewport] = React.useState(false);
  const hasEnteredRef = React.useRef(false);

  React.useEffect(() => {
    const element = ref.current;

    if (!element || (once && hasEnteredRef.current)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.some((entry) => entry.isIntersecting);

        if (!intersecting) {
          if (!once) {
            setIsInViewport(false);
          }

          return;
        }

        hasEnteredRef.current = true;
        setIsInViewport(true);

        if (once) {
          observer.disconnect();
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [once, rootMargin, threshold]);

  return { ref, isInViewport };
};

export { useInViewport };
export type { UseInViewportOptions, UseInViewportResult };
