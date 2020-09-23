module.exports = function(api) {
  api.cache(true);

  return {
    presets: [
      "@babel/preset-react", "@babel/preset-env",
      ["@babel/preset-typescript", { allExtensions: true, isTSX: true, }]
    ],
    plugins: [
      ["@babel/plugin-proposal-class-properties", { loose: false }],
      ["@babel/plugin-transform-async-to-generator"],
      ["module-resolver", { alias:  {
          "app": "./app"
        }}]
    ]
  };
};