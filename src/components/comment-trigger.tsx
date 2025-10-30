import { Button, ButtonProps } from "design-system/button";
import { c } from "design-system/c";
import React from "react";
import { BiCommentDetail } from "react-icons/bi";

type CommentTriggerProps = {
  count: number;
  position: "left" | "right";
} & ButtonProps;

const CommentTrigger = ({
  className,
  count,
  position,
  ...props
}: CommentTriggerProps) => {
  return (
    <div className="relative">
      <Button
        className={c(
          "bg-gradient-to-r from-sky-200 via-pink-200 to-gray-300",
          "dark:from-sky-900 dark:via-indigo-900 dark:to-gray-950",
          "animate-gradient-move bg-[length:200%_200%]",
          className,
        )}
        {...props}
      >
        <BiCommentDetail />
      </Button>

      {count > 0 && (
        <span
          className={c(
            position === "left" ? "-left-3" : "-right-3",
            count > 99
              ? "text-[0.625rem]"
              : count < 9
                ? "text-sm"
                : "text-[0.75rem]",
            "inline-flex absolute -top-3 items-center justify-center p-1 rounded-full size-6",
            "font-bold leading-none text-black dark:text-white",
            "bg-gradient-to-r from-sky-200 via-pink-200 to-gray-300",
            "dark:from-sky-900 dark:via-indigo-900 dark:to-gray-950",
            "animate-gradient-move bg-[length:200%_200%]",
            "border border-zinc-300 dark:border-zinc-800",
          )}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </div>
  );
};

export { CommentTrigger };
