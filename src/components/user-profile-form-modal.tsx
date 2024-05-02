import React from 'react';
import { Button } from 'design-system/button';
import { BiX } from 'react-icons/bi';
import Modal from 'design-system/modal';
import { Field } from 'design-system/field';
import { Input } from 'design-system/input';
import { Textarea } from 'design-system/textarea';
import { UserProfile } from 'models/user';
import { NonNullableProperties } from 'development-kit/utility-types';
import {
  chain,
  noEdgeSpaces,
  notEmpty,
  minLength,
  maxLength,
  nickname,
} from 'development-kit/validators';

interface UserProfileFormModalProps {
  onClose(): void;
}

type UserProfileFormValues = NonNullableProperties<UserProfile>;

const validators = {
  nickname: (value: string): boolean =>
    chain(notEmpty, noEdgeSpaces, minLength(2), maxLength(25), nickname)(value),
  bio: (value: string): boolean =>
    chain(notEmpty, noEdgeSpaces, minLength(60), maxLength(300))(value),
};

const UserProfileFormModal = ({ onClose }: UserProfileFormModalProps) => {
  const [values, setValues] = React.useState<UserProfileFormValues>(() => ({
    nickname: ``,
    bio: ``,
    avatar: ``,
    githubUrl: ``,
    linkedInUrl: ``,
    fbUrl: ``,
    twitterUrl: ``,
  }));

  const nicknameInvalid = !validators.nickname(values.nickname);
  const invalid = nicknameInvalid;

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
              placeholder="Examples: tom1994, work_work, pro-grammer, ...etc"
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  nickname: e.target.value,
                }))
              }
              value={values.nickname}
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
              placeholder="https://your-blog-domain"
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
            disabled={invalid}
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
