import type {
  PermanentDocumentDto,
  Tags,
  UserProfileDto,
} from 'api-4markdown-contracts';

type HomeViewModel = {
  initialCode: string;
};

type EducationDocumentAvatarModel = {
  avatar: NonNullable<UserProfileDto['avatar']>['sm'] | null;
  displayName: NonNullable<UserProfileDto['displayName']>;
} | null;

type RichEducationDocumentModel = Pick<
  PermanentDocumentDto,
  'id' | 'path' | 'name' | 'rating' | 'mdate' | 'description' | 'tags'
> & {
  author: EducationDocumentAvatarModel;
};

type LightEducationDocumentModel = Pick<
  PermanentDocumentDto,
  'id' | 'path' | 'name' | 'rating' | 'mdate'
> & {
  author: EducationDocumentAvatarModel;
};

// @TODO[PRIO=4]: [Split models to separate files].
type EducationZoneViewModel = {
  page: number;
  pagesCount: number;
  documents: {
    top: LightEducationDocumentModel[];
    partialTop: LightEducationDocumentModel[];
    wall: RichEducationDocumentModel[];
  };
  topTags: Tags;
};

type EducationRankViewModel = {
  topDocuments: RichEducationDocumentModel[];
  topTags: Tags;
};

export type {
  HomeViewModel,
  EducationZoneViewModel,
  LightEducationDocumentModel,
  EducationRankViewModel,
  RichEducationDocumentModel,
};
