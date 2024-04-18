export default {
  // Production clone environment
  site: `http://localhost:9000`,
  ci: {
    budget: {
      performance: 92,
      accessibility: 92,
      'best-practices': 92,
      seo: 92,
    },
  },
  reporter: `jsonExpanded`,
  scanner: {
    device: `mobile`,
  },
};
