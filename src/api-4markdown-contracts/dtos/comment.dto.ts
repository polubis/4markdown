import type { Date, Id } from '../atoms';
import type { RatingDto } from './rating.dto';
import type { Avatar, UserProfileDto } from './user-profile.dto';

type CommentAuthor = {
  displayName: UserProfileDto['displayName'];
  avatar: Pick<Avatar, 'md'> | null;
  url: string | null;
};

type CommentDto = {
  id: Id;
  cdate: Date;
  mdate: Date;
  content: string;
  rating: RatingDto;
  author: CommentAuthor;
  children: Omit<CommentDto, 'children'>[];
};

export type { CommentDto };
