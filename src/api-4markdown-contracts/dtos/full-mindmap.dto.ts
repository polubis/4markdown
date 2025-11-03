import type { Id, UserProfileDto } from "api-4markdown-contracts";
import type { MindmapDto } from "./mindmap.dto";

type FullMindmapDto = MindmapDto & {
  authorId: Id;
  authorProfile: UserProfileDto | null;
  isAuthorTrusted: boolean;
};

export type { FullMindmapDto };
