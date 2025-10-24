import { c } from "design-system/c";
import { Skeleton } from "design-system/skeleton";
import React, { ComponentProps } from "react";

const CommentsSkeleton = ({ className, ...props }: ComponentProps<"ul">) => {
  return (
    <ul className={c("flex flex-col gap-4", className)} {...props}>
      {Array.from({ length: 3 }).map((_, index) => (
        <li
          key={index}
          className="p-6 flex flex-col rounded-lg border border-zinc-300 dark:border-zinc-800"
        >
          <div className="flex items-center gap-6">
            <Skeleton className="shrink-0 w-12 h-12 rounded-full" />
            <div className="flex flex-col flex-1 gap-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>

          <Skeleton className="h-4 w-full mt-4" />
        </li>
      ))}
    </ul>
  );
};

export { CommentsSkeleton };
