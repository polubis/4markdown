import { Bar } from 'design-system/bar';
import React from 'react';
import { useDocStore } from 'store/doc/doc.store';
import { ActiveDocBarContent } from './active-doc-bar-content';
import { useAuthStore } from 'store/auth/auth.store';

const DocBar = () => {
  const docStore = useDocStore();
  const authStore = useAuthStore();

  return (
    <Bar className="h-[50px]">
      {authStore.is === `idle` ? (
        <h6
          className="text-xl font-bold max-w-[260px] truncate"
          title="Give Us Second 👌"
        >
          Give Us Second 👌
        </h6>
      ) : (
        <>
          {docStore.is === `idle` ? (
            <h6
              className="text-xl font-bold max-w-[260px] truncate"
              title="Markdown Cheatsheet"
            >
              Markdown Cheatsheet
            </h6>
          ) : (
            <ActiveDocBarContent />
          )}
        </>
      )}
    </Bar>
  );
};

export default DocBar;
