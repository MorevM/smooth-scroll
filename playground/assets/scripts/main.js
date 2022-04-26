import { SmoothScroll } from '../../../src/smooth-scroll.js'; // eslint-disable-line no-unused-vars
import { SmoothScrollNative } from '../../../src/smooth-scroll-native.js'; // eslint-disable-line no-unused-vars

// Settings
const settings = ['axis', 'alignment'].reduce((acc, name) => {
	acc[name] = document.querySelector(`[name="${name}"]:checked`).value;
	return acc;
}, {});

document.addEventListener('change', async ({ target }) => {
	const input = target;
	const { name, value } = input;

	if (!Object.keys(settings).includes(name)) {
		return;
	}

	window.scrollTo(0, 0);
	await new Promise((resolve) => setTimeout(resolve));

	switch (name) { /* eslint-disable require-atomic-updates */
		case 'axis':
			settings.axis = value;
			document.documentElement.classList[value === 'x' ? 'add' : 'remove']('theme-horizontal');
			break;

		case 'alignment':
			settings.alignment = value;
			break;

		default:
			// no default
			break;
	} /* eslint-enable require-atomic-updates */
});

// Scroll links
const pageScroller = () => new SmoothScroll({
	element: window,
	// duration: [300, 700],
	// easing: easeInOutQuad,
	block: settings.alignment,
	inline: settings.alignment,
	autofocus: true,
	fixedElements: {
		x: settings.axis === 'x'
			? {
				start: ['[data-elem="sticky-block"][data-align="start"].is-fixed'],
				end: ['[data-elem="sticky-block"][data-align="end"].is-fixed'],
			}
			: {},
		y: settings.axis === 'y'
			? {
				start: ['[data-elem="sticky-block"][data-align="start"].is-fixed'],
				end: ['[data-elem="sticky-block"][data-align="end"].is-fixed'],
			}
			: {},
	},
});

const blockScroller = () => new SmoothScroll({
	element: document.querySelector('[data-elem="inner-block"]'),
	duration: 400,
	// easing: easeInOutQuad,
	block: settings.alignment,
});

document.addEventListener('click', (e) => {
	const link = e.target.closest('[data-use="SmoothScroll"]');
	if (!link) return;

	let scroller;
	let target;

	if (link.dataset.scroller === 'block') {
		scroller = blockScroller();
		target = 'paragraph' in link.dataset
			? `p:nth-child(${link.dataset.paragraph})`
			: 0;
	} else {
		scroller = pageScroller();
		target = link.hash;
	}

	scroller
		.to(target)
		.then(([x, y]) => console.log(`X: ${x}, Y: ${y}`)); // eslint-disable-line no-console

	e.preventDefault();
});

// Sticky blocks
(function initSticky() {
	// Init elements
	document.querySelectorAll('[data-elem="sticky-block"]').forEach((el) => {
		// Reset properties
		el.style.removeProperty('position');
		el.style.removeProperty('top');
		el.style.removeProperty('right');
		el.style.removeProperty('bottom');
		el.style.removeProperty('left');
		el.classList.remove('is-fixed');

		// Set up placeholder
		let placeholder = el.nextElementSibling;

		if (!('stickyPlaceholder' in placeholder.dataset)) {
			placeholder = document.createElement('div');
			placeholder.dataset.stickyPlaceholder = '';
			el.after(placeholder);
		}

		placeholder.style.setProperty('width', settings.axis === 'x' ? `${el.offsetWidth}px` : '1px');
		placeholder.style.setProperty('height', settings.axis === 'x' ? '1px' : `${el.offsetHeight}px`);

		placeholder.style.setProperty('position', 'absolute');
		placeholder.style.setProperty('top', '-9999px');
		placeholder.style.setProperty('left', '-9999px');

		// Fix block
		if (settings.axis === 'x') {
			const isFixed = el.dataset.align === 'start'
				? el.getBoundingClientRect().left <= 0
				: el.getBoundingClientRect().left <= window.innerWidth - el.offsetWidth;

			if (isFixed) {
				el.style.setProperty(el.dataset.align === 'start' ? 'left' : 'right', 0);
				el.style.setProperty('position', 'fixed');
				el.classList.add('is-fixed');

				placeholder.style.removeProperty('height');
				placeholder.style.removeProperty('position');
				placeholder.style.removeProperty('top');
				placeholder.style.removeProperty('left');
			}
		} else {
			const isFixed = el.dataset.align === 'start'
				? el.getBoundingClientRect().top <= 0
				: el.getBoundingClientRect().top <= window.innerHeight - el.offsetHeight;

			if (isFixed) {
				el.style.setProperty(el.dataset.align === 'start' ? 'top' : 'bottom', 0);
				el.style.setProperty('position', 'fixed');
				el.classList.add('is-fixed');

				placeholder.style.removeProperty('width');
				placeholder.style.removeProperty('position');
				placeholder.style.removeProperty('top');
				placeholder.style.removeProperty('left');
			}
		}
	});

	// Init events
	window.addEventListener('load', initSticky);
	window.addEventListener('resize', initSticky);
	window.addEventListener('scroll', initSticky, { passive: true });
}());

// Test mode
window._sut = {
	instance: null,
	init(options = {}, native = false) {
		this.instance = native
			? new SmoothScrollNative(options)
			: new SmoothScroll(options);
	},
};
