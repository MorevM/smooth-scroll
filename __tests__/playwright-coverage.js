import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import { loadNycConfig } from '@istanbuljs/load-nyc-config';
import { test as baseTest, expect } from '@playwright/test';

const nycDir = await loadNycConfig().then((config) => {
	return path.join(process.cwd(), config.tempDir ?? '.nyc_output');
});

const test = baseTest.extend({
	context: async ({ context }, use) => {
		await context.addInitScript(() => {
			window.addEventListener('beforeunload', () => {
				window.collectIstanbulCoverage(JSON.stringify(window.__coverage__));
			});
		});

		await fs.promises.mkdir(nycDir, { recursive: true });
		await context.exposeFunction('collectIstanbulCoverage', (json) => {
			if (!json) return;
			fs.writeFileSync(path.join(nycDir, `playwright_coverage_${randomBytes(16).toString('hex')}.json`), json);
		});

		await use(context);

		for (const page of context.pages()) {
			await page.evaluate(() => window.collectIstanbulCoverage(JSON.stringify(window.__coverage__)));
			await page.close();
		}
	},
});

export { test, expect };
