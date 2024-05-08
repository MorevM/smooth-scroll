import type { Options } from 'tsup';

export const tsup: Options = {
	sourcemap: false,
	clean: true,
	target: 'esnext',
	format: ['cjs', 'esm'],
	dts: true,
	entryPoints: {
		'index': 'src/index.ts',
		'lib/smooth-scroll': 'src/lib/smooth-scroll.ts',
		'lib/smooth-scroll-native': 'src/lib/smooth-scroll-native.ts',
		'vue': 'src/vue.ts',
		'easing': 'src/easing.ts',
		'nuxt': 'src/nuxt.ts',
	},
	outExtension: ({ format }) => ({ js: format === 'cjs' ? `.${format}` : `.js` }),
};
