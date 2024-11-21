import React from 'react';
import { useCreatorDivide } from './use-creator-divide';
import { useConfirm } from 'development-kit/use-confirm';

// @TODO[PRIO=4]: [Change code to content].
const useCreatorManagement = ({
  code,
  initialCode,
  onChange,
}: {
  code: string;
  initialCode: string;
  onChange: (code: string) => void;
}) => {
  const { divide, divideMode, setDivideMode } = useCreatorDivide();
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  const creatorRef = React.useRef<HTMLTextAreaElement>(null);

  const clearConfirm = useConfirm(() => onChange(``));
  const resetConfirm = useConfirm(() => onChange(initialCode));

  const scrollToHeading = async (input: HTMLTextAreaElement): Promise<void> => {
    const DESKTOP_WIDTH = 1024;

    if (divideMode !== `both` || window.innerWidth < DESKTOP_WIDTH) {
      return;
    }

    const { scrollToMarkdownHeading } = await import(
      `./scroll-to-markdown-heading`
    );

    scrollToMarkdownHeading(input);
  };

  const maintainTabs: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    const target = e.target as HTMLTextAreaElement;

    scrollToHeading(target);

    if (e.key !== `Tab`) {
      return;
    }

    e.preventDefault();

    const start = target.selectionStart;
    const end = target.selectionEnd;

    const newValue =
      code.substring(0, start) + ` ` + ` ` + ` ` + ` ` + code.substring(end);

    onChange(newValue);

    target.selectionStart = target.selectionEnd = start + 1;
  };

  const changeCode: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const timeout = timeoutRef.current;

    timeout && clearTimeout(timeout);

    timeoutRef.current = setTimeout(() => {
      onChange(e.target.value);
    }, 750);
  };

  React.useEffect(() => {
    const creatorField = creatorRef.current;

    if (creatorField) {
      creatorField.value = code;
    }
  }, [code, divideMode]);

  React.useEffect(() => {
    const timeout = timeoutRef.current;

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, []);

  return {
    divideMode,
    clearConfirm,
    creatorRef,
    resetConfirm,
    changeCode,
    maintainTabs,
    setDivideMode,
    divide,
    scrollToHeading,
  };
};

export { useCreatorManagement };
