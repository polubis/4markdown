import { Base64, Id, Path } from './general';

interface User {
  name: string | null;
  avatar: string | null;
}

type UserAvatarVariantKey = 'tn' | 'sm' | 'md' | 'lg';

type UserAvatarVariantObj = {
  w: number;
  h: number;
  id: Id;
  src: Path;
};

type UserAvatarVariant<Key extends UserAvatarVariantKey> = {
  [K in Key]: UserAvatarVariantObj;
};
type UserProfileAvatar = UserAvatarVariant<'tn'> &
  UserAvatarVariant<'sm'> &
  UserAvatarVariant<'md'> &
  UserAvatarVariant<'lg'>;

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
  UserAvatarVariantKey,
  UserAvatarVariantObj,
};
