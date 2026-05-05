import type { Atoms } from "api-4markdown-contracts";
import type { MindmapPreviewOkMindmap } from "store/mindmap-preview/models";

type MindmapPreviewNode = MindmapPreviewOkMindmap["nodes"][number];

const ratingCategories: (keyof Atoms["Rating"])[] = [
  `perfect`,
  `good`,
  `decent`,
  `bad`,
  `ugly`,
];

const sumRatingVotes = (
  rating: Partial<Atoms["Rating"]> | undefined,
): number => {
  if (!rating) return 0;
  return ratingCategories.reduce((acc, key) => acc + (rating[key] ?? 0), 0);
};

const toBullshitAverage = (scoreAverage: number): number => {
  if (scoreAverage <= 0) return 0;
  return 11 - scoreAverage;
};

const toRatingAverage = (rating: Atoms["Rating"]): number => {
  const totalVotes = sumRatingVotes(rating);
  if (totalVotes === 0) return 0;

  const weightedSum =
    rating.perfect * 5 +
    rating.good * 4 +
    rating.decent * 3 +
    rating.bad * 2 +
    rating.ugly * 1;

  return weightedSum / totalVotes;
};

type NodeEngagementShape = {
  perfect?: number;
  good?: number;
  decent?: number;
  bad?: number;
  ugly?: number;
  scoreAverage?: number;
  scoreCount?: number;
  data?: { commentsCount?: number };
};

const getNodeEngagement = (node: MindmapPreviewNode): NodeEngagementShape =>
  node as NodeEngagementShape;

const aggregateMindmapPreviewDetails = (mindmap: MindmapPreviewOkMindmap) => {
  const aggregatedRating: Atoms["Rating"] = {
    perfect: 0,
    good: 0,
    decent: 0,
    bad: 0,
    ugly: 0,
  };

  let totalComments = 0;
  let scoreWeightedSum = 0;
  let scoreWeightTotal = 0;
  let nodesWithScores = 0;

  for (const node of mindmap.nodes) {
    const n = getNodeEngagement(node);
    for (const key of ratingCategories) {
      aggregatedRating[key] += n[key] ?? 0;
    }
    totalComments += n.data?.commentsCount ?? 0;
    const count = n.scoreCount ?? 0;
    const avg = n.scoreAverage ?? 0;
    if (count > 0 && avg > 0) {
      scoreWeightedSum += avg * count;
      scoreWeightTotal += count;
      nodesWithScores += 1;
    }
  }

  const totalRatingVotes = sumRatingVotes(aggregatedRating);
  const mapLevelRatingAverage = toRatingAverage(aggregatedRating);
  const mapLevelScoreAverage =
    scoreWeightTotal > 0 ? scoreWeightedSum / scoreWeightTotal : 0;
  const mapLevelBullshitAverage = toBullshitAverage(mapLevelScoreAverage);

  return {
    nodeCount: mindmap.nodes.length,
    edgeCount: mindmap.edges.length,
    aggregatedRating,
    totalRatingVotes,
    mapLevelRatingAverage,
    totalComments,
    mapLevelScoreAverage,
    mapLevelBullshitAverage,
    nodesWithScores,
    scoreSubmissionCount: scoreWeightTotal,
  };
};

export { aggregateMindmapPreviewDetails, sumRatingVotes, ratingCategories };
