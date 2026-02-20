import React from "react";

const AssetsSkeletonLoader = ({
  "data-testid": dataTestId,
}: {
  "data-testid"?: string;
}) => {
  return (
    <ul className="columns-1 md:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
      {Array.from({ length: 6 }).map((_, index) => (
        <li
          key={index}
          className="break-inside-avoid mb-4 p-4 flex flex-col rounded-lg border border-zinc-300 dark:border-zinc-800"
        >
          <div
            className="rounded-md bg-gradient-to-r from-gray-300 via-zinc-200 to-gray-200 dark:from-gray-800 dark:via-zinc-800 dark:to-gray-900 animate-gradient-move bg-[length:200%_200%] h-[200px] w-full mb-4"
            data-testid={dataTestId}
          />
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
        </li>
      ))}
    </ul>
  );
};

export { AssetsSkeletonLoader };
