const pkg = require('./package.json')

const config = {
  entry: pkg.source,
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
              modules: {
                localIdentName: `${pkg.libraryName}-[local]_[hash:base64:5]`
              }
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

module.exports = [
  Object.assign({}, config, {
    output: {
      library: pkg.name,
      libraryTarget: 'umd',
      libraryExport: 'default',
      path: process.cwd(),
      filename: pkg.main
    }
  })
]
