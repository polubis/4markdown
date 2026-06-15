import { rateResource } from "./handlers/rate-resource";
import { addScore } from "./handlers/add-score";
import { loadComments } from "./handlers/load-comments";
import { loadMoreComments } from "./handlers/load-more-comments";
import { rateComment } from "./handlers/rate-comment";
import { addComment } from "./handlers/add-comment";
import { editComment } from "./handlers/edit-comment";
import { deleteComment } from "./handlers/delete-comment";
import { Store } from "./store";
import { Bus } from "./bus";
import { BusEvent } from "../domain/models";
import { toMeterValue } from "../domain/value-objects";

export const createFacade = (useStore: Store, bus: Bus) => {
  return {
    rateResource: rateResource(useStore, bus),
    addScore: addScore(useStore, bus),
    loadComments: loadComments(useStore),
    loadMoreComments: loadMoreComments(useStore),
    rateComment: rateComment(useStore, bus),
    addComment: addComment(useStore, bus),
    editComment: editComment(useStore, bus),
    deleteComment: deleteComment(useStore, bus),
    useRating: () => useStore((state) => state.rating),
    useScore: () => useStore((state) => state.score),
    useMeterValue: () =>
      useStore((state) =>
        toMeterValue({ rating: state.rating, score: state.score }),
      ),
    useMyCategory: () => useStore((state) => state.myCategory),
    useMyScore: () => useStore((state) => state.myScore),
    useComments: () => useStore((state) => state.comments),
    onBusEvent: (onEvent: (event: BusEvent) => void) => bus.subscribe(onEvent),
  };
};

export type Facade = ReturnType<typeof createFacade>;
