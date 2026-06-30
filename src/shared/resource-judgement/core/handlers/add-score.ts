import type {
  Score,
  ScoreValue,
  ResourceId,
  ResourceType,
} from "../../domain/models";
import {
  addDocumentScore,
  addMindmapNodeScore,
  addUserProfileScore,
  toOperationError,
} from "../../integration/api";
import { type Bus } from "../bus";
import { type Store } from "../store";

const buildOptimisticScore = (prevScore: Score, score: ScoreValue): Score => {
  const nextCount = prevScore.count + 1;
  const nextAverageRaw =
    (prevScore.average * prevScore.count + score) / nextCount;
  const nextAverage = Math.round(nextAverageRaw * 10) / 10;

  return {
    average: nextAverage,
    count: nextCount,
    values: [...prevScore.values, score],
  };
};

const saveScore = async (
  resourceId: ResourceId,
  resourceType: ResourceType,
  score: ScoreValue,
) => {
  switch (resourceType) {
    case "document":
      return addDocumentScore(resourceId, score);
    case "mindmap-node":
      return addMindmapNodeScore(resourceId, score);
    case "user-profile":
      return addUserProfileScore(resourceId, score);
    case "mindmap":
      throw new Error(`Unsupported resource type: ${resourceType}`);
  }
};

export const addScore =
  (store: Store, bus: Bus) => async (score: ScoreValue) => {
    const {
      score: prevScore,
      myScore: prevMyScore,
      resourceId,
      resourceType,
    } = store.getState();

    try {
      store.setState({
        score: buildOptimisticScore(prevScore, score),
        myScore: score,
      });

      const nextScore = await saveScore(resourceId, resourceType, score);
      store.setState({
        score: nextScore,
        myScore: score,
      });
    } catch (error) {
      store.setState({
        score: prevScore,
        myScore: prevMyScore,
      });
      bus.next({ type: "fail", message: toOperationError(error) });
    }
  };
