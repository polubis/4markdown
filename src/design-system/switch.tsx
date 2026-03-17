import React from "react";
import { c } from "./c";

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  name?: string;
  disabled?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  className?: string;
};

const Switch: React.FC<SwitchProps> = ({
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
        className="peer sr-only active:[&+div]:border-white"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
      />
      <div
        className={c(
          "w-11 h-6 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-400 peer-focus:outline-none",
          {
            "bg-blue-600 dark:bg-blue-500 after:translate-x-5": checked,
            "bg-gray-200 dark:bg-gray-500": !checked,
            "opacity-50 cursor-not-allowed": disabled,
          },
        )}
        aria-hidden="true"
      />
    </label>
  );
};

export type { SwitchProps };
export { Switch };
