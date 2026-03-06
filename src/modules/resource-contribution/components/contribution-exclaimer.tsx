import React from "react";
import { BiInfoCircle } from "react-icons/bi";
import { c } from "design-system/c";

type ContributionExclaimerProps = {
  className?: string;
};

const ContributionExclaimer = ({ className }: ContributionExclaimerProps) => {
  return (
    <div
      className={c(
        "flex gap-2 text-sm items-start border rounded-md p-3",
        "bg-zinc-100 dark:bg-zinc-900/80 border-zinc-300 dark:border-zinc-800",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <BiInfoCircle className="shrink-0 mt-0.5" size={20} aria-hidden />
      <div>
        <p className="font-medium mb-1">Thank you for contributing!</p>
        <p>
          After your changes are applied, you will be added to the authors list
          and displayed under the article.
        </p>
      </div>
    </div>
  );
};

export { ContributionExclaimer };
