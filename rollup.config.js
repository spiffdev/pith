import pkg from './package.json'
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: pkg.main,
  output: {
    file: './dist/umd.js',
    format: 'umd',
    name: 'pith',
    sourcemap: true
  },
  plugins: [
    typescript(),
    nodeResolve(),
    commonjs(),
  ],
};

