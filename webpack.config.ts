/* eslint-disable @typescript-eslint/naming-convention */
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
import { Configuration } from 'webpack';

const config: Configuration = {
  node: {
    global: true,
  },
  resolve: {
    fallback: {
      fs: require.resolve('browserify-fs'),
      tls: require.resolve('tls'),
      net: require.resolve('net'),
      child_process: false,
    },
  },
  plugins: [new NodePolyfillPlugin()],
};

export default config;
