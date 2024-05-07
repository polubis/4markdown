interface User {
  name: string | null;
  avatar: string | null;
}

type UserProfile = {
  nickname: string;
  bio: string;
  avatar: string | null;
  githubUrl: string | null;
  linkedInUrl: string | null;
  twitterUrl: string | null;
  fbUrl: string | null;
  blogUrl: string | null;
};

type UpdateUserProfilePayload = UserProfile;
type UpdateUserProfileDto = UserProfile;

export type {
  User,
  UserProfile,
  UpdateUserProfilePayload,
  UpdateUserProfileDto,
};
