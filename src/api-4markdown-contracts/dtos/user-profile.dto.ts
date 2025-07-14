import type { Date, Id, Path, Slug } from "../atoms";

type AvatarVariant = {
  w: number;
  h: number;
  id: Id;
  src: Path;
};

type Avatar = {
  tn: AvatarVariant;
  sm: AvatarVariant;
  md: AvatarVariant;
  lg: AvatarVariant;
};

type UserProfileDto = {
  id: Id;
  cdate: Date;
  mdate: Date;
  displayNameSlug: Slug | null;
  displayName: string | null;
  bio: string | null;
  avatar: Avatar | null;
  githubUrl: string | null;
  linkedInUrl: string | null;
  twitterUrl: string | null;
  fbUrl: string | null;
  blogUrl: string | null;
};

export type { UserProfileDto };
