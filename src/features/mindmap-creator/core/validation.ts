const validationLimits = {
  name: {
    min: 1,
    max: 70,
  },
  description: {
    min: 110,
    max: 160,
  },
} as const;

export { validationLimits };
