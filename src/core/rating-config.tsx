import type { RatingCategory } from "api-4markdown-contracts";
import type { IconType } from "react-icons";
import { BiBulb, BiHeart, BiLaugh, BiLike, BiDislike } from "react-icons/bi";

const RATING_ICONS: [IconType, RatingCategory][] = [
	[BiHeart, `perfect`],
	[BiBulb, `good`],
	[BiLike, `decent`],
	[BiDislike, `bad`],
	[BiLaugh, `ugly`],
];

export { RATING_ICONS };
