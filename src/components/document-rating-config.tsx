import type { DocumentRatingCategory } from 'api-4markdown-contracts';
import type { IconType } from 'react-icons';
import { BiBulb, BiHeart, BiLaugh, BiLike, BiDislike } from 'react-icons/bi';

const DOCUMENT_RATING_ICONS: [IconType, DocumentRatingCategory][] = [
  [BiHeart, `perfect`],
  [BiBulb, `good`],
  [BiLike, `decent`],
  [BiDislike, `bad`],
  [BiLaugh, `ugly`],
];

export { DOCUMENT_RATING_ICONS };
