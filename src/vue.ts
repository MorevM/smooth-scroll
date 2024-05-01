// @ts-nocheck -- nvm
import { SmoothScroll } from './lib/smooth-scroll';

export default {
	install: (Vue, options = {}) => {
		Vue.prototype.$scroll = new SmoothScroll(options);
	},
};
