export default {
	all: true,
	include: ['src/**/*.js'],
	exclude: ['**/*nuxt*'],
	tempDir: 'tmp/tests/.nyc_output',
	cacheDir: 'tmp/tests/.nyc_cache',
	reportDir: 'tmp/tests/coverage',
	reporter: ['lcov', 'text'],
};
