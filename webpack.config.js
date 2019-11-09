const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './index.tsx',
  mode: "development",

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",
  context: path.resolve(__dirname, 'src'),

  resolve: {
    modules: ['node_modules', 'src'],
    extensions: [ '.ts', '.tsx', '.js'],
  },

  module: {
      rules: [
          {
              test: /\.ts(x?)$/,
              exclude: /node_modules/,
              use: [
                  {
                      loader: "ts-loader"
                  }
              ]
          },
          {
            test: /\.css$/i,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                // options: {
                //   publicPath: (resourcePath, context) => {
                //     // publicPath is the relative path of the resource to the context
                //     // e.g. for ./css/admin/main.css the publicPath will be ../../
                //     // while for ./css/main.css the publicPath will be ../
                //     return path.relative(path.dirname(resourcePath), context) + '..' + '/dist';
                //   },
                // },
                options: {
                  publicPath: 'dist/'
                }
              },
              { loader: 'css-loader', options: { importLoaders: 1 } },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: (loader) => [
                    require('postcss-nested')()
                  ]
                }
              }
            ],
          },
          // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
          {
              enforce: "pre",
              test: /\.js$/,
              loader: "source-map-loader"
          }
      ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
  ],

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  // externals: {
  //     "react": "React",
  //     "react-dom": "ReactDOM"
  // },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  }
};
