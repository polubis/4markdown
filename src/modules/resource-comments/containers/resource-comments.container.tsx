import React, { useState } from "react";
import { useResourceCommentsContext } from "../providers/resource-comments.provider";
import { Err } from "design-system/err";
import { BiComment, BiError, BiPencil, BiTrash } from "react-icons/bi";
import { Empty } from "design-system/empty";
import { CommentsSkeleton } from "../components/comments-skeleton";
import { Avatar } from "design-system/avatar";
import { formatDistance } from "date-fns";
import { RATING_ICONS } from "core/rating-config";
import { Button } from "design-system/button";
import { CommentId, RatingCategory } from "api-4markdown-contracts";
import { useMutation } from "core/use-mutation";
import { rateResourceCommentAct } from "../acts/rate-resource-comment.act";
import throttle from "lodash.throttle";
import { useYourUserProfileState } from "store/your-user-profile";
import { Modal2 } from "design-system/modal2";
import { useFeature } from "@greenonsoftware/react-kit";
import { deleteResourceCommentAct } from "../acts/delete-resource-comment.act";
import { Loader } from "design-system/loader";
import { EditCommentWidgetContainer } from "./edit-comment-widget.container";

const rateCommentThrottled = throttle(rateResourceCommentAct, 5000);

const ResourceCommentsContainer = () => {
  const { commentsQuery, addCommentWidget, editCommentWidget, ...rest } =
    useResourceCommentsContext();
  const yourUserProfile = useYourUserProfileState();
  const [ratedComments, setRatedComments] = useState<
    Record<CommentId, RatingCategory>
  >({});
  const rateMutation = useMutation();
  const deleteCommentModal = useFeature<CommentId>();

  const deleteCommentMutation = useMutation({
    handler: async () => {
      if (deleteCommentModal.is === "off") {
        throw new Error("Comment modal is off");
      }

      return await deleteResourceCommentAct({
        ...rest,
        commentId: deleteCommentModal.data,
      });
    },
    onOk: () => {
      deleteCommentModal.off();
      commentsQuery.setState((prev) => {
        if (prev.is === "ok" && deleteCommentModal.is === "on") {
          return {
            is: "ok",
            data: prev.data.filter(
              (comment) => comment.id !== deleteCommentModal.data,
            ),
          };
        }
        return prev;
      });
      deleteCommentMutation.reset();
    },
  });

  const rateComment = (category: RatingCategory, commentId: CommentId) => {
    setRatedComments((prev) => ({ ...prev, [commentId]: category }));

    rateMutation.start(() =>
      rateCommentThrottled({
        ...rest,
        commentId,
        category,
      }),
    );
  };

  if (commentsQuery.is === "idle" || commentsQuery.is === "busy") {
    return <CommentsSkeleton />;
  }

  if (commentsQuery.is === "fail") {
    return (
      <Err>
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
          onClick={() => commentsQuery.start()}
        >
          Try Again
        </Err.Action>
      </Err>
    );
  }

  if (commentsQuery.data.length === 0) {
    return (
      <Empty>
        <Empty.Icon>
          <BiComment size={80} />
        </Empty.Icon>
        <Empty.Title>No comments yet</Empty.Title>
        <Empty.Description>
          Be the first to comment on this resource
        </Empty.Description>
        <Empty.Action
          title="Add comment"
          auto
          s={2}
          i={2}
          onClick={addCommentWidget.on}
        >
          Add Comment
        </Empty.Action>
      </Empty>
    );
  }

  const comments = commentsQuery.data;

  return (
    <>
      <ul className="flex flex-wrap gap-4">
        {comments.map((comment) => (
          <li
            key={comment.id}
            className="relative flex-1 p-3 flex flex-col rounded-lg border border-zinc-300 dark:border-zinc-800"
          >
            <div className="flex items-center gap-4">
              <Avatar
                size="sm"
                src={comment.ownerProfile.avatar?.sm?.src}
                alt={comment.ownerProfile.displayName ?? `Comment author`}
                char={comment.ownerProfile.displayName?.charAt(0)}
                className="shrink-0 bg-gray-300 dark:bg-slate-800"
              />
              <div className="flex flex-col pr-10">
                <h3 className="text-base font-bold leading-6 mb-1">
                  {comment.ownerProfile.displayName ?? `Anonymous`}
                </h3>
                <p className="text-sm">
                  {formatDistance(new Date(), comment.mdate, {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <p className="italic mt-4">{comment.content}</p>
            <div className="ml-auto mt-4 flex">
              {RATING_ICONS.map(([Icon, category]) => (
                <Button
                  i={ratedComments[comment.id] === category ? 2 : 1}
                  s={1}
                  auto
                  key={category}
                  title={`Rate as ${category}`}
                  onClick={() => rateComment(category, comment.id)}
                >
                  <Icon className="mr-0.5 size-4" />
                  <strong>
                    {ratedComments[comment.id] === category
                      ? comment[category] + 1
                      : comment[category]}
                  </strong>
                </Button>
              ))}
            </div>
            {yourUserProfile.is === "ok" &&
              comment.ownerProfile.id === yourUserProfile.user?.id && (
                <div className="flex flex-col gap-1 absolute top-2.5 right-2">
                  <Button
                    i={1}
                    s={1}
                    title="Delete comment"
                    onClick={() => deleteCommentModal.on(comment.id)}
                  >
                    <BiTrash />
                  </Button>
                  <Button
                    i={1}
                    s={1}
                    title="Edit comment"
                    onClick={() =>
                      editCommentWidget.on({
                        id: comment.id,
                        etag: comment.etag,
                        content: comment.content,
                      })
                    }
                  >
                    <BiPencil />
                  </Button>
                </div>
              )}
            <div></div>
          </li>
        ))}
      </ul>
      {editCommentWidget.is === "on" && <EditCommentWidgetContainer />}
      {deleteCommentModal.is === "on" && (
        <Modal2
          disabled={deleteCommentMutation.is === "busy"}
          onClose={deleteCommentModal.off}
        >
          <Modal2.Header title="Delete comment" closeButtonTitle="Cancel" />
          <Modal2.Body>
            {deleteCommentMutation.is === "idle" && (
              <p>Are you sure you want to delete this comment?</p>
            )}
            {deleteCommentMutation.is === "busy" && (
              <Loader size="xl" className="m-auto" />
            )}
            {deleteCommentMutation.is === "fail" && (
              <Err>
                <Err.Icon>
                  <BiError size={80} />
                </Err.Icon>
                <Err.Title>Something went wrong!</Err.Title>
                <Err.Description>
                  {deleteCommentMutation.error.message}
                </Err.Description>
                <Err.Action
                  title="Retry delete comment"
                  auto
                  s={2}
                  i={2}
                  onClick={() => deleteCommentMutation.start()}
                >
                  Try Again
                </Err.Action>
              </Err>
            )}
          </Modal2.Body>
          <Modal2.Footer className="flex gap-3">
            <Button
              auto
              className="flex-1"
              i={1}
              s={2}
              onClick={deleteCommentModal.off}
              title="Cancel delete comment"
              disabled={deleteCommentMutation.is === "busy"}
            >
              Cancel
            </Button>
            <Button
              auto
              className="flex-1"
              i={2}
              s={2}
              disabled={deleteCommentMutation.is === "busy"}
              title="Confirm delete comment"
              onClick={() => deleteCommentMutation.start()}
            >
              Confirm
            </Button>
          </Modal2.Footer>
        </Modal2>
      )}
    </>
  );
};

export { ResourceCommentsContainer };
