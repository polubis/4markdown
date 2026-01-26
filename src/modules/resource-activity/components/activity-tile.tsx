import React from "react";
import { ResourceActivityDto } from "api-4markdown-contracts";

type ActivityTileProps = {
  activity: ResourceActivityDto;
  children: React.ReactNode;
};

const formatDate = (cdate: ResourceActivityDto["cdate"]): string => {
  return new Date(cdate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ActivityTile = ({ activity, children }: ActivityTileProps) => {
  return (
    <article className="text-left relative z-10 w-full px-4 py-3 rounded-lg backdrop-blur-sm bg-white/80 dark:bg-zinc-950/80 border border-zinc-300 dark:border-zinc-800">
      <time
        className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block"
        dateTime={activity.cdate}
      >
        {formatDate(activity.cdate)}
      </time>
      {children}
    </article>
  );
};

export { ActivityTile, formatDate };
