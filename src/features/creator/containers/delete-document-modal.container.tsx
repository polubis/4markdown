import { Button } from 'design-system/button';
import { Input } from 'design-system/input';
import Modal from 'design-system/modal';
import React from 'react';
import { BiX } from 'react-icons/bi';
import { useDocumentsCreatorState } from 'store/documents-creator';
import { deleteDocumentAct } from 'store/documents-creator/acts';
import { selectActiveDocument } from 'store/documents-creator/selectors';

const DeleteDocumentModalContainer = ({ onClose }: { onClose?(): void }) => {
  const busy = useDocumentsCreatorState((state) => state.busy);
  const activeDocument = useDocumentsCreatorState(selectActiveDocument);
  const [name, setName] = React.useState(``);

  const close = (): void => {
    if (busy) return;

    onClose?.();
  };

  const handleConfirm: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    (await deleteDocumentAct()).is === `ok` && close();
  };

  return (
    <Modal onEscape={close}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h6 className="text-xl">Document Removal</h6>
        <Button
          type="button"
          disabled={busy}
          i={2}
          s={1}
          title="Close document removal"
          onClick={close}
        >
          <BiX />
        </Button>
      </div>
      <form onSubmit={handleConfirm}>
        <p className="mb-4">
          Type <strong>{activeDocument.name}</strong> to remove this document
        </p>
        <fieldset className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Document Name*</label>
          <Input
            placeholder="Type document name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </fieldset>
        <footer className="mt-6 flex">
          <Button
            className="ml-auto"
            type="button"
            i={1}
            s={2}
            auto
            disabled={busy}
            title="Cancel document removal"
            onClick={close}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="ml-2"
            i={2}
            s={2}
            auto
            title="Confirm document removal"
            disabled={name !== activeDocument.name || busy}
          >
            Remove
          </Button>
        </footer>
      </form>
    </Modal>
  );
};

export { DeleteDocumentModalContainer };
