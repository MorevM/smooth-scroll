export default {
	testDir: './__tests__/tests',
	globalSetup: './__tests__/bootstrap.js',
	outputDir: './tmp/tests/artifacts',
	timeout: 0,
	retries: 1,
	use: {
		browserName: 'chromium',
		baseURL: 'http://localhost:3001',
		viewport: {
			width: 1280,
			height: 720,
		},
		trace: 'on-first-retry',
	},
	webServer: {
		command: 'yarn _compile:test',
		port: 3001,
		timeout: 0,
		reuseExistingServer: !process.env.CI,
	},
};
