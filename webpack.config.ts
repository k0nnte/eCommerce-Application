import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyPlugin from "copy-webpack-plugin";

type Mode = 'production' | 'development';

interface IenvVar{
  mode: Mode;
  port: number;
}



export default (env: IenvVar) => {

  const isDevelop = env.mode === 'development';
  
  const config: webpack.Configuration = {
    mode: env.mode ?? 'development',

    entry: path.resolve(__dirname,'src', 'main.ts'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].[contenthash].js",
        clean: true,

    },
    plugins: [
        new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'public', 'index.html'), favicon: path.resolve(__dirname, 'public', 'favicon.ico') }),
       !isDevelop && new MiniCssExtractPlugin({
          filename: 'css/[name].[contenthash].css',
          chunkFilename: 'css/[name].[contenthash].css'
        }),
        new CopyPlugin({
          patterns: [
            { from: path.resolve(__dirname,"public", "files"), to: path.resolve(__dirname, "dist", 'files') }
          ],
        }),
    ],
    module: {
        rules: [
          {
            // test: /\.s[ac]ss$/i,
            test: /\.s?[ac]ss$/i,
            use: [
              isDevelop ?  'style-loader' :  MiniCssExtractPlugin.loader,
               "css-loader",
               "sass-loader"
            ],
          },
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
          {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
          },
        ],
      },
      resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
          '@': path.resolve(__dirname, 'src')
        }
      },
      devtool: isDevelop ? 'inline-source-map' : false,
      devServer: isDevelop ?  {
        port: env.port ?? 8080,
        hot: true
      } : undefined
}
    return config;
    
   
  };