/*
|--------------------------------------------------------------------------
| import npm packages
|--------------------------------------------------------------------------
*/
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

/*
|--------------------------------------------------------------------------
| import user define files
|--------------------------------------------------------------------------
*/
const config = require('../configuration/config');
const { httpStatusCodeMessages } = require('../utilities/constants');

/*
|--------------------------------------------------------------------------
| App secret
|--------------------------------------------------------------------------
*/
const appAccessTokenSecret = config.appAccessTokenSecret;

/*
|--------------------------------------------------------------------------
| write JWT helper functions
|--------------------------------------------------------------------------
*/
const verifyUserAccessToken = async (req, res, next) => {
	if (!req.headers['authorization']) return next(createError(401, httpStatusCodeMessages.http_400_tokenRequired));

	const token = req.headers['authorization'].split(' ')[1];

	try {
		jwt.verify(token, appAccessTokenSecret, (error, payload) => {
			if (error) {
				if (error.name === 'TokenExpiredError') {
					return next(createError(401, httpStatusCodeMessages.http_401_tokenExpire, { error }));
				} else {
					return next(createError(401, httpStatusCodeMessages.http_400_invalidToken, { error }));
				}
			} else {
				// payload verifcation
				// 1. encrypted data
				// 2. user exsits or not and active or not
			}

			req.payload = payload;
			next();
		});
	} catch (error) {
		return next(createError(500, httpStatusCodeMessages.http_500, { error }));
	}
};

module.exports = { verifyUserAccessToken };
