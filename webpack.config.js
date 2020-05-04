const pkg = require('./package.json')

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: './src/index.ts',
  output: {
    library: pkg.libraryName,
    libraryTarget: 'umd',
    path: process.cwd(),
    filename: pkg.main
  },
  resolve: {
    extensions: ['.ts', '.js', '.css']
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              esModule: true,
              modules: true
            }
          }
        ]
      }
    ]
  },
  devtool: 'eval-source-map',
  devServer: {
    contentBase: './'
  }
}
