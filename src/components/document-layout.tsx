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
import { Button } from 'design-system/button';
import { BiArrowToTop, BiSquare } from 'react-icons/bi';
import { usePortal } from 'development-kit/use-portal';

type DocumentLayoutProps = {
  children: string;
  rating: DocumentRatingDto;
  tags: Tags;
  author: UserProfileDto | null;
} & Pick<DocumentRatingProps, 'onRate' | 'yourRate'>;

const ToolBar = () => {
  const { render } = usePortal();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    let prevY = window.scrollY;

    const handleScroll = (): void => {
      const y = window.scrollY;

      setVisible(prevY > y && y > 100);

      prevY = y;
    };

    window.addEventListener(`scroll`, handleScroll);

    return () => {
      window.removeEventListener(`scroll`, handleScroll);
    };
  }, []);

  if (!visible) return null;

  return render(
    <div className="fixed flex flex-col space-y-2 left-0 bottom-0 p-4">
      <Button
        i={2}
        s={2}
        title="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: `smooth` })}
      >
        <BiArrowToTop />
      </Button>
      <Button title="Divide the article into flashcards" i={2} s={2}>
        <BiSquare />
      </Button>
    </div>,
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
  return (
    <>
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
      <ToolBar />
    </>
  );
};

export { DocumentLayout };
