import type { PermanentDocumentDto, UserProfileDto } from 'api-4markdown';
import type { Prettify } from 'development-kit/utility-types';

type EducationZoneViewModel = {
  documents: Prettify<
    Omit<PermanentDocumentDto, `visibility` | 'code' | 'author'> & {
      author: {
        avatar: NonNullable<UserProfileDto['avatar']>['sm'] | null;
        displayName: NonNullable<UserProfileDto['displayName']>;
      } | null;
    }
  >[];
};

export type { EducationZoneViewModel };
