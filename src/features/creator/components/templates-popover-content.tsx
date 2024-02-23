import Popover from 'design-system/popover';
import { Buttons } from './buttons';
import React from 'react';

interface TemplatesPopoverContentProps {
  onCopy(content: string): void;
  onClose(): void;
}

const TemplatesPopoverContent: React.FC<TemplatesPopoverContentProps> = ({
  onCopy,
  onClose,
}) => {
  return (
    <Popover
      className="flex gap-2 w-[94%] tn:max-w-max tn:w-auto overflow-x-auto bottom-20 left-2 md:bottom-auto md:top-16"
      onBackdropClick={onClose}
    >
      <Buttons.Headings onClick={onCopy} />
      <Buttons.Link onClick={onCopy} />
      <Buttons.Image onClick={onCopy} />
      <Buttons.Code onClick={onCopy} />
      <Buttons.Table onClick={onCopy} />
    </Popover>
  );
};

export default TemplatesPopoverContent;
