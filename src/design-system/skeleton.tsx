import React, { ComponentProps } from "react";
import { c } from "./c";

const Skeleton = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      className={c(
        "rounded-md bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 dark:from-gray-800 dark:via-zinc-800 dark:to-gray-900 animate-gradient-move bg-[length:200%_200%] h-full w-full",
        className,
      )}
      {...props}
    />
  );
};

export { Skeleton };
