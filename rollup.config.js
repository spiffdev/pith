import swc from 'rollup-plugin-swc'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import pkg from './package.json'

export default [
  {
    input: pkg.main,
    plugins: [
      typescript(),
      swc(),
    ],
    output: {
      file: pkg.publishConfig.module,
      format: 'es',
      sourcemap: true
    }
  },
  {
    input: pkg.main,
    plugins: [
      typescript(),
      commonjs(),
      swc(),
    ],
    output: {
      file: pkg.publishConfig.main,
      format: 'cjs',
      sourcemap: true
    }
  }
]
