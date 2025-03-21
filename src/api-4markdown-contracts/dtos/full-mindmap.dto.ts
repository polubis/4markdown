import type { Id } from 'api-4markdown-contracts';
import type { MindmapDto } from './mindmap.dto';
import type { UserProfileDto } from './user-profile.dto';

type FullMindmapDto = MindmapDto & {
  authorId: Id;
  authorProfile: UserProfileDto | null;
  isTrustedAuthor: boolean;
};

export type { FullMindmapDto };
