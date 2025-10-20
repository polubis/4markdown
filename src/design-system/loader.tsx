import React, { type DetailedHTMLProps, type HTMLAttributes } from "react";
import { c } from "./c";

type LoaderSize = "sm" | "md" | "lg" | "xl";

interface LoaderProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  size?: LoaderSize;
  variant?: "primary" | "secondary";
}

const Loader = ({
  className,
  variant = "primary",
  size = `md`,
  ...props
}: LoaderProps) => {
  return (
    <div
      {...props}
      className={c(
        `loader border-4 border-solid rounded-full`,
        variant === "primary" &&
          `border-gray-300 border-r-green-700 dark:border-slate-800 dark:border-r-green-700`,
        variant === "secondary" &&
          `border-white border-r-green-700 dark:border-r-green-700`,
        { "w-6 h-6": size === `sm` },
        { "w-8 h-8": size === `md` },
        { "w-10 h-10": size === `lg` },
        { "w-12 h-12": size === `xl` },
        className,
      )}
    />
  );
};

export { Loader };
