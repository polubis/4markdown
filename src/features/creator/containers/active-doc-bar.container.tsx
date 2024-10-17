import { Button } from 'design-system/button';
import { useToggle } from 'development-kit/use-toggle';
import React from 'react';
import { BiCheck, BiDotsHorizontal, BiEdit, BiSave, BiX } from 'react-icons/bi';
import { authStoreSelectors, useAuthStore } from 'store/auth/auth.store';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';
import type { DocStoreActiveState } from 'store/doc/doc.store';
import { docStoreSelectors } from 'store/doc/doc.store';
import { useDocsStore } from 'store/docs/docs.store';
import { DocBarRow } from '../components/doc-bar-row';
import { YourDocumentsContainer } from './your-documents.container';
import { creatorStoreSelectors } from 'store/creator/creator.store';
import { useForm } from 'development-kit/use-form';
import {
  updateDocNameSchema,
  updatePermamentDocNameSchema,
} from 'core/validators/doc-validators';
import { updateDocumentName } from '../store/update-document-name.action';

const DocumentDetailsContainer = React.lazy(
  () => import(`./document-details.container`),
);
const DeleteDocModal = React.lazy(
  () => import(`../../../components/delete-doc-modal`),
);

const getSchema = (docStore: DocStoreActiveState) =>
  docStore.visibility === `permanent`
    ? updatePermamentDocNameSchema
    : updateDocNameSchema;

const ActiveDocBarContainer = () => {
  const docManagementStore = useDocManagementStore();
  const docStore = docStoreSelectors.useActive();
  const docsStore = useDocsStore();
  const authStore = useAuthStore();
  const creatorStore = creatorStoreSelectors.useReady();
  const [{ values, invalid, untouched }, { inject, set, reconfigure }] =
    useForm({ name: docStore.name }, getSchema(docStore));
  const edition = useToggle();
  const morePopover = useToggle();
  const deleteModal = useToggle();

  const handleNameChangeConfirm: React.FormEventHandler<
    HTMLFormElement
  > = async (e) => {
    e.preventDefault();
    try {
      await updateDocumentName(values.name);
      edition.close();
    } catch {}
  };

  const handleSaveCodeConfirm = async (): Promise<void> => {
    await authStoreSelectors.authorized().updateDocumentCode();
  };

  const handleEditOpen: React.MouseEventHandler<HTMLButtonElement> = () => {
    set({ name: docStore.name });
    edition.open();
  };

  const handleEditClose: React.MouseEventHandler<HTMLButtonElement> = () => {
    edition.close();
    set({ name: `` });
  };

  React.useEffect(() => {
    reconfigure({ name: docStore.name }, getSchema(docStore));
  }, [docStore, reconfigure]);

  const nonInteractive =
    authStore.is !== `authorized` ||
    docManagementStore.is === `busy` ||
    docsStore.is === `busy`;

  return (
    <>
      {edition.opened ? (
        <form className="flex items-center" onSubmit={handleNameChangeConfirm}>
          <input
            className="w-full px-3 py-1 placeholder:text-gray-600 dark:placeholder:text-gray-300 text-sm rounded-md bg-gray-300 dark:bg-slate-800 border-[2.5px] border-transparent focus:border-black focus:dark:border-white outline-none"
            autoFocus
            placeholder="Type document name*"
            {...inject(`name`)}
          />
          <Button
            i={1}
            s={1}
            className="mr-1 ml-3"
            disabled={invalid || untouched || docManagementStore.is === `busy`}
            title="Confirm name change"
            type="submit"
          >
            <BiCheck />
          </Button>
          <Button
            i={1}
            s={1}
            title="Close document name edition"
            disabled={docManagementStore.is === `busy`}
            type="button"
            onClick={handleEditClose}
          >
            <BiX />
          </Button>
        </form>
      ) : (
        <DocBarRow title={docStore.name}>
          <Button
            i={1}
            s={1}
            title="Change document name"
            disabled={nonInteractive}
            onClick={handleEditOpen}
          >
            <BiEdit />
          </Button>
          <Button
            i={1}
            s={1}
            disabled={nonInteractive || !creatorStore.changed}
            title="Save changes"
            onClick={handleSaveCodeConfirm}
          >
            <BiSave />
          </Button>
          <YourDocumentsContainer />
          <Button
            i={1}
            s={1}
            disabled={nonInteractive}
            title="More document options"
            onClick={morePopover.open}
          >
            <BiDotsHorizontal />
          </Button>
        </DocBarRow>
      )}

      {morePopover.opened && (
        <React.Suspense>
          <DocumentDetailsContainer
            onOpen={() => {
              deleteModal.open();
              morePopover.close();
            }}
            onClose={morePopover.close}
          />
        </React.Suspense>
      )}

      {deleteModal.opened && (
        <React.Suspense>
          <DeleteDocModal onClose={deleteModal.close} />
        </React.Suspense>
      )}
    </>
  );
};

export default ActiveDocBarContainer;
