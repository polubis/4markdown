import { c } from "design-system/c";
import { Skeleton } from "design-system/skeleton";
import React, { ComponentProps } from "react";

const GroupsSkeletonLoader = ({
  className,
  ...props
}: ComponentProps<"ul">) => {
  return (
    <ul
      className={c(
        "columns-1 md:columns-2 lg:columns-3 gap-4 [column-fill:_balance]",
        className,
      )}
      {...props}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <li
          key={index}
          className="break-inside-avoid mb-4 p-4 flex flex-col rounded-lg border border-zinc-300 dark:border-zinc-800"
        >
          <div className="flex items-center gap-4">
            <Skeleton className="shrink-0 w-12 h-12 rounded-full" />
            <div className="flex flex-col flex-1 gap-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>

          {Math.random() > 0.3 && <Skeleton className="h-4 w-full mt-4" />}
        </li>
      ))}
    </ul>
  );
};

export { GroupsSkeletonLoader };
