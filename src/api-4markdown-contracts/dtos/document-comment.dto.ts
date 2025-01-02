import type { Date, Id } from '../atoms';
import type { DocumentRatingDto } from './document-rating.dto';
import type { Avatar, UserProfileDto } from './user-profile.dto';

type CommentAuthor = {
  displayName: UserProfileDto['displayName'];
  avatar: Pick<Avatar, 'sm'> | null;
  url: string | null;
};

type DocumentCommentDto = {
  id: Id;
  cdate: Date;
  mdate: Date;
  content: string;
  rating: DocumentRatingDto;
  author: CommentAuthor;
  repliesCount: number;
};

export type { DocumentCommentDto };
