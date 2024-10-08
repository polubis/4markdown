import React from 'react';
import Markdown from './markdown';
import { Badges } from 'design-system/badges';
import { Badge } from 'design-system/badge';
import { Avatar } from 'design-system/avatar';
import { UserSocials } from './user-socials';
import type {
  DocumentRatingDto,
  Tags,
  UserProfileDto,
} from 'api-4markdown-contracts';
import { DocumentRating, type DocumentRatingProps } from './document-rating';

type DocumentLayoutProps = {
  children: string;
  rating: DocumentRatingDto;
  tags: Tags;
  author: UserProfileDto | null;
} & Pick<DocumentRatingProps, 'onRate' | 'yourRate'>;

type ThumbnailImage = {
  h: number;
  w: number;
  src: string;
  type: 'image';
  format: 'webp';
};

type Thumbnails = [
  string,
  ThumbnailImage,
  ThumbnailImage,
  ThumbnailImage,
  ThumbnailImage,
  ThumbnailImage,
];

const thumbnails: Thumbnails = [
  `https://cdn.mos.cms.futurecdn.net/xaycNDmeyxpHDrPqU6LmaD.jpg`,
  {
    h: 1024,
    w: 1024,
    src: `https://cdn.mos.cms.futurecdn.net/xaycNDmeyxpHDrPqU6LmaD.jpg`,
    type: `image`,
    format: `webp`,
  },
  {
    h: 864,
    w: 864,
    src: `https://cdn.mos.cms.futurecdn.net/xaycNDmeyxpHDrPqU6LmaD.jpg`,
    type: `image`,
    format: `webp`,
  },
  {
    h: 768,
    w: 768,
    src: `https://cdn.mos.cms.futurecdn.net/xaycNDmeyxpHDrPqU6LmaD.jpg`,
    type: `image`,
    format: `webp`,
  },
  {
    h: 480,
    w: 480,
    src: `https://cdn.mos.cms.futurecdn.net/xaycNDmeyxpHDrPqU6LmaD.jpg`,
    type: `image`,
    format: `webp`,
  },
  {
    h: 150,
    w: 150,
    src: `https://cdn.mos.cms.futurecdn.net/xaycNDmeyxpHDrPqU6LmaD.jpg`,
    type: `image`,
    format: `webp`,
  },
];

const DocumentLayout = ({
  children,
  author,
  tags,
  yourRate,
  rating,
  onRate,
}: DocumentLayoutProps) => {
  const [thumbnailPlaceholder, ...fullThumbnails] = thumbnails;

  return (
    <main className="max-w-4xl p-4 my-6 mx-auto">
      <DocumentRating
        className="mb-6 justify-end"
        rating={rating}
        yourRate={yourRate}
        onRate={onRate}
      />
      {tags.length > 0 && (
        <Badges className="mb-4">
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </Badges>
      )}
      <figure className="bg-slate-200 dark:bg-slate-800 rounded-md mb-4">
        <picture>
          {fullThumbnails.map((thumbnail) => (
            <source key={thumbnail.src} srcSet={thumbnail.src} />
          ))}
          <img
            src={thumbnailPlaceholder}
            alt="The description of the article"
          />
        </picture>
        <figcaption className="opacity-0 h-0">
          The title of the article.
        </figcaption>
      </figure>
      {/* <figure className="relative w-full mb-4 h-[160px] tn:h-[240px] md:h-[320px]">
        <img
          className="absolute top-0 right-0 w-full h-full object-cover rounded-lg"
          src={thumbnail.placeholder}
        />
        <picture>
          <source
            srcSet={thumbnail.xl.src}
            media={`(min-width: ${thumbnail.xl.w}px)`}
          />
          <source
            srcSet={thumbnail.lg.src}
            media={`(min-width: ${thumbnail.lg.w}px)`}
          />
          <source
            srcSet={thumbnail.md.src}
            media={`(min-width: ${thumbnail.md.w}px)`}
          />
          <source
            srcSet={thumbnail.sm.src}
            media={`(min-width: ${thumbnail.sm.w}px)`}
          />
          <img
            className="absolute top-0 right-0 w-full h-full object-cover rounded-lg"
            src={thumbnail.sm.src}
          />
        </picture>
      </figure> */}
      <Markdown>{children}</Markdown>
      {author?.bio && author?.displayName && (
        <section className="mt-12">
          <div className="flex max-w-xl space-x-5 ml-auto rounded-lg">
            <Avatar
              className="shrink-0 bg-gray-300 dark:bg-slate-800"
              size="md"
              src={author.avatar?.md.src}
              alt="Author avatar"
              char={author.displayName.charAt(0)}
            />
            <div className="flex flex-col">
              <i>About Author</i>
              <strong className="mb-1 text-black dark:text-white">
                {author.displayName}
              </strong>
              <p>{author.bio}</p>
              <div className="flex space-x-2 mt-4">
                <UserSocials
                  githubUrl={author.githubUrl}
                  linkedInUrl={author.linkedInUrl}
                  blogUrl={author.blogUrl}
                  twitterUrl={author.twitterUrl}
                  fbUrl={author.fbUrl}
                  createTitle={(title) => `Author ${title}`}
                />
              </div>
            </div>
          </div>
        </section>
      )}
      <DocumentRating
        className="mt-10 justify-end"
        rating={rating}
        yourRate={yourRate}
        onRate={onRate}
      />
    </main>
  );
};

export { DocumentLayout };
