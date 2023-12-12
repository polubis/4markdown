import React, { type ReactNode } from 'react';

interface LinkProps {
  children: ReactNode;
}

const Link: React.FC<LinkProps> = ({ children }) => {
  return <a className="text-black dark:text-white">{children}</a>;
};

export { Link };
