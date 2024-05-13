import { Base64, Path } from './general';

interface User {
  name: string | null;
  avatar: string | null;
}

type AvatarVariant<Key extends 'tn' | 'sm' | 'md' | 'lg' | 'xl'> = {
  [K in Key]: {
    w: number;
    h: number;
    src: Path;
  };
};

type UserProfileAvatar = AvatarVariant<'tn'> &
  AvatarVariant<'sm'> &
  AvatarVariant<'md'> &
  AvatarVariant<'lg'>;

type UserProfile = {
  displayName: string | null;
  bio: string | null;
  avatar: UserProfileAvatar | null;
  githubUrl: string | null;
  linkedInUrl: string | null;
  twitterUrl: string | null;
  fbUrl: string | null;
  blogUrl: string | null;
};

type GetYourProfileDto = UserProfile | null;

type UpdateYourProfileAvatarAction =
  | {
      type: `noop`;
    }
  | { type: `remove` }
  | { type: `update`; data: Base64 };
type UpdateYourProfilePayload = Omit<UserProfile, 'avatar'> & {
  avatar: UpdateYourProfileAvatarAction;
};
type UpdateYourProfileDto = UserProfile;

export type {
  User,
  UserProfile,
  GetYourProfileDto,
  UpdateYourProfilePayload,
  UpdateYourProfileAvatarAction,
  UpdateYourProfileDto,
};
