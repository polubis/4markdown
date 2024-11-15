import React from 'react';

type CreatorDivideMode = 'both' | 'preview' | 'code';

const useCreatorDivide = () => {
  const [divideMode, setDivideMode] = React.useState<CreatorDivideMode>(`both`);

  const divide = (): void => {
    if (divideMode === `both`) {
      setDivideMode(`code`);
      return;
    }

    if (divideMode === `code`) {
      setDivideMode(`preview`);
      return;
    }

    setDivideMode(`both`);
  };

  return {
    divide,
    divideMode,
    setDivideMode,
  };
};

export { useCreatorDivide };
