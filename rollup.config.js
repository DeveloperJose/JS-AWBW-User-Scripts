import babel from '@rollup/plugin-babel'
import nodeResolve from '@rollup/plugin-node-resolve'
export default {
    input: 'music_player/main.js',
    output: {
      file: 'dist/bundle.js',
      format: 'iife',
      sourcemap: false,
    },
    plugins: [
        nodeResolve({ extensions: ['.js', '.ts', '.tsx'] }),
        babel({ babelHelpers: 'bundled' }),
    ]
  };