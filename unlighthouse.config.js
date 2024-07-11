module.exports = {
  ci: {
    budget: {
      performance: 90,
      accessibility: 90,
      'best-practices': 90,
      seo: 90,
    },
  },
  reporter: `jsonExpanded`,
  scanner: {
    device: `mobile`,
  },
};
