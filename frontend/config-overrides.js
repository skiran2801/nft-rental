const { override } = require('customize-cra');

module.exports = override((config) => {
  // Disable source maps for node_modules
  if (config.mode === 'development') {
    config.module.rules.push({
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      enforce: 'pre',
      loader: require.resolve('source-map-loader'),
      exclude: /@babel(?:\/|\\{1,2})runtime|web3|@ethersproject/,
    });
  }
  return config;
}); 