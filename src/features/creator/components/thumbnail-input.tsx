import { Button } from 'design-system/button';
import { readFileAsBase64 } from 'development-kit/file-reading';
import {
  UseFileInputConfig,
  useFileInput,
} from 'development-kit/use-file-input';
import React from 'react';

interface ThumbnailInputProps extends Omit<UseFileInputConfig, 'onChange'> {
  src: string;
  error?: string;
  onChange(base64: string): void;
}

const ThumbnailInput = ({
  src,
  multiple,
  accept,
  maxSize,
  error,
  onError,
  onChange,
}: ThumbnailInputProps) => {
  const handleChange: UseFileInputConfig['onChange'] = React.useCallback(
    async ({ target: { files } }) => {
      if (multiple) {
        return;
      }

      if (!files || files.length !== 1) return;

      try {
        const result = await readFileAsBase64(files[0]);
        onChange(result);
      } catch {
        onError?.();
      }
    },
    [onChange, onError, multiple],
  );

  const [upload] = useFileInput({
    accept,
    maxSize,
    multiple,
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
            className="rounded-md w-8 h-8 object-cover"
            src={src}
            alt="Files preview"
          />
        ) : (
          `Add document thumbnail`
        )}
      </Button>
      {error && <p className="mt-1 text-red-500">{error}</p>}
    </div>
  );
};

export type { ThumbnailInputProps };
export { ThumbnailInput };
