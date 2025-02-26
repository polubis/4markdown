import React from 'react';
import { getYourMindmapsAct } from 'acts/get-your-mindmaps.act';
import { useAuthStore } from 'store/auth/auth.store';
import { YourMindmapsContainer } from './your-mindmaps.container';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { activeMindmapSelector } from 'store/mindmap-creator/selectors';
import { Button } from 'design-system/button';
import { BiDotsHorizontal, BiEdit, BiSave } from 'react-icons/bi';

const Loader = () => (
  <div className="flex gap-2">
    <div className="w-20 h-8 rounded-md bg-gray-300 dark:bg-gray-800" />
    <div className="w-4 h-8 rounded-md bg-gray-300 dark:bg-gray-800" />
    <div className="w-10 h-8 rounded-md bg-gray-300 dark:bg-gray-800" />
  </div>
);

const ActiveMindmapBarContainer = () => {
  const activeMindmap = useMindmapCreatorState(activeMindmapSelector);

  return (
    <>
      {activeMindmap ? (
        <>
          <h1 className="font-bold text-lg mr-4 truncate max-w-[260px]">
            {activeMindmap.name}
          </h1>
          <div className="flex items-center space-x-2">
            <Button i={1} s={1} title="Update mindmap name">
              <BiEdit />
            </Button>
            <Button i={1} s={1} title="Save mindmap changes">
              <BiSave />
            </Button>
            <YourMindmapsContainer />
            <Button i={1} s={1} title="Open mindmap details">
              <BiDotsHorizontal />
            </Button>
          </div>
        </>
      ) : (
        <>
          <h1 className="font-bold text-lg mr-4 truncate max-w-[260px]">
            Mindmap Creator
          </h1>
          <YourMindmapsContainer />
        </>
      )}
    </>
  );
};

const SubNavContainer = () => {
  const authStore = useAuthStore();

  React.useEffect(() => {
    authStore.is === `authorized` && getYourMindmapsAct();
  }, [authStore]);

  return (
    <>
      {authStore.is === `idle` && <Loader />}

      {authStore.is === `unauthorized` && (
        <h1 className="font-bold text-lg mr-4 truncate max-w-[260px]">
          Mindmap Creator
        </h1>
      )}

      {authStore.is === `authorized` && <ActiveMindmapBarContainer />}
    </>
  );
};

export { SubNavContainer };
