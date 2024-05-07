import React from 'react';
import { Button } from 'design-system/button';
import { BiX } from 'react-icons/bi';
import Modal from 'design-system/modal';
import { Field } from 'design-system/field';
import { Input } from 'design-system/input';
import { Textarea } from 'design-system/textarea';
import { UserProfile } from 'models/user';
import { NonNullableProperties } from 'development-kit/utility-types';
import { useForm } from 'development-kit/use-form';
import {
  maxLength,
  minLength,
  nickname,
  noEdgeSpaces,
  notEmpty,
  optional,
  url,
} from 'development-kit/form';
import { findNearestParent, makeFreeFlat, rtree } from 'development-kit/tree';

interface UserProfileFormModalProps {
  onClose(): void;
}

type UserProfileFormValues = NonNullableProperties<UserProfile>;

const UserProfileFormModal = ({ onClose }: UserProfileFormModalProps) => {
  const [{ invalid }, { inject }] = useForm<UserProfileFormValues>(
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
      githubUrl: [optional(noEdgeSpaces, url)],
    },
  );

  const ftree = makeFreeFlat(rtree);

  return (
    <Modal>
      {ftree.map((node) => (
        <li
          key={node.id}
          className={`ml-${node.level}`}
          onClick={() => {
            console.log(findNearestParent(node.parentId, ftree));
          }}
        >
          {node.username}
        </li>
      ))}
    </Modal>
  );
};

export default UserProfileFormModal;
