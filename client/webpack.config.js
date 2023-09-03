const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require ('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest, GenerateSW } = require('workbox-webpack-plugin');

// TODO: Add and configure workbox plugins for a service worker and manifest file.
// TODO: Add CSS loaders and babel to webpack.

module.exports = () => {
  return {
    mode: 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    
    plugins: [
      //generates new html page with all necessary links (routes/images...)
      new HtmlWebpackPlugin({
        template: './index.html',
        title: 'Text-Editor 8000'
      }),
      //creating cache
      new InjectManifest({
        swSrc: './src-sw.js',
        swDest: 'src-sw.js',
      }),
      // creates downloadable PWA
      // new GenerateSW(),
      new WebpackPwaManifest({
        name: 'Text-Editor 8000',
        short_name: 'T.E-8000',
        description: 'Keep track of important tasks!',
        background_color: '#7eb4e2',
        theme_color: '#7eb4e2',
        start_url: './',
        publicPath: './',
        icons: [
          {
            src: path.resolve('src/images/logo.png'),
            sizes: [96, 128, 192, 256, 384, 512],
            //created directory assets and directory icons and will save 6 images of different sized (we only listed 6 diff sizes it could be more or less.)
            destination: path.join('assets', 'icons'),
          },
        ],
      }),
    ],

    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.m?js$/,// looking for .mjs or .js files
          exclude: /node_modules/, //excluing node_models
          use: {
            loader: 'babel-loader', //makes js regaurdless of how it was written compatible to different environments
            options: {
              presets: ['@babel/preset-env'],//environment of browser being used
              plugins: [
                '@babel/plugin-proposal-object-rest-spread',//using es6 syntax with spread opperator
                '@babel/transform-runtime'],// reduced on duplication (reduces on size of the package)
            },
          },
        },
      ],
    },
  };
};
