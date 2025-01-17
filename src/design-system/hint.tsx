import React, { type ReactNode, type ComponentType } from 'react';
import { Modal } from './modal';
import c from 'classnames';
import {
  type SimpleFeature,
  useSimpleFeature,
} from 'development-kit/use-simple-feature';

interface HintProps {
  className?: string;
  content?: ComponentType<SimpleFeature>;
  trigger: ComponentType<SimpleFeature> | ReactNode;
}

const Hint = ({ className, trigger: Trigger, content: Content }: HintProps) => {
  const toggler = useSimpleFeature();

  return (
    <>
      <i className={c(`text-sm`, className)}>
        {typeof Trigger === `function` ? <Trigger {...toggler} /> : Trigger}
      </i>
      {toggler.isOn && Content && (
        <Modal onClose={toggler.off}>
          <Content {...toggler} />
        </Modal>
      )}
    </>
  );
};

export type { HintProps };
export { Hint };
