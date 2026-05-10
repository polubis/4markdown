import type { DocumentId, Rating, RatingCategory } from "../../domain/models";
import {
  toOperationError,
  rateDocument as rateDocumentApi,
} from "../../integration/api";
import { type Store } from "../store";
import { type Bus } from "../bus";

export const rateDocument =
  (store: Store, bus: Bus) =>
  async (payload: { documentId: DocumentId; category: RatingCategory }) => {
    const prevRating = store.getState().rating;

    try {
      const newRating: Rating = {
        ...prevRating,
        [payload.category]: prevRating[payload.category] + 1,
      };

      store.setState({ rating: newRating });

      await rateDocumentApi(payload);
    } catch (error) {
      store.setState({ rating: prevRating });
      bus.next({ type: "fail", message: toOperationError(error) });
    }
  };
