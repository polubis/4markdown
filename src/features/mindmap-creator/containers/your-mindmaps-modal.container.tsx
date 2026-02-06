import { Button } from "design-system/button";
import { Modal2 } from "design-system/modal2";
import React from "react";
import { BiErrorAlt, BiRefresh, BiSearch, BiX } from "react-icons/bi";
import c from "classnames";
import { differenceInDays, formatDistance } from "date-fns";
import { Tabs } from "design-system/tabs";
import type { MindmapDto } from "api-4markdown-contracts";
import { useMindmapCreatorState } from "store/mindmap-creator";
import { readyMindmapsSelector } from "store/mindmap-creator/selectors";
import {
  closeYourMindmapsViewAction,
  selectMindmapAction,
} from "store/mindmap-creator/actions";
import { reloadYourMindmapsAct } from "acts/reload-your-mindmaps.act";
import { Loader } from "design-system/loader";
import { VisibilityIcon } from "components/visibility-icon";

const rangeFilters = [`Recent`, `Older`, `Old`] as const;

type RangeFilter = (typeof rangeFilters)[number];

const rangeLookup: Record<RangeFilter, [number, number]> = {
  Recent: [0, 7],
  Older: [8, 30],
  Old: [31, Number.MAX_VALUE],
};

interface MindmapListItemProps {
  mindmap: MindmapDto;
  isActive: boolean;
  onSelect: (mindmapId: MindmapDto["id"]) => void;
}

const MindmapListItem = React.memo<MindmapListItemProps>(
  ({ mindmap, isActive, onSelect }) => {
    const handleClick = React.useCallback(() => {
      onSelect(mindmap.id);
    }, [mindmap.id, onSelect]);

    const formattedDate = React.useMemo(
      () =>
        formatDistance(new Date(), mindmap.mdate, {
          addSuffix: true,
        }),
      [mindmap.mdate],
    );

    return (
      <li
        className={c(
          `flex flex-col cursor-pointer border-2 rounded-lg px-4 py-3`,
          isActive
            ? `bg-green-700 text-white border-green-700`
            : `bg-zinc-200 dark:hover:bg-gray-900 dark:bg-gray-950 hover:bg-zinc-300 border-zinc-300 dark:border-zinc-800`,
        )}
        title={mindmap.name}
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
            visibility={mindmap.visibility}
            className="size-6 shrink-0"
          />
        </div>
        <strong>{mindmap.name}</strong>
      </li>
    );
  },
);

MindmapListItem.displayName = `MindmapListItem`;

const YourMindmapsContentContainer = ({
  searchQuery,
  activeMindmapId,
  filteredMindmaps,
}: {
  searchQuery: string;
  activeMindmapId: string | null;
  filteredMindmaps: MindmapDto[];
}) => {
  const selectMindmap = React.useCallback(
    (mindmapId: MindmapDto["id"]): void => {
      selectMindmapAction(mindmapId);
    },
    [],
  );

  const isMindmapActive = React.useCallback(
    (mindmapId: string): boolean => activeMindmapId === mindmapId,
    [activeMindmapId],
  );

  return (
    <>
      {filteredMindmaps.length > 0 ? (
        <ul className="flex flex-col space-y-3">
          {filteredMindmaps.map((mindmap) => (
            <MindmapListItem
              key={mindmap.id}
              mindmap={mindmap}
              isActive={isMindmapActive(mindmap.id)}
              onSelect={selectMindmap}
            />
          ))}
        </ul>
      ) : (
        <h6 className="p-4 text-center">
          {searchQuery.trim().length > 0
            ? `No mindmaps found matching "${searchQuery}"`
            : `No mindmaps for selected filters`}
        </h6>
      )}
    </>
  );
};

