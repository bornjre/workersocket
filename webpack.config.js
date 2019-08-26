const path = require('path');

module.exports = {
  entry: {
    main : './src/index.ts',
    webworker: './src/webworker.ts'
  },
  mode:'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: '[name].js',
    //path: path.resolve(__dirname, 'dist')
  }
};