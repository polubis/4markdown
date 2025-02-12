import { Button } from 'design-system/button';
import { Modal } from 'design-system/modal';
import React from 'react';
import { BiLowVision, BiRefresh, BiShow, BiWorld } from 'react-icons/bi';
import c from 'classnames';
import { differenceInDays, formatDistance } from 'date-fns';
import { Tabs } from 'design-system/tabs';
import type { MindmapDto } from 'api-4markdown-contracts';
import { useYourMindmapsState } from 'store/your-mindmaps';
import { yourMindmapsReadySelector } from 'store/your-mindmaps/selectors';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { mindmapCreatorReadySelector } from 'store/mindmap-creator/selectors';
import { useMindmapModalsContext } from '../providers/mindmap-widgets.provider';
import { initializeMindmapAction } from 'store/mindmap-creator/actions';
import { reloadYourMindmapsAct } from 'acts/reload-your-mindmaps.act';

const rangeFilters = [`Recent`, `Old`, `Really Old`] as const;

type RangeFilter = (typeof rangeFilters)[number];

const rangeLookup: Record<RangeFilter, [number, number]> = {
  Recent: [0, 7],
  Old: [8, 30],
  'Really Old': [31, Number.MAX_VALUE],
};

const MindmapsListModalContainer = () => {
  const mindmapsState = useYourMindmapsState(yourMindmapsReadySelector);
  const { activeMindmap } = useMindmapCreatorState(mindmapCreatorReadySelector);
  const { mindmapsListModal } = useMindmapModalsContext();
  const [activeRange, setActiveRange] = React.useState<RangeFilter>(
    rangeFilters[0],
  );

  const selectMindmap = (mindmap: MindmapDto): void => {
    initializeMindmapAction(mindmap);
    mindmapsListModal.off();
  };

  const mindmaps = React.useMemo((): MindmapDto[] => {
    const now = new Date();

    return mindmapsState.mindmaps.filter((mindmap) => {
      const diff = differenceInDays(now, mindmap.mdate);
      const [from, to] = rangeLookup[activeRange];

      return diff >= from && diff <= to;
    });
  }, [mindmapsState, activeRange]);

  return (
    <Modal onClose={mindmapsListModal.off}>
      <Modal.Header
        title="Your Mindmaps"
        closeButtonTitle="Close your mindmaps"
      >
        <Button
          type="button"
          i={2}
          s={1}
          title="Sync mindmaps"
          onClick={reloadYourMindmapsAct}
        >
          <BiRefresh />
        </Button>
      </Modal.Header>

      <Tabs className="mb-5">
        {rangeFilters.map((range) => (
          <Tabs.Item
            key={range}
            title={`${range} mindmaps`}
            active={range === activeRange}
            onClick={() => setActiveRange(range)}
          >
            {range}
          </Tabs.Item>
        ))}
      </Tabs>

      {mindmaps.length > 0 ? (
        <ul className="flex flex-col space-y-3">
          {mindmaps.map((mindmap) => (
            <li
              className={c(
                `flex flex-col cursor-pointer border-2 rounded-lg px-4 py-3`,
                activeMindmap.id === mindmap.id
                  ? `bg-green-700 text-white border-green-700`
                  : `bg-zinc-200 dark:hover:bg-gray-900 dark:bg-gray-950 hover:bg-zinc-300 border-zinc-300 dark:border-zinc-800`,
              )}
              title={mindmap.name}
              key={mindmap.id}
              onClick={() => selectMindmap(mindmap)}
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
                {mindmap.visibility === `private` && (
                  <BiLowVision size="20" title="This mindmap is private" />
                )}
                {mindmap.visibility === `public` && (
                  <BiShow size="20" title="This mindmap is public" />
                )}
                {mindmap.visibility === `permanent` && (
                  <BiWorld size="20" title="This mindmap is permanent" />
                )}
              </div>
              <strong>{mindmap.name}</strong>
            </li>
          ))}
        </ul>
      ) : (
        <h6 className="p-4 text-center">No mindmaps for selected filters</h6>
      )}
    </Modal>
  );
};

export { MindmapsListModalContainer };
