/*
|--------------------------------------------------------------------------
| import npm packages
|--------------------------------------------------------------------------
*/
const router = require('express-promise-router')();
const multer = require('multer');
const createError = require('http-errors');

/*
|--------------------------------------------------------------------------
| import helper validations
|--------------------------------------------------------------------------
*/
const { verifyUserAccessToken } = require('../helpers/jwtHelper');
const { payloadDecryption } = require('../helpers/customMiddleware');

/*
|--------------------------------------------------------------------------
| import user define files
|--------------------------------------------------------------------------
*/
const config = require('../configuration/config');
const { httpStatusCodeMessages } = require('../utilities/constants');

/*
|--------------------------------------------------------------------------
| import controllers
|--------------------------------------------------------------------------
*/
const { testController } = require('../controllers/TestController');

/*
|--------------------------------------------------------------------------
| Application Statuses routes
|--------------------------------------------------------------------------
*/
router.route('/test').get(testController);

module.exports = router;
