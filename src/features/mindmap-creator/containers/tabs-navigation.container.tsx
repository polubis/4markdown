import React from 'react';

import { useMindmapCreatorState } from 'store/mindmap-creator';
import { mindmapReadySelector } from 'store/mindmap-creator/selectors';
import { setMindmapAction } from 'store/mindmap-creator/actions';

const TabsNavigationContainer = () => {
  const { activeMindmap } = useMindmapCreatorState(mindmapReadySelector);

  return (
    <header className="h-[50px] flex border-zinc-300 dark:border-zinc-800 border-b px-4">
      <nav className="h-full flex items-center">
        <button
          key="initial-mindmap"
          className="text-xl flex items-center max-w-[260px] truncate mr-2 hover:underline underline-offset-4"
          onClick={() => setMindmapAction(activeMindmap)}
        >
          {activeMindmap.name}
        </button>
      </nav>
    </header>
  );
};

export { TabsNavigationContainer };
