import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import babelPluginFactory from 'rollup-plugin-babel';
import pkg from './package.json';
import peerDep from 'rollup-plugin-peer-deps-external';
import del from 'rollup-plugin-delete';

const extensions = ['.js', '.ts'];
process.env.BABEL_ENV = 'production';

export default {
    input: './src/index.ts',
    plugins: [
        del({
            targets: 'dist/*',
            verbose: true
        }),
        peerDep(),
        nodeResolve({extensions}),
        commonjs({
            include: 'node_modules/**/*'
        }),
        babelPluginFactory({
            extensions,
            include: ['./**/*'],
            runtimeHelpers: true
        })
    ],
    output: [{file: pkg.module, format: 'es'}]
};
