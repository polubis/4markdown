import c from 'classnames';
import React from 'react';

type ImageContentSet = { w: number; h: number; src: string };

type ImageContentProps = {
  className?: string;
  src: string;
  alt?: string;
} & {
  [key: string]: string | ImageContentSet | undefined;
};

type ImagePlaceholderProps = {
  className?: string;
  src: string;
};

type ImageProps = {
  className?: string;
  placeholder?: React.ReactNode;
  content: React.ReactNode;
};

const ImagePlaceholder = ({ className, src }: ImagePlaceholderProps) => (
  <img
    className={c(
      className,
      `absolute top-0 right-0 w-full h-full object-cover`,
    )}
    src={src}
  />
);

const Image = ({ className, placeholder, content }: ImageProps) => {
  return (
    <figure className={c(`relative`, className)}>
      {placeholder}
      {content}
    </figure>
  );
};

const ImageContent = ({
  className,
  alt,
  src,
  ...srcSet
}: ImageContentProps) => (
  <picture className={className}>
    {Object.entries(srcSet).map(([key, set]) => (
      <source
        key={key}
        srcSet={(set as ImageContentSet).src}
        media={`(min-width: ${(set as ImageContentSet).w}px)`}
      />
    ))}
    <img
      className="absolute top-0 right-0 w-full h-full object-cover"
      src={src}
      alt={alt}
    />
  </picture>
);

Image.Placeholder = ImagePlaceholder;
Image.Content = ImageContent;

export type { ImageProps };
export { Image };
