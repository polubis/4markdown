import { Button } from "design-system/button";
import { Modal2 } from "design-system/modal2";
import React from "react";
import { BiErrorAlt, BiRefresh } from "react-icons/bi";
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

const rangeFilters = [`Recent`, `Old`, `Really Old`] as const;

type RangeFilter = (typeof rangeFilters)[number];

const rangeLookup: Record<RangeFilter, [number, number]> = {
  Recent: [0, 7],
  Old: [8, 30],
  "Really Old": [31, Number.MAX_VALUE],
};

const YourMindmapsContentContainer = ({
  activeRange,
}: {
  activeRange: RangeFilter;
}) => {
  const { activeMindmapId } = useMindmapCreatorState();
  const mindmapsState = useMindmapCreatorState((state) =>
    readyMindmapsSelector(state.mindmaps),
  );

  const mindmaps = React.useMemo((): MindmapDto[] => {
    const now = new Date();

    return mindmapsState.data.filter((mindmap) => {
      const diff = differenceInDays(now, mindmap.mdate);
      const [from, to] = rangeLookup[activeRange];

      return diff >= from && diff <= to;
    });
  }, [mindmapsState, activeRange]);

  return (
    <>
      {mindmaps.length > 0 ? (
        <ul className="flex flex-col space-y-3">
          {mindmaps.map((mindmap) => (
            <li
              className={c(
                `flex flex-col cursor-pointer border-2 rounded-lg px-4 py-3`,
                activeMindmapId === mindmap.id
                  ? `bg-green-700 text-white border-green-700`
                  : `bg-zinc-200 dark:hover:bg-gray-900 dark:bg-gray-950 hover:bg-zinc-300 border-zinc-300 dark:border-zinc-800`,
              )}
              title={mindmap.name}
              key={mindmap.id}
              onClick={() => selectMindmapAction(mindmap.id)}
            >
              <div className="flex justify-between mb-0.5">
                <span className="text-sm capitalize">
                  Edited{` `}
                  {formatDistance(new Date(), mindmap.mdate, {
                    addSuffix: true,
                  })}
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
          ))}
        </ul>
      ) : (
        <h6 className="p-4 text-center">No mindmaps for selected filters</h6>
      )}
    </>
  );
};

const YourMindmapsModalContainer = () => {
  const { mindmaps } = useMindmapCreatorState();
  const [activeRange, setActiveRange] = React.useState<RangeFilter>(
    rangeFilters[0],
  );

  const pending = mindmaps.is === `idle` || mindmaps.is === `busy`;

  return (
    <Modal2 disabled={pending} onClose={closeYourMindmapsViewAction}>
      <Modal2.Header
        title="Your Mindmaps"
        closeButtonTitle="Close your mindmaps"
      >
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
      <Modal2.Body>
        {pending && <Loader className="mx-auto my-3" size="lg" />}
        {mindmaps.is === `ok` && (
          <YourMindmapsContentContainer activeRange={activeRange} />
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
      <Modal2.Footer>
        <Tabs className="w-full">
          {rangeFilters.map((range) => (
            <Tabs.Item
              key={range}
              disabled={pending}
              title={`${range} mindmaps`}
              active={range === activeRange}
              onClick={() => setActiveRange(range)}
            >
              {range}
            </Tabs.Item>
          ))}
        </Tabs>
      </Modal2.Footer>
    </Modal2>
  );
};

export { YourMindmapsModalContainer };
