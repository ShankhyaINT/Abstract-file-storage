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
const { fileUpload, fileList, fileDelete } = require('../controllers/FileController');

// Define the storage for uploaded files
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, `${config.uploadFolder}/`); // specify the destination folder
	},
	filename: function (req, file, cb) {
		const timestamp = Date.now();
		const file_originalname = file.originalname;
		const file_extension = file_originalname.split('.').pop();
		const newFileName = `${timestamp}.${file_extension}`;
		cb(null, newFileName); // specify the filename
	},
});

// Create Multer instance with the storage options
const upload = multer({ storage });

/*
|--------------------------------------------------------------------------
| Application Statuses routes
|--------------------------------------------------------------------------
*/
router.route('/upload').post(upload.single('file'), fileUpload);
router.route('/list').get(fileList);
router.route('/delete').delete(fileDelete);

module.exports = router;
