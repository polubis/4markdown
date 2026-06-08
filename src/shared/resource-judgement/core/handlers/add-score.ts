import type { Score, ScoreValue } from "../../domain/models";
import {
  addDocumentScore as addDocumentScoreApi,
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

export const addScore =
  (store: Store, bus: Bus) => async (score: ScoreValue) => {
    const {
      score: prevScore,
      myScore: prevMyScore,
      resourceId,
    } = store.getState();

    try {
      store.setState({
        score: buildOptimisticScore(prevScore, score),
        myScore: score,
      });

      const nextScore = await addDocumentScoreApi(resourceId, score);
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
