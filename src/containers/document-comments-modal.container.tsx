import { Modal } from 'design-system/modal';
import React from 'react';

type DocumentCommentsModalContainerProps = {
  onClose(): void;
};

const DocumentCommentsModalContainer = ({
  onClose,
}: DocumentCommentsModalContainerProps) => {
  return <Modal onEscape={onClose}>c</Modal>;
};

export { DocumentCommentsModalContainer };
