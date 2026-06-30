import { c } from "design-system/c";
import React, { type ComponentProps } from "react";
import { BiCommentDetail } from "react-icons/bi";
import { formatCompactCount } from "./formatting";
import { useContext } from "./context";

export type CommentsSummaryProps = ComponentProps<"div">;

export const CommentsSummary = ({
  className,
  ...rest
}: CommentsSummaryProps) => {
  const { useComments } = useContext();
  const { totalCount } = useComments();

  return (
    <div
      {...rest}
      className={c(
        "flex w-fit items-center gap-1.5 rounded-md border px-2 py-2 shadow-sm",
        "border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300",
        className,
      )}
    >
      <BiCommentDetail aria-hidden="true" size={20} />
      <strong className="text-sm leading-none tabular-nums">
        {formatCompactCount(totalCount)}
      </strong>
    </div>
  );
};
