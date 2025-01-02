import { logIn } from 'actions/log-in.action';
import { addDocumentCommentsAct } from 'acts/add-document-comment.act';
import { getDocumentCommentsAct } from 'acts/get-document-comments.act';
import { formatDistance } from 'date-fns';
import { Avatar } from 'design-system/avatar';
import { Button } from 'design-system/button';
import { Field } from 'design-system/field';
import { Loader } from 'design-system/loader';
import { Modal } from 'design-system/modal';
import { Textarea } from 'design-system/textarea';
import { maxLength, minLength } from 'development-kit/form';
import { useForm } from 'development-kit/use-form';
import { useDocumentLayoutContext } from 'providers/document-layout.provider';
import React, { type FormEventHandler } from 'react';
import { BiRefresh, BiX } from 'react-icons/bi';
import { useAuthStore } from 'store/auth/auth.store';
import { useDocumentCommentsState } from 'store/document-comments';
import { yourProfileStoreSelectors } from 'store/your-profile/your-profile.store';

const COMMENT_RULES = {
  MIN: 1,
  MAX: 250,
} as const;

const DocumentCommentsModalContainer = ({ onClose }: { onClose(): void }) => {
  const { comments, updating } = useDocumentCommentsState();
  const [{ document }] = useDocumentLayoutContext();
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

  const getDocumentComments = (): void => {
    getDocumentCommentsAct({
      document: {
        id: document.id,
        authorId: document.authorId,
      },
    });
  };

  const confirmComment: FormEventHandler<HTMLFormElement> = async (
    e,
  ): Promise<void> => {
    e.preventDefault();
    addDocumentCommentsAct({
      document: {
        id: document.id,
        authorId: document.authorId,
      },
      comment: {
        content: values.comment,
      },
    });
  };

  React.useEffect(() => {
    getDocumentComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal className="[&>*]:w-[100%] [&>*]:max-w-xl" onEscape={close}>
      <header className="flex items-center">
        <h6 className="text-xl mr-8">Comments</h6>
        <Button
          i={2}
          s={1}
          className="ml-auto"
          title="Reload comments"
          disabled={yourProfileStore.is === `busy`}
          onClick={getDocumentComments}
        >
          <BiRefresh />
        </Button>
        <Button
          type="button"
          i={2}
          s={1}
          title="Close comments section"
          className="ml-2"
          onClick={close}
        >
          <BiX />
        </Button>
      </header>
      <div className="flex flex-col">
        {(comments.is === `idle` || comments.is === `busy`) && (
          <Loader className="m-10 self-center" size="xl" />
        )}

        {comments.is === `fail` && (
          <div className="p-4 flex flex-col items-center m-auto">
            <h6 className="text-center">
              Unable to load comments for this document. Please try again
            </h6>
            <Button
              title="Retry loading comments"
              className="mt-4"
              auto
              s={2}
              i={2}
              onClick={getDocumentComments}
            >
              Try Again
            </Button>
          </div>
        )}

        {comments.is === `ok` && (
          <>
            {comments.data.length > 0 && (
              <section>
                <ul className="grid gap-3">
                  {comments.data.map((comment) => (
                    <React.Fragment key={comment.id}>
                      <li className="flex">
                        <Avatar
                          className="shrink-0 mr-3 bg-gray-300 dark:bg-slate-800"
                          size="sm"
                          title={`${comment.author?.displayName ?? `User`} avatar`}
                          alt={`${comment.author?.displayName ?? `User`} avatar`}
                          char={
                            comment.author?.displayName
                              ? comment.author.displayName.charAt(0)
                              : undefined
                          }
                          src={comment.author?.avatar?.sm.src}
                        />
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <strong className="text-lg">
                              {comment.author?.displayName ?? `Anonymous`}
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
            )}

            <footer className="mt-8" onSubmit={confirmComment}>
              {yourProfileStore.is === `ok` ? (
                <form>
                  <Field
                    label={`Comment (${values.comment.length}/250)*`}
                    className="mt-3"
                  >
                    <Textarea
                      placeholder="Please be polite and add comments that provide value to you, the author, and the readers"
                      value={values.comment}
                      onChange={(e) => set({ comment: e.target.value })}
                    />
                  </Field>
                  <Button
                    className="mt-6 ml-auto"
                    i={2}
                    s={2}
                    auto
                    disabled={untouched || invalid || updating.is === `busy`}
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
          </>
        )}
      </div>
    </Modal>
  );
};

export { DocumentCommentsModalContainer };
