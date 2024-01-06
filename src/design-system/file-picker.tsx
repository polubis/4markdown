import React from 'react';
import c from 'classnames';
import { Button } from './button';
import { useToggle } from 'development-kit/use-toggle';

type FilePickerPreview = string;
type FilePickerPreviewList = FilePickerPreview[];
type FilePickerFiles = FileList | null;

interface FilePickerProps {
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
  accept?: string;
  invalid?: boolean;
  loading?: boolean;
  preview: FilePickerPreviewList;
  onChange?(files: FilePickerFiles, preview: FilePickerPreviewList): void;
  onRemove?(src: FilePickerPreview): void;
}

const loadImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result !== `string`) {
        reject(Error(`Cannot load preview of the file`));
        return;
      }

      resolve(reader.result);
    };

    reader.readAsDataURL(file);
  });
};

const loadPreview = async (
  e: React.ChangeEvent<HTMLInputElement>,
): Promise<[FilePickerFiles, FilePickerPreviewList]> => {
  const { files } = e.target;

  if (!files) {
    return [null, []];
  }

  const promises: Promise<string>[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    promises.push(loadImage(file));
  }

  const preview = await Promise.all(promises);

  return [files, preview];
};

const FilePicker = ({
  className,
  disabled,
  multiple,
  preview,
  loading,
  invalid,
  accept,
  onRemove,
  onChange,
}: FilePickerProps) => {
  const confirm = useToggle<string>();
  const pending = useToggle();
  const inputRef = React.useRef<React.ElementRef<'input'>>(null);

  const busy = pending.opened || loading;
  const previewing = preview.length > 0;
  const blocked = disabled || busy;

  const handleClick = (): void => {
    if (blocked) return;

    inputRef.current?.click();
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    pending.open();

    const result = await loadPreview(e);

    pending.close();
    onChange?.(...result);
  };

  const handlePreviewImageClick = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    src: FilePickerPreview,
  ) => {
    e.stopPropagation();

    if (blocked) return;

    confirm.openWithData(src);
  };

  const handleConfirmRemoval = (): void => {
    if (!confirm.data) {
      throw Error(`Preview data missing`);
    }

    onRemove?.(confirm.data);
    confirm.close();
  };

  return (
    <div className={c(className)}>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
        accept={accept}
        multiple={multiple}
      />
      <div className="flex flex-wrap gap-1">
        {preview.map((src) => (
          <img
            alt="File picker preview"
            key={src}
            src={src}
            title="File picker preview"
            onClick={(e) => handlePreviewImageClick(e, src)}
          />
        ))}
      </div>
      {previewing || (
        <Button
          type="button"
          disabled={blocked}
          auto
          s={2}
          i={2}
          onClick={handleClick}
        >
          Choose a file
        </Button>
      )}
    </div>
  );
};

export type { FilePickerPreviewList, FilePickerFiles };
export { FilePicker };
