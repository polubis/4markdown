module.exports = {
  ci: {
    budget: {
      performance: 94,
      accessibility: 90,
      'best-practices': 90,
      seo: 90,
    },
  },
  site: `http://localhost:9000`,
  reporter: `jsonExpanded`,
  scanner: {
    device: `mobile`,
  },
};
