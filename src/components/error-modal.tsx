import { Button } from 'design-system/button';
import Modal from 'design-system/modal';
import React from 'react';
import { BiX } from 'react-icons/bi';

interface ErrorModalProps {
  heading: string;
  message: string;
  onClose(): void;
}

const ErrorModal = ({ heading, message, onClose }: ErrorModalProps) => {
  return (
    <Modal onClose={onClose}>
      <div className="flex items-center gap-4">
        <h6 className="text-red-600 dark:text-red-400 text-xl">{heading}</h6>
        <Button type="button" i={2} rfull title="Close" onClick={onClose}>
          <BiX />
        </Button>
      </div>
      <p className="text-sm mt-2">{message}</p>
      <Button
        type="button"
        className="mt-4"
        i={2}
        rfull
        title="Close"
        onClick={onClose}
      >
        Close
      </Button>
    </Modal>
  );
};

export default ErrorModal;
