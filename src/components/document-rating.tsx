import type {
  DocumentRatingCategory,
  DocumentRatingDto,
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
  rating: DocumentRatingDto;
  yourRate: DocumentRatingCategory | null;
  onRate(category: DocumentRatingCategory, index: number): void;
};

const comments = [
  {
    id: `1`,
    cdate: `2024-12-11T12:00:00.000Z`,
    mdate: `2024-12-11T12:30:00.000Z`,
    author: {
      name: `Donald Rice`,
    },
    content: `Christian spirit passion virtues suicide morality. Pinnacle moral pinnacle hope abstract right disgust joy.`,
    reactions: {
      likes: 24,
    },
    interactions: {
      canReply: true,
      replyLabel: `Reply`,
      liked: true,
      likeLabel: `You Like`,
    },
  },
  {
    id: `2`,
    cdate: `2024-12-11T11:50:00.000Z`,
    mdate: `2024-12-11T12:10:00.000Z`,
    author: {
      name: `Jane Doe`,
    },
    content: `I completely agree with this perspective. It's refreshing to see these topics discussed.`,
    reactions: {
      likes: 15,
    },
    interactions: {
      canReply: true,
      replyLabel: `Reply`,
      liked: false,
      likeLabel: `Like`,
    },
  },
  {
    id: `3`,
    cdate: `2024-12-11T11:40:00.000Z`,
    mdate: `2024-12-11T12:05:00.000Z`,
    author: {
      name: `John Smith`,
      avatar: `https://firebasestorage.googleapis.com/v0/b/greenonsoftware-dev-api.appspot.com/o/5vHPGeTv26Oj574o1RRjweB6nx03%2Favatars%2Fmd?alt=media`,
    },
    content: `While I see your point, I believe there's more nuance to this topic that needs to be addressed.`,
    reactions: {
      likes: 8,
    },
    interactions: {
      canReply: true,
      replyLabel: `Reply`,
      liked: false,
      likeLabel: `Like`,
    },
  },
  {
    id: `4`,
    cdate: `2024-12-11T11:30:00.000Z`,
    mdate: `2024-12-11T11:55:00.000Z`,
    author: {
      name: `Alice Johnson`,
    },
    content: `Interesting take! Thanks for sharing your thoughts.`,
    reactions: {
      likes: 12,
    },
    interactions: {
      canReply: true,
      liked: true,
    },
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
                    title={`${comment.author.name} avatar`}
                    alt={`${comment.author.name} avatar`}
                    char={
                      comment.author.avatar
                        ? comment.author.name.charAt(0)
                        : undefined
                    }
                    src={comment.author.avatar}
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <strong className="text-lg">{comment.author.name}</strong>
                      <div className="w-1 h-1 rounded-full bg-gray-500 mx-2" />
                      <time dateTime={comment.cdate}>
                        {formatDistance(comment.cdate, now)}
                      </time>
                    </div>
                    <p className="mt-1">{comment.content}</p>
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
