import { getYourMindmapsAct } from 'acts/get-your-mindmaps.act';
import React from 'react';
import { useAuthStore } from 'store/auth/auth.store';
import { useMindmapCreatorState } from 'store/mindmap-creator';

const Loader = () => (
  <div className="flex gap-2">
    <div className="w-20 h-8 rounded-md bg-gray-300 dark:bg-gray-800" />
    <div className="w-4 h-8 rounded-md bg-gray-300 dark:bg-gray-800" />
    <div className="w-10 h-8 rounded-md bg-gray-300 dark:bg-gray-800" />
  </div>
);

const SubNavContainer = () => {
  const authStore = useAuthStore();
  const { mindmaps } = useMindmapCreatorState();

  React.useEffect(() => {
    authStore.is === `authorized` && getYourMindmapsAct();
  }, [authStore]);

  return (
    <>
      {authStore.is === `idle` && <Loader />}
      {authStore.is === `authorized` && (
        <>
          {mindmaps.is === `ok` ? (
            <>
              <h1
                className="font-bold text-lg max-w-[260px] truncate mr-4"
                title="Markdown Editor"
              >
                Bla bla loaded mindmaps
              </h1>
            </>
          ) : (
            <h1
              className="font-bold text-lg max-w-[260px] truncate mr-4"
              title="Markdown Editor"
            >
              Mindmap Creator (Create Mindmaps Effortlessly)
            </h1>
          )}
        </>
      )}
      {authStore.is === `unauthorized` && (
        <h6 className="font-bold text-lg truncate mr-4" title="Markdown Editor">
          Markdown Editor
        </h6>
      )}
    </>
  );
};

export { SubNavContainer };
