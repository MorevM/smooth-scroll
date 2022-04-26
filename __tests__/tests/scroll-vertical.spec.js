import { test, expect } from '../playwright-coverage.js';
import {
	STICKY_BLOCKS,
	VIEWPORT_SIZE,
	EXPECTATIONS,
	getPageScroll,
} from '../utility.js';

test.describe('SmoothScroll', () => {
	test.describe('Vertical scrolling', () => {
		test.use({
			viewport: {
				width: 1280,
				height: VIEWPORT_SIZE,
			},
		});

		test.beforeEach(async ({ page }) => {
			await page.goto('/');
			await page.check('[name="axis"][value="y"]');
		});

		/**
		 * Test `block: start` option
		 */
		test('Scrolls to position where top edge of the block is on the top edge of the viewport if `block` option set to `start`', async ({ page }) => {
			// Setup testing environment
			await page.check('[name="alignment"][value="start"]');
			await page.evaluate((sticky) => window._sut.init({
				block: 'start',
				fixedElements: { y: sticky },
			}), STICKY_BLOCKS);

			// Scroll down
			for (let i = 2; i <= 8; i++) {
				await page.evaluate((target) => window._sut.instance.to(target), `#block-${i}`);

				const result = await getPageScroll(page, 'y');
				const expected = EXPECTATIONS['start'][`#block-${i}`][0]; // eslint-disable-line dot-notation

				expect(result, `Scroll down to #block-${i}`).toBe(expected);
			}

			// Scroll up
			for (let i = 7; i >= 1; i--) {
				await page.evaluate((target) => window._sut.instance.to(target), `#block-${i}`);

				const result = await getPageScroll(page, 'y');
				const expected = EXPECTATIONS['start'][`#block-${i}`][1]; // eslint-disable-line dot-notation

				expect(result, `Scroll up to #block-${i}`).toBe(expected);
			}
		});

		/**
		 * Test `block: end` option
		 */
		test('Scrolls to position where bottom edge of the block is on the bottom edge of the viewport if `block` option set to `end`', async ({ page }) => {
			// Setup testing environment
			await page.check('[name="alignment"][value="end"]');
			await page.evaluate((sticky) => window._sut.init({
				block: 'end',
				fixedElements: { y: sticky },
			}), STICKY_BLOCKS);

			// Scroll down
			for (let i = 2; i <= 8; i++) {
				await page.evaluate((target) => window._sut.instance.to(target), `#block-${i}`);

				const result = await getPageScroll(page, 'y');
				const expected = EXPECTATIONS['end'][`#block-${i}`][0]; // eslint-disable-line dot-notation

				expect(result, `Scroll down to #block-${i}`).toBe(expected);
			}

			// Scroll up
			for (let i = 7; i >= 1; i--) {
				await page.evaluate((target) => window._sut.instance.to(target), `#block-${i}`);

				const result = await getPageScroll(page, 'y');
				const expected = EXPECTATIONS['end'][`#block-${i}`][1]; // eslint-disable-line dot-notation

				expect(result, `Scroll up to #block-${i}`).toBe(expected);
			}
		});

		/**
		 * Test `block: center` option
		 */
		test('Scrolls to position where center of the block is on the center of the viewport (considering sticky blocks) if `block` option set to `center`', async ({ page }) => {
			// Setup testing environment
			await page.check('[name="alignment"][value="center"]');
			await page.evaluate((sticky) => window._sut.init({
				block: 'center',
				fixedElements: { y: sticky },
			}), STICKY_BLOCKS);

			// Scroll down
			for (let i = 2; i <= 8; i++) {
				await page.evaluate((target) => window._sut.instance.to(target), `#block-${i}`);

				const result = await getPageScroll(page, 'y');
				const expected = EXPECTATIONS['center'][`#block-${i}`][0]; // eslint-disable-line dot-notation

				expect(result, `Scroll down to #block-${i}`).toBe(expected);
			}

			// Scroll up
			for (let i = 7; i >= 1; i--) {
				await page.evaluate((target) => window._sut.instance.to(target), `#block-${i}`);

				const result = await getPageScroll(page, 'y');
				const expected = EXPECTATIONS['center'][`#block-${i}`][1]; // eslint-disable-line dot-notation

				expect(result, `Scroll up to #block-${i}`).toBe(expected);
			}
		});
	});
});
