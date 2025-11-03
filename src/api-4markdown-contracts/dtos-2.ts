import { SUID } from "development-kit/suid";
import { Brand } from "development-kit/utility-types";

export type Atoms = {
  UTCDate: Brand<string, `UTCDate`>;
  Etag: Brand<string, `Etag`>;
  AccessGroupId: Brand<string, `AccessGroupId`>;
  UserProfileId: Brand<string, `UserProfileId`>;
  DocumentId: Brand<string, `DocumentId`>;
  MindmapId: Brand<string, `MindmapId`>;
  MindmapNodeId: Brand<SUID, `MindmapNodeId`>;
  ResourceId: Atoms["DocumentId"] | Atoms["MindmapId"] | Atoms["MindmapNodeId"];
  ResourceType: "document" | "mindmap" | "mindmap-node";
  ResourceVisibility: "private" | "public" | "permanent" | "manual";
  RatingCategory: "ugly" | "bad" | "decent" | "good" | "perfect";
  ImageId: Brand<string, `ImageId`>;
  Path: Brand<string, `Path`>;
  RewriteAssistantPersona: "cleany" | "grammy" | "teacher";
};

export type AccessGroupDto = {
  id: Atoms["AccessGroupId"];
  cdate: Atoms["UTCDate"];
  etag: Atoms["Etag"];
  mdate: Atoms["UTCDate"];
  name: string;
  description: string | null;
  members: Atoms["UserProfileId"][];
};

export type ResourceCompletionDto = {
  cdate: Atoms["UTCDate"];
  type: Atoms["ResourceType"];
  resourceId: Atoms["ResourceId"];
  parentId?: Atoms["MindmapId"];
};

export type RatingDto = Record<Atoms["RatingCategory"], number>;

export type ImageDto = {
  extension: `png` | `jpeg` | `jpg` | `gif` | `webp`;
  contentType:
    | `image/png`
    | `image/jpeg`
    | `image/jpg`
    | `image/gif`
    | `image/webp`;
  url: Atoms["Path"];
  id: Atoms["ImageId"];
};
