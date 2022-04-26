import {
	addPluginTemplate,
	createResolver,
	defineNuxtModule,
	isNuxt2,
} from '@nuxt/kit';

export default defineNuxtModule({
	meta: {
		name: '@morev/smooth-scroll',
		configKey: 'smoothScroll',
		compatibility: {},
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
