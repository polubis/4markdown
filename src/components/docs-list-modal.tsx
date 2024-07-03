import { Button } from 'design-system/button';
import Modal from 'design-system/modal';
import type { Doc } from 'models/doc';
import React from 'react';
import { BiLowVision, BiRefresh, BiShow, BiWorld, BiX } from 'react-icons/bi';
import { authStoreSelectors } from 'store/auth/auth.store';
import { docStoreActions, useDocStore } from 'store/doc/doc.store';
import { type DocsStoreOkState, useDocsStore } from 'store/docs/docs.store';
import c from 'classnames';
import { differenceInDays, formatDistance } from 'date-fns';
import { Tabs } from 'design-system/tabs';

interface DocsListModalProps {
  onClose?(): void;
}

const rangeFilters = [`Recent`, `Old`, `Really Old`] as const;

type RangeFilter = (typeof rangeFilters)[number];

const rangeLookup: Record<RangeFilter, [number, number]> = {
  Recent: [0, 7],
  Old: [7, 30],
  'Really Old': [30, Number.MAX_VALUE],
};

const DocsListModal = ({ onClose }: DocsListModalProps) => {
  const docsStore = useDocsStore();
  const docStore = useDocStore();
  const authStore = authStoreSelectors.useAuthorized();
  const [activeRange, setActiveRange] = React.useState<RangeFilter>(
    rangeFilters[0],
  );

  React.useEffect(() => {
    authStoreSelectors.authorized().getDocs();
  }, []);

  const selectDoc = (doc: Doc): void => {
    docStoreActions.setActive(doc);
    onClose?.();
  };

  const close = (): void => {
    if (docsStore.is === `busy`) return;

    onClose?.();
  };

  const docs = React.useMemo((): DocsStoreOkState['docs'] => {
    if (docsStore.is !== `ok`) return [];

    const now = new Date();

    return docsStore.docs.filter((doc) => {
      const diff = differenceInDays(now, doc.mdate);
      const [from, to] = rangeLookup[activeRange];

      return diff >= from && diff <= to;
    });
  }, [docsStore, activeRange]);

  return (
    <Modal onEscape={close}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h6 className="text-xl">Your Documents</h6>
        <div className="flex gap-2">
          <Button
            type="button"
            i={2}
            s={1}
            title="Sync documents"
            disabled={docsStore.is === `busy`}
            onClick={authStore.reloadDocs}
          >
            <BiRefresh />
          </Button>
          <Button
            type="button"
            i={2}
            s={1}
            disabled={docsStore.is === `busy`}
            title="Close your documents"
            onClick={close}
          >
            <BiX />
          </Button>
        </div>
      </div>
      {(docsStore.is === `idle` || docsStore.is === `busy`) && (
        <p className="text-2xl">Just a second (￣▽￣)...</p>
      )}
      {docsStore.is === `fail` && (
        <p className="text-xl text-red-600 dark:text-red-400 text-center">
          Something went wrong... Try again with <strong>above button</strong>
        </p>
      )}
      {docsStore.is === `ok` && (
        <>
          <Tabs className="mb-5">
            {rangeFilters.map((range) => (
              <Tabs.Item
                key={range}
                title={`Show "${range}" documents`}
                active={range === activeRange}
                onClick={() => setActiveRange(range)}
              >
                {range}
              </Tabs.Item>
            ))}
          </Tabs>
          {docs.length > 0 ? (
            <ul className="flex flex-col space-y-3">
              {docs.map((doc) => (
                <li
                  className={c(
                    `flex flex-col cursor-pointer border-2 rounded-lg px-4 py-3`,
                    docStore.is === `active` && docStore.id === doc.id
                      ? `bg-green-700 text-white border-green-700`
                      : `bg-zinc-200 dark:hover:bg-gray-900 dark:bg-gray-950 hover:bg-zinc-300 border-zinc-300 dark:border-zinc-800`,
                  )}
                  title={doc.name}
                  key={doc.id}
                  onClick={() => selectDoc(doc)}
                >
                  <div className="flex justify-between mb-0.5">
                    <span className="text-sm capitalize">
                      Edited{` `}
                      {formatDistance(new Date(), doc.mdate, {
                        addSuffix: true,
                      })}
                      {` `}
                      ago
                    </span>
                    {doc.visibility === `private` && (
                      <BiLowVision size="20" title="This document is private" />
                    )}
                    {doc.visibility === `public` && (
                      <BiShow size="20" title="This document is public" />
                    )}
                    {doc.visibility === `permanent` && (
                      <BiWorld size="20" title="This document is permanent" />
                    )}
                  </div>
                  <strong className="text-md">{doc.name}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <h6 className="p-4 text-center">
              No documents for selected filters
            </h6>
          )}
        </>
      )}
    </Modal>
  );
};

export default DocsListModal;
