import React from 'react';
import { Button } from 'design-system/button';
import { BiX } from 'react-icons/bi';
import Modal from 'design-system/modal';

interface UserProfileFormModalProps {
  onClose(): void;
}

const UserProfileFormModal = ({ onClose }: UserProfileFormModalProps) => {
  return (
    <Modal onEscape={onClose}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h6 className="text-xl">Your Profile Details</h6>
        <div className="flex gap-2">
          <Button
            type="button"
            i={2}
            s={1}
            title="Close user profile settings form"
            onClick={onClose}
          >
            <BiX />
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UserProfileFormModal;
