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

const DocumentLayout = ({
  children,
  author,
  tags,
  yourRate,
  rating,
  onRate,
}: DocumentLayoutProps) => {
  return (
    <main className="max-w-4xl p-4 my-6 mx-auto">
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
