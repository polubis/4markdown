import React, { type ReactNode, type ComponentType } from 'react';
import type { ToggleReturn } from 'development-kit/use-toggle';
import { useToggle } from 'development-kit/use-toggle';
import { Modal } from './modal';
import c from 'classnames';

interface HintProps {
  className?: string;
  content?: ComponentType<ToggleReturn>;
  trigger: ComponentType<ToggleReturn> | ReactNode;
}

const Hint = ({ className, trigger: Trigger, content: Content }: HintProps) => {
  const toggler = useToggle();

  return (
    <>
      <i className={c(`text-sm`, className)}>
        {typeof Trigger === `function` ? <Trigger {...toggler} /> : Trigger}
      </i>
      {toggler.opened && Content && (
        <Modal onClose={toggler.close}>
          <Content {...toggler} />
        </Modal>
      )}
    </>
  );
};

export type { HintProps };
export { Hint };
