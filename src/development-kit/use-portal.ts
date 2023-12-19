import React from 'react';
import { createPortal } from 'react-dom';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect';
import { isServer } from './ssr-csr';

type RenderPortal = (children: React.ReactNode) => React.ReactPortal | null;

type UsePortal = () => {
  render: RenderPortal;
};

const usePortal: UsePortal = () => {
  const wrapper = React.useMemo(
    () => (isServer() ? null : document.createElement(`div`)),
    [],
  );

  useIsomorphicLayoutEffect(() => {
    if (!wrapper) return;

    document.body.appendChild(wrapper);

    return () => {
      document.body.removeChild(wrapper);
    };
  }, []);

  return {
    render: (children) => (wrapper ? createPortal(children, wrapper) : null),
  };
};

export { usePortal };
