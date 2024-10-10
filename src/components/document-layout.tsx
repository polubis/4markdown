import React from 'react';
import Markdown from './markdown';
import { Badges } from 'design-system/badges';
import { Badge } from 'design-system/badge';
import { Avatar } from 'design-system/avatar';
import { UserSocials } from './user-socials';
import type {
  DocumentRatingDto,
  DocumentThumbnailDto,
  Tags,
  UserProfileDto,
} from 'api-4markdown-contracts';
import { DocumentRating, type DocumentRatingProps } from './document-rating';

type DocumentLayoutProps = {
  children: string;
  rating: DocumentRatingDto;
  tags: Tags;
  author: UserProfileDto | null;
  thumbnail?: DocumentThumbnailDto;
} & Pick<DocumentRatingProps, 'onRate' | 'yourRate'>;

const DocumentLayout = ({
  children,
  author,
  tags,
  yourRate,
  rating,
  thumbnail,
  onRate,
}: DocumentLayoutProps) => {
  return (
    <main className="max-w-4xl p-4 my-6 mx-auto">
      <DocumentRating
        className="mb-4 justify-end"
        rating={rating}
        yourRate={yourRate}
        onRate={onRate}
      />
      {thumbnail && (
        <figure className="mb-4">
          <picture className="[&>*]:rounded-sm">
            {Object.entries(thumbnail.variants).map(
              ([key, { src, h, w, type }]) => (
                <source
                  key={key}
                  srcSet={`${src} ${w}w ${h}h`}
                  media={`(min-width: ${w}px)`}
                  type={type}
                />
              ),
            )}
            <img
              src={thumbnail.placeholder}
              alt="The description of the article"
            />
          </picture>
          <figcaption className="opacity-0 h-0">
            The title of the article.
          </figcaption>
        </figure>
      )}
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
