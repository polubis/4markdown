import React, { type MouseEventHandler } from 'react';

type CheckboxProps = {
  label: string;
  checked: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
};

const Checkbox = ({ label, checked, onClick }: CheckboxProps) => {
  return (
    <div className="flex items-center space-x-2.5 max-w-fit" onClick={onClick}>
      <input
        type="checkbox"
        checked={checked}
        className="cursor-pointer h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 dark:focus:ring-blue-600 dark:checked:bg-blue-600 dark:checked:border-blue-600"
      />
      <label className="cursor-pointer font-medium">{label}</label>
    </div>
  );
};

export { Checkbox };
