import React from 'react';
import { getYourMindmapsAct } from 'acts/get-your-mindmaps.act';
import { useAuthStore } from 'store/auth/auth.store';
import { YourMindmapsContainer } from './your-mindmaps.container';

const Loader = () => (
  <div className="flex gap-2">
    <div className="w-20 h-8 rounded-md bg-gray-300 dark:bg-gray-800" />
    <div className="w-4 h-8 rounded-md bg-gray-300 dark:bg-gray-800" />
    <div className="w-10 h-8 rounded-md bg-gray-300 dark:bg-gray-800" />
  </div>
);

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

      {authStore.is === `authorized` && (
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

export { SubNavContainer };
