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
}

const sizesMap: Record<AvatarSize, number> = {
  tn: 24,
  sm: 32,
  md: 64,
  lg: 100,
};

const iconSizesLookup: Record<AvatarSize, number> = {
  tn: 24,
  sm: 28,
  md: 32,
  lg: 40,
};

const Avatar = ({ className, size, src, char, alt }: AvatarProps) => {
  return (
    <div
      className={c(
        className,
        `flex items-center justify-center rounded-full`,
        `w-[${sizesMap[size]}px] h-[${sizesMap[size]}px]`,
      )}
    >
      {src && (
        <img
          referrerPolicy="no-referrer"
          className="rounded-full h-full w-full shadow-lg"
          src={src}
          alt={alt}
        />
      )}
      {!src && char && (
        <span
          className={c(
            `capitalize font-bold`,
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

      {!src && !char && <BiQuestionMark size={iconSizesLookup[size]} />}
    </div>
  );
};

export type { AvatarProps, AvatarSize };
export { Avatar };
