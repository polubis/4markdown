import { Button } from "design-system/button";
import React from "react";
import { BiRefresh, BiSearch, BiX } from "react-icons/bi";
import { docStoreActions, useDocStore } from "store/doc/doc.store";
import { type DocsStoreOkState, useDocsStore } from "store/docs/docs.store";
import c from "classnames";
import { differenceInDays, formatDistance } from "date-fns";
import { Tabs } from "design-system/tabs";
import { reloadYourDocuments } from "actions/reload-your-documents.action";
import type { API4MarkdownDto } from "api-4markdown-contracts";
import { Modal2 } from "design-system/modal2";
import { Loader } from "design-system/loader";
import { VisibilityIcon } from "components/visibility-icon";

const rangeFilters = [`Recent`, `Older`, `Old`] as const;

type RangeFilter = (typeof rangeFilters)[number];

const rangeLookup: Record<RangeFilter, [number, number]> = {
  Recent: [0, 7],
  Older: [8, 30],
  Old: [31, Number.MAX_VALUE],
};

type DocItem = API4MarkdownDto<"getYourDocuments">[number];

interface DocumentListItemProps {
  doc: DocItem;
  isActive: boolean;
  onSelect: (doc: DocItem) => void;
}

const DocumentListItem = React.memo<DocumentListItemProps>(
  ({ doc, isActive, onSelect }) => {
    const handleClick = React.useCallback(() => {
      onSelect(doc);
    }, [doc, onSelect]);

    const formattedDate = React.useMemo(
      () =>
        formatDistance(new Date(), doc.mdate, {
          addSuffix: true,
        }),
      [doc.mdate],
    );

    return (
      <li
        className={c(
          `flex flex-col cursor-pointer border-2 rounded-lg px-4 py-3`,
          isActive
            ? `bg-green-700 text-white border-green-700`
            : `bg-zinc-200 dark:hover:bg-gray-900 dark:bg-gray-950 hover:bg-zinc-300 border-zinc-300 dark:border-zinc-800`,
        )}
        title={doc.name}
        onClick={handleClick}
      >
        <div className="flex justify-between mb-0.5">
          <span className="text-sm capitalize">
            Edited{` `}
            {formattedDate}
            {` `}
            ago
          </span>
          <VisibilityIcon
            visibility={doc.visibility}
            className="size-5 shrink-0"
          />
        </div>
        <strong>{doc.name}</strong>
      </li>
    );
  },
);

DocumentListItem.displayName = `DocumentListItem`;

