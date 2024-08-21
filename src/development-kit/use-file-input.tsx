import {
  type ChangeEventHandler,
  type ChangeEvent,
  useRef,
  useCallback,
  useEffect,
} from 'react';

interface UseFileInputConfig {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onError?(): void;
}

const useFileInput = ({
  accept = ``,
  multiple = false,
  maxSize = 10,
  onChange,
  onError,
}: UseFileInputConfig) => {
  const ref = useRef<HTMLInputElement | null>(null);

  const handleChange = useCallback(
    (e: Event): void => {
      const input = ref.current;
      const event = e as unknown as ChangeEvent<HTMLInputElement>;

      if (input) {
        const { files } = event.target;
        const filesCount = files?.length ?? 0;
        const allowedTypes = accept.split(`,`).map((type) => type.trim());

        for (let i = 0; i < filesCount; i++) {
          const file = files?.item(i);

          if (file) {
            const sizeAsMegabytes = file.size / 1024 / 1024;

            if (
              !allowedTypes.includes(file.type) ||
              sizeAsMegabytes > maxSize
            ) {
              onError?.();
              return;
            }
          }
        }

        onChange(event);

        input.removeEventListener(`change`, handleChange);
        input.remove();
      }
    },
    [accept, maxSize, onError, onChange],
  );

  const upload = useCallback((): void => {
    ref.current = document.createElement(`input`);
    const input = ref.current;
    input.type = `file`;
    input.accept = accept;
    input.multiple = multiple;

    input.addEventListener(`change`, handleChange);
    input.click();
  }, [handleChange, multiple, accept]);

  useEffect(() => {
    const input = ref.current;

    return () => {
      input?.remove();
      input?.removeEventListener(`change`, handleChange);
    };
  }, [handleChange]);

  return [upload] as const;
};

export type { UseFileInputConfig };
export { useFileInput };
