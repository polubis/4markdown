import React from 'react';

interface UseFileInputConfig {
  accept?: string;
  multiple?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onError?(): void;
}

const useFileInput = ({
  accept = ``,
  multiple = false,
  onChange,
  onError,
}: UseFileInputConfig) => {
  const ref = React.useRef<HTMLInputElement | null>(null);

  const handleChange = React.useCallback(
    (e: Event): void => {
      const input = ref.current;
      const event = e as unknown as React.ChangeEvent<HTMLInputElement>;

      if (input) {
        const { files } = event.target;
        const filesCount = files?.length ?? 0;
        const allowedTypes = accept.split(`, `);

        for (let i = 0; i < filesCount; i++) {
          const file = files?.item(i);

          if (!!file && !allowedTypes.includes(file.type)) {
            onError?.();
            return;
          }
        }

        onChange(event);

        input.removeEventListener(`change`, handleChange);
        input.remove();
      }
    },
    [accept, onError, onChange],
  );

  const upload = React.useCallback((): void => {
    ref.current = document.createElement(`input`);
    const input = ref.current;
    input.type = `file`;
    input.style.position = `fixed`;
    input.style.opacity = `0`;
    input.accept = accept;
    input.multiple = multiple;

    input.addEventListener(`change`, handleChange);
    input.click();
  }, [handleChange, multiple, accept]);

  React.useEffect(() => {
    const input = ref.current;

    return () => {
      input?.remove();
      input?.removeEventListener(`change`, handleChange);
    };
  }, [handleChange]);

  return [upload] as const;
};

export { useFileInput };
