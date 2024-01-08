import React from 'react';
import { Button } from 'design-system/button';
import Modal from 'design-system/modal';
import { BiX } from 'react-icons/bi';
import { authStoreSelectors } from 'store/auth/auth.store';

interface DeleteAccountModalProps {
  onClose?(): void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ onClose }) => {
  const [email, setEmail] = React.useState('');
  const authStore = authStoreSelectors.ready();
  const isAuthorized = authStore.is === 'authorized';

  const close = (): void => {
    if (!isAuthorized) return;
    onClose?.();
  };

  const handleConfirm: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      await authStoreSelectors.authorized().deleteAccount(email);
      close();
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <Modal onClose={close}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h6 className="text-xl">Account Removal</h6>
        <Button
          type="button"
          disabled={!isAuthorized}
          i={2}
          s={1}
          title="Close account removal"
          onClick={close}
        >
          <BiX />
        </Button>
      </div>
      <form onSubmit={handleConfirm}>
        <p className="mb-4">
          To remove your account, please confirm by entering your email address.
        </p>
        <fieldset className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Email address*</label>
          <input
            placeholder="Type your email address..."
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="px-3 py-2 placeholder:text-gray-600 dark:placeholder:text-gray-300 text-sm rounded-md bg-gray-300 dark:bg-slate-800 border-[2.5px] border-transparent focus:border-black focus:dark:border-white outline-none"
          />
        </fieldset>
        <footer className="mt-6 flex">
          <Button
            className="ml-auto"
            type="button"
            i={1}
            s={2}
            auto
            disabled={!isAuthorized}
            title="Cancel account removal"
            onClick={close}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="ml-2"
            i={2}
            s={2}
            auto
            title="Confirm account removal"
            disabled={!email || !isAuthorized}
          >
            Remove Account
          </Button>
        </footer>
      </form>
    </Modal>
  );
};

export default DeleteAccountModal;
