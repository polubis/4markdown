import React from 'react';
import { Button } from 'design-system/button';
import { BiX } from 'react-icons/bi';
import Modal from 'design-system/modal';
import { Field } from 'design-system/field';
import { Input } from 'design-system/input';
import { Textarea } from 'design-system/textarea';
import { UserProfile } from 'models/user';
import { NonNullableProperties } from 'development-kit/utility-types';

interface UserProfileFormModalProps {
  onClose(): void;
}

type UserProfileFormValues = NonNullableProperties<UserProfile>;

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
      <form onSubmit={() => {}}>
        <section className="space-y-4">
          <Field label={`Nickname`}>
            <Input
              placeholder="Examples: tom1994, workfororc, programmer, ...etc"
              // onChange={(e) => setName(e.target.value)}
              // value={name}
            />
          </Field>
          <Field label={`Bio`}>
            <Textarea
              placeholder="Example: I like programming and playing computer games..."
              // onChange={(e) => setName(e.target.value)}
              // value={name}
            />
          </Field>
          <Field label={`GitHub Link`}>
            <Input
              placeholder="https://github.com/your-profile"
              // onChange={(e) => setName(e.target.value)}
              // value={name}
            />
          </Field>
          <Field label={`Facebook Link`}>
            <Input
              placeholder="https://www.facebook.com/your-profile"
              // onChange={(e) => setName(e.target.value)}
              // value={name}
            />
          </Field>
          <Field label={`LinkedIn Link`}>
            <Input
              placeholder="https://www.linkedin.com/your-profile"
              // onChange={(e) => setName(e.target.value)}
              // value={name}
            />
          </Field>
          <Field label={`Twitter Link`}>
            <Input
              placeholder="https://twitter.com/your-profile"
              // onChange={(e) => setName(e.target.value)}
              // value={name}
            />
          </Field>
          <Field label={`Blog`}>
            <Input
              placeholder="https://your-blog-domain.com"
              // onChange={(e) => setName(e.target.value)}
              // value={name}
            />
          </Field>
        </section>
        <footer className="mt-10 flex">
          <Button
            className="ml-auto"
            type="button"
            i={1}
            s={2}
            auto
            title="Cancel user profile update"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="ml-2"
            i={2}
            s={2}
            auto
            title="Confirm user profile update"
          >
            Confirm
          </Button>
        </footer>
      </form>
    </Modal>
  );
};

export default UserProfileFormModal;
