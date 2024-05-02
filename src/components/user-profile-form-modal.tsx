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
  report,
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
    blogUrl: ``,
  }));

  const changeValue =
    <Key extends keyof UserProfileFormValues>(key: Key) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));
    };

  const injectProps = <Key extends keyof UserProfileFormValues>(key: Key) => ({
    onChange: changeValue(key),
    value: values[key],
  });

  const { nok } = React.useMemo(() => report(values, validators), [values]);

  return (
    <Modal>
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
          <Field label={`Nickname*`}>
            <Input
              placeholder="Examples: tom1994, work_work, pro-grammer, ...etc"
              {...injectProps(`nickname`)}
            />
          </Field>
          <Field label={`Bio*`}>
            <Textarea
              placeholder="Example: I like programming and playing computer games..."
              {...injectProps(`bio`)}
            />
          </Field>
          <Field label={`GitHub Link`}>
            <Input
              placeholder="https://github.com/your-profile"
              {...injectProps(`githubUrl`)}
            />
          </Field>
          <Field label={`Facebook Link`}>
            <Input
              placeholder="https://www.facebook.com/your-profile"
              {...injectProps(`fbUrl`)}
            />
          </Field>
          <Field label={`LinkedIn Link`}>
            <Input
              placeholder="https://www.linkedin.com/your-profile"
              {...injectProps(`linkedInUrl`)}
            />
          </Field>
          <Field label={`Twitter Link`}>
            <Input
              placeholder="https://twitter.com/your-profile"
              {...injectProps(`twitterUrl`)}
            />
          </Field>
          <Field label={`Blog`}>
            <Input
              placeholder="https://your-blog-domain"
              {...injectProps(`blogUrl`)}
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
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="ml-2"
            i={2}
            s={2}
            auto
            disabled={nok}
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
