import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';

export default {
    input: 'src/index.js',
    output: {
        compact: true,
        file: 'dist/index.js',
        name: 'NearSocialRootWidget',
        format: 'iife',
        sourcemap: true,
        globals: {
            'near-api-js': 'nearApi',
            react: 'React',
        },
    },
    external: [
        'react',
        'react-dom',
        'near-api-js',
    ],
    plugins: [
        nodeResolve({
            extensions: ['js'],
        }),
        babel({
            presets: ['@babel/preset-react'],
        }),
        uglify(),
    ],
};