const YourMindmapsModalContainer = () => {
  const { mindmaps, activeMindmapId } = useMindmapCreatorState();
  const [activeRange, setActiveRange] = React.useState<RangeFilter>(
    rangeFilters[0],
  );
  const [searchQuery, setSearchQuery] = React.useState(``);
  const [isSearchActive, setIsSearchActive] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);

  const mindmapsState = useMindmapCreatorState((state) => {
    if (state.mindmaps.is === `ok`) {
      return readyMindmapsSelector(state.mindmaps);
    }
    return null;
  });

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

  const filteredMindmaps = React.useMemo((): MindmapDto[] => {
    if (mindmaps.is !== `ok` || !mindmapsState) {
      return [];
    }

    const query = searchQuery.trim().toLowerCase();
    const hasQuery = query.length > 0;

    // Early exit for search mode with empty query
    if (isSearchActive && !hasQuery) {
      return mindmapsState.data;
    }

    const now = new Date();

    return mindmapsState.data.filter((mindmap) => {
      // If search is active with query, filter by search query
      if (isSearchActive && hasQuery) {
        return (
          mindmap.name.toLowerCase().includes(query) ||
          mindmap.id.toLowerCase().includes(query)
        );
      }

      // Otherwise, apply range filter
      const diff = differenceInDays(now, mindmap.mdate);
      const [from, to] = rangeLookup[activeRange];
      return diff >= from && diff <= to;
    });
  }, [mindmaps.is, mindmapsState, activeRange, searchQuery, isSearchActive]);

  const pending = React.useMemo(
    () => mindmaps.is === `idle` || mindmaps.is === `busy`,
    [mindmaps.is],
  );

  return (
    <Modal2
      disabled={pending}
      onClose={closeYourMindmapsViewAction}
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
            <label htmlFor="mindmap-search-input" className="sr-only">
              Search mindmaps
            </label>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BiSearch
                  className="h-5 w-5 text-gray-600 dark:text-gray-300"
                  aria-hidden="true"
                />
              </div>
              <input
                id="mindmap-search-input"
                ref={searchInputRef}
                type="text"
                name="mindmap-search"
                autoComplete="off"
                spellCheck={false}
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search mindmaps…"
                className={c(
                  `block w-full h-8 pl-10 pr-3 text-sm rounded-md`,
                  `bg-gray-300 dark:bg-slate-800`,
                  `border border-transparent`,
                  `focus-visible:border-black focus-visible:dark:border-white`,
                  `focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black focus-visible:dark:ring-white`,
                  `placeholder:text-gray-600 dark:placeholder:text-gray-300`,
                  `text-gray-900 dark:text-white`,
                )}
                aria-label="Search mindmaps by name or ID"
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
          title="Your Mindmaps"
          closeButtonTitle="Close your mindmaps"
        >
          <Button
            type="button"
            i={2}
            s={1}
            title="Search mindmaps"
            disabled={pending}
            onClick={handleToggleSearch}
          >
            <BiSearch />
          </Button>
          <Button
            type="button"
            i={2}
            s={1}
            title="Sync mindmaps"
            disabled={pending}
            onClick={reloadYourMindmapsAct}
          >
            <BiRefresh />
          </Button>
        </Modal2.Header>
      )}

      <Modal2.Body
        className={c(
          (pending ||
            mindmaps.is === `fail` ||
            (mindmaps.is === `ok` && filteredMindmaps.length === 0)) &&
            `flex items-center justify-center`,
        )}
      >
        {pending && <Loader className="mx-auto my-3" size="lg" />}
        {mindmaps.is === `ok` && (
          <YourMindmapsContentContainer
            searchQuery={searchQuery}
            activeMindmapId={activeMindmapId ?? null}
            filteredMindmaps={filteredMindmaps}
          />
        )}
        {mindmaps.is === `fail` && (
          <>
            <p className="flex gap-2 text-sm justify-center mb-4 items-center bg-red-300 dark:bg-red-700 p-2 rounded-md">
              <BiErrorAlt className="shrink-0" size={20} />
              {mindmaps.error.message}
            </p>
            <Button
              i={2}
              s={2}
              auto
              className="w-full"
              title="Sync mindmap"
              onClick={reloadYourMindmapsAct}
            >
              Reload
            </Button>
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
                title={`${range} mindmaps`}
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

export { YourMindmapsModalContainer };
