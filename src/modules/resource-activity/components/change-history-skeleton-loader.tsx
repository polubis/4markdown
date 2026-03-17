import React from "react";
import { Skeleton } from "design-system/skeleton";
import { c } from "design-system/c";

type ChangeHistorySkeletonLoaderProps = {
  className?: string;
};

const ChangeHistorySkeletonLoader = ({
  className,
}: ChangeHistorySkeletonLoaderProps) => {
  return (
    <div
      className={c(
        "relative w-full min-h-full bg-white dark:bg-zinc-950 py-8 px-4 sm:px-6 md:px-8",
        className,
      )}
    >
      <div className="max-w-3xl mx-auto relative">
        <div className="relative flex justify-center">
          <div className="absolute top-0 bottom-0 w-0.5 z-0 left-1/2 -translate-x-1/2">
            <div className="h-full border-l-2 border-dashed border-gray-300 dark:border-zinc-700" />
          </div>

          <ul className="relative space-y-6 w-full">
            {Array.from({ length: 5 }).map((_, index) => (
              <li
                key={index}
                className="relative flex flex-col items-center w-full"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <article className="text-left relative z-10 w-full px-4 py-3 rounded-lg backdrop-blur-sm bg-white/80 dark:bg-zinc-950/80 border border-zinc-300 dark:border-zinc-800">
                  <Skeleton className="h-3 w-24 mb-2" />
                  <div className="mb-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-5/6" />
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export { ChangeHistorySkeletonLoader };
