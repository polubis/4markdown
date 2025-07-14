import React from "react";

const usePrevious = <TValue>(value: TValue): TValue => {
  const ref = React.useRef(value);

  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export { usePrevious };
