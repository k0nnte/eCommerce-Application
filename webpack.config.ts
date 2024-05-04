import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";

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
        new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'public', 'index.html') })
    ],
    module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
        ],
      },
      resolve: {
        extensions: ['.tsx', '.ts', '.js'],
      },
      devtool: isDevelop ? 'inline-source-map' : false,
      devServer: isDevelop ?  {
        port: env.port ?? 8080,
        hot: true
      } : undefined
}
    return config;
    
   
  };