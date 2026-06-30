import type {
  Rating,
  RatingCategory,
  ResourceId,
  ResourceType,
} from "../../domain/models";
import {
  rateDocument,
  rateMindmapNode,
  rateUserProfile,
  toOperationError,
} from "../../integration/api";
import { type Store } from "../store";
import { type Bus } from "../bus";

const rate = async (
  resourceId: ResourceId,
  resourceType: ResourceType,
  category: RatingCategory,
) => {
  switch (resourceType) {
    case "document":
      return rateDocument(resourceId, category);
    case "mindmap-node":
      return rateMindmapNode(resourceId, category);
    case "user-profile":
      return rateUserProfile(resourceId, category);
    case "mindmap":
      throw new Error(`Unsupported resource type: ${resourceType}`);
  }
};

export const rateResource =
  (store: Store, bus: Bus) => async (category: RatingCategory) => {
    const {
      rating: prevRating,
      resourceId,
      resourceType,
      myCategory: prevMyCategory,
    } = store.getState();

    try {
      const newRating: Rating = {
        ...prevRating,
        [category]: prevRating[category] + 1,
      };

      store.setState({ rating: newRating, myCategory: category });

      await rate(resourceId, resourceType, category);
    } catch (error) {
      store.setState({
        rating: prevRating,
        myCategory: prevMyCategory,
      });
      bus.next({ type: "fail", message: toOperationError(error) });
    }
  };
