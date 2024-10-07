import type {
  PermanentDocumentDto,
  UserProfileDto,
} from 'api-4markdown-contracts';

type HomeViewModel = {
  initialCode: string;
};

type RichEducationDocumentModel = Pick<
  PermanentDocumentDto,
  'id' | 'path' | 'name' | 'rating' | 'mdate' | 'description' | 'tags'
> & {
  author: {
    avatar: NonNullable<UserProfileDto['avatar']>['sm'] | null;
    displayName: NonNullable<UserProfileDto['displayName']>;
  } | null;
};

type LightEducationDocumentModel = Pick<
  PermanentDocumentDto,
  'id' | 'path' | 'name' | 'rating' | 'mdate'
> & {
  author: {
    avatar: NonNullable<UserProfileDto['avatar']>['sm'] | null;
    displayName: NonNullable<UserProfileDto['displayName']>;
  } | null;
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
};

type EducationRankViewModel = {
  top: RichEducationDocumentModel[];
};

export type {
  HomeViewModel,
  EducationZoneViewModel,
  LightEducationDocumentModel,
  EducationRankViewModel,
  RichEducationDocumentModel,
};
