// rollup.config.js
import typescript from 'rollup-plugin-typescript';

export default {
  input: './index.ts',
  output: {
    file: './index.js',
    format: 'cjs'
  },
  plugins: [
    typescript()
  ]
}