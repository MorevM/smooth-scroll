import { test, expect } from '../playwright-coverage.js';
import {
	STICKY_BLOCKS,
	VIEWPORT_SIZE,
	EXPECTATIONS,
	getPageScroll,
} from '../utility.js';

test.describe('SmoothScroll', () => {
	test.describe('Horizontal scrolling', () => {
		test.use({
			viewport: {
				width: VIEWPORT_SIZE,
				height: 720,
			},
		});

		test.beforeEach(async ({ page }) => {
			await page.goto('/');
			await page.check('[name="axis"][value="x"]');
		});

		/**
		 * Test `inline: start` option
		 */
		test('Scrolls to position where left edge of the block is on the left edge of the viewport if `inline` option set to `start`', async ({ page }) => {
			// Setup testing environment
			await page.check('[name="alignment"][value="start"]');
			await page.evaluate((sticky) => window._sut.init({
				inline: 'start',
				fixedElements: { x: sticky },
			}), STICKY_BLOCKS);

			// Scroll right
			for (let i = 2; i <= 8; i++) {
				await page.evaluate((target) => window._sut.instance.to(target), `#block-${i}`);

				const result = await getPageScroll(page, 'x');
				const expected = EXPECTATIONS['start'][`#block-${i}`][0]; // eslint-disable-line dot-notation

				expect(result, `Scroll right to #block-${i}`).toBe(expected);
			}

			// Scroll left
			for (let i = 7; i >= 1; i--) {
				await page.evaluate((target) => window._sut.instance.to(target), `#block-${i}`);

				const result = await getPageScroll(page, 'x');
				const expected = EXPECTATIONS['start'][`#block-${i}`][1]; // eslint-disable-line dot-notation

				expect(result, `Scroll left to #block-${i}`).toBe(expected);
			}
		});

		/**
		 * Test `inline: end` option
		 */
		test('Scrolls to position where right edge of the block is on the right edge of the viewport if `inline` option set to `end`', async ({ page }) => {
			// Setup testing environment
			await page.check('[name="alignment"][value="end"]');
			await page.evaluate((sticky) => window._sut.init({
				inline: 'end',
				fixedElements: { x: sticky },
			}), STICKY_BLOCKS);

			// Scroll right
			for (let i = 2; i <= 8; i++) {
				await page.evaluate((target) => window._sut.instance.to(target), `#block-${i}`);

				const result = await getPageScroll(page, 'x');
				const expected = EXPECTATIONS['end'][`#block-${i}`][0]; // eslint-disable-line dot-notation

				expect(result, `Scroll right to #block-${i}`).toBe(expected);
			}

			// Scroll left
			for (let i = 7; i >= 1; i--) {
				await page.evaluate((target) => window._sut.instance.to(target), `#block-${i}`);

				const result = await getPageScroll(page, 'x');
				const expected = EXPECTATIONS['end'][`#block-${i}`][1]; // eslint-disable-line dot-notation

				expect(result, `Scroll left to #block-${i}`).toBe(expected);
			}
		});

		/**
		 * Test `inline: center` option
		 */
		test('Scrolls to position where center of the block is on the center of the viewport (considering sticky blocks) if `inline` option set to `center`', async ({ page }) => {
			// Setup testing environment
			await page.check('[name="alignment"][value="center"]');
			await page.evaluate((sticky) => window._sut.init({
				inline: 'center',
				fixedElements: { x: sticky },
			}), STICKY_BLOCKS);

			// Scroll right
			for (let i = 2; i <= 8; i++) {
				await page.evaluate((target) => window._sut.instance.to(target), `#block-${i}`);

				const result = await getPageScroll(page, 'x');
				const expected = EXPECTATIONS['center'][`#block-${i}`][0]; // eslint-disable-line dot-notation

				expect(result, `Scroll right to #block-${i}`).toBe(expected);
			}

			// Scroll left
			for (let i = 7; i >= 1; i--) {
				await page.evaluate((target) => window._sut.instance.to(target), `#block-${i}`);

				const result = await getPageScroll(page, 'x');
				const expected = EXPECTATIONS['center'][`#block-${i}`][1]; // eslint-disable-line dot-notation

				expect(result, `Scroll left to #block-${i}`).toBe(expected);
			}
		});
	});
});
