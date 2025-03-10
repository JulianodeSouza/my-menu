module.exports = function (api) {
  api.cache(false);
  const plugins = [];

  return {
    presets: ['babel-preset-expo'],

    plugins,
  };
};
