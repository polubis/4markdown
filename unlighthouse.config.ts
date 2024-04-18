export default {
  // Production clone environment
  site: `https://soft-pithivier-093469.netlify.app`,
  ci: {
    budget: {
      performance: 94,
      accessibility: 94,
      'best-practices': 94,
      seo: 94,
    },
  },
  reporter: `jsonExpanded`,
  scanner: {
    device: `mobile`,
  },
};
