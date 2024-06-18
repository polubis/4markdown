import c from 'classnames';
import ErrorModal from 'components/error-modal';
import { makeDocPermamentSchema } from 'core/validators/doc-validators';
import { Button } from 'design-system/button';
import { Field } from 'design-system/field';
import { Input } from 'design-system/input';
import { Textarea } from 'design-system/textarea';
import { readFileAsBase64 } from 'development-kit/file-reading';
import { useFileInput } from 'development-kit/use-file-input';
import { useForm } from 'development-kit/use-form';
import { useToggle } from 'development-kit/use-toggle';
import { DocThumbnailAction } from 'models/doc';
import { Path } from 'models/general';
import React from 'react';
import { BiX } from 'react-icons/bi';
import { authStoreSelectors } from 'store/auth/auth.store';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';
import { docStoreSelectors } from 'store/doc/doc.store';

interface PermamentDocFormContainerProps {
  onConfirm(): void;
  onClose(): void;
  onBack(): void;
}

const thumbnailFormats = [`png`, `jpeg`, `jpg`, `webp`] as const;
const thumbnailRestrictions = {
  type: thumbnailFormats.map((extension) => `image/${extension}`).join(`, `),
  size: 2,
};

type PermanentDocFormData = {
  name: string;
  description: string;
  tags: string;
  thumbnail: DocThumbnailAction;
};

const PermamentDocFormContainer = ({
  onConfirm,
  onClose,
  onBack,
}: PermamentDocFormContainerProps) => {
  const docStore = docStoreSelectors.active();
  const thumbnailErrorModal = useToggle();
  const docManagementStore = useDocManagementStore();
  const [thumbnailPreview, setThumbnailPreview] = React.useState<Path>(
    docStore.visibility === `permanent` ? docStore.thumbnail?.md.src ?? `` : ``,
  );
  const [{ invalid, values, result, untouched }, { inject, set }] =
    useForm<PermanentDocFormData>(
      {
        name: docStore.name,
        description:
          docStore.visibility === `permanent` ? docStore.description : ``,
        tags:
          docStore.visibility === `permanent` ? docStore.tags.join(`,`) : ``,
        thumbnail: { type: `noop` },
      },
      makeDocPermamentSchema,
    );

  const { name, description, tags, thumbnail } = values;

  const [uploadThumbnail] = useFileInput({
    accept: thumbnailRestrictions.type,
    maxSize: thumbnailRestrictions.size,
    onChange: ({ target: { files } }) => {
      const uploadAndOpen = async (): Promise<void> => {
        if (!!files && files.length === 1) {
          try {
            const thumbnail = await readFileAsBase64(files[0]);
            setThumbnailPreview(thumbnail);
            set({
              thumbnail: {
                type: `update`,
                data: thumbnail,
              },
            });
          } catch {
            thumbnailErrorModal.open();
          }
        }
      };

      uploadAndOpen();
    },
    onError: thumbnailErrorModal.open,
  });

  const handleConfirm: React.FormEventHandler<HTMLFormElement> = async (
    e,
  ): Promise<void> => {
    e.preventDefault();

    try {
      await authStoreSelectors
        .authorized()
        .makeDocPermanent(name, description, tags.split(`,`), thumbnail);
      onConfirm();
    } catch {}
  };

  const removeThumbnail = (): void => {
    setThumbnailPreview(``);
    set({
      thumbnail:
        docStore.visibility === `permanent` && docStore.thumbnail
          ? {
              type: `remove`,
            }
          : { type: `noop` },
    });
  };

  if (thumbnailErrorModal.opened) {
    return (
      <ErrorModal.Content
        heading="Invalid thumbnail"
        message={
          <>
            Please ensure that the thumbnail format is valid. Supported formats
            include <strong>{thumbnailFormats.join(`, `)}</strong>, with a
            maximum file size of{` `}
            <strong>{thumbnailRestrictions.size} megabytes</strong>
          </>
        }
        onClose={thumbnailErrorModal.close}
      />
    );
  }

  return (
    <form className="flex flex-col" onSubmit={handleConfirm}>
      <header className="flex items-center mb-4">
        <h6 className="text-xl mr-4">Add Required Data</h6>
        <Button
          i={2}
          s={1}
          className="ml-auto"
          disabled={docManagementStore.is === `busy`}
          title="Close document permanent status change"
          onClick={onClose}
        >
          <BiX />
        </Button>
      </header>
      <Field label="Thumbnail" className="mt-2">
        <Button
          className={c({
            'p-6': !thumbnailPreview,
          })}
          type="button"
          i={2}
          s="auto"
          auto
          title="Thumbnail field"
          onClick={uploadThumbnail}
        >
          {thumbnailPreview ? (
            <img
              className="rounded-md h-[160px] w-full object-cover"
              src={thumbnailPreview}
            />
          ) : (
            `Add thumbnail`
          )}
        </Button>
        {thumbnailPreview && (
          <Button
            type="button"
            auto
            className="mt-2 mb-2 ml-auto"
            disabled={docManagementStore.is === `busy`}
            s={1}
            i={2}
            onClick={removeThumbnail}
          >
            Remove
          </Button>
        )}
      </Field>
      <Field label={`Name (${name.length})*`} className="mt-2">
        <Input autoFocus placeholder="Type document name" {...inject(`name`)} />
      </Field>
      <Field label={`Description (${description.length})*`} className="mt-3">
        <Textarea
          placeholder="Describe your document in 3-4 sentences. The description will be displayed in Google"
          {...inject(`description`)}
        />
      </Field>
      <Field
        label={result.tags ? `Tags*` : `Tags (${tags.split(`,`).length})*`}
        className="mt-2"
        hint="It may be React, Angular, Vue and others..."
      >
        <Input placeholder="Separate tags with a comma" {...inject(`tags`)} />
      </Field>
      <footer className="mt-6 flex">
        <Button
          className="ml-auto"
          type="button"
          i={1}
          s={2}
          auto
          title="Back to document status confirmation"
          disabled={docManagementStore.is === `busy`}
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="ml-2"
          i={2}
          s={2}
          auto
          disabled={invalid || untouched || docManagementStore.is === `busy`}
          title="Make document permanent"
        >
          Confirm
        </Button>
      </footer>
    </form>
  );
};

export { PermamentDocFormContainer };
