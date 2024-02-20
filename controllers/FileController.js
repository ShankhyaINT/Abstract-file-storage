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
const { getDate, deleteFile } = require('../utilities/common');

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
const fileUpload = async (req, res, next) => {
	try {
		const data = req.file;
		res.status(200).json({ status: true, message: 'File uploaded successfully.', data });
	} catch (error) {
		return next(createError(500, httpStatusCodeMessages.http_500, { error }));
	}
};

const fileList = async (req, res, next) => {
	try {
		const folderPath = config.uploadFolder;
		fs.readdir(folderPath, (err, files) => {
			if (err) {
				return next(createError(500, httpStatusCodeMessages.http_500, { err }));
			}

			// List all files in the uploads folder
			res.status(200).json({ status: true, data: files });
		});
	} catch (error) {
		return next(createError(500, httpStatusCodeMessages.http_500, { error }));
	}
};

const fileDelete = async (req, res, next) => {
	try {
        const { files } = req.body;
        const folderPath = config.uploadFolder;
        for (const file of files) {
            await deleteFile(`${folderPath}/${file}`);
        }
        res.status(200).json({ status: true, message: "File(s) deleted." });
	} catch (error) {
		return next(createError(500, httpStatusCodeMessages.http_500, { error }));
	}
};

module.exports = {
	fileUpload,
	fileList,
	fileDelete,
};
