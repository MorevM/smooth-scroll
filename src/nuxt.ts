import { resolve } from 'node:path';
import { addPluginTemplate, defineNuxtModule, isNuxt2 } from '@nuxt/kit';
import { isArray, omit } from '@morev/utils';
import type { NuxtModuleOptions } from './types';

const BABEL_PLUGIN_NAME = '@babel/plugin-transform-logical-assignment-operators';
const SCOPE = '@morev';
const MODULE_NAME = `${SCOPE}/smooth-scroll`;

export default defineNuxtModule<NuxtModuleOptions>({
	meta: {
		name: MODULE_NAME,
		configKey: 'smoothScroll',
		compatibility: {
			nuxt: '>= 2.17.0 || >=3.5.0',
		},
	},
	defaults: {
		native: false,
		instanceName: 'scroller',
		methodName: 'scrollTo',
	},
	hooks: {},
	setup(options, nuxt) {
		// This is necessary because the package uses utilities
		// that use modern syntax and have not been transpiled.
		if (isNuxt2()) {
			nuxt.options.build.transpile.push('@morev/utils', 'ohash', MODULE_NAME);

			/* @ts-expect-error -- Lack of compatibility with Nuxt 2 */
			nuxt.options.build.babel.plugins ??= [];
			/* @ts-expect-error -- Lack of compatibility with Nuxt 2 */
			const doesBabelPluginExists = nuxt.options.build.babel.plugins.some((plugin) => {
				return isArray(plugin)
					? plugin[0] === BABEL_PLUGIN_NAME
					: plugin === BABEL_PLUGIN_NAME;
			});

			/* @ts-expect-error -- Lack of compatibility with Nuxt 2 */
			!doesBabelPluginExists && nuxt.options.build.babel.plugins.push(BABEL_PLUGIN_NAME);
		}

		addPluginTemplate({
			src: resolve(__dirname, 'nuxt-plugin.js'),
			filename: 'smooth-scroll-plugin.client.js',
			options: {
				options: omit(options, 'methodName', 'instanceName', 'native'),
				instanceName: options.instanceName,
				methodName: options.methodName,
				importName: options.native ? 'SmoothScrollNative' : 'SmoothScroll',
				isNuxt2: isNuxt2(),
			},
		});
	},
});
