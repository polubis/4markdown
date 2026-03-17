import React from "react";
import { c } from "./c";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  name?: string;
  disabled?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  className?: string;
};

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  id,
  name,
  disabled = false,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  className,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!disabled) {
        onChange(!checked);
      }
    }
  };

  return (
    <label
      className={c(
        "relative inline-flex items-center cursor-pointer",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <input
        type="checkbox"
        id={id}
        name={name}
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
      />
      <div
        className={c(
          "w-6 h-6 rounded border-2 flex items-center justify-center transition-[background-color,border-color] duration-200 ease-in-out focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400 focus-within:outline-none",
          checked
            ? "bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500"
            : "bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        aria-hidden="true"
      >
        {checked && (
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path d="M5 13l4 4L19 7"></path>
          </svg>
        )}
      </div>
    </label>
  );
};

export type { CheckboxProps };
export { Checkbox };
