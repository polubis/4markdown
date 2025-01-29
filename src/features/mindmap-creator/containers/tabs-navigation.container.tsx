import React from 'react';

import { useMindmapCreatorState } from 'store/mindmap-creator';
import { mindmapReadySelector } from 'store/mindmap-creator/selectors';
import c from 'classnames';
import { setMindmapAction } from 'store/mindmap-creator/actions';

const TabsNavigationContainer = () => {
  const { browsedMindmaps, activeMindmap } =
    useMindmapCreatorState(mindmapReadySelector);

  const tabs = React.useMemo(
    () => [activeMindmap, ...browsedMindmaps],
    [activeMindmap, browsedMindmaps],
  );

  return (
    <header className="h-12 flex border-zinc-300 dark:border-zinc-800 border-b px-4">
      <nav className="h-full">
        {tabs.map((mindmap) => (
          <button
            key={mindmap.id}
            className={c(
              `text-black black:text-white h-full px-2 bg-gray-200 hover:bg-gray-300 cursor-pointer`,
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
