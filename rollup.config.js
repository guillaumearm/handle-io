// rollup.config.js
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

const outputs = [
  { format: 'cjs', outputFolder: 'lib' },
  { format: 'es', outputFolder: 'es' },
  { format: 'umd', outputFolder: 'dist' },
];

export default outputs.map(({ format, outputFolder }) => ({
  input: `src/index.js`,
  output: {
    name: 'HandleIO',
    format,
    file: `${outputFolder}/handle-io.js`,
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
}))
