import React from 'react';
import { M } from './markdown';
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
import { Button } from 'design-system/button';
import { BiSquare } from 'react-icons/bi';
import Markdown from 'markdown-to-jsx';

type DocumentLayoutProps = {
  children: string;
  rating: DocumentRatingDto;
  tags: Tags;
  author: UserProfileDto | null;
} & Pick<DocumentRatingProps, 'onRate' | 'yourRate'>;

type Display = `document` | `flashcards`;

const FlashcardsDisplay = ({ children }: { children: string }) => {
  const Parts = React.useMemo(() => {
    const parts = children.split(`#`);

    return parts.map((part, idx) => <Markdown key={idx}>{part}</Markdown>);
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
  const [display, setDisplay] = React.useState<Display>(`document`);

  const toggleDisplay = (): void => {
    setDisplay((prevDisplay) =>
      prevDisplay === `document` ? `flashcards` : `document`,
    );
  };

  return (
    <>
      <main className="max-w-4xl p-4 my-6 mx-auto">
        <section className="flex ml-auto mb-6 justify-end tn:justify-start">
          <Button
            title={
              display === `document`
                ? `Divide the document into sections`
                : `Display as a single document`
            }
            i={2}
            s={2}
            onClick={toggleDisplay}
          >
            <BiSquare />
          </Button>
        </section>
        <DocumentRating
          className="mb-6 justify-end"
          rating={rating}
          yourRate={yourRate}
          onRate={onRate}
        />
        {tags.length > 0 && (
          <section className="flex flex-wrap gap-2 items-center mb-4">
            {tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </section>
        )}
        {display === `document` && (
          <article className={M.className}>
            <M>{children}</M>
          </article>
        )}
        {display === `flashcards` && (
          <article>
            <FlashcardsDisplay>{children}</FlashcardsDisplay>
          </article>
        )}
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
          className="mt-10 justify-end"
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
