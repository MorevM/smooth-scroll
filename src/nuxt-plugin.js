/* eslint-disable */

import { <%= options.importName %> as Instance } from '@morev/smooth-scroll';

const scroller = new Instance(<%= JSON.stringify(options.options || {}) %>);

// <% if (options.isNuxt2) { %>

export default (ctx, inject) => {
	inject('<%= options.instanceName %>', scroller);
	inject('<%= options.methodName %>', scroller.to.bind(scroller));
};

// <% } else { %>

export default defineNuxtPlugin(nuxtApp => {
	return {
    provide: {
      '<%= options.instanceName %>': scroller,
      '<%= options.methodName %>': scroller.to.bind(scroller),
    }
  }
})

// <% } %>
