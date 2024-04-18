export default {
  // Production clone environment
  site: `https://soft-pithivier-093469.netlify.app`,
  ci: {
    budget: {
      performance: 90,
      accessibility: 90,
      'best-practices': 90,
      seo: 90,
    },
  },
  reporter: `lighthouseServer`,
  scanner: {
    device: `mobile`,
  },
};
