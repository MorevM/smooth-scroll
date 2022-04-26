import { SmoothScroll } from './smooth-scroll.js';

const install = (Vue, options = {}) => {
	Vue.prototype.$scroll = new SmoothScroll(options);
};

if (typeof window !== 'undefined' && window.Vue) {
	window.Vue.use({ install });
}

export default {
	install,
};
