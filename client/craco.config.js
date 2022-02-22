module.exports = {
  reactScriptsVersion: "react-scripts" /* (default value) */,
  style: {
    modules: {
      localIdentName: "",
    },
    css: {
      loaderOptions: {
        /* Any css-loader configuration options: https://github.com/webpack-contrib/css-loader. */
      },
    },
    sass: {
      loaderOptions: {
        /* Any sass-loader configuration options: https://github.com/webpack-contrib/sass-loader. */
      },
    },
    /* postcss: {
      mode: "extends"  || "file",
      env: {
        autoprefixer: {
        },
        stage: 3 ,
        features: {
        },
      },
      loaderOptions: {
      },
    },*/
  },
  eslint: {
    enable: true /* (default value) */,
    mode: "extends" /* (default value) */ || "file",
    configure: {
      /* Any eslint configuration options: https://eslint.org/docs/user-guide/configuring */
    },
    configure: (eslintConfig, { env, paths }) => {
      return eslintConfig;
    },
    pluginOptions: {
      /* Any eslint plugin configuration options: https://github.com/webpack-contrib/eslint-webpack-plugin#options. */
    },
  },
  babel: {
    presets: [],
    plugins: [],
    loaderOptions: {
      /* Any babel-loader configuration options: https://github.com/babel/babel-loader. */
    },
  },
  typescript: {
    enableTypeChecking: true /* (default value)  */,
  },
  webpack: {
    alias: {},
    plugins: {
      add: [] /* An array of plugins */,
      remove:
        [] /* An array of plugin constructor's names (i.e. "StyleLintPlugin", "ESLintWebpackPlugin" ) */,
    },
    configure: {
      /* Any webpack configuration options: https://webpack.js.org/configuration */
    },
  },
  jest: {
    babel: {
      addPresets: true /* (default value) */,
      addPlugins: true /* (default value) */,
    },
    configure: {
      /* Any Jest configuration options: https://jestjs.io/docs/en/configuration */
    },
  },
  devServer: {
    /* Any devServer configuration options: https://webpack.js.org/configuration/dev-server/#devserver */
  },
  plugins: [
    {
      plugin: {
        overrideCracoConfig: ({
          cracoConfig,
          pluginOptions,
          context: { env, paths },
        }) => {
          return cracoConfig;
        },
        overrideWebpackConfig: ({
          webpackConfig,
          cracoConfig,
          pluginOptions,
          context: { env, paths },
        }) => {
          return webpackConfig;
        },
        overrideDevServerConfig: ({
          devServerConfig,
          cracoConfig,
          pluginOptions,
          context: { env, paths, proxy, allowedHost },
        }) => {
          return devServerConfig;
        },
        overrideJestConfig: ({
          jestConfig,
          cracoConfig,
          pluginOptions,
          context: { env, paths, resolve, rootDir },
        }) => {
          return jestConfig;
        },
      },
      options: {},
    },
  ],
};
