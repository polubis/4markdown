import React from 'react';
import { BiQuestionMark } from 'react-icons/bi';
import c from 'classnames';

type AvatarSize = 'tn' | 'sm' | 'md' | 'lg';

interface AvatarProps {
  size: AvatarSize;
  src?: string;
  className?: string;
  char?: string;
  alt: string;
  title?: string;
}

const iconSizesLookup: Record<AvatarSize, number> = {
  tn: 24,
  sm: 28,
  md: 32,
  lg: 40,
};

const Avatar = ({ className, size, src, char, alt, title }: AvatarProps) => {
  return (
    <div
      title={title}
      className={c(
        className,
        `flex items-center justify-center rounded-full`,
        {
          'w-6 h-6': size === `tn`,
        },
        {
          'w-8 h-8': size === `sm`,
        },
        { 'w-16 h-16': size === `md` },
        {
          'w-[100px] h-[100px]': size === `lg`,
        },
      )}
    >
      {src && (
        <img
          referrerPolicy="no-referrer"
          className="rounded-full h-full w-full"
          src={src}
          alt={alt}
        />
      )}
      {!src && char && (
        <span
          className={c(
            `capitalize font-bold text-black dark:text-white`,
            {
              'text-xl': size === `tn` || size === `sm`,
            },
            {
              'text-2xl': size === `md`,
            },
            { 'text-3xl': size === `lg` },
          )}
        >
          {char}
        </span>
      )}
      {!src && !char && (
        <BiQuestionMark
          className="text-black dark:text-white"
          size={iconSizesLookup[size]}
        />
      )}
    </div>
  );
};

export type { AvatarProps, AvatarSize };
export { Avatar };
