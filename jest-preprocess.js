const babelOptions = {
  presets: [`babel-preset-gatsby`, `@babel/preset-typescript`],
  plugins: [
    [`@babel/plugin-proposal-decorators`, { legacy: true }],
    [`@babel/plugin-proposal-class-properties`, { loose: true }],
  ],
};

module.exports = require(`babel-jest`).default.createTransformer(babelOptions);
