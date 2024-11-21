import React, { type FormEventHandler } from 'react';
import { Button } from 'design-system/button';
import { BiPlusCircle, BiX } from 'react-icons/bi';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';
import { Input } from 'design-system/input';
import { useForm } from 'development-kit/use-form';
import { createDocument } from 'store/creator/create-document.action';
import type { API4MarkdownPayload } from 'api-4markdown-contracts';
import { Field } from 'design-system/field';
import { Hint } from 'design-system/hint';
import Modal from 'design-system/modal';

type CreateDocumentModalProps = {
  onClose(): void;
};

const CreateDocumentModal = ({ onClose }: CreateDocumentModalProps) => {
  const docManagementStore = useDocManagementStore();
  const [{ invalid, values, untouched }, { inject }] = useForm<
    Pick<API4MarkdownPayload<'createDocument'>, 'name'>
  >({ name: `` });

  const close = (): void => {
    if (docManagementStore.is === `busy`) return;

    onClose();
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      await createDocument(values);
      close();
    } catch {}
  };

  return (
    <Modal onEscape={close}>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="flex items-center mb-4">
          <h6 className="text-xl mr-8">Create Document</h6>
          <Button
            type="button"
            i={2}
            s={1}
            title="Close document adding"
            className="ml-auto"
            disabled={docManagementStore.is === `busy`}
            onClick={close}
          >
            <BiX />
          </Button>
        </div>
        <Field
          label="Document Name*"
          hint={
            <Hint
              trigger={
                <>
                  Document will be created in <strong>private</strong> mode.
                  Visible only to you, but <strong>not encrypted</strong> -
                  avoid sensitive data
                </>
              }
            />
          }
        >
          <Input
            placeholder={`My Notes, Basics of Computer Science, ...etc`}
            {...inject(`name`)}
          />
        </Field>
        <Button
          type="submit"
          i={2}
          s={2}
          className="mt-6"
          auto
          title="Confirm document creation"
          disabled={untouched || invalid || docManagementStore.is === `busy`}
        >
          Create
          <BiPlusCircle />
        </Button>
      </form>
    </Modal>
  );
};

export { CreateDocumentModal };
