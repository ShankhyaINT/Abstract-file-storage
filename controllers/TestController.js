/*
|--------------------------------------------------------------------------
| import npm packages
|--------------------------------------------------------------------------
*/
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const createError = require('http-errors');
const Entities = require('html-entities').AllHtmlEntities;

/*
|--------------------------------------------------------------------------
| import node default module
|--------------------------------------------------------------------------
*/
const fs = require('fs');
const path = require('path');

/*
|--------------------------------------------------------------------------
| import user define files
|--------------------------------------------------------------------------
*/
const config = require('../configuration/config');
const { httpStatusCodeMessages } = require('../utilities/constants');
const { getDate } = require('../utilities/common');

/*
|--------------------------------------------------------------------------
| env variables
|--------------------------------------------------------------------------
*/
const appAccessTokenSecret = config.appAccessTokenSecret;

/*
|--------------------------------------------------------------------------
| create object for Entities - it is only working on string
|--------------------------------------------------------------------------
*/
const entities = new Entities();

/*
|--------------------------------------------------------------------------
| Controller
|--------------------------------------------------------------------------
*/
const testController = async (req, res, next) => {
	try {
		res.status(200).json({ status: true, data: [], message: "Working ... " });
	} catch (error) {
		return next(createError(500, httpStatusCodeMessages.http_500, { error }));
	}
};

module.exports = {
	testController,
};
