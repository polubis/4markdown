module.exports = {
  testEnvironment: `jsdom`,
  transform: {
    '^.+\\.[jt]sx?$': `<rootDir>/jest-preprocess.js`,
  },
  setupFilesAfterEnv: [`<rootDir>/setup-test-env.js`],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss)$': `identity-obj-proxy`,
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `<rootDir>/__mocks__/file-mock.js`,
    '^development-kit/(.*)': `<rootDir>/src/development-kit/$1`,
    '^store/(.*)': `<rootDir>/src/store/$1`,
    '^core/(.*)': `<rootDir>/src/core/$1`,
    '^components/(.*)': `<rootDir>/src/components/$1`,
    '^design-system/(.*)': `<rootDir>/src/design-system/$1`,
    '^api-4markdown$': `<rootDir>/src/api-4markdown`,
    '^api-4markdown-contracts$': `<rootDir>/src/api-4markdown-contracts`,
  },
  testPathIgnorePatterns: [`node_modules`, `\\.cache`, `<rootDir>.*/public`],
  transformIgnorePatterns: [
    `node_modules/(?!(gatsby|gatsby-script|gatsby-link)/)`,
  ],
  globals: {
    __PATH_PREFIX__: ``,
  },
  testEnvironmentOptions: {
    url: `http://localhost`,
  },
  setupFiles: [`<rootDir>/loadershim.js`],
};
