import React from "react";
import { useResourceCommentsContext } from "../providers/resource-comments.provider";
import { Err } from "design-system/err";
import { BiComment, BiError } from "react-icons/bi";
import { Empty } from "design-system/empty";
import { CommentsSkeleton } from "../components/comments-skeleton";
import { Avatar } from "design-system/avatar";
import { formatDistance } from "date-fns";
import { RATING_ICONS } from "core/rating-config";
import { Button } from "design-system/button";
import { useFeature } from "@greenonsoftware/react-kit";
import { CommentId, RatingCategory } from "api-4markdown-contracts";
import { useMutation } from "core/use-mutation";
import { rateResourceCommentAct } from "../acts/rate-resource-comment.act";

const ResourceCommentsContainer = () => {
  const { commentsQuery, addCommentWidget, ...rest } =
    useResourceCommentsContext();
  const yourRate = useFeature<RatingCategory>();
  const rateMutation = useMutation();

  const rateComment = (category: RatingCategory, commentId: CommentId) => {
    yourRate.on(category);

    if (yourRate.is === `off`) {
      rateMutation.start((signal) => {
        return rateResourceCommentAct({
          ...rest,
          commentId,
          category,
        })
          .then(() => {
            if (signal.aborted) return;
            yourRate.on(category);
          })
          .catch(() => {
            if (signal.aborted) return;
            yourRate.on(category);
          });
      });
    }
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
    <ul className="flex flex-wrap gap-4">
      {comments.map((comment) => (
        <li
          key={comment.id}
          className="flex-1 p-3 flex flex-col rounded-lg border border-zinc-300 dark:border-zinc-800"
        >
          <div className="flex items-center gap-4">
            <Avatar
              size="sm"
              src={comment.ownerProfile.avatar?.sm?.src}
              alt={comment.ownerProfile.displayName ?? `Comment author`}
              char={comment.ownerProfile.displayName?.charAt(0)}
              className="shrink-0 bg-gray-300 dark:bg-slate-800"
            />
            <div className="flex flex-col">
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
                i={yourRate.is === `on` && yourRate.data === category ? 2 : 1}
                s={1}
                auto
                key={category}
                title={`Rate as ${category}`}
                onClick={() => rateComment(category, comment.id)}
              >
                <Icon className="mr-0.5 size-4" />
                <strong>
                  {yourRate.is === `on` && yourRate.data === category
                    ? comment[category] + 1
                    : comment[category]}
                </strong>
              </Button>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
};

export { ResourceCommentsContainer };
