import { Button } from 'design-system/button';
import Modal from 'design-system/modal';
import React from 'react';
import { BiX } from 'react-icons/bi';

interface ErrorModalProps {
  heading: string;
  message: React.ReactNode;
  onClose(): void;
}

const ErrorModal = ({ heading, message, onClose }: ErrorModalProps) => {
  return (
    <Modal>
      <div className="flex items-center justify-between gap-4">
        <h6 className="text-red-600 dark:text-red-400 text-xl">{heading}</h6>
        <Button type="button" i={2} s={1} title="Close" onClick={onClose}>
          <BiX />
        </Button>
      </div>
      <p className="text-sm mt-2">{message}</p>
      <Button
        type="button"
        className="mt-8 ml-auto"
        i={1}
        s={2}
        auto
        title="Close"
        onClick={onClose}
      >
        Close
      </Button>
    </Modal>
  );
};

export default ErrorModal;
