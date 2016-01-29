module.exports = {
  entry: [
     'babel-polyfill',
     './index.js'
   ],
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
    loaders: [
      { test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ],
  },
  stats: {
   colors: true,
   reasons: true
  },
  debug: true,
  devtool: 'source-map',
  devServer: {
    port: 8081,
    progress: true,
    colors: true
  }
}
