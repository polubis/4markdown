import React from "react";
import { Avatar } from "design-system/avatar";
import { UserProfileDto } from "api-4markdown-contracts";

type ActivityAuthorBadgeProps = {
  authorProfile: UserProfileDto | null;
  className?: string;
};

const ActivityAuthorBadge = ({
  authorProfile,
  className,
}: ActivityAuthorBadgeProps) => {
  if (!authorProfile) return null;

  const authorName = authorProfile.displayName ?? authorProfile.id ?? "Unknown";

  return (
    <div className={`flex items-center gap-1.5 ${className ?? ""}`}>
      <Avatar
        size="tn"
        alt={`${authorName} avatar`}
        className="bg-gray-300 dark:bg-slate-800"
        char={authorProfile.displayName?.charAt(0)}
        src={authorProfile.avatar?.tn?.src}
        title={authorName}
      />
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
        {authorName}
      </span>
    </div>
  );
};

export { ActivityAuthorBadge };
