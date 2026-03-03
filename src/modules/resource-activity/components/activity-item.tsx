import React from "react";
import { ResourceActivityModel } from "../store/models";
import { CreatedActivity } from "./activities/created-activity";
import { ContentChangedActivity } from "./activities/content-changed-activity";
import { VisibilityChangedActivity } from "./activities/visibility-changed-activity";
import { MetadataUpdatedActivity } from "./activities/metadata-updated-activity";
import { CommentAddedActivity } from "./activities/comment-added-activity";
import { RatingChangedActivity } from "./activities/rating-changed-activity";
import { ScoreChangedActivity } from "./activities/score-changed-activity";

type ActivityItemProps = {
  activity: ResourceActivityModel;
  index: number;
};

const ActivityItem = ({ activity, index }: ActivityItemProps) => {
  const renderActivity = () => {
    switch (activity.type) {
      case "created":
        return <CreatedActivity activity={activity} />;
      case "content-changed":
        return <ContentChangedActivity activity={activity} />;
      case "visibility-changed":
        return <VisibilityChangedActivity activity={activity} />;
      case "metadata-updated":
        return <MetadataUpdatedActivity activity={activity} />;
      case "comment-added":
        return <CommentAddedActivity activity={activity} />;
      case "rating-changed":
        return <RatingChangedActivity activity={activity} />;
      case "score-changed":
        return <ScoreChangedActivity activity={activity} />;
      default:
        return null;
    }
  };

  return (
    <li
      className="relative flex flex-col items-center w-full"
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {renderActivity()}
    </li>
  );
};

export { ActivityItem };
