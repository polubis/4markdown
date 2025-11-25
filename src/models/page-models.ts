import type {
  Atoms,
  FullMindmapDto,
  PermanentDocumentDto,
  UserProfileDto,
} from "api-4markdown-contracts";

type HomePageModel = {};
// @TODO[PRIO=3]: [Do BE for FE and reduce amount of proxy models here].
type EducationDocumentAvatarModel = {
  avatar: NonNullable<UserProfileDto["avatar"]>["sm"] | null;
  displayName: NonNullable<UserProfileDto["displayName"]>;
  id: UserProfileDto["id"];
} | null;

type RichEducationDocumentModel = Pick<
  PermanentDocumentDto,
  | "id"
  | "path"
  | "name"
  | "rating"
  | "cdate"
  | "description"
  | "tags"
  | "commentsCount"
  | "score"
> & {
  author: EducationDocumentAvatarModel;
};

type LightEducationDocumentModel = Pick<
  PermanentDocumentDto,
  "id" | "path" | "name" | "rating" | "cdate" | "commentsCount" | "score"
> & {
  author: EducationDocumentAvatarModel;
};

// @TODO[PRIO=4]: [Split models to separate files].
type EducationPageModel = {
  page: number;
  pagesCount: number;
  documents: {
    top: LightEducationDocumentModel[];
    partialTop: LightEducationDocumentModel[];
    wall: RichEducationDocumentModel[];
  };
  topTags: string[];
  tag?: string;
};

type EducationRankPageModel = {
  topDocuments: RichEducationDocumentModel[];
  topTags: string[];
};

type MindmapPageModel = {
  mindmap: FullMindmapDto;
  mindmapPath: Atoms["Path"];
};

export type {
  HomePageModel,
  EducationPageModel,
  LightEducationDocumentModel,
  EducationRankPageModel,
  RichEducationDocumentModel,
  MindmapPageModel,
};
