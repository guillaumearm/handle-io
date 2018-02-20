// rollup.config.js
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

const OUTPUT_FORMAT = process.env.OUTPUT_FORMAT || 'es'

export default {
  input: 'src/index.js',
  output: {
    name: 'HandleIO',
    format: OUTPUT_FORMAT,
  },
  plugins: [
    nodeResolve({
      main: true,
      module: true,
      jsnext: true,
    }),

    commonjs({
      include: 'node_modules/**',
      extensions: [ '.js' ],
    })
  ]
};
