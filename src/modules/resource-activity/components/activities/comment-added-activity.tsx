import React from "react";
import { Avatar } from "design-system/avatar";
import { ActivityTile } from "../activity-tile";
import { ActivityAuthorBadge } from "../activity-author-badge";
import { ResourceActivityModel } from "../../store/models";

type CommentAddedActivityProps = {
  activity: Extract<ResourceActivityModel, { type: "comment-added" }>;
};

const CommentAddedActivity = ({ activity }: CommentAddedActivityProps) => {
  const commentAuthorName =
    activity.comment.ownerProfile.displayName ??
    activity.comment.ownerProfile.id ??
    "Unknown";

  return (
    <ActivityTile activity={activity}>
      <div className="mb-2">
        <ActivityAuthorBadge
          authorProfile={activity.authorProfile}
          className="mb-1"
        />
        <h3 className="text-base font-semibold text-black dark:text-white">
          Comment Added
        </h3>
      </div>
      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        <p className="mb-2">A comment was added.</p>
        <div className="bg-gray-100 dark:bg-zinc-900 rounded-lg p-3 border border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-2 mb-2">
            <Avatar
              size="tn"
              alt={`${commentAuthorName} avatar`}
              className="bg-gray-300 dark:bg-slate-800"
              char={activity.comment.ownerProfile.displayName?.charAt(0)}
              src={activity.comment.ownerProfile.avatar?.tn?.src}
              title={commentAuthorName}
            />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {commentAuthorName}
            </span>
          </div>
          <p className="text-sm text-gray-800 dark:text-gray-200">
            {activity.comment.content}
          </p>
        </div>
      </div>
    </ActivityTile>
  );
};

export { CommentAddedActivity };
