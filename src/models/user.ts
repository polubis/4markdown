import type { UserProfileDto } from 'api-4markdown';
import { Base64 } from './general';

interface User {
  name: string | null;
  avatar: string | null;
}

type GetYourProfileDto = UserProfileDto;

type UpdateYourProfileAvatarAction =
  | {
      type: `noop`;
    }
  | { type: `remove` }
  | { type: `update`; data: Base64 };
type UpdateYourProfilePayload = Omit<UserProfileDto, 'avatar'> & {
  avatar: UpdateYourProfileAvatarAction;
};
type UpdateYourProfileDto = UserProfileDto;

export type {
  User,
  GetYourProfileDto,
  UpdateYourProfilePayload,
  UpdateYourProfileAvatarAction,
  UpdateYourProfileDto,
};
