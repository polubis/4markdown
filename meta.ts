export const meta = {
  appName: `4Markdown`,
  lang: `en`,
  contactEmail: `greenonsoftware@gmail.com`,
  company: `GreenOn Software`,
  blogUrl: `https://greenonsoftware.com/articles`,
  siteUrl: `https://4markdown.com`,
  description: `Craft, edit, and preview your Markdown documents with ease, all within a clean and user-friendly interface`,
  title: `4Markdown - Online Markdown Editor`,
  companyUrl: `https://greenonsoftware.com`,
  authorsUrl: `https://greenonsoftware.com/authors`,
  discordUrl: `https://discord.com/invite/PxXQayT3x3`,
  linkedInUrl: `https://www.linkedin.com/company/greenon-software`,
  sourceCodeUrl: `https://github.com/polubis/4markdown`,
  ytChannelUrl: `https://www.youtube.com/channel/UCg3avsGct9zd_zK9AVpTOmQ`,
  fbGroupUrl: `https://www.facebook.com/groups/1472987149805006`,
  grammarlyUrl: `https://chromewebstore.google.com/detail/grammarly-grammar-checker/kbfnbcaeplbcioakkpcpgfkobkghlhen?pli=1`,
  ytVideoTutorialUrl: `https://www.youtube.com/watch?v=t3Ve0em65rY`,
  mdCheatsheet: `https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet`,
  routes: {
    home: `/`,
    docs: {
      preview: `/document-preview/`,
      educationZone: `/education-zone/`,
    },
    notFound: `/404/`,
    privacyPolicy: `/privacy-policy/`,
  },
  legacyRoutes: {
    docs: {
      preview: `/docs/preview/`, // Now "/document/preview/""
      browse: `/docs/browse/`, // Now "/education-zone/"
    },
  },
} as const;
