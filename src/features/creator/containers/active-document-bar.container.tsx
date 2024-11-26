import { Button } from 'design-system/button';
import { useToggle } from 'development-kit/use-toggle';
import React from 'react';
import { BiCheck, BiDotsHorizontal, BiEdit, BiSave, BiX } from 'react-icons/bi';
import { useAuthStore } from 'store/auth/auth.store';
import { DocBarRow } from '../components/doc-bar-row';
import { YourDocumentsContainer } from './your-documents.container';
import { useForm } from 'development-kit/use-form';
import { useDocumentsCreatorState } from 'store/documents-creator';
import { selectActiveDocument } from 'store/documents-creator/selectors';
import { updateDocumentCodeAct } from 'acts/update-document-code.act';
import { updateDocumentNameAct } from 'acts/update-document-name.act';

const DocumentDetailsContainer = React.lazy(() =>
  import(`./document-details.container`).then((m) => ({
    default: m.DocumentDetailsContainer,
  })),
);

const DeleteDocumentModalContainer = React.lazy(() =>
  import(`./delete-document-modal.container`).then((m) => ({
    default: m.DeleteDocumentModalContainer,
  })),
);

const ActiveDocumentBarContainer = () => {
  const busy = useDocumentsCreatorState((state) => state.busy);
  const activeDocument = useDocumentsCreatorState(selectActiveDocument);
  const changed = useDocumentsCreatorState((state) => state.changed);

  const authStore = useAuthStore();
  const [{ values, invalid, untouched }, { inject, set, reconfigure }] =
    useForm({ name: activeDocument.name });
  const edition = useToggle();
  const morePopover = useToggle();
  const deleteModal = useToggle();

  const handleNameChangeConfirm: React.FormEventHandler<
    HTMLFormElement
  > = async (e) => {
    e.preventDefault();
    (await updateDocumentNameAct(values.name)).is === `ok` && edition.close();
  };

  const handleEditOpen: React.MouseEventHandler<HTMLButtonElement> = () => {
    reconfigure({ name: activeDocument.name });
    edition.open();
  };

  const handleEditClose: React.MouseEventHandler<HTMLButtonElement> = () => {
    edition.close();
    set({ name: `` });
  };

  React.useEffect(() => {
    reconfigure({ name: activeDocument.name });
  }, [activeDocument, reconfigure]);

  const nonInteractive = authStore.is !== `authorized` || busy;

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
            disabled={invalid || untouched || busy}
            title="Confirm name change"
            type="submit"
          >
            <BiCheck />
          </Button>
          <Button
            i={1}
            s={1}
            title="Close document name edition"
            disabled={busy}
            type="button"
            onClick={handleEditClose}
          >
            <BiX />
          </Button>
        </form>
      ) : (
        <DocBarRow title={activeDocument.name}>
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
            disabled={nonInteractive || !changed}
            title="Save changes"
            onClick={updateDocumentCodeAct}
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
          <DeleteDocumentModalContainer onClose={deleteModal.close} />
        </React.Suspense>
      )}
    </>
  );
};

export default ActiveDocumentBarContainer;
