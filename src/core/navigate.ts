import { navigate as navigateGatsby } from 'gatsby';

const navigate = (url: string): void => {
  // Someone destroyed types definition in new Gatsby version.
  // This is to fix that, if new version release, remove this file.
  navigateGatsby(url as any);
};

export { navigate };
