import { useAuthStart } from "core/use-auth-start";
import { Button } from "design-system/button";
import { Empty } from "design-system/empty";
import React from "react";
import { BiComment, BiError, BiPlus } from "react-icons/bi";
import { DocumentCommentFormContainer } from "./document-comment-form.container";
import { DocumentCommentsListLoader } from "../components/document-comments-list-loader";
import { useDocumentCommentsContext } from "../providers/document-comments.provider";
import { DocumentCommentsList } from "../components/document-comments-list";
import { useYourUserProfileState } from "store/your-user-profile";
import { loadDocumentCommentsAct } from "../acts/load-document-comments.act";
import { useQuery2 } from "core/use-query-2";
import { EmptyDocumentComments } from "../components/empty-document-comments";
import { Err } from "design-system/err";

type DocumentCommentsContainerProps = {
  className?: string;
};

const DocumentCommentsContainer = ({
  className,
}: DocumentCommentsContainerProps) => {
  const { commentsCount, documentId, commentsQuery, commentForm } =
    useDocumentCommentsContext();

  const startAddingComment = useAuthStart();

  const yourUserProfile = useYourUserProfileState();

  const loadMoreCommentsQuery = useQuery2({
    initialize: false,
    handler: () =>
      loadDocumentCommentsAct({
        resourceId: documentId,
        nextCursor: commentsQuery.data?.nextCursor ?? null,
        limit: 10,
      }),
    onOk: (newData) => {
      commentsQuery.setData((currData) => ({
        ...currData,
        comments: [...currData.comments, ...newData.comments],
      }));
    },
  });

  const openAddForm = () => {
    startAddingComment(async () => {
      if (!commentsQuery.data) {
        const [status] = await commentsQuery.start();

        if (status === "ok") {
          commentForm.on({
            mode: "add",
          });
        }

        return;
      }

      commentForm.on({
        mode: "add",
      });
    });
  };

  return (
    <>
      <div className={className}>
        <h2 className="mb-4 flex items-center gap-2 justify-between">
          <span className="text-lg">
            Comments{" "}
            {commentsQuery.data
              ? `(${commentsQuery.data.comments.length})`
              : `(${commentsCount})`}
          </span>
          <Button
            i={2}
            s={1}
            title="Add comment"
            disabled={commentsQuery.busy}
            onClick={openAddForm}
          >
            <BiPlus />
          </Button>
        </h2>
        {commentsQuery.error ? (
          <Err className="border border-zinc-300 dark:border-zinc-800 rounded-lg p-6">
            <Err.Icon>
              <BiError size={80} />
            </Err.Icon>
            <Err.Title>Something went wrong!</Err.Title>
            <Err.Description>{commentsQuery.error.message}</Err.Description>
            <Err.Action
              title="Retry loading comments"
              auto
              s={2}
              i={2}
              disabled={commentsQuery.busy}
              onClick={() => commentsQuery.start()}
            >
              Try Again
            </Err.Action>
          </Err>
        ) : (
          <>
            {commentsQuery.data ? (
              <>
                {commentsQuery.data.comments.length > 0 ? (
                  <>
                    <DocumentCommentsList
                      comments={commentsQuery.data.comments}
                      onEditStart={(comment) =>
                        commentForm.on({
                          mode: "edit",
                          commentId: comment.id,
                          content: comment.content,
                        })
                      }
                      userProfileId={
                        yourUserProfile.is === "ok"
                          ? (yourUserProfile.user?.id ?? null)
                          : null
                      }
                    />
                    {commentsQuery.data.hasMore && (
                      <Button
                        className="mt-4 ml-auto"
                        s={1}
                        i={2}
                        auto
                        disabled={loadMoreCommentsQuery.busy}
                        onClick={() => loadMoreCommentsQuery.start()}
                      >
                        Load More Comments
                      </Button>
                    )}
                  </>
                ) : (
                  <EmptyDocumentComments
                    disabled={commentsQuery.busy}
                    onAddClick={openAddForm}
                  />
                )}
              </>
            ) : commentsCount > 0 ? (
              <Empty className="relative overflow-hidden border border-zinc-300 dark:border-zinc-800 rounded-lg p-6">
                <DocumentCommentsListLoader className="z-[-1] absolute top-0 -translate-y-12 left-0 w-full h-full opacity-10 dark:opacity-5 rotate-45" />
                <Empty.Icon>
                  <BiComment size={80} />
                </Empty.Icon>
                <Empty.Title>Click To Expand Comments</Empty.Title>
                <Empty.Description>
                  To save some server bandwidth, comments are hidden by default.
                  Click to expand them.
                </Empty.Description>
                <Empty.Action
                  title="Show comments"
                  auto
                  s={2}
                  i={2}
                  disabled={commentsQuery.busy}
                  onClick={() => commentsQuery.start()}
                >
                  Show Comments
                </Empty.Action>
              </Empty>
            ) : (
              <EmptyDocumentComments
                disabled={commentsQuery.busy}
                onAddClick={openAddForm}
              />
            )}
          </>
        )}
      </div>
      {commentForm.is === "on" && (
        <DocumentCommentFormContainer {...commentForm.data} />
      )}
    </>
  );
};

export { DocumentCommentsContainer };
