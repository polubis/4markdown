import React from 'react';
import c from 'classnames';

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <picture className={c(`w-[32px] h-[32px] shrink-0`, className)}>
      <img rel="preload" src="/favicon-32x32.png" alt="Logo" />
    </picture>
  );
};

export { Logo };
