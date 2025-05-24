import React, {
  type DetailedHTMLProps,
  type TextareaHTMLAttributes,
} from 'react';
import c from 'classnames';

interface TextareaProps
  extends DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {}

const Textarea = ({ className, ...props }: TextareaProps) => {
  return (
    <div className={c(`w-full`, className)}>
      <textarea
        className="block w-full px-3 py-2 text-black dark:text-white min-h-[100px] placeholder:text-gray-600 dark:placeholder:text-gray-300 text-sm rounded-md bg-gray-300 dark:bg-slate-800 border-[2.5px] border-transparent focus:border-black dark:focus:border-white outline-hidden"
        {...props}
      />
    </div>
  );
};

export { Textarea };
