import type { Rating, RatingCategory } from "../../domain/models";
import {
  rateDocument as rateDocumentApi,
  toOperationError,
} from "../../integration/api";
import { type Store } from "../store";
import { type Bus } from "../bus";

export const rateResource =
  (store: Store, bus: Bus) => async (category: RatingCategory) => {
    const {
      rating: prevRating,
      resourceId,
      myCategory: prevMyCategory,
    } = store.getState();

    try {
      const newRating: Rating = {
        ...prevRating,
        [category]: prevRating[category] + 1,
      };

      store.setState({ rating: newRating, myCategory: category });

      await rateDocumentApi(resourceId, category);
    } catch (error) {
      store.setState({
        rating: prevRating,
        myCategory: prevMyCategory,
      });
      bus.next({ type: "fail", message: toOperationError(error) });
    }
  };
