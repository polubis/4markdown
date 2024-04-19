import { thumbnailRestrictions } from 'consts/image-restrictions';
import { Button } from 'design-system/button';
import { readFileAsBase64 } from 'development-kit/file-reading';
import {
  UseFileInputConfig,
  useFileInput,
} from 'development-kit/use-file-input';
import React from 'react';

interface ThumbnailInputProps
  extends Omit<UseFileInputConfig, 'onChange' | 'multiple'> {
  src: string;
  error?: React.ReactNode;
  onChange(base64: string): void;
}

const ThumbnailInput = ({
  src,
  accept,
  maxSize,
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
    accept,
    maxSize,
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
          `Add document thumbnail`
        )}
      </Button>
      {error ? (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : (
        <p className="text-sm mt-1">
          Max {thumbnailRestrictions.size} MB {thumbnailRestrictions.type}
        </p>
      )}
    </div>
  );
};

export type { ThumbnailInputProps };
export { ThumbnailInput };
