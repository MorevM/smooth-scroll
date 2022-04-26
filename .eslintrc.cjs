module.exports = {
	root: true,
	extends: [
		'@morev/eslint-config/base',
		'@morev/eslint-config/node',
		'@morev/eslint-config/browser',
		'@morev/eslint-config/preset/typescript',
		'@morev/eslint-config/preset/assistive',
		'@morev/eslint-config/preset/html',
	],
	rules: {},
	overrides: [
		{
			files: ['**/src/**/*.js'],
			rules: {
				'default-case': 'off',
			},
		},
		{
			files: ['*.ts'],
			rules: {
				'@typescript-eslint/no-empty-interface': 'off',
			},
		},
		{
			files: ['**/__tests__/**/*.js'],
			rules: {
				'no-await-in-loop': 'off',
			},
		},
	],
};
