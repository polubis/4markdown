import { Button } from 'design-system/button';
import { Field } from 'design-system/field';
import { Input } from 'design-system/input';
import { Modal } from 'design-system/modal';
import { Textarea } from 'design-system/textarea';
import React from 'react';

const CreateNodeModalContainer = () => {
  return (
    // onEscape={mindmapCreatorStoreActions.cancelMindmapCreation}
    <Modal disabled={false} onClose={() => {}}>
      <Modal.Header
        title="Add New Node"
        closeButtonTitle="Close node creation"
      />

      <p className="mb-4">
        By default, the mindmap will be created in{` `}
        <strong>private mode</strong>, meaning only you will be able to view it.
        You can change this at any time later
      </p>

      {/* <form onSubmit={handleConfirm}>
        <Field label={`Name (${values.name.length})*`} className="mt-2">
          <Input
            autoFocus
            placeholder="Type mindmap name"
            {...inject(`name`)}
          />
        </Field>
        <Field
          label={`Description (${values.description.length})`}
          className="mt-3"
        >
          <Textarea
            placeholder="Describe your mindmap in 3-4 sentences"
            {...inject(`description`)}
          />
        </Field>
        {creation.is === `fail` && (
          <p className="text-red-600 dark:text-red-400 mt-6 text-right">
            {creation.error.symbol === `invalid-schema`
              ? creation.error.content[0].message
              : creation.error.content}
          </p>
        )}
        <footer className="mt-6 flex">
          <Button
            className="ml-auto"
            type="button"
            i={1}
            s={2}
            disabled={creation.is === `busy`}
            auto
            onClick={mindmapCreatorStoreActions.cancelMindmapCreation}
          >
            Close
          </Button>
          <Button
            disabled={creation.is === `busy` || invalid}
            type="submit"
            className="ml-2"
            i={2}
            s={2}
            auto
          >
            Confirm
          </Button>
        </footer>
      </form> */}
    </Modal>
  );
};

export { CreateNodeModalContainer };
