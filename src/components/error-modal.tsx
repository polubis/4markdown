import { Button } from 'design-system/button';
import { Modal } from 'design-system/modal';
import React, { type ReactNode } from 'react';

interface ErrorModalProps {
  heading: string;
  message: ReactNode;
  footer?: ReactNode;
  onClose(): void;
}

const ErrorModal = ({ heading, message, footer, onClose }: ErrorModalProps) => {
  return (
    <Modal onClose={onClose}>
      <Modal.Header
        className="[&_h6]:text-red-600 [&_h6]:dark:text-red-400"
        title={heading}
        closeButtonTitle="Close"
      />
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
