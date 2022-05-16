/* eslint-disable */
// <% if (options.isNuxt2) { %>

import Vue from 'vue';
// `Nuxt` doesn't respect `exports` field in `package.json` and implicitly
// transform `import` to `require`, thats why where is defined full path
// and `.cjs` extension.
import { SmoothScroll } from '@morev/smooth-scroll/dist/smooth-scroll.cjs';
const scroller = new SmoothScroll(<%= JSON.stringify(options.options || {}) %>);

export default (ctx, inject) => {
	inject('scroll', scroller.to.bind(scroller));
};

// <% } else { %>

import { SmoothScroll } from '@morev/smooth-scroll';
const scroller = new SmoothScroll();

export default defineNuxtPlugin(nuxtApp => {
	return {
    provide: {
      scroll: scroller.to.bind(scroller),
    }
  }
})


// <% } %>
