import React from "react";
import { Modal2 } from "design-system/modal2";
import { Err } from "design-system/err";
import { BiError } from "react-icons/bi";
import { Input } from "design-system/input";
import { navigate } from "gatsby";
import { searchStaticContentAct } from "acts/search-static-content.act";
import type { SearchDataItem } from "models/pages-data";
import type { API4MarkdownError } from "api-4markdown-contracts";

const EMPTY_STATE_COUNT = 20;
const LATEST_COUNT = 10;

type SearchPopoverContentProps = {
  onClose(): void;
};

let searchDataCache: { is: `idle` } | { is: `ok`; data: SearchDataItem[] } = {
  is: `idle`,
};

type LoadState =
  | { is: `busy` }
  | { is: `ok`; data: SearchDataItem[] }
  | { is: `fail`; error: API4MarkdownError };

function shuffleAndTake<T>(arr: T[], n: number): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

function sortByMdateDesc(items: SearchDataItem[]): SearchDataItem[] {
  return [...items].sort((a, b) => b.mdate.localeCompare(a.mdate));
}

type CategorizedSample = {
  latest: SearchDataItem[];
  older: SearchDataItem[];
};

function getEmptyStateSample(data: SearchDataItem[]): CategorizedSample {
  const sample = shuffleAndTake(data, EMPTY_STATE_COUNT);
  const byDate = sortByMdateDesc(sample);
  const latest = byDate.slice(0, LATEST_COUNT);
  const older = byDate.slice(LATEST_COUNT, EMPTY_STATE_COUNT);
  return { latest, older };
}

const resultItemClass =
  "flex flex-col cursor-pointer border-2 rounded-lg px-4 py-3 bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 hover:bg-zinc-300 border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100";

function ResultItem({
  result,
  onClick,
}: {
  result: SearchDataItem;
  onClick: () => void;
}) {
  return (
    <li
      className={resultItemClass}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <h6>{result.title}</h6>
      {result.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4 mt-2">
          {result.description}
        </p>
      )}
      <p className="text-sm mt-1">{result.url}</p>
    </li>
  );
}

function ResultSection({
  headingId,
  title,
  items,
}: {
  headingId: string;
  title: string;
  items: SearchDataItem[];
}) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby={headingId} className="mt-6 first:mt-4">
      <h2
        id={headingId}
        className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 px-1"
      >
        {title}
      </h2>
      <ul className="flex flex-col gap-2 list-none p-0 m-0">
        {items.map((result, index) => (
          <ResultItem
            key={`${result.url}-${index}`}
            result={result}
            onClick={() => navigate(result.url)}
          />
        ))}
      </ul>
    </section>
  );
}

const SearchPopoverContent = ({ onClose }: SearchPopoverContentProps) => {
  const [search, setSearch] = React.useState(``);
  const [searchData, setSearchData] = React.useState<LoadState>(() =>
    searchDataCache.is === `idle`
      ? {
          is: `busy`,
        }
      : searchDataCache,
  );

  React.useEffect(() => {
    const loadSearchData = async () => {
      const result = await searchStaticContentAct();

      if (result.is === `ok`) {
        searchDataCache = { is: `ok`, data: result.data };
      }

      setSearchData(result);
    };

    searchDataCache.is === `idle` && loadSearchData();
  }, []);

  const query = search.trim();
  const hasQuery = query.length > 0;

  const filteredData = React.useMemo(() => {
    if (searchData.is !== `ok` || !hasQuery) return [];
    return searchData.data.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        (item.description &&
          item.description.toLowerCase().includes(query.toLowerCase())) ||
        item.url.toLowerCase().includes(query.toLowerCase()),
    );
  }, [search, searchData, hasQuery, query]);

  const emptyStateSample = React.useMemo((): CategorizedSample | null => {
    if (searchData.is !== `ok` || hasQuery || searchData.data.length === 0)
      return null;
    return getEmptyStateSample(searchData.data);
  }, [searchData, hasQuery]);

  const showCategorized =
    searchData.is === `ok` && !hasQuery && emptyStateSample !== null;
  const showFiltered =
    searchData.is === `ok` && hasQuery && filteredData.length > 0;

  return (
    <Modal2 disabled={searchData.is === `busy`} onClose={onClose}>
      <Modal2.Header title="Find Anything" closeButtonTitle="Close search" />
      <Modal2.Body>
        <Input
          placeholder="Search by title, description or URL"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {showCategorized && emptyStateSample && (
          <nav
            className="mt-4 flex flex-col"
            aria-label="Random articles by category"
          >
            <ResultSection
              headingId="search-latest-heading"
              title="Latest"
              items={emptyStateSample.latest}
            />
            <ResultSection
              headingId="search-older-heading"
              title="Older"
              items={emptyStateSample.older}
            />
          </nav>
        )}

        {showFiltered && (
          <ul className="mt-4 flex flex-col gap-2 list-none p-0 m-0">
            {filteredData.map((result, index) => (
              <ResultItem
                key={`${result.url}-${index}`}
                result={result}
                onClick={() => navigate(result.url)}
              />
            ))}
          </ul>
        )}

        {searchData.is === `fail` && (
          <Err className="py-6">
            <Err.Icon>
              <BiError size={80} />
            </Err.Icon>
            <Err.Title>Something went wrong!</Err.Title>
            <Err.Description className="mb-0">
              {searchData.error.message}
            </Err.Description>
          </Err>
        )}
      </Modal2.Body>
    </Modal2>
  );
};

export { SearchPopoverContent };
