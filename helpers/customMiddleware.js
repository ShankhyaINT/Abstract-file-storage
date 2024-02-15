/*
|--------------------------------------------------------------------------
| import npm packages
|--------------------------------------------------------------------------
*/
const rateLimit = require('express-rate-limit');
const createError = require('http-errors');
const CryptoJS = require('crypto-js');

/*
|--------------------------------------------------------------------------
| import user define files
|--------------------------------------------------------------------------
*/
const { httpStatusCodeMessages } = require('../utilities/constants');
const config = require('../configuration/config');

/*
|--------------------------------------------------------------------------
| App secret
|--------------------------------------------------------------------------
*/
const dataEncryptionSecret = config.dataEncryptionSecret;

/*
|--------------------------------------------------------------------------
| define rateLimit
|--------------------------------------------------------------------------
*/
const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 2, // Limit each IP to 400 requests per `window` (here, per 5 minutes)
	standardHeaders: false, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers

	/**
	 * The skipSuccessfulRequests option is set to false, which means that
	 * successful requests will be counted towards the rate limit. If it were
	 * set to true, successful requests would not be counted towards the rate limit.
	 */
	skipSuccessfulRequests: false,
	handler: function (req, res, next) {
		return next(createError(429, httpStatusCodeMessages.http_429));
	},
});

const payloadDecryption = async (req, res, next) => {
	if (config.environment == 'development') {
		if (
			req.get('User-Agent') == 'vscode-restclient'
			|| req.get('User-Agent') == 'Thunder Client (https://www.thunderclient.com)'
			|| req.get('User-Agent').includes('PostmanRuntime/')
			// || req.get('User-Agent').includes('okhttp/')
		) {
			next();
			return;
		}
	}

	Object.keys(req.body).forEach((key) => {
		req.body[key] = CryptoJS.AES.decrypt(req.body[key], dataEncryptionSecret).toString(CryptoJS.enc.Utf8);
	});
	next();
};

module.exports = {
	limiter,
	payloadDecryption,
};
