const path = require("path");
const webpack = require("webpack");
const ZipPlugin = require("zip-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const ExtensionReloader = require("webpack-extension-reloader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WextManifestWebpackPlugin = require("wext-manifest-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const viewsPath = path.join(__dirname, "views");
const sourcePath = path.join(__dirname, "source");
const destPath = path.join(__dirname, "extension");
const nodeEnv = process.env.NODE_ENV || "development";
const targetBrowser = process.env.TARGET_BROWSER;

const extensionReloaderPlugin =
  nodeEnv === "development"
    ? new ExtensionReloader({
        port: 9090,
        reloadPage: true,
        entries: {
          // TODO: reload manifest on update
          extensionPage: ["popup", "options"],
        },
      })
    : () => {
        this.apply = () => {};
      };

const getExtensionFileType = (browser) => {
  if (browser === "opera") {
    return "crx";
  }

  if (browser === "firefox") {
    return "xpi";
  }

  return "zip";
};

function getStatic(dir) {
  return path.resolve(__dirname, "..", "static", dir)
}

module.exports = {
  devtool: nodeEnv === "development" ? "eval-source-map" : false, // https://github.com/webpack/webpack/issues/1194#issuecomment-560382342

  stats: {
    all: false,
    builtAt: true,
    errors: true,
    hash: true,
  },

  mode: nodeEnv,

  entry: {
    manifest: path.join(sourcePath, "manifest.json"),
    popup: path.join(sourcePath, "Popup", "index.jsx"),
    options: path.join(sourcePath, "Options", "index.jsx"),
    vendor: [getStatic('vendor/custom-elements.min.js'), getStatic('vendor/clr-icons.min.js')],
    styles: [
      getStatic("vendor/clr-icons.min.css"), getStatic("css/style.css"), getStatic("css/inter-font.css"),
      // path.join(sourcePath, "styles", "popup.css"), path.join(sourcePath, "styles", "options.css")
    ]
  },

  output: {
    path: path.join(destPath, targetBrowser),
    filename: "js/[name].bundle.js",
  },

  resolve: {
    extensions: [".js", ".jsx", ".json"],
    alias: {
      "webextension-polyfill": path.resolve(
        path.join(__dirname, "node_modules", "webextension-polyfill")
      ),
    },
  },

  module: {
    rules: [
      {
        type: "javascript/auto", // prevent webpack handling json with its own loaders,
        test: /manifest\.json$/,
        use: {
          loader: "wext-manifest-loader",
          options: {
            usePackageJSONVersion: true, // set to false to not use package.json version for manifest
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(js|ts)x?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].css",
              context: "./source/styles/",
              outputPath: "css/",
            },
          },
          // {
          //   loader: "postcss-loader",
          //   options: {
          //     ident: "postcss",
          //     // eslint-disable-next-line global-require
          //     plugins: [require("autoprefixer")()],
          //   },
          // },
          // "resolve-url-loader",
          // "sass-loader",
        ],
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      SERVER_ENDPOINT:  JSON.stringify(nodeEnv === "development" ? "http://localhost:8080" : "https://forwardmail.herokuapp.com")
    }),
    // Plugin to not generate js bundle for manifest entry
    new WextManifestWebpackPlugin(),
    // Generate sourcemaps
    new webpack.SourceMapDevToolPlugin({filename: false}),
    // environmental variables
    new webpack.EnvironmentPlugin(["NODE_ENV", "TARGET_BROWSER"]),
    // delete previous build files
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        path.join(process.cwd(), `extension/${targetBrowser}`),
        path.join(
          process.cwd(),
          `extension/${targetBrowser}.${getExtensionFileType(targetBrowser)}`
        ),
      ],
      cleanStaleWebpackAssets: false,
      verbose: true,
    }),
    new HtmlWebpackPlugin({
      template: path.join(viewsPath, "popup.html"),
      inject: "body",
      chunks: ["popup", "vendor"],
      filename: "popup.html",
    }),
    new HtmlWebpackPlugin({
      template: path.join(viewsPath, "options.html"),
      inject: "body",
      chunks: ["options"],
      filename: "options.html",
    }),
    // write css file(s) to build folder
    // new MiniCssExtractPlugin({filename: "css/[name].css"}),
    // copy static assets
    new CopyWebpackPlugin([
      {from: getStatic('favicons') + '/favicon-?(16|32|48|128).png', to: 'static/icons', flatten: true},
      {from: getStatic('fonts'), to: 'static/fonts', flatten: true},
    ]),
    // plugin to enable browser reloading in development mode
    extensionReloaderPlugin,
  ],

  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        terserOptions: {
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorPluginOptions: {
          preset: ["default", {discardComments: {removeAll: true}}],
        },
      }),
      new ZipPlugin({
        path: destPath,
        extension: `${getExtensionFileType(targetBrowser)}`,
        filename: `${targetBrowser}`,
      }),
    ],
  },
};
