import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';

type Mode = 'production' | 'development';

interface IenvVar{
  mode: Mode;
}



export default (env: IenvVar) => {
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
}
    return config;
    
   
  };