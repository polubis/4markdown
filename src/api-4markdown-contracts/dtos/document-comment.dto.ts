import type { Date, Id } from '../atoms';
import type { RatingDto } from './rating.dto';
import type { UserProfileDto } from './user-profile.dto';

type DocumentCommentDto = {
  id: Id;
  cdate: Date;
  mdate: Date;
  content: string;
  rating: RatingDto;
  author: UserProfileDto | null;
  replies: Omit<DocumentCommentDto, 'replies'>[];
};

export type { DocumentCommentDto };
