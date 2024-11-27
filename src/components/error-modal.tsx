import { Button } from 'design-system/button';
import { Modal } from 'design-system/modal';
import React, { type ReactNode } from 'react';
import { BiX } from 'react-icons/bi';

interface ErrorModalProps {
  heading: string;
  message: ReactNode;
  footer?: ReactNode;
  onClose(): void;
}

const ErrorModal = ({ heading, message, footer, onClose }: ErrorModalProps) => {
  return (
    <Modal onEscape={onClose}>
      <div className="flex items-center justify-between gap-4">
        <h6 className="text-red-600 dark:text-red-400 text-xl">{heading}</h6>
        <Button type="button" i={2} s={1} title="Close" onClick={onClose}>
          <BiX />
        </Button>
      </div>
      <p className="text-sm mt-2">{message}</p>
      <footer className="flex justify-end space-x-2 mt-8">
        {footer}
        <Button type="button" i={1} s={2} auto title="Close" onClick={onClose}>
          Close
        </Button>
      </footer>
    </Modal>
  );
};

export default ErrorModal;
