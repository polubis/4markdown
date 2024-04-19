import { thumbnailRestrictions } from 'consts/image-restrictions';
import { Button } from 'design-system/button';
import { readFileAsBase64 } from 'development-kit/file-reading';
import {
  UseFileInputConfig,
  useFileInput,
} from 'development-kit/use-file-input';
import React from 'react';

interface ThumbnailInputProps {
  src: string;
  error: boolean;
  onChange(base64: string): void;
  onError?(): void;
}

const ThumbnailInput = ({
  src,
  error,
  onError,
  onChange,
}: ThumbnailInputProps) => {
  const handleChange: UseFileInputConfig['onChange'] = React.useCallback(
    async ({ target: { files } }) => {
      if (!files || files.length !== 1) return;

      try {
        const result = await readFileAsBase64(files[0]);
        onChange(result);
      } catch {
        onError?.();
      }
    },
    [onChange, onError],
  );

  const [upload] = useFileInput({
    accept: thumbnailRestrictions.type,
    maxSize: thumbnailRestrictions.size,
    onChange: handleChange,
    onError,
  });

  return (
    <div className="flex flex-col">
      <Button
        type="button"
        i={2}
        s={2}
        auto
        className="w-full"
        title="Add document thumbnail"
        onClick={upload}
      >
        {src ? (
          <img
            className="rounded-md"
            src={src}
            alt="Document thumbnail preview"
          />
        ) : (
          `One image (max 1MB size) with jpg, jpeg or png format`
        )}
      </Button>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          Please ensure that the image format is valid. Supported formats
          include <strong>{thumbnailRestrictions.type}</strong>, with a maximum
          file size of{` `}
          <strong>{thumbnailRestrictions.size} MB</strong>
        </p>
      )}
    </div>
  );
};

export type { ThumbnailInputProps };
export { ThumbnailInput };
