import { Button } from "design-system/button";
import { Field } from "design-system/field";
import { Hint } from "design-system/hint";
import { Input } from "design-system/input";
import { Textarea } from "design-system/textarea";
import { Modal2 } from "design-system/modal2";
import { useForm } from "development-kit/use-form";
import React from "react";
import { useDocManagementStore } from "store/doc-management/doc-management.store";
import { docStoreSelectors } from "store/doc/doc.store";
import { updateDocumentVisibility } from "actions/update-document-visibility.action";
import { SeoFriendlyDescriptionHint } from "../components/seo-friendly-description-hint";

type PermamentDocFormContainerProps = {
  onConfirm(): void;
  onBack(): void;
};

const PermamentDocFormContainer = ({
  onConfirm,
  onBack,
}: PermamentDocFormContainerProps) => {
  const docStore = docStoreSelectors.active();
  const docManagementStore = useDocManagementStore();
  const [{ invalid, values, untouched }, { inject }] = useForm({
    name: docStore.name,
    description:
      docStore.visibility === `permanent` ? docStore.description : ``,
    tags: docStore.visibility === `permanent` ? docStore.tags.join(`,`) : ``,
  });

  const { name, description, tags } = values;

  const disabled = docManagementStore.is === `busy`;

  const handleConfirm = async (): Promise<void> => {
    try {
      await updateDocumentVisibility({
        name,
        description,
        tags: tags.split(`,`),
        visibility: `permanent`,
      });
      onConfirm();
    } catch {}
  };

  const splittedTags = React.useMemo(
    () =>
      values.tags
        .split(`,`)
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0).length,
    [values.tags],
  );

  return (
    <>
      <Modal2.Header
        title="Add Required Data"
        closeButtonTitle="Close document permanent status change"
      />
      <Modal2.Body>
        <Field
          label={`Name (${name.length})*`}
          hint={<Hint trigger="3-15 separate words, and max 70 characters" />}
        >
          <Input
            autoFocus
            placeholder="Type document name"
            {...inject(`name`)}
          />
        </Field>
        <Field
          label={`Description (${description.length})*`}
          className="mt-3"
          hint={<SeoFriendlyDescriptionHint />}
        >
          <Textarea
            placeholder="The description will be displayed in Google and under document"
            {...inject(`description`)}
          />
        </Field>
        <Field
          label={splittedTags === 0 ? `Tags*` : `Tags (${splittedTags})*`}
          className="mt-2"
          hint={<Hint trigger={`Comma-separated, 1-10 tags, each unique`} />}
        >
          <Input
            placeholder="React, ruby-on-rails, c++, c# ...etc"
            {...inject(`tags`)}
          />
        </Field>
      </Modal2.Body>
      <Modal2.Footer className="flex space-x-3 w-full">
        <Button
          type="button"
          i={1}
          s={2}
          className="flex-1"
          auto
          title="Back to document status confirmation"
          disabled={disabled}
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          i={2}
          s={2}
          auto
          className="flex-1"
          disabled={invalid || untouched || disabled}
          onClick={handleConfirm}
          title="Make document permanent"
        >
          Confirm
        </Button>
      </Modal2.Footer>
    </>
  );
};

export { PermamentDocFormContainer };
