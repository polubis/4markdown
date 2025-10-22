import React, { type ReactNode, type ComponentType } from "react";
import c from "classnames";
import { useSimpleFeature } from "@greenonsoftware/react-kit";

type SimpleFeature = ReturnType<typeof useSimpleFeature>;

interface HintProps {
  className?: string;
  trigger: ComponentType<SimpleFeature> | ReactNode;
}

const Hint = ({ className, trigger: Trigger }: HintProps) => {
  const toggler = useSimpleFeature();

  return (
    <i className={c(`text-sm`, className)}>
      {typeof Trigger === `function` ? <Trigger {...toggler} /> : Trigger}
    </i>
  );
};

export type { HintProps };
export { Hint };
