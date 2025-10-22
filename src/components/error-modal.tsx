import { Button } from "design-system/button";
import { Modal2 } from "design-system/modal2";
import React, { type ReactNode } from "react";

interface ErrorModalProps {
  heading: string;
  message: ReactNode;
  footer?: ReactNode;
  onClose(): void;
}

const ErrorModal = ({ heading, message, footer, onClose }: ErrorModalProps) => {
  return (
    <Modal2 onClose={onClose}>
      <Modal2.Header
        className="[&_h6]:text-red-600 [&_h6]:dark:text-red-400"
        title={heading}
        closeButtonTitle="Close error screen"
      />
      <Modal2.Body>
        <p className="text-sm">{message}</p>
      </Modal2.Body>
      <Modal2.Footer className="flex justify-end space-x-2">
        {footer}
        <Button type="button" i={1} s={2} auto title="Close" onClick={onClose}>
          Close
        </Button>
      </Modal2.Footer>
    </Modal2>
  );
};

export default ErrorModal;
