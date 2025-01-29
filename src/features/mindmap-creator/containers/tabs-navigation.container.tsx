import React from 'react';

import { useMindmapCreatorState } from 'store/mindmap-creator';
import { mindmapReadySelector } from 'store/mindmap-creator/selectors';
import c from 'classnames';
import { setMindmapAction } from 'store/mindmap-creator/actions';
import { BiChevronRight } from 'react-icons/bi';

const TabsNavigationContainer = () => {
  const { browsedMindmaps, activeMindmap, initialMindmap } =
    useMindmapCreatorState(mindmapReadySelector);

  return (
    <header className="h-14 flex border-zinc-300 dark:border-zinc-800 border-b px-4">
      <nav className="h-full flex items-center">
        <button
          key="initial-mindmap"
          className="text-xl flex items-center max-w-[260px] truncate mr-2 hover:underline underline-offset-4"
          onClick={() => setMindmapAction(initialMindmap)}
        >
          {initialMindmap.name} <BiChevronRight className="ml-1" size={24} />
        </button>
        {browsedMindmaps.map((mindmap) => (
          <button
            key={mindmap.id}
            className={c(
              `text-black black:text-white h-full px-3 bg-gray-200 hover:bg-gray-300 cursor-pointer`,
              { 'bg-gray-300': mindmap.id === activeMindmap.id },
            )}
            onClick={() => setMindmapAction(mindmap)}
          >
            {mindmap.name}
          </button>
        ))}
      </nav>
    </header>
  );
};

export { TabsNavigationContainer };
