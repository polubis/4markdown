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
  type: string;
  format: string;
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
  `https://cdn.backpacker.com/wp-content/uploads/2018/08/15042738127_f2ecb0b570_o.jpg`,
  {
    // 5/2
    h: 346,
    w: 864,
    src: `https://cdn.mos.cms.futurecdn.net/xaycNDmeyxpHDrPqU6LmaD.jpg`,
    type: `image/jpg`,
    format: `jpg`,
  },
  {
    h: 864,
    w: 864,
    src: `https://cdn.britannica.com/10/241010-049-3EB67AA2/highest-mountains-of-the-world-on-each-continent.jpg`,
    type: `image/jpg`,
    format: `jpg`,
  },
  {
    h: 768,
    w: 768,
    src: `https://cdn.mos.cms.futurecdn.net/xaycNDmeyxpHDrPqU6LmaD.jpg`,
    type: `image/jpg`,
    format: `jpg`,
  },
  {
    h: 480,
    w: 480,
    src: `https://hips.hearstapps.com/hmg-prod/images/alpe-di-siusi-sunrise-with-sassolungo-or-langkofel-royalty-free-image-1623254127.jpg`,
    type: `image/jpg`,
    format: `jpg`,
  },
  {
    h: 150,
    w: 150,
    src: `https://i.natgeofe.com/n/c9107b46-78b1-4394-988d-53927646c72b/1095.jpg`,
    type: `image/jpg`,
    format: `jpg`,
  },
];

const thumbnailsMedia = [1024, 768, 512, 420, 320] as const;

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
        className="mb-4 justify-end"
        rating={rating}
        yourRate={yourRate}
        onRate={onRate}
      />
      <figure className="mb-4">
        <picture className="[&>*]:rounded-sm">
          {fullThumbnails.map((thumbnail, index) => (
            <source
              key={thumbnail.src}
              srcSet={`${thumbnail.src} ${thumbnail.w}w ${thumbnail.h}h`}
              media={`(min-width: ${thumbnailsMedia[index]}px)`}
              type={thumbnail.type}
            />
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
      {tags.length > 0 && (
        <Badges className="mb-4">
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </Badges>
      )}
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
