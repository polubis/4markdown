import React, { useState, useRef, useEffect, forwardRef } from "react";
import { BiSearch, BiX, BiUser } from "react-icons/bi";
import { c } from "./c";

type SearchInputProps = React.ComponentPropsWithoutRef<"div"> & {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onSelect?: (item: any) => void;
  items?: Array<{
    id: string;
    displayName: string;
    email?: string;
    avatar?: string | null;
  }>;
  renderItem?: (item: any) => React.ReactNode;
  noResultsText?: string;
  maxHeight?: string;
};

type SearchInputDropdownProps = React.ComponentPropsWithoutRef<"div"> & {
  isOpen: boolean;
  items: any[];
  onItemSelect: (item: any) => void;
  renderItem: (item: any) => React.ReactNode;
  noResultsText: string;
  maxHeight: string;
};

type SearchInputItemProps = React.ComponentPropsWithoutRef<"div"> & {
  item: any;
  onClick: () => void;
};

type SearchInputNoResultsProps = React.ComponentPropsWithoutRef<"div"> & {
  text: string;
};

const SearchInputDropdown = ({
  className,
  isOpen,
  items,
  onItemSelect,
  renderItem,
  noResultsText,
  maxHeight,
  ...props
}: SearchInputDropdownProps) => {
  if (!isOpen) return null;

  return (
    <div
      className={c(
        `absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-y-auto`,
        maxHeight,
        className,
      )}
      {...props}
    >
      {items.length > 0 ? (
        items.map((item) => (
          <SearchInputItem
            key={item.id}
            item={item}
            onClick={() => onItemSelect(item)}
          >
            {renderItem(item)}
          </SearchInputItem>
        ))
      ) : (
        <SearchInputNoResults text={noResultsText} />
      )}
    </div>
  );
};

const SearchInputItem = ({
  className,
  item,
  onClick,
  children,
  ...props
}: SearchInputItemProps) => {
  return (
    <div
      className={c(
        `flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0`,
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

const SearchInputNoResults = ({
  className,
  text,
  ...props
}: SearchInputNoResultsProps) => {
  return (
    <div
      className={c(
        `p-4 text-center text-gray-500 dark:text-gray-400`,
        className,
      )}
      {...props}
    >
      <BiUser className="h-8 w-8 mx-auto mb-2 text-gray-300" />
      <p>{text}</p>
    </div>
  );
};

const SearchInput = forwardRef<HTMLDivElement, SearchInputProps>(
  (
    {
      className,
      placeholder = "Search...",
      onSearch,
      onSelect,
      items = [],
      renderItem,
      noResultsText = "No results found",
      maxHeight = "max-h-80",
      ...props
    },
    ref,
  ) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState(items);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Filter items based on search query
    useEffect(() => {
      if (searchQuery.trim() === "") {
        setSearchResults(items);
        setIsSearchOpen(false);
      } else {
        const filtered = items.filter((item) =>
          Object.values(item).some((value) =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        );
        setSearchResults(filtered);
        setIsSearchOpen(true);
      }
    }, [searchQuery, items]);

    // Close search when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          ref &&
          "current" in ref &&
          ref.current &&
          !ref.current.contains(event.target as Node)
        ) {
          setIsSearchOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);

    const handleItemSelect = (item: any) => {
      setSearchQuery("");
      setIsSearchOpen(false);
      onSelect?.(item);
    };

    const handleClear = () => {
      setSearchQuery("");
      setIsSearchOpen(false);
      inputRef.current?.focus();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
      onSearch?.(value);
    };

    const handleInputFocus = () => {
      if (searchQuery.trim() !== "") {
        setIsSearchOpen(true);
      }
    };

    const defaultRenderItem = (item: any) => (
      <>
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {item.displayName?.charAt(0)?.toUpperCase() ||
              item.name?.charAt(0)?.toUpperCase() ||
              "?"}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {item.displayName || item.name || item.id}
          </p>
          {item.email && (
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {item.email}
            </p>
          )}
          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
            ID: {item.id}
          </p>
        </div>
        <div className="flex-shrink-0">
          <BiUser className="h-4 w-4 text-gray-400" />
        </div>
      </>
    );

    return (
      <div ref={ref} className={c(`relative`, className)} {...props}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <BiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
          {searchQuery && (
            <button
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10"
            >
              <BiX className="h-5 w-5" />
            </button>
          )}
        </div>

        <SearchInputDropdown
          isOpen={isSearchOpen}
          items={searchResults}
          onItemSelect={handleItemSelect}
          renderItem={renderItem || defaultRenderItem}
          noResultsText={noResultsText}
          maxHeight={maxHeight}
        />
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

// Add sub-components to the SearchInput
const SearchInputWithSubComponents = SearchInput as typeof SearchInput & {
  Dropdown: typeof SearchInputDropdown;
  Item: typeof SearchInputItem;
  NoResults: typeof SearchInputNoResults;
};

SearchInputWithSubComponents.Dropdown = SearchInputDropdown;
SearchInputWithSubComponents.Item = SearchInputItem;
SearchInputWithSubComponents.NoResults = SearchInputNoResults;

export type {
  SearchInputProps,
  SearchInputDropdownProps,
  SearchInputItemProps,
  SearchInputNoResultsProps,
};
export { SearchInputWithSubComponents as SearchInput };
