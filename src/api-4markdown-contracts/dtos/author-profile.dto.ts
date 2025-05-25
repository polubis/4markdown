import type { MindmapDto, UserProfileDto } from 'api-4markdown-contracts';

type AuthorProfileDto = UserProfileDto & {
  mindmaps: MindmapDto[];
  rating: {
    ugly: number;
    bad: number;
    decent: number;
    good: number;
    perfect: number;
  };
  testimonials: {
    author: UserProfileDto;
    content: string;
  }[];
};

export { AuthorProfileDto };
