const isInvalidSelection = ({
  selectionStart,
  selectionEnd,
}: {
  selectionStart: number;
  selectionEnd: number;
}): boolean => {
  return (
    selectionStart === selectionEnd || selectionStart < 0 || selectionEnd < 0
  );
};

const getSelectedText = ({
  value,
  selectionStart,
  selectionEnd,
}: {
  selectionStart: number;
  selectionEnd: number;
  value: string;
}): string | null => {
  if (isInvalidSelection({ selectionStart, selectionEnd })) {
    return null;
  }

  return value.slice(selectionStart, selectionEnd);
};

const replaceText = ({
  selectionStart,
  selectionEnd,
  value,
  valueToReplace,
}: {
  selectionStart: number;
  selectionEnd: number;
  value: string;
  valueToReplace: string;
}): string => {
  if (isInvalidSelection({ selectionStart, selectionEnd })) {
    return value;
  }

  return (
    value.slice(0, selectionStart) + valueToReplace + value.slice(selectionEnd)
  );
};

export { replaceText, getSelectedText, isInvalidSelection };
