import type {
  PermanentDocumentDto,
  UserProfileDto,
} from 'api-4markdown-contracts';
import type { Prettify } from 'development-kit/utility-types';

type EducationZoneViewModel = {
  docs: Prettify<
    Omit<PermanentDocumentDto, `visibility` | 'code' | 'author'> & {
      author: {
        avatar: NonNullable<UserProfileDto['avatar']>['sm'] | null;
        displayName: NonNullable<UserProfileDto['displayName']>;
      } | null;
    }
  >[];
};

type HomeViewModel = {
  initialCode: string;
};

export type { EducationZoneViewModel, HomeViewModel };
