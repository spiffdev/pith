import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'

export default [
  {
    input: './src/index.ts',
    plugins: [
      typescript(),
    ],
    output: {
      file: './dist/index.js',
      format: 'es',
      sourcemap: true
    }
  },
  {
    input: './src/index.ts',
    plugins: [
      typescript(),
      commonjs(),
    ],
    output: {
      file: './dist/index.cjs',
      format: 'cjs',
      sourcemap: true
    }
  }
]
