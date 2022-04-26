import { test, expect } from '../playwright-coverage.js';
import {
	STICKY_BLOCKS,
	VIEWPORT_SIZE,
	EXPECTATIONS,
	getPageScroll,
	getBlockScroll,
} from '../utility.js';

test.describe('SmoothScroll', () => {
	test.describe('Features', () => {
		test.use({
			viewport: {
				width: 1280,
				height: VIEWPORT_SIZE,
			},
		});

		test.beforeEach(async ({ page }) => {
			await page.goto('/');
			await page.check('[name="axis"][value="y"]');
			await page.check('[name="alignment"][value="start"]');
		});

		/**
		 * Test inner blocks scrolling
		 */
		test('Can be used for scrolling a certain block instead of the whole page', async ({ page }) => {
			await page.goto('/#block-4');
			const pageScroll = await getPageScroll(page);

			// Setup testing environment
			await page.evaluate(() => window._sut.init({
				element: document.querySelector('[data-elem="inner-block"]'),
			}));

			// Scroll inner block to its inner element
			await page.evaluate(() => window._sut.instance.to('p:nth-child(4)'));

			expect(await getBlockScroll(page, '[data-elem="inner-block"]')).not.toBe(0);
			expect(await getPageScroll(page)).toBe(pageScroll);

			// Scroll inner block to a certain value
			await page.evaluate(() => window._sut.instance.to(50));

			expect(await getBlockScroll(page, '[data-elem="inner-block"]')).toBe(50);
			expect(await getPageScroll(page)).toBe(pageScroll);
		});

		/**
		 * Test native `scrollTo` method
		 */
		test('Can scroll using the native `scrollTo` method if `SmoothScrollNative` module is used', async ({ page }) => {
			// Setup testing environment
			await page.evaluate((sticky) => window._sut.init({
				block: 'start',
				fixedElements: { y: sticky },
			}, true), STICKY_BLOCKS);

			// Scroll to the target block
			await page.evaluate(() => window._sut.instance.to('#block-2'));
			expect(await getPageScroll(page)).toBe(EXPECTATIONS['start']['#block-2'][0]); // eslint-disable-line dot-notation
		});

		/**
		 * Test `autofocus: true` option
		 */
		test('Sets focus to the target element after scrolling if `autofocus` option set to `true`', async ({ page }) => {
			// Setup testing environment
			await page.evaluate((sticky) => window._sut.init({
				block: 'start',
				autofocus: true,
				fixedElements: { y: sticky },
			}), STICKY_BLOCKS);

			// Scroll to the block previous to the sticky block
			await page.evaluate(() => window._sut.instance.to('#block-2'));

			await expect(page.locator('#block-2')).toBeFocused();
			expect(await getPageScroll(page)).toBe(EXPECTATIONS['start']['#block-2'][0]); // eslint-disable-line dot-notation

			// Scroll to the block next to the sticky block
			await page.evaluate(() => window._sut.instance.to('#block-4'));

			await expect(page.locator('#block-4')).toBeFocused();
			expect(await getPageScroll(page)).toBe(EXPECTATIONS['start']['#block-4'][0]); // eslint-disable-line dot-notation
		});

		/**
		 * Test `options` argument of the `to` method'
		 */
		test('Allows to extend the initial options using the `options` argument of the `to` method', async ({ page }) => {
			// Setup testing environment
			await page.evaluate(() => window._sut.init({
				block: 'start',
			}, true));

			// Scroll to the block start because of initial options
			await page.evaluate(() => window._sut.instance.to('#block-2'));
			expect(await getPageScroll(page)).toBe(EXPECTATIONS['start']['#block-2'][0]); // eslint-disable-line dot-notation

			// Scroll to the block end because custom options overrides the initial for current invocation
			await page.evaluate(() => window._sut.instance.to('#block-2', { block: 'end' }));
			expect(await getPageScroll(page)).toBe(EXPECTATIONS['end']['#block-2'][0]); // eslint-disable-line dot-notation

			// Scroll to the block start because the initial options was not overridden permanently
			await page.evaluate(() => window._sut.instance.to('#block-2'));
			expect(await getPageScroll(page)).toBe(EXPECTATIONS['start']['#block-2'][0]); // eslint-disable-line dot-notation
		});

		/**
		 * Test `addFixedElements` method
		 */
		test('Allows to add fixed elements dynamically after initialization using the `addFixedElements` method', async ({ page }) => {
			// Setup testing environment
			await page.evaluate(() => window._sut.init({
				block: 'start',
				fixedElements: {},
			}));

			// Scroll to the block next to the sticky block ignores it
			await page.evaluate(() => window._sut.instance.to('#block-4'));
			expect(await getPageScroll(page)).not.toBe(EXPECTATIONS['start']['#block-4'][0]); // eslint-disable-line dot-notation

			// Register fixed elements
			await page.evaluate((sticky) => {
				window._sut.instance.addFixedElements('y', 'start', ...sticky.start);
				window._sut.instance.addFixedElements('y', 'end', ...sticky.end);
			}, STICKY_BLOCKS);

			// Scroll to the block next to the sticky block now considers it
			await page.evaluate(() => window._sut.instance.to('#block-4'));
			expect(await getPageScroll(page)).toBe(EXPECTATIONS['start']['#block-4'][0]); // eslint-disable-line dot-notation
		});

		/**
		 * Test `removeFixedElements` method
		 */
		test('Allows to remove fixed elements dynamically after initialization using the `removeFixedElements` method', async ({ page }) => {
			// Setup testing environment
			await page.evaluate((sticky) => window._sut.init({
				block: 'start',
				fixedElements: { y: sticky },
			}), STICKY_BLOCKS);

			// Scroll to the block next to the sticky block considers it
			await page.evaluate(() => window._sut.instance.to('#block-4'));
			expect(await getPageScroll(page)).toBe(EXPECTATIONS['start']['#block-4'][0]); // eslint-disable-line dot-notation

			// Remove all the registered fixed elements
			await page.evaluate((sticky) => {
				window._sut.instance.removeFixedElements(...Object.values(sticky).flat());
			}, STICKY_BLOCKS);

			// Scroll to the block next to the sticky block now ignores it
			await page.evaluate(() => window._sut.instance.to('#block-4'));
			expect(await getPageScroll(page)).not.toBe(EXPECTATIONS['start']['#block-4'][0]); // eslint-disable-line dot-notation
		});
	});
});
