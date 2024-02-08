import { Bar } from 'design-system/bar';
import React from 'react';
import { useDocStore } from 'store/doc/doc.store';
import { useAuthStore } from 'store/auth/auth.store';
import { Button } from 'design-system/button';
import { BiEdit, BiGridAlt, BiSave } from 'react-icons/bi';
import { useDocsStore } from 'store/docs/docs.store';

const ActiveDocBarContent = React.lazy(
  () => import(`./active-doc-bar-content`),
);

const Loader = () => (
  <div className="flex gap-2">
    <div className="w-20 h-8 rounded-sm bg-gray-300 dark:bg-gray-800" />
    <div className="w-4 h-8 rounded-sm bg-gray-300 dark:bg-gray-800" />
    <div className="w-10 h-8 rounded-sm bg-gray-300 dark:bg-gray-800" />
  </div>
);

const DocBar = () => {
  const docStore = useDocStore();
  const docsStore = useDocsStore();
  const authStore = useAuthStore();

  const disabled = docsStore.is === `busy`;

  return (
    <Bar className="h-[50px]">
      {authStore.is === `idle` && <Loader />}
      {authStore.is === `authorized` && (
        <>
          {docStore.is === `idle` ? (
            <>
              <h6
                className="text-xl font-bold max-w-[260px] truncate"
                title="Markdown Cheatsheet"
              >
                Type Your Document Name Here
              </h6>
              <Button
                i={1}
                s={1}
                className="ml-4"
                title="Change document name"
                disabled={disabled}
                // onClick={handleEditOpen}
              >
                <BiEdit />
              </Button>
              <Button
                i={1}
                s={1}
                className="ml-2"
                disabled={disabled}
                title="Save changes"
                // onClick={handleSaveCodeConfirm}
              >
                <BiSave />
              </Button>
              <Button
                i={1}
                s={1}
                className="ml-2"
                title="Your documents"
                disabled={disabled}
                // onClick={docsModal.open}
              >
                <BiGridAlt />
              </Button>
            </>
          ) : (
            <React.Suspense fallback={<Loader />}>
              <ActiveDocBarContent />
            </React.Suspense>
          )}
        </>
      )}
      {authStore.is === `unauthorized` && (
        <h6
          className="text-xl font-bold max-w-[260px] truncate"
          title="Markdown Cheatsheet"
        >
          Markdown Cheatsheet
        </h6>
      )}
    </Bar>
  );
};

export default DocBar;
