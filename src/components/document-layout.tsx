import React from 'react';
import { M, Markdown } from './markdown';
import { Badge } from 'design-system/badge';
import { Avatar } from 'design-system/avatar';
import { UserSocials } from './user-socials';
import type {
  DocumentRatingDto,
  Tags,
  UserProfileDto,
} from 'api-4markdown-contracts';
import { DocumentRating, type DocumentRatingProps } from './document-rating';
import { ScrollToTop } from './scroll-to-top';
import { BiDockTop, BiGrid } from 'react-icons/bi';
import { Tabs } from 'design-system/tabs';
import c from 'classnames';

type DocumentLayoutProps = {
  children: string;
  rating: DocumentRatingDto;
  tags: Tags;
  author: UserProfileDto | null;
} & Pick<DocumentRatingProps, 'onRate' | 'yourRate'>;

type Display = `document` | `flashcards`;

const FlashcardsDisplay = ({ children }: { children: string }) => {
  const Parts = React.useMemo(() => {
    const parts = children.split(`\n`);

    const intro = parts
      .slice(
        0,
        parts.findIndex((part) => /^##\s.+$/.test(part)),
      )
      .join(`\n`)
      .trim();

    const content = [intro];

    return (
      <ul className="flex flex-wrap gap-6">
        {content.map((block, index) => (
          <li
            className="cursor-pointer relative p-4 border-2 rounded-md border-zinc-300 dark:border-zinc-800"
            key={index}
          >
            <strong className="absolute dark:opacity-10 opacity-15 text-6xl top-0 right-2">
              {index + 1}
            </strong>
            <div className="pointer-events-none select-none">
              <Markdown>{block}</Markdown>
            </div>
          </li>
        ))}
      </ul>
    );
  }, [children]);

  return Parts;
};

const DocumentLayout = ({
  children,
  author,
  tags,
  yourRate,
  rating,
  onRate,
}: DocumentLayoutProps) => {
  const [display, setDisplay] = React.useState<Display>(`flashcards`);

  return (
    <>
      <main className="p-4 my-6">
        <section className="flex ml-auto mb-6 justify-end tn:justify-start max-w-4xl mx-auto">
          <Tabs>
            <Tabs.Item
              title="Display as a single document"
              active={display === `document`}
              onClick={() => setDisplay(`document`)}
            >
              <BiDockTop size={20} />
            </Tabs.Item>
            <Tabs.Item
              title="Divide the document into sections"
              active={display === `flashcards`}
              onClick={() => setDisplay(`flashcards`)}
            >
              <BiGrid size={20} />
            </Tabs.Item>
          </Tabs>
        </section>
        <DocumentRating
          className="mb-6 justify-end max-w-4xl mx-auto"
          rating={rating}
          yourRate={yourRate}
          onRate={onRate}
        />
        {tags.length > 0 && (
          <section className="flex flex-wrap gap-2 items-center mb-4 max-w-4xl mx-auto">
            {tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </section>
        )}
        {display === `document` && (
          <article className={c(`max-w-4xl mx-auto`, M.className)}>
            <M>{children}</M>
          </article>
        )}
        {display === `flashcards` && (
          <article className="my-10">
            <FlashcardsDisplay>{children}</FlashcardsDisplay>
          </article>
        )}
        {author?.bio && author?.displayName && (
          <section className="mt-12 max-w-4xl mx-auto">
            <div className="flex max-w-xl space-x-5 ml-auto rounded-lg">
              <Avatar
                className="shrink-0 bg-gray-300 dark:bg-slate-800"
                size="md"
                src={author.avatar?.md.src}
                alt="Author avatar"
                char={author.displayName.charAt(0)}
              />
              <div className="flex flex-col overflow-hidden">
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
          className="mt-10 justify-end max-w-4xl mx-auto"
          rating={rating}
          yourRate={yourRate}
          onRate={onRate}
        />
      </main>
      <ScrollToTop />
    </>
  );
};

export { DocumentLayout };
