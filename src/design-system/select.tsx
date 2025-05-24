'use client';

import React, {
  type HTMLAttributes,
  type DetailedHTMLProps,
  type ReactNode,
} from 'react';
import c from 'classnames';
import { BiChevronDown, BiChevronUp, BiCheck } from 'react-icons/bi';
import { useSimpleFeature } from '@greenonsoftware/react-kit';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    'onChange' | 'value'
  > {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const Select = ({
  className,
  options,
  value,
  onChange,
  placeholder = `Select an option`,
  disabled,
  ...props
}: SelectProps) => {
  const dropdownMenu = useSimpleFeature();
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const listboxRef = React.useRef<HTMLUListElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  const toggleOpen = React.useCallback(
    (_: React.MouseEvent<HTMLDivElement>): void => {
      if (!disabled) {
        dropdownMenu.toggle();
      }
    },
    [disabled, dropdownMenu],
  );

  const handleOptionClick = React.useCallback(
    (option: SelectOption) => {
      onChange?.(option.value);
      dropdownMenu.off();
    },
    [onChange, dropdownMenu],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>): void => {
      if (disabled) return;

      switch (e.key) {
        case `Enter`:
        case ` `:
          if (!dropdownMenu.isOn) {
            dropdownMenu.on();
          } else {
            const option = options[highlightedIndex];
            if (option) {
              handleOptionClick(option);
            }
          }
          e.preventDefault();
          break;
        case `ArrowDown`:
        case `ArrowRight`:
          if (dropdownMenu.isOn) {
            setHighlightedIndex((prev) =>
              prev < options.length - 1 ? prev + 1 : prev,
            );
          } else {
            dropdownMenu.on();
          }
          e.preventDefault();
          break;
        case `ArrowUp`:
        case `ArrowLeft`:
          if (dropdownMenu.isOn) {
            setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          } else {
            dropdownMenu.on();
          }
          e.preventDefault();
          break;
        case `Escape`:
          dropdownMenu.off();
          e.preventDefault();
          break;
        case `Tab`:
          if (dropdownMenu.isOn) {
            dropdownMenu.off();
          }
          break;
      }
    },
    [options, highlightedIndex, disabled, handleOptionClick, dropdownMenu],
  );

  React.useEffect(() => {
    if (dropdownMenu.isOn && listboxRef.current) {
      const highlightedElement = listboxRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: `nearest` });
      }
    }
  }, [dropdownMenu.isOn, highlightedIndex]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        dropdownMenu.off();
      }
    };

    if (dropdownMenu.isOn) {
      document.addEventListener(`mousedown`, handleClickOutside);
    }

    return () => {
      document.removeEventListener(`mousedown`, handleClickOutside);
    };
  }, [dropdownMenu.isOn, dropdownMenu]);

  React.useEffect(() => {
    if (dropdownMenu.isOn) {
      const selectedIndex = options.findIndex(
        (option) => option.value === value,
      );
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
  }, [dropdownMenu.isOn, options, value]);

  return (
    <div ref={containerRef} className={c(`relative w-full`, className)}>
      <div
        tabIndex={disabled ? -1 : 0}
        className={c(
          `flex items-center justify-between w-full px-3 py-2 text-sm rounded-md`,
          `bg-gray-300 dark:bg-slate-800`,
          `border-[2.5px] border-transparent`,
          `focus:border-black focus:dark:border-white outline-none`,
          `select-none`,
          {
            'cursor-pointer': !disabled,
            'opacity-50 cursor-not-allowed': disabled,
          },
        )}
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={dropdownMenu.isOn}
        aria-labelledby="select-label"
        role="combobox"
        {...props}
      >
        <span
          className={c(`block truncate`, {
            'text-gray-600 dark:text-gray-300': !selectedOption,
          })}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="flex items-center pointer-events-none">
          {dropdownMenu.isOn ? (
            <BiChevronUp className="w-4 h-4" />
          ) : (
            <BiChevronDown className="w-4 h-4" />
          )}
        </span>
      </div>

      {dropdownMenu.isOn && (
        <ul
          ref={listboxRef}
          className={c(
            `absolute z-10 w-full mt-1 max-h-[300px] overflow-auto`,
            `bg-gray-300 dark:bg-slate-800 rounded-md`,
            `border-[2.5px] border-black dark:border-white`,
            `py-1 shadow-lg`,
          )}
          role="listbox"
          aria-labelledby="select-label"
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              className={c(
                `px-3 py-2 cursor-pointer select-none relative`,
                `hover:bg-gray-400/50 dark:hover:bg-slate-700`,
                {
                  'bg-gray-400/50 dark:bg-slate-700':
                    highlightedIndex === index || option.value === value,
                  'font-medium': option.value === value,
                },
              )}
              onClick={() => handleOptionClick(option)}
              role="option"
              aria-selected={option.value === value}
            >
              <div className="flex items-center justify-between">
                <span className="block truncate">{option.label}</span>
                {option.value === value && <BiCheck className="w-4 h-4" />}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const SelectField = ({
  className,
  label,
  hint,
  ...props
}: {
  className?: string;
  label?: ReactNode;
  hint?: ReactNode;
} & SelectProps) => {
  return (
    <fieldset className={c(`flex flex-col gap-1.5`, className)}>
      {label && (
        <label id="select-label" className="text-sm font-medium">
          {label}
        </label>
      )}
      <Select {...props} />
      {hint}
    </fieldset>
  );
};

export { Select };
