import React, { type DetailedHTMLProps, type InputHTMLAttributes } from "react";
import c from "classnames";

interface InputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {}

const Input = ({ className, ...props }: InputProps) => {
  return (
    <div className={c(`w-full`, className)}>
      <input
        className="w-full px-3 py-2 placeholder:text-gray-600 dark:placeholder:text-gray-300 text-sm rounded-md bg-gray-300 dark:bg-slate-800 border-[2.5px] border-transparent focus:border-black focus:dark:border-white outline-none"
        {...props}
      />
    </div>
  );
};

export { Input };
