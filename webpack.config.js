const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/js/index.js', // Точка входа
    output: {
      filename: 'bundle.js', // Имя выходного файла
      path: path.resolve(__dirname, 'dist'), // Папка для сборки
      clean: true, // Очистка папки dist перед каждой сборкой
    },
    devServer: {
      static: './dist', // Папка для сервера разработки
      hot: true, // Горячая перезагрузка
    },
    module: {
      rules: [
        // Обработка JavaScript
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        // Обработка CSS
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader',
          ],
        },
        // Обработка изображений
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[hash][ext][query]',
          },
        },
        // Обработка шрифтов
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[hash][ext][query]',
          },
        },
      ],
    },
    plugins: [
      // Обработка HTML
      new HtmlWebpackPlugin({
        template: './src/index.html', // Шаблон HTML
      }),
      // Минификация CSS
      new MiniCssExtractPlugin({
        filename: 'index.css',
      }),
    ],
    optimization: {
      minimizer: [
        // Минификация CSS
        new CssMinimizerPlugin(),
      ],
    },
    mode: isProduction ? 'production' : 'development', // Режим сборки
  };
};