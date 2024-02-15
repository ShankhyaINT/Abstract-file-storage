module.exports = {
	env: {
		node: true,
		commonjs: true,
		es2021: true,
	},
	extends: 'eslint:recommended',
	parserOptions: {
		ecmaVersion: 13,
	},
	plugins: ['security'],
	rules: {
		'no-mixed-spaces-and-tabs': 1,
		'no-unused-vars': 1,
		'no-redeclare': 1,
		'no-async-promise-executor': 1,
		'no-useless-escape': 1,
		'no-empty': 1,
		'no-prototype-builtins': 1,
		'no-undef': 1,

		/** security plugin rules **/
		'security/detect-non-literal-fs-filename': 2,
		'security/detect-non-literal-regexp': 2,
		'security/detect-unsafe-regex': 2,
		'security/detect-buffer-noassert': 2,
		'security/detect-child-process': 2,
		'security/detect-disable-mustache-escape': 2,
		'security/detect-eval-with-expression': 2,
		'security/detect-no-csrf-before-method-override': 2,
		'security/detect-non-literal-require': 2,
		'security/detect-object-injection': 1,
		'security/detect-possible-timing-attacks': 1,
		'security/detect-pseudoRandomBytes': 2,
	},
};
