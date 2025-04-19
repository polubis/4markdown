import React from 'react';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';
import { Modal } from 'design-system/modal';
import { createDocumentAct } from 'acts/create-document.act';
import { startConversationAction } from 'store/document-generation/actions';
import {
  NewDocumentForm,
  type NewDocumentFormProps,
} from 'components/new-document-form';

type CreateDocumentModalContainerProps = {
  onClose(): void;
};

const CreateDocumentModalContainer = ({
  onClose,
}: CreateDocumentModalContainerProps) => {
  const [activeType, setActiveType] = React.useState<`ai` | `manual` | `none`>(
    `none`,
  );

  const docManagementStore = useDocManagementStore();

  const submitForm: NewDocumentFormProps['onSubmit'] = async (payload) => {
    if (payload.variant === `manual`) {
      const result = await createDocumentAct(payload.values);

      if (result.is === `ok`) {
        onClose();
      }

      return;
    }

    startConversationAction({
      ...payload.values,
      style: payload.values.style.split(`,`),
    });

    onClose();
  };

  return (
    <Modal disabled={docManagementStore.is === `busy`} onClose={onClose}>
      <Modal.Header
        title="Create Document"
        closeButtonTitle="Close document adding"
      />

      {activeType === `none` ? (
        <>
          <section className="flex flex-col gap-3">
            <button
              className="flex flex-col cursor-pointer hover:bg-zinc-300 dark:hover:bg-gray-900 p-3 rounded-md bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
              onClick={() => setActiveType(`manual`)}
            >
              <h6 className="capitalize text-left">Setup Things Manually</h6>
              <p className="mt-1 text-sm text-left">
                Adding document by providing its name
              </p>
            </button>
            <button
              className="flex flex-col cursor-pointer hover:bg-zinc-300 dark:hover:bg-gray-900 p-3 rounded-md bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
              onClick={() => setActiveType(`ai`)}
            >
              <h6 className="capitalize text-left">Generate With AI</h6>
              <p className="mt-1 text-sm text-left">
                Use AI to generate document. Provide structure, metadata and
                voilà!
              </p>
            </button>
          </section>
        </>
      ) : (
        <NewDocumentForm
          variant={activeType}
          disabled={docManagementStore.is === `busy`}
          onSubmit={submitForm}
          onBack={() => setActiveType(`none`)}
        />
      )}
    </Modal>
  );
};

export { CreateDocumentModalContainer };
