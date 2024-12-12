import type {
  CommentDto,
  RatingCategory,
  RatingDto,
} from 'api-4markdown-contracts';
import React from 'react';
import c from 'classnames';
import { Button } from 'design-system/button';
import { DOCUMENT_RATING_ICONS } from 'core/document-rating-config';
import { BiCommentDetail, BiX } from 'react-icons/bi';
import { useToggle } from 'development-kit/use-toggle';
import { Modal } from 'design-system/modal';
import { Avatar } from 'design-system/avatar';
import { formatDistance } from 'date-fns';

type DocumentRatingProps = {
  className?: string;
  rating: RatingDto;
  yourRate: RatingCategory | null;
  onRate(category: RatingCategory, index: number): void;
};

const comments: CommentDto[] = [
  {
    id: `1`,
    cdate: `2024-12-11T12:00:00.000Z`,
    mdate: `2024-12-11T12:30:00.000Z`,
    content: `Christian spirit passion virtues suicide morality. Pinnacle moral pinnacle hope abstract right disgust joy.`,
    author: {
      displayName: `Donald Rice`,
      avatar: {
        md: {
          w: 64,
          h: 64,
          id: `1`,
          src: `https://firebasestorage.googleapis.com/v0/b/greenonsoftware-dev-api.appspot.com/o/5vHPGeTv26Oj574o1RRjweB6nx03%2Favatars%2Fmd?alt=media`,
        },
      },
      url: `https://www.linkedin.com/in/adrian-po%C5%82ubi%C5%84ski-281ab2172/`,
    },
    rating: {
      ugly: 1,
      bad: 0,
      good: 1,
      perfect: 1,
      decent: 1,
    },
    children: [
      {
        id: `2`,
        cdate: `2024-12-11T12:00:00.000Z`,
        mdate: `2024-12-11T12:30:00.000Z`,
        content: `Christian spirit passion virtues suicide morality. Pinnacle moral pinnacle hope abstract right disgust joy.`,
        author: {
          displayName: `Donald Rice`,
          avatar: {
            md: {
              w: 64,
              h: 64,
              id: `1`,
              src: `https://firebasestorage.googleapis.com/v0/b/greenonsoftware-dev-api.appspot.com/o/5vHPGeTv26Oj574o1RRjweB6nx03%2Favatars%2Fmd?alt=media`,
            },
          },
          url: `https://www.linkedin.com/in/adrian-po%C5%82ubi%C5%84ski-281ab2172/`,
        },
        rating: {
          ugly: 1,
          bad: 0,
          good: 1,
          perfect: 1,
          decent: 1,
        },
      },
    ],
  },
  {
    id: `3`,
    cdate: `2024-12-11T12:00:00.000Z`,
    mdate: `2024-12-11T12:30:00.000Z`,
    content: `Christian spirit passion virtues suicide morality. Pinnacle moral pinnacle hope abstract right disgust joy.`,
    author: {
      displayName: null,
      avatar: null,
      url: `https://www.linkedin.com/in/adrian-po%C5%82ubi%C5%84ski-281ab2172/`,
    },
    rating: {
      ugly: 1,
      bad: 0,
      good: 1,
      perfect: 1,
      decent: 1,
    },
    children: [],
  },
];

const CommentsArea = () => {
  const modal = useToggle();
  const now = new Date();

  return (
    <>
      <Button
        i={1}
        s={1}
        auto
        key="comments"
        title="See comments"
        onClick={modal.open}
      >
        <BiCommentDetail className="mr-0.5" />
        <strong>0</strong>
      </Button>
      {modal.opened && (
        <Modal className="[&>*]:w-[100%] [&>*]:max-w-xl" onEscape={modal.close}>
          <header className="flex items-center mb-6">
            <h6 className="text-xl mr-8">Comments ({comments.length})</h6>
            <Button
              type="button"
              i={2}
              s={1}
              title="Close comments section"
              className="ml-auto"
              onClick={modal.close}
            >
              <BiX />
            </Button>
          </header>
          <section>
            <ul className="flex flex-col space-y-6">
              {comments.map((comment) => (
                <li className="flex" key={comment.id}>
                  <Avatar
                    className="shrink-0 tn:flex hidden mr-4"
                    size="md"
                    title={`${comment.author.displayName ?? `User`} avatar`}
                    alt={`${comment.author.displayName ?? `User`} avatar`}
                    char={
                      comment.author.displayName
                        ? comment.author.displayName.charAt(0)
                        : undefined
                    }
                    src={comment.author.avatar?.md.src}
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <strong className="text-lg">
                        {comment.author.displayName ?? `Anonymous`}
                      </strong>
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-500 mx-2" />
                      <time dateTime={comment.cdate}>
                        {formatDistance(comment.cdate, now)}
                      </time>
                    </div>
                    <p className="mt-1">{comment.content}</p>
                    <div className="flex items-center mt-2.5">
                      <div className="flex">
                        {DOCUMENT_RATING_ICONS.map(([Icon, category]) => (
                          <Button
                            i={1}
                            s={1}
                            auto
                            key={category}
                            title={`Rate as ${category}`}
                            // onClick={() => onRate(category, idx)}
                          >
                            <Icon className="mr-0.5" />
                            <strong>{comment.rating[category]}</strong>
                          </Button>
                        ))}
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-500 mx-2" />
                      <button className="hover:underline underline-offset-2 mr-4 p-1">
                        Reply ({comment.children.length})
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <footer className="mt-8">
            <Button className="ml-auto" i={2} s={2} auto>
              Add Comment
            </Button>
          </footer>
        </Modal>
      )}
    </>
  );
};

const DocumentRating = ({
  className,
  yourRate,
  rating,
  onRate,
}: DocumentRatingProps) => {
  return (
    <section
      className={c(
        `flex tn:[&>button]:flex-row [&>button]:flex-col`,
        className,
      )}
    >
      <CommentsArea />
      {DOCUMENT_RATING_ICONS.map(([Icon, category], idx) => (
        <Button
          i={yourRate === category ? 2 : 1}
          s={1}
          auto
          key={category}
          title={`Rate as ${category}`}
          onClick={() => onRate(category, idx)}
        >
          <Icon className="mr-0.5" />
          <strong>{rating[category]}</strong>
        </Button>
      ))}
    </section>
  );
};

export { DocumentRating };
export type { DocumentRatingProps };
