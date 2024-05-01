import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

const ROOT_PATH = path.resolve('./').replaceAll('\\', '/');
const SRC_PATH = `${ROOT_PATH}/src`;
const DIST_PATH = `${ROOT_PATH}/dist`;

const formatMappings = [
	{ format: 'esm', extension: 'mjs' },
	{ format: 'cjs', extension: 'cjs' },
	{ format: 'umd', extension: 'js', name: 'SmoothScroll' },
];

const processFiles = (...files) => files.reduce((acc, [entry, output]) => {
	formatMappings.forEach(({ format, extension, name }) => {
		acc.push({
			input: `${SRC_PATH}/${entry}.ts`,
			output: {
				file: `${DIST_PATH}/${output}.${extension}`,
				format,
				name,
				exports: 'named',
				sourcemap: true,
			},
			external: ['@morev/utils', 'js-easing-functions', '@nuxt/kit'],
			plugins: [
				typescript(),
				resolve(),
				commonjs(),
			].filter(Boolean),
		});
	});
	return acc;
}, []).flat();

export default processFiles(
	['lib/smooth-scroll', 'smooth-scroll'],
	['lib/smooth-scroll-native', 'native'],
	['vue', 'vue'],
	['easing', 'easing'],
	['nuxt', 'nuxt'],
);
