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
import {
  BiArrowToLeft,
  BiArrowToRight,
  BiCopyAlt,
  BiDockTop,
  BiGrid,
  BiX,
} from 'react-icons/bi';
import { Tabs } from 'design-system/tabs';
import c from 'classnames';
import { useToggle } from 'development-kit/use-toggle';
import { Button } from 'design-system/button';
import { Modal } from 'design-system/modal';

type DocumentLayoutProps = {
  children: string;
  rating: DocumentRatingDto;
  tags: Tags;
  author: UserProfileDto | null;
} & Pick<DocumentRatingProps, 'onRate' | 'yourRate'>;

type Display = `document` | `flashcards`;

const FlashcardsDiplayPreview = ({
  children,
  onClose,
}: {
  children: string;
  onClose(): void;
}) => {
  return (
    <Modal className="tn:!w-[100%] !max-w-3xl !p-0" onEscape={onClose}>
      <header className="flex items-center p-4 border-zinc-300 dark:border-zinc-800">
        <h6 className="text-xl mr-8">Chapter Preview</h6>
        <Button
          className="ml-auto"
          i={2}
          s={1}
          onClick={onClose}
          title="Close section preview (Esc)"
        >
          <BiX />
        </Button>
      </header>
      <section className="p-4">
        <Markdown>{children}</Markdown>
      </section>
      <footer className="flex items-center justify-end p-4 space-x-2 py-3 border-t-2 border-zinc-300 dark:border-zinc-800">
        <Button i={2} s={1} title="Copy this section markdown (C)">
          <BiCopyAlt />
        </Button>
        <Button i={2} s={1} title="Go to previous section (A)">
          <BiArrowToLeft />
        </Button>
        <Button i={2} s={1} title="Go to next section (D)">
          <BiArrowToRight />
        </Button>
      </footer>
    </Modal>
  );
};

/**
 * Disable tab when popup opened
 * Display section index when popup opened
 3. Improve preview popup behavior
 5. Add copy markdown button for each and for everything
 6. Fix preview on mobile
 7. Add option to share it - whole article.
 */

const FlashcardsDisplay = ({ children }: { children: string }) => {
  const preview = useToggle<string>();

  const Parts = React.useMemo(() => {
    const parts = children.split(`\n`);

    const intro = parts
      .slice(
        0,
        parts.findIndex((part) => /^##\s.+$/.test(part)),
      )
      .join(`\n`)
      .trim();

    const sections = parts
      .reduce<number[]>((acc, part, index) => {
        if (/^##\s.+$/.test(part)) {
          acc.push(index);
        }

        return acc;
      }, [])
      .map((start, index, positions) => {
        const end = positions[index + 1] ?? parts.length - 1;

        return parts.slice(start, end).join(`\n`).trim();
      });

    const content = [intro, ...sections];

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {content.map((block, index) => (
          <button
            className="text-left relative h-[300px] p-4 border-2 rounded-md border-zinc-300 dark:border-zinc-800 overflow-hidden cursor-pointer focus:outline dark:outline-2 outline-2.5 outline-black dark:outline-white"
            key={index}
            onClick={() => preview.openWithData(block)}
          >
            <Markdown>{block}</Markdown>
          </button>
        ))}
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  return (
    <>
      {Parts}
      {preview.data && (
        <FlashcardsDiplayPreview onClose={preview.close}>
          {preview.data}
        </FlashcardsDiplayPreview>
      )}
    </>
  );
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
          <article className="my-10 mx-auto max-w-[1920px]">
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
