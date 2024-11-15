import type {
  PermanentDocumentDto,
  Tags,
  UserProfileDto,
} from 'api-4markdown-contracts';

type HomePageModel = {
  initialCode: string;
};
// @TODO[PRIO=3]: [Do BE for FE and reduce amount of proxy models here].
type EducationDocumentAvatarModel = {
  avatar: NonNullable<UserProfileDto['avatar']>['sm'] | null;
  displayName: NonNullable<UserProfileDto['displayName']>;
} | null;

type RichEducationDocumentModel = Pick<
  PermanentDocumentDto,
  'id' | 'path' | 'name' | 'rating' | 'cdate' | 'description' | 'tags'
> & {
  author: EducationDocumentAvatarModel;
};

type LightEducationDocumentModel = Pick<
  PermanentDocumentDto,
  'id' | 'path' | 'name' | 'rating' | 'cdate'
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
  topTags: Tags;
  tag?: Tags[number];
};

type EducationRanPageModel = {
  topDocuments: RichEducationDocumentModel[];
  topTags: Tags;
};

type FlashcardsCreatorPageModel = {};

export type {
  HomePageModel,
  EducationPageModel,
  LightEducationDocumentModel,
  EducationRanPageModel,
  RichEducationDocumentModel,
  FlashcardsCreatorPageModel,
};
