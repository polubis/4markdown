import { makeDocPermamentSchema } from 'core/validators/doc-validators';
import { Button } from 'design-system/button';
import { Field } from 'design-system/field';
import { Hint } from 'design-system/hint';
import { Input } from 'design-system/input';
import { Textarea } from 'design-system/textarea';
import { useForm } from 'development-kit/use-form';
import React, { type FormEventHandler } from 'react';
import { BiX } from 'react-icons/bi';
import { authStoreSelectors } from 'store/auth/auth.store';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';
import { docStoreSelectors } from 'store/doc/doc.store';
import { SeoFriendlyDescriptionHint } from '../components/seo-friendly-description-hint';
import c from 'classnames';
import type { ImageAction, Path } from 'api-4markdown-contracts';
import { useFileInput } from 'development-kit/use-file-input';
import { readFileAsBase64 } from 'development-kit/file-reading';
import { useToggle } from 'development-kit/use-toggle';

type PermamentDocFormContainerProps = {
  onConfirm(): void;
  onClose(): void;
  onBack(): void;
};

type PermanentDocFormData = {
  name: string;
  description: string;
  tags: string;
  thumbnail: ImageAction;
};

const thumbnailFormats = [`png`, `jpeg`, `jpg`, `webp`, `avif`] as const;
const thumbnailRestrictions = {
  type: thumbnailFormats.map((extension) => `image/${extension}`).join(`, `),
  size: 2,
};

const PermamentDocFormContainer = ({
  onConfirm,
  onClose,
  onBack,
}: PermamentDocFormContainerProps) => {
  const docStore = docStoreSelectors.active();
  const docManagementStore = useDocManagementStore();
  const thumbnailErrorModal = useToggle();
  const [thumbnailPreview, setThumbnailPreview] = React.useState<Path>(() =>
    docStore.visibility === `permanent`
      ? (docStore.thumbnails?.[0].variants.md.src ?? ``)
      : ``,
  );

  const [{ invalid, values, result, untouched }, { inject, set }] =
    useForm<PermanentDocFormData>(
      {
        // @TODO[PRIO=3]: [This should be handled via function].
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

  const handleConfirm: FormEventHandler<HTMLFormElement> = async (
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
        docStore.visibility === `permanent` &&
        Array.isArray(docStore.thumbnails)
          ? {
              type: `remove`,
            }
          : { type: `noop` },
    });
  };

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
      <Field label={`Name (${name.length})*`} className="mt-2">
        <Input autoFocus placeholder="Type document name" {...inject(`name`)} />
      </Field>
      <Field
        label={`Description (${description.length})*`}
        className="mt-3"
        hint={<SeoFriendlyDescriptionHint />}
      >
        <Textarea
          placeholder="Describe your document in 3-4 sentences. The description will be displayed in Google"
          {...inject(`description`)}
        />
      </Field>
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
      <Field
        label={result.tags ? `Tags*` : `Tags (${tags.split(`,`).length})*`}
        className="mt-2"
        hint={<Hint trigger="It may be React, Angular, Vue and others..." />}
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
