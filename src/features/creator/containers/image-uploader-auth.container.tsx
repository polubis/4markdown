import { Button } from 'design-system/button';
import { Modal } from 'design-system/modal';
import { useFileInput } from 'development-kit/use-file-input';
import React from 'react';
import ErrorModal from 'components/error-modal';
import { useCopy } from 'development-kit/use-copy';
import { Status } from 'design-system/status';
import { IMAGE_EXTENSIONS } from 'api-4markdown-contracts';
import { uploadImageAct } from 'acts/upload-image.act';
import { useUploadImageState } from 'store/upload-image';
import { UploadImageButton } from '../components/upload-image-button';
import { readFileAsBase64 } from 'development-kit/file-reading';
import { useComboPress } from 'development-kit/use-combo-press';

const IMAGE_RULES = {
  type: IMAGE_EXTENSIONS.map((extension) => `image/${extension}`).join(`, `),
  size: 4,
} as const;

const readImageAsBase64FromClipboard = async (): Promise<string | null> => {
  const clipboardItems = await navigator.clipboard.read();

  for (const item of clipboardItems) {
    if (
      item.types.includes(`image/png`) ||
      item.types.includes(`image/jpeg`) ||
      item.types.includes(`image/jpg`) ||
      item.types.includes(`image/gif`) ||
      item.types.includes(`image/webp`)
    ) {
      const blob = await item.getType(item.types[0]);
      return await readFileAsBase64(blob);
    }
  }

  return null;
};

const ImageUploaderAuthContainer = () => {
  const uploadImageStatus = useUploadImageState();
  const [copyState, copy] = useCopy();

  useComboPress([`control`, `v`], async () => {
    if (uploadImageStatus.is !== `idle`) return;

    const image = await readImageAsBase64FromClipboard();

    if (!image) return;

    await uploadImageAct(image);
  });

  const [upload] = useFileInput({
    accept: IMAGE_RULES.type,
    maxSize: IMAGE_RULES.size,
    onChange: async ({ target: { files } }) => {
      if (!!files && files.length === 1) {
        await uploadImageAct(await readFileAsBase64(files[0]));
      }
    },
    onError: () =>
      useUploadImageState.swap({
        is: `fail`,
        error: { symbol: `unknown`, content: `Unknown`, message: `Unknown` },
      }),
  });

  const copyAndClose = (): void => {
    if (uploadImageStatus.is !== `ok`)
      throw Error(`There is no data assigned to image modal`);

    copy(`![Alt](${uploadImageStatus.url})\n*Description*`);

    useUploadImageState.reset();
  };

  return (
    <>
      {copyState.is === `copied` && <Status>Image copied</Status>}

      {uploadImageStatus.is === `busy` && <Status>Uploading image...</Status>}

      {uploadImageStatus.is === `ok` && (
        <Modal onClose={useUploadImageState.reset}>
          <Modal.Header
            title="Image uploaded ✅"
            closeButtonTitle="Close image upload"
          />
          <p>
            To use <strong>uploaded image</strong> in markdown editor click
            below button.
          </p>
          <Button
            title="Copy image link"
            className="capitalize mt-8 ml-auto"
            auto
            s={2}
            i={2}
            onClick={copyAndClose}
          >
            Copy Link
          </Button>
        </Modal>
      )}

      {uploadImageStatus.is === `fail` && (
        <ErrorModal
          heading="Invalid image"
          message={
            <>
              Please ensure that the image format is valid. Supported formats
              include <strong>{IMAGE_RULES.type}</strong>, with a maximum file
              size of{` `}
              <strong>{IMAGE_RULES.size} megabytes</strong>
            </>
          }
          onClose={useUploadImageState.reset}
        />
      )}

      <UploadImageButton
        disabled={uploadImageStatus.is === `busy`}
        onClick={upload}
      />
    </>
  );
};

export { ImageUploaderAuthContainer };
