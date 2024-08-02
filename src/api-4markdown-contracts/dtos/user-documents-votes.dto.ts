import type { Id } from '../atoms';
import type { DocumentRatingCategory } from './document-rating.dto';

type UserDocumentsVotesDto = Record<Id, DocumentRatingCategory>;

export type { UserDocumentsVotesDto };
