export const MAX_SCORE = 10;

export const formatCompactCount = (count: number): string => {
  if (count > 99) {
    return "99+";
  }

  return String(count);
};

export const formatScoreAverage = (average: number): string => {
  if (average <= 0) {
    return "N/A";
  }

  return average.toFixed(1);
};
