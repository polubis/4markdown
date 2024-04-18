export default {
  // Production clone environment
  site: `https://soft-pithivier-093469.netlify.app`,
  ci: {
    budget: {
      performance: 96,
      accessibility: 100,
      'best-practices': 100,
      seo: 100,
    },
  },
  reporter: `jsonExpanded`,
  scanner: {
    device: `mobile`,
  },
};
