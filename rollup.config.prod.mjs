import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

const ROOT_PATH = path.resolve('./').replace(/\\/g, '/');
const SRC_PATH = `${ROOT_PATH}/src`;
const DIST_PATH = `${ROOT_PATH}/dist`;

const formatMappings = [
	{ format: 'esm', extension: 'mjs', useBabel: false },
	{ format: 'cjs', extension: 'cjs', useBabel: false },
	{ format: 'umd', extension: 'js', useBabel: true, name: 'SmoothScroll' },
];

const processFiles = (...files) => files.reduce((acc, [entry, output]) => {
	formatMappings.forEach(({ format, extension, name, useBabel }) => {
		acc.push({
			input: `${SRC_PATH}/${entry}.js`,
			output: {
				file: `${DIST_PATH}/${output}.${extension}`,
				format,
				name,
				exports: 'named',
				sourcemap: true,
			},
			external: ['@morev/helpers', 'js-easing-functions', /@babel\/runtime/, '@nuxt/kit'],
			plugins: [
				resolve(),
				commonjs(),
				babel({
					babelHelpers: 'runtime',
					exclude: new RegExp('/node_modules/'),
					babelrc: false,
					presets: [['@babel/preset-env', { useBuiltIns: false }]],
					plugins: [['@babel/plugin-transform-runtime', { corejs: 3 }]],
				}),
				// terser(),
			].filter(Boolean),
		});
	});
	return acc;
}, []).flat();

export default processFiles(
	['smooth-scroll', 'smooth-scroll'],
	['smooth-scroll-native', 'native'],
	['vue', 'vue'],
	['easing', 'easing'],
	['nuxt', 'nuxt'],
);
