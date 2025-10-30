import React from "react";
import { Err } from "design-system/err";
import { BiComment, BiError, BiPencil, BiTrash } from "react-icons/bi";
import { Empty } from "design-system/empty";
import { CommentsSkeleton } from "../components/comments-skeleton";
import { Avatar } from "design-system/avatar";
import { formatDistance } from "date-fns";
import { RATING_ICONS } from "core/rating-config";
import { Button } from "design-system/button";
import { CommentId, RatingCategory } from "api-4markdown-contracts";
import { rateResourceCommentAct } from "../acts/rate-resource-comment.act";
import throttle from "lodash.throttle";
import { useYourUserProfileState } from "store/your-user-profile";
import { useResourceCommentsStore } from "../store";
import { setAction } from "../store/actions";
import { loadResourceCommentsAct } from "../acts/load-resource-comments.act";

const rateCommentThrottled = throttle(rateResourceCommentAct, 5000);

const ResourceCommentsContainer = () => {
  const comments = useResourceCommentsStore.use.comments();
  const idle = useResourceCommentsStore.use.idle();
  const loading = useResourceCommentsStore.use.loading();
  const error = useResourceCommentsStore.use.error();

  const yourUserProfile = useYourUserProfileState();

  const rateComment = (category: RatingCategory, commentId: CommentId) => {
    rateCommentThrottled(category, commentId);
  };

  if (idle || loading) {
    return <CommentsSkeleton />;
  }

  if (error) {
    return (
      <Err>
        <Err.Icon>
          <BiError size={80} />
        </Err.Icon>
        <Err.Title>Something went wrong!</Err.Title>
        <Err.Description>{error.message}</Err.Description>
        <Err.Action
          title="Retry loading comments"
          auto
          s={2}
          i={2}
          onClick={loadResourceCommentsAct}
        >
          Try Again
        </Err.Action>
      </Err>
    );
  }

  if (comments.length === 0) {
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
          onClick={() => setAction("commentFormData", { type: "add" })}
        >
          Add Comment
        </Empty.Action>
      </Empty>
    );
  }

  return (
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
                i={comment.rated ? 2 : 1}
                s={1}
                auto
                key={category}
                title={`Rate as ${category}`}
                onClick={() => rateComment(category, comment.id)}
              >
                <Icon className="mr-0.5 size-4" />
                <strong>{comment[category]}</strong>
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
                  onClick={() =>
                    setAction("deleteCommentData", {
                      id: comment.id,
                      etag: comment.etag,
                    })
                  }
                >
                  <BiTrash />
                </Button>
                <Button
                  i={1}
                  s={1}
                  title="Edit comment"
                  onClick={() =>
                    setAction("commentFormData", {
                      type: "edit",
                      data: {
                        id: comment.id,
                        etag: comment.etag,
                        content: comment.content,
                      },
                    })
                  }
                >
                  <BiPencil />
                </Button>
              </div>
            )}
        </li>
      ))}
    </ul>
  );
};

export { ResourceCommentsContainer };
