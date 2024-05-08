import { Base64, Path } from './general';

interface User {
  name: string | null;
  avatar: string | null;
}

type AvatarVariant<
  Key extends 'tn' | 'sm' | 'md' | 'lg' | 'xl',
  Size extends number,
> = {
  [K in Key]: {
    w: Size;
    h: Size;
    src: Path;
  };
};

type UserProfileAvatar = AvatarVariant<'tn', 24> &
  AvatarVariant<'sm', 32> &
  AvatarVariant<'md', 64> &
  AvatarVariant<'lg', 100>;

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

type GetYourProfileDto = UserProfile;

type UpdateUserProfileAvatarAction =
  | { type: `idle` }
  | { type: `remove` }
  | { type: `update`; data: Base64 };
type UpdateUserProfilePayload = Omit<UserProfile, 'avatar'> & {
  avatar: UpdateUserProfileAvatarAction;
};
type UpdateUserProfileDto = UserProfile;

export type {
  User,
  UserProfileAvatar,
  UserProfile,
  UpdateUserProfileAvatarAction,
  UpdateUserProfilePayload,
  UpdateUserProfileDto,
  GetYourProfileDto,
};
