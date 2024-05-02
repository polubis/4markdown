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
};

export type { User, UserProfile };
