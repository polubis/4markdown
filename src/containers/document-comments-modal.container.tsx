import { logIn } from 'actions/log-in.action';
import type { DocumentCommentDto } from 'api-4markdown-contracts';
import { formatDistance } from 'date-fns';
import { Avatar } from 'design-system/avatar';
import { Button } from 'design-system/button';
import { Field } from 'design-system/field';
import { Modal } from 'design-system/modal';
import { Textarea } from 'design-system/textarea';
import { maxLength, minLength } from 'development-kit/form';
import { useForm } from 'development-kit/use-form';
import React, { type FormEventHandler } from 'react';
import { BiX } from 'react-icons/bi';
import { useAuthStore } from 'store/auth/auth.store';
import { yourProfileStoreSelectors } from 'store/your-profile/your-profile.store';

type DocumentCommentsModalContainerProps = {
  onClose(): void;
};

const comments: DocumentCommentDto[] = [
  {
    id: `1`,
    cdate: `2024-12-11T12:00:00.000Z`,
    mdate: `2024-12-11T12:30:00.000Z`,
    content: `Christian spirit passion virtues suicide morality. Pinnacle moral pinnacle hope abstract right disgust joy.`,
    author: {
      displayName: `Donald Rice`,
      avatar: {
        sm: {
          w: 32,
          h: 32,
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
    repliesCount: 1,
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
    repliesCount: 0,
  },
];

const COMMENT_RULES = {
  MIN: 1,
  MAX: 250,
} as const;

const DocumentCommentsModalContainer = ({
  onClose,
}: DocumentCommentsModalContainerProps) => {
  const authStore = useAuthStore();
  const yourProfileStore = yourProfileStoreSelectors.useState();
  const now = new Date();

  const [{ invalid, values, untouched }, { set }] = useForm(
    {
      comment: ``,
    },
    {
      comment: [minLength(COMMENT_RULES.MIN), maxLength(COMMENT_RULES.MAX)],
    },
  );

  const close = (): void => {
    onClose();
  };

  const confirmComment: FormEventHandler<HTMLFormElement> = async (
    e,
  ): Promise<void> => {
    e.preventDefault();
  };

  return (
    <Modal className="[&>*]:w-[100%] [&>*]:max-w-xl" onEscape={close}>
      <header className="flex items-center mb-6">
        <h6 className="text-xl mr-8">Comments ({comments.length})</h6>
        <Button
          type="button"
          i={2}
          s={1}
          title="Close comments section"
          className="ml-auto"
          onClick={close}
        >
          <BiX />
        </Button>
      </header>
      <section>
        <ul className="grid gap-3">
          {comments.map((comment) => (
            <React.Fragment key={comment.id}>
              <li className="flex">
                <Avatar
                  className="shrink-0 mr-3 bg-gray-300 dark:bg-slate-800"
                  size="sm"
                  title={`${comment.author.displayName ?? `User`} avatar`}
                  alt={`${comment.author.displayName ?? `User`} avatar`}
                  char={
                    comment.author.displayName
                      ? comment.author.displayName.charAt(0)
                      : undefined
                  }
                  src={comment.author.avatar?.sm.src}
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
                  {/* <div className="flex items-center mt-2.5 space-x-1">
                    <button
                      className="flex items-center mr-2"
                      // onClick={() => toggleReplyVisibility(comment.id)}
                    >
                      <BiHeart />
                      <BiLike />
                      <BiDislike />
                      {` `}
                      <span className="pl-1">(40)</span>
                    </button>
                    <button
                      className="hover:underline underline-offset-2 mr-2"
                      // onClick={() => toggleReplyVisibility(comment.id)}
                    >
                      Replies ({comment.repliesCount})
                    </button>
                  </div> */}
                </div>
              </li>
              {/* {repliesVisibility[comment.id] && (
                <CommentReplies replies={replies[comment.id]} />
              )} */}
            </React.Fragment>
          ))}
        </ul>
      </section>
      <footer className="mt-8" onSubmit={confirmComment}>
        {yourProfileStore.is === `ok` ? (
          <form>
            <Field
              label={`Comment (${values.comment.length}/250)*`}
              className="mt-3"
            >
              <Textarea
                placeholder="The description will be displayed in Google and under document"
                value={values.comment}
                onChange={(e) => set({ comment: e.target.value })}
              />
            </Field>
            <Button
              className="mt-6 ml-auto"
              i={2}
              s={2}
              auto
              disabled={untouched || invalid}
              title="Confirm and add comment"
              type="submit"
            >
              Add Comment
            </Button>
          </form>
        ) : (
          <Button
            title="Add comment"
            className="ml-auto"
            i={2}
            s={2}
            auto
            disabled={authStore.is === `idle`}
            onClick={logIn}
          >
            Add Comment
          </Button>
        )}
      </footer>
    </Modal>
  );
};

export { DocumentCommentsModalContainer };
