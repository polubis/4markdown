import React from "react";
import { BiSearch, BiX } from "react-icons/bi";
import { Modal2 } from "design-system/modal2";
import { Loader } from "design-system/loader";
import { Button } from "design-system/button";
import { useDocsStore } from "store/docs/docs.store";
import { getYourDocumentsAct } from "acts/get-your-documents.act";
import type { API4MarkdownDto } from "api-4markdown-contracts";
import c from "classnames";
import { meta } from "../../../../meta";

type DocItem = API4MarkdownDto<`getYourDocuments`>[number];

interface MarkdownLinkCommandContainerProps {
  onInsert(link: string): void;
  onClose(): void;
}

const MarkdownLinkCommandContainer = ({
  onInsert,
  onClose,
}: MarkdownLinkCommandContainerProps) => {
  const docsStore = useDocsStore();
  const [searchQuery, setSearchQuery] = React.useState(``);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  React.useEffect(() => {
    if (docsStore.is === `idle`) {
      getYourDocumentsAct();
    }
  }, [docsStore.is]);

  React.useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const filteredDocs = React.useMemo((): DocItem[] => {
    if (docsStore.is !== `ok`) return [];

    const query = searchQuery.trim().toLowerCase();

    if (!query) return docsStore.docs;

    return docsStore.docs.filter(
      (doc) =>
        doc.name.toLowerCase().includes(query) ||
        doc.id.toLowerCase().includes(query),
    );
  }, [docsStore, searchQuery]);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  const selectDoc = React.useCallback(
    (doc: DocItem): void => {
      const url = `${meta.siteUrl}${meta.routes.documents.preview}?id=${doc.id}`;
      onInsert(`[${doc.name}](${url})`);
    },
    [onInsert],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === `ArrowDown`) {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, filteredDocs.length - 1));
    } else if (e.key === `ArrowUp`) {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === `Enter`) {
      e.preventDefault();
      const doc = filteredDocs[activeIndex];
      if (doc) selectDoc(doc);
    }
  };

  React.useEffect(() => {
    if (listRef.current) {
      const activeItem = listRef.current.children[activeIndex] as
        | HTMLElement
        | undefined;
      activeItem?.scrollIntoView({ block: `nearest` });
    }
  }, [activeIndex]);

  const pending =
    docsStore.is === `idle` || docsStore.is === `busy`;

  return (
    <Modal2 onClose={onClose}>
      <Modal2.Header
        title=" "
        closeButtonTitle="Close article link command"
        skipX
        className="grid-cols-[1fr_auto]"
      >
        <div className="w-full max-w-[31.25rem] mx-auto flex items-center gap-2">
          <label htmlFor="markdown-link-command-search" className="sr-only">
            Search articles
          </label>
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BiSearch
                className="h-5 w-5 text-gray-600 dark:text-gray-300"
                aria-hidden="true"
              />
            </div>
            <input
              id="markdown-link-command-search"
              ref={searchInputRef}
              type="text"
              name="markdown-link-command-search"
              autoComplete="off"
              spellCheck={false}
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              placeholder="Search articles to link…"
              className={c(
                `block w-full h-8 pl-10 pr-3 text-sm rounded-md`,
                `bg-gray-300 dark:bg-slate-800`,
                `border border-transparent`,
                `focus-visible:border-black focus-visible:dark:border-white`,
                `focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black focus-visible:dark:ring-white`,
                `placeholder:text-gray-600 dark:placeholder:text-gray-300`,
                `text-gray-900 dark:text-white`,
              )}
              aria-label="Search articles by name or ID"
            />
          </div>
          <Button
            type="button"
            i={2}
            s={1}
            title="Close article link command"
            onClick={onClose}
          >
            <BiX />
          </Button>
        </div>
      </Modal2.Header>

      <Modal2.Body
        className={c(
          (pending ||
            docsStore.is === `fail` ||
            (docsStore.is === `ok` && filteredDocs.length === 0)) &&
            `flex items-center justify-center`,
        )}
      >
        {pending && <Loader size="xl" className="mx-auto" />}

        {docsStore.is === `fail` && (
          <p className="text-red-600 dark:text-red-400 text-center font-medium">
            Failed to load articles. Please try again.
          </p>
        )}

        {docsStore.is === `ok` && filteredDocs.length === 0 && (
          <p className="text-center font-medium">
            {searchQuery.trim().length > 0
              ? `No articles found matching "${searchQuery}"`
              : `No articles available`}
          </p>
        )}

        {docsStore.is === `ok` && filteredDocs.length > 0 && (
          <ul ref={listRef} className="flex flex-col space-y-2">
            {filteredDocs.map((doc, index) => (
              <li
                key={doc.id}
                className={c(
                  `flex flex-col cursor-pointer border-2 rounded-lg px-4 py-3`,
                  index === activeIndex
                    ? `bg-green-700 text-white border-green-700`
                    : `bg-zinc-200 dark:hover:bg-gray-900 dark:bg-gray-950 hover:bg-zinc-300 border-zinc-300 dark:border-zinc-800`,
                )}
                onClick={() => selectDoc(doc)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <span className="text-xs capitalize mb-0.5 opacity-70">
                  {doc.visibility}
                </span>
                <strong className="truncate">{doc.name}</strong>
              </li>
            ))}
          </ul>
        )}
      </Modal2.Body>

      <Modal2.Footer className="text-xs text-gray-500 dark:text-gray-400 gap-3">
        <span>
          <kbd className="font-mono">↑↓</kbd> navigate
        </span>
        <span>
          <kbd className="font-mono">↵</kbd> insert link
        </span>
        <span>
          <kbd className="font-mono">Esc</kbd> close
        </span>
      </Modal2.Footer>
    </Modal2>
  );
};

export { MarkdownLinkCommandContainer };
