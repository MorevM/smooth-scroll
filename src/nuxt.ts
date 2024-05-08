import { addPluginTemplate, createResolver, defineNuxtModule, isNuxt2 } from '@nuxt/kit';
import type { PartialOptions } from './types';

export default defineNuxtModule<PartialOptions>({
	meta: {
		name: '@morev/smooth-scroll',
		configKey: 'smoothScroll',
		compatibility: {
			nuxt: '>= 2.17.0 || >=3.5.0',
		},
	},
	defaults: {},
	hooks: {},
	setup(options, nuxt) {
		const resolver = createResolver(import.meta.url);

		addPluginTemplate({
			src: resolver.resolve('nuxt-plugin.js'),
			filename: 'smooth-scroll-plugin.client.js',
			options: {
				options,
				isNuxt2: isNuxt2(),
			},
		});
	},
});
