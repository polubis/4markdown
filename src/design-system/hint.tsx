import { ToggleReturn, useToggle } from 'development-kit/use-toggle';
import React from 'react';
import Modal from './modal';
import c from 'classnames';

interface HintProps {
  className?: string;
  content?: React.ComponentType<ToggleReturn>;
  trigger: ((props: ToggleReturn) => React.ReactNode) | React.ReactNode;
}

const Hint = ({ className, trigger, content: Content }: HintProps) => {
  const toggler = useToggle();

  return (
    <>
      <i className={c(`text-sm`, className)}>
        {typeof trigger === `function` ? trigger(toggler) : trigger}
      </i>
      {toggler.opened && Content && (
        <Modal onEscape={toggler.close}>
          <Content {...toggler} />
        </Modal>
      )}
    </>
  );
};

export type { HintProps };
export { Hint };
