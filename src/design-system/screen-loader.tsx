import React from 'react';

import Backdrop from './backdrop';
import c from 'classnames';
import { Loader } from './loader';
import { usePortal } from 'development-kit/use-portal';

interface ScreenLoaderProps {
  className?: string;
}

const ScreenLoader = ({ className }: ScreenLoaderProps) => {
  const { render } = usePortal();

  return (
    <>
      <Backdrop />
      {render(
        <Loader
          size="lg"
          className={c(
            `fixed top-0 right-0 bottom-0 left-0 m-auto z-10`,
            className,
          )}
        />,
      )}
    </>
  );
};

export { ScreenLoader };
