import { c } from "design-system/c";
import { Skeleton } from "design-system/skeleton";
import React, { ComponentProps } from "react";

const SelectedUsersSkeletonLoader = ({
  className,
  ...props
}: ComponentProps<"div">) => {
  return (
    <div
      className={c(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3",
        className,
      )}
      {...props}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="shrink-0 w-8 h-8 rounded-full" />
            <div className="flex-1 min-w-0">
              <Skeleton className="h-4 w-3/4 mb-1" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="shrink-0 w-4 h-4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export { SelectedUsersSkeletonLoader };
