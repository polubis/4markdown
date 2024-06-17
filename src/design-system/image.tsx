import c from 'classnames';
import React from 'react';

type ImageContentSet = { w: number; h: number; src: string };

type ImageProps = {
  className?: string;
  placeholder?: string;
  src: string;
  alt?: string;
} & {
  [key: string]: ImageContentSet | React.ReactNode;
};

const Image = ({ className, placeholder, alt, src, ...srcSet }: ImageProps) => {
  return (
    <figure className={c(`relative`, className)}>
      {placeholder && (
        <img
          className="absolute top-0 right-0 w-full h-full object-cover rounded-lg"
          src={placeholder}
        />
      )}
      <picture>
        {Object.entries(srcSet).map(([key, set]) => (
          <source
            key={key}
            srcSet={(set as ImageContentSet).src}
            media={`(min-width: ${(set as ImageContentSet).w}px)`}
          />
        ))}
        <img
          className="absolute top-0 right-0 w-full h-full object-cover rounded-lg"
          src={src}
          alt={alt}
        />
      </picture>
    </figure>
  );
};

export type { ImageProps };
export { Image };
