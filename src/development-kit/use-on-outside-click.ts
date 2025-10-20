import React, { useEffect, RefObject } from "react";

type OnOutsideClickConfig = {
  onOutsideClick?: (event: MouseEvent) => void;
  enabled?: boolean;
};

/**
 * Hook that handles clicks outside of a referenced element
 * @param ref - React ref to the element to watch for outside clicks
 * @param config - Configuration object with callback and enabled state
 */
const useOnOutsideClick = (
  ref: RefObject<HTMLElement>,
  config: OnOutsideClickConfig = {},
) => {
  const { onOutsideClick, enabled = true } = config;

  const configRef = React.useRef<OnOutsideClickConfig>(config);

  useEffect(() => {
    configRef.current = config;
  }, [onOutsideClick, enabled]);

  useEffect(() => {
    if (!configRef.current.enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        configRef.current.onOutsideClick?.(event);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, enabled]);
};

export type { OnOutsideClickConfig };
export { useOnOutsideClick };
