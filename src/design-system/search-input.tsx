import React, { forwardRef, useState, useRef } from "react";
import { BiSearch, BiX } from "react-icons/bi";
import { c } from "./c";
import { useOnOutsideClick } from "../development-kit/use-on-outside-click";
import { context } from "@greenonsoftware/react-kit";
import { Loader } from "./loader";

const [SearchProvider, useSearchContext] = context(
  (props: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    inputRef: React.MutableRefObject<HTMLInputElement | null>;
    listRef: React.MutableRefObject<HTMLUListElement | null>;
  }) => props,
);

// Main Search compound component
const Search = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  // Handle outside clicks to close the search list
  useOnOutsideClick(listRef, {
    onOutsideClick: () => setIsOpen(false),
    enabled: isOpen,
  });

  return (
    <SearchProvider
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      inputRef={inputRef}
      listRef={listRef}
    >
      <div className={c("relative", className)} {...props}>
        {children}
      </div>
    </SearchProvider>
  );
};

// Search Input component
const SearchInput = forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<"input"> & {
    onClear?: () => void;
    showClear?: boolean;
    busy?: boolean;
  }
>(({ className, onClear, showClear, onFocus, busy, ...props }, ref) => {
  const { setIsOpen, inputRef } = useSearchContext();

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsOpen(true);
    onFocus?.(e);
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {busy ? (
          <Loader className="border-2 size-5" variant="secondary" size="sm" />
        ) : (
          <BiSearch className="h-5 w-5" />
        )}
      </div>
      <input
        ref={(node) => {
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          inputRef.current = node;
        }}
        type="text"
        className={c(
          "block w-full pl-10 pr-10 py-2 placeholder:text-gray-600 dark:placeholder:text-gray-300 text-sm rounded-md bg-gray-300 dark:bg-slate-800 border-[2.5px] border-transparent focus:border-black focus:dark:border-white outline-none",
          className,
        )}
        onFocus={handleFocus}
        {...props}
      />
      {showClear && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <BiX className="h-5 w-5" />
        </button>
      )}
    </div>
  );
});

SearchInput.displayName = "SearchInput";

// Search List component
const SearchList = forwardRef<
  HTMLUListElement,
  React.ComponentPropsWithoutRef<"ul">
>(({ className, children, ...props }, ref) => {
  const { isOpen, listRef } = useSearchContext();

  if (!isOpen) return null;

  return (
    <ul
      ref={(node) => {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
        listRef.current = node;
      }}
      className={c(
        "absolute w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-y-auto max-h-80",
        className,
      )}
      {...props}
    >
      {children}
    </ul>
  );
});

SearchList.displayName = "SearchList";

// Search List Item component
const SearchListItem = ({
  className,
  children,
  onClick,
  ...props
}: React.ComponentPropsWithoutRef<"li">) => {
  const { setIsOpen } = useSearchContext();

  const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
    setIsOpen(false);
    onClick?.(e);
  };

  return (
    <li
      className={c(
        "flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </li>
  );
};

Search.Input = SearchInput;
Search.List = SearchList;
Search.ListItem = SearchListItem;

export { Search };
