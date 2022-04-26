/**
 * Sticky blocks that should be supplied
 * to the `fixedElements` option
 */
export const STICKY_BLOCKS = {
	start: ['[data-elem="sticky-block"][data-align="start"].is-fixed'],
	end: ['[data-elem="sticky-block"][data-align="end"].is-fixed'],
};

/**
 * Viewport width/height will be set explicitly
 * because it affects the expected values,
 * it should make tests less fragile
 */
export const VIEWPORT_SIZE = 800;

/**
 * We set the expected values manually
 * because it is really hard to make it dynamically calculated
 * without reproducing the tested object logic
 */
export const EXPECTATIONS = Object.entries({
	start: {
		'#block-1': 0,
		'#block-2': 600,
		'#block-3': 1200,
		'#block-4': 1800,
		'#block-5': 3000,
		'#block-6': 3700,
		'#block-7': 4300,
		'#block-8': 5370,
	},
	end: {
		'#block-1': 0,
		'#block-2': 400,
		'#block-3': 1070,
		'#block-4': 2270,
		'#block-5': 2870,
		'#block-6': 3670,
		'#block-7': 4870,
		'#block-8': 5370,
	},
	center: {
		'#block-1': 0,
		'#block-2': 500,
		'#block-3': 1170,
		'#block-4': 2035,
		'#block-5': [2935, 2985],
		'#block-6': 3685,
		'#block-7': 4585,
		'#block-8': 5370,
	},
}).reduce((acc, [align, values]) => {
	acc[align] = Object.entries(values).reduce((acc2, [block, value]) => {
		acc2[block] = [...[value].flat(), value[0] ?? value].slice(0, 2);
		return acc2;
	}, {});
	return acc;
}, {});

/**
 * Retrieves page scroll position in Playwright tests.
 *
 * @param     {object}            page     The `Page` object provided by Playwright tests.
 * @param     {string}            [axis]   Scroll axis (`x` or `y`).
 *
 * @returns   {Promise<number>}            Promise object representing page scroll position value by a given axis.
 */
export const getPageScroll = async (page, axis = 'y') => {
	return axis === 'x'
		? page.evaluate(() => window.scrollX)
		: page.evaluate(() => window.scrollY);
};

/**
 * Retrieves a given element scroll position in Playwright tests.
 *
 * @param     {object}            page       The `Page` object provided by Playwright tests.
 * @param     {string}            selector   Selector of the element being evaluated.
 * @param     {string}            [axis]     Scroll axis (`x` or `y`).
 *
 * @returns   {Promise<number>}              Promise object representing a given element scroll position value by a given axis.
 */
export const getBlockScroll = async (page, selector, axis = 'y') => {
	return axis === 'x'
		? page.evaluate((_selector) => document.querySelector(`${_selector}`).scrollLeft, selector)
		: page.evaluate((_selector) => document.querySelector(`${_selector}`).scrollTop, selector);
};
