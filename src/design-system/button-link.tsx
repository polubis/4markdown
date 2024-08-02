import React, { type ReactNode } from 'react';
import c from 'classnames';

interface ButtonLinkProps {
  className?: string;
  to: string;
  title: string;
  rel?: string;
  children: ReactNode;
  target?: string;
  component?: (props: Omit<ButtonLinkProps, 'component'>) => ReactNode;
}

const ButtonLink = ({
  className,
  component: Component = ({ to, ...props }) => <a href={to} {...props} />,
  ...props
}: ButtonLinkProps) => {
  return (
    <Component
      className={c(
        `text-md shrink-0 cursor-pointer dark:outline-white focus:outline dark:outline-2 outline-2.5 outline-black text-center px-3 py-2 [&>svg]:text-2xl rounded-md font-medium font-sans bg-gray-300 text-black hover:bg-gray-400/70 dark:bg-slate-800 dark:hover:bg-slate-800/70 dark:text-white`,
        className,
      )}
      {...props}
    />
  );
};

export { ButtonLink };
