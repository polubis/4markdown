import React from "react";
import { ResourceActivityModel } from "../store/models";

type ActivityTileProps = {
  activity: ResourceActivityModel;
  children: React.ReactNode;
};

const locale =
  typeof navigator !== "undefined" && navigator.language
    ? navigator.language
    : undefined;

const formatDateWithTime = (cdate: ResourceActivityModel["cdate"]): string => {
  const date = new Date(cdate);
  const dateStr = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
  const timeStr = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
  return `${dateStr} ${timeStr}`;
};

const ActivityTile = ({ activity, children }: ActivityTileProps) => {
  return (
    <article className="text-left relative z-10 w-full px-4 py-3 rounded-lg backdrop-blur-sm bg-white/80 dark:bg-zinc-950/80 border border-zinc-300 dark:border-zinc-800">
      <time
        className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block"
        dateTime={activity.cdate}
      >
        {formatDateWithTime(activity.cdate)}
      </time>
      {children}
    </article>
  );
};

export { ActivityTile, formatDateWithTime };
