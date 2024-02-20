import React from 'react';
import c from 'classnames';

interface TextareaProps
  extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {}

const Textarea = ({ className, ...props }: TextareaProps) => {
  return (
    <div className={c(`w-full`, className)}>
      <textarea
        className="w-full px-3 py-2 text-black dark:text-white min-h-[100px] placeholder:text-gray-600 dark:placeholder:text-gray-300 text-sm rounded-md bg-gray-300 dark:bg-slate-800 border-[2.5px] border-transparent focus:border-black focus:dark:border-white outline-none"
        {...props}
      />
    </div>
  );
};

export { Textarea };
