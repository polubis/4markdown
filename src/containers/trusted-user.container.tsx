import React from 'react';
import type { ReactNode, DetailedHTMLProps, ButtonHTMLAttributes } from 'react';
import { useYourUserProfileState } from 'store/your-user-profile';
import { MdVerified, MdGppBad, MdGppMaybe } from 'react-icons/md';
import c from 'classnames';

interface TooltipProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  text: string;
  children: ReactNode;
  className?: string;
}

const Tooltip = ({ text, children, className }: TooltipProps) => (
  <div className={c(`group relative inline-block`, className)}>
    <span>{children}</span>
    <span
      className={c(
        `pointer-events-none absolute left-1/2 -translate-x-1/2`,
        `whitespace-nowrap rounded bg-black px-2 py-1 text-white`,
        `opacity-0 transition group-hover:opacity-100`,
        // Mobile: show above
        `bottom-full mb-2`,
        `before:absolute before:left-1/2 before:-translate-x-1/2`,
        `before:border-4 before:border-transparent before:border-t-black`,
        `before:bottom-[-8px]`,
        // Desktop: show below
        `md:bottom-auto md:top-full md:mt-2`,
        `md:before:bottom-auto md:before:top-[-8px]`,
        `md:before:border-t-transparent md:before:border-b-black`,
      )}
    >
      {text}
    </span>
  </div>
);

const TrustedUserContainer = () => {
  const yourUserProfile = useYourUserProfileState();

  if (yourUserProfile.is !== `ok`) {
    return (
      <Tooltip
        title={`Trusted user loading container`}
        text={`Loading verification status...`}
      >
        <span className={`text-gray-400 dark:text-gray-500`}>
          <MdGppMaybe size={24} />
        </span>
      </Tooltip>
    );
  }

  const isVerified = yourUserProfile.user?.isTrusted;

  return (
    <Tooltip
      title={`Trusted user container`}
      text={isVerified ? `User is verified` : `User is not verified`}
    >
      <span
        className={
          isVerified
            ? `text-green-700 dark:text-green-400`
            : `text-red-500 dark:text-red-400`
        }
      >
        {isVerified ? <MdVerified size={24} /> : <MdGppBad size={24} />}
      </span>
    </Tooltip>
  );
};

export { TrustedUserContainer };