const DocsListModalContainer = ({ onClose }: { onClose(): void }) => {
  const docsStore = useDocsStore();
  const docStore = useDocStore();
  const [activeRange, setActiveRange] = React.useState<RangeFilter>(
    rangeFilters[0],
  );
  const [searchQuery, setSearchQuery] = React.useState(``);
  const [isSearchActive, setIsSearchActive] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);

  const selectDoc = React.useCallback(
    (document: DocItem): void => {
      docStoreActions.setActive(document);
      onClose();
    },
    [onClose],
  );

  const handleToggleSearch = React.useCallback((): void => {
    setIsSearchActive((prev) => {
      const newState = !prev;
      if (newState) {
        // Focus input when opening search
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 0);
      } else {
        // Clear search when closing
        setSearchQuery(``);
      }
      return newState;
    });
  }, []);

  const handleSearchChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setSearchQuery(e.target.value);
    },
    [],
  );

  const handleSearchKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === `Escape`) {
        setIsSearchActive(false);
        setSearchQuery(``);
      }
    },
    [],
  );

  const handleRangeChange = React.useCallback((range: RangeFilter): void => {
    setActiveRange(range);
  }, []);

  const docs = React.useMemo((): DocsStoreOkState["docs"] => {
    if (docsStore.is !== `ok`) return [];

    const query = searchQuery.trim().toLowerCase();
    const hasQuery = query.length > 0;

    // Early exit for search mode with empty query
    if (isSearchActive && !hasQuery) {
      return docsStore.docs;
    }

    const now = new Date();

    return docsStore.docs.filter((doc) => {
      // If search is active with query, filter by search query
      if (isSearchActive && hasQuery) {
        return (
          doc.name.toLowerCase().includes(query) ||
          doc.id.toLowerCase().includes(query)
        );
      }

      // Otherwise, apply range filter
      const diff = differenceInDays(now, doc.mdate);
      const [from, to] = rangeLookup[activeRange];
      return diff >= from && diff <= to;
    });
  }, [docsStore, activeRange, searchQuery, isSearchActive]);

  const pending = React.useMemo(
    () => docsStore.is === `idle` || docsStore.is === `busy`,
    [docsStore.is],
  );

  const isDocActive = React.useCallback(
    (docId: string): boolean =>
      docStore.is === `active` && docStore.id === docId,
    [docStore],
  );

  return (
    <Modal2
      disabled={pending}
      onClose={onClose}
      className={c(
        isSearchActive && `[&>*]:h-screen sm:[&>*]:h-full [&>*]:max-h-full`,
      )}
    >
      {isSearchActive ? (
        <Modal2.Header
          title=" "
          closeButtonTitle="Close search"
          skipX
          className="grid-cols-[1fr_auto]"
        >
          <div className="w-full max-w-[31.25rem] mx-auto flex items-center gap-2">
            <label htmlFor="doc-search-input" className="sr-only">
              Search documents
            </label>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BiSearch
                  className="h-5 w-5 text-gray-600 dark:text-gray-300"
                  aria-hidden="true"
                />
              </div>
              <input
                id="doc-search-input"
                ref={searchInputRef}
                type="text"
                name="doc-search"
                autoComplete="off"
                spellCheck={false}
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search documents…"
                className={c(
                  `block w-full h-8 pl-10 pr-3 text-sm rounded-md`,
                  `bg-gray-300 dark:bg-slate-800`,
                  `border border-transparent`,
                  `focus-visible:border-black focus-visible:dark:border-white`,
                  `focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black focus-visible:dark:ring-white`,
                  `placeholder:text-gray-600 dark:placeholder:text-gray-300`,
                  `text-gray-900 dark:text-white`,
                )}
                aria-label="Search documents by name or ID"
              />
            </div>
            <Button
              type="button"
              i={2}
              s={1}
              title="Close search"
              onClick={handleToggleSearch}
            >
              <BiX />
            </Button>
          </div>
        </Modal2.Header>
      ) : (
        <Modal2.Header
          title="Your Documents"
          closeButtonTitle="Close your documents"
        >
          <Button
            type="button"
            i={2}
            s={1}
            title="Search documents"
            disabled={pending}
            onClick={handleToggleSearch}
          >
            <BiSearch />
          </Button>
          <Button
            type="button"
            i={2}
            s={1}
            title="Sync documents"
            disabled={pending}
            onClick={reloadYourDocuments}
          >
            <BiRefresh />
          </Button>
        </Modal2.Header>
      )}

      <Modal2.Body
        className={c(
          (pending ||
            docsStore.is === `fail` ||
            (docsStore.is === `ok` && docs.length === 0)) &&
            `flex items-center justify-center`,
        )}
      >
        {pending && (
          <Loader
            data-testid="[docs-list-modal]:loader"
            size="xl"
            className="mx-auto"
          />
        )}
        {docsStore.is === `fail` && (
          <p className="text-red-600 dark:text-red-400 text-center font-medium">
            Something went wrong… Try again with above button refresh button
          </p>
        )}
        {docsStore.is === `ok` && (
          <>
            {docs.length > 0 ? (
              <ul className="flex flex-col space-y-3">
                {docs.map((doc) => (
                  <DocumentListItem
                    key={doc.id}
                    doc={doc}
                    isActive={isDocActive(doc.id)}
                    onSelect={selectDoc}
                  />
                ))}
              </ul>
            ) : (
              <p className="text-center font-medium">
                {searchQuery.trim().length > 0
                  ? `No documents found matching "${searchQuery}"`
                  : `No documents for selected filters`}
              </p>
            )}
          </>
        )}
      </Modal2.Body>
      {!isSearchActive && (
        <Modal2.Footer>
          <Tabs className="w-full">
            {rangeFilters.map((range) => (
              <Tabs.Item
                key={range}
                disabled={pending}
                title={`${range} documents`}
                active={range === activeRange}
                onClick={() => handleRangeChange(range)}
              >
                {range}
              </Tabs.Item>
            ))}
          </Tabs>
        </Modal2.Footer>
      )}
    </Modal2>
  );
};

export { DocsListModalContainer };
