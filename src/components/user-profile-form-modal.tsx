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
  noEdgeSpaces,
  notEmpty,
  minLength,
  maxLength,
  nickname,
  url,
} from 'development-kit/form';
import { useForm } from 'development-kit/use-form';

interface UserProfileFormModalProps {
  onClose(): void;
}

type UserProfileFormValues = NonNullableProperties<UserProfile>;

const UserProfileFormModal = ({ onClose }: UserProfileFormModalProps) => {
  const [{ nok }, { inject }] = useForm<UserProfileFormValues>(
    {
      nickname: ``,
      bio: ``,
      avatar: ``,
      githubUrl: ``,
      linkedInUrl: ``,
      fbUrl: ``,
      twitterUrl: ``,
      blogUrl: ``,
    },
    {
      nickname: [notEmpty, noEdgeSpaces, minLength(2), maxLength(25), nickname],
      bio: [notEmpty, noEdgeSpaces, minLength(60), maxLength(300)],
      githubUrl: [noEdgeSpaces, url],
    },
  );

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
              {...inject(`nickname`)}
            />
          </Field>
          <Field label={`Bio*`}>
            <Textarea
              placeholder="Example: I like programming and playing computer games..."
              {...inject(`bio`)}
            />
          </Field>
          <Field label={`GitHub Link`}>
            <Input
              placeholder="https://github.com/your-profile"
              {...inject(`githubUrl`)}
            />
          </Field>
          <Field label={`Facebook Link`}>
            <Input
              placeholder="https://www.facebook.com/your-profile"
              {...inject(`fbUrl`)}
            />
          </Field>
          <Field label={`LinkedIn Link`}>
            <Input
              placeholder="https://www.linkedin.com/your-profile"
              {...inject(`linkedInUrl`)}
            />
          </Field>
          <Field label={`Twitter Link`}>
            <Input
              placeholder="https://twitter.com/your-profile"
              {...inject(`twitterUrl`)}
            />
          </Field>
          <Field label={`Blog`}>
            <Input
              placeholder="https://your-blog-domain"
              {...inject(`blogUrl`)}
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
