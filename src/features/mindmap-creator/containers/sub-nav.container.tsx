import { getYourMindmapsAct } from 'acts/get-your-mindmaps.act';
import React from 'react';
import { useAuthStore } from 'store/auth/auth.store';

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
      <h1
        className="font-bold text-lg max-w-[260px] truncate"
        title="Markdown Editor"
      >
        Mindmap Creator
      </h1>
    </>
  );
};

export { SubNavContainer };
