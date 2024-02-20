/*
|--------------------------------------------------------------------------
| import npm packages
|--------------------------------------------------------------------------
*/
const moment = require('moment');
const request = require('request');
const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
const FileType = require('file-type');
const got = require('got');

/*
|--------------------------------------------------------------------------
| import node default module
|--------------------------------------------------------------------------
*/
const fs = require('fs');
const fs_promises = require('fs').promises;

/*
|--------------------------------------------------------------------------
| write functions which will be re-used
|--------------------------------------------------------------------------
*/
const commonDateFormat = (date, format) => {
	return moment(date).utc().format(format);
};

const commonDateFormat1 = (date, format) => {
	return moment(date).format(format);
};

const dbDateFormat = (date) => {
	// 2022-09-05 15:00:59
	return moment(date).utc().format('YYYY-MM-DD HH:mm:ss');
};

const getHourMin = (date) => {
	// 22:04
	return moment(date).utc().format('HH:mm');
};

const getTimestamp = (date) => {
	return moment(date).unix();
};

const getDate = () => {
	// 2022-09-05 15:00:59
	return moment().format('YYYY-MM-DD HH:mm:ss');
};

const getDBDateOnly = (date) => {
	if (date) {
		// 2022-09-05
		return moment(date).utc().format('YYYY-MM-DD');		
	} else{
		return null;
	}
};

const getFromUnix = (date, format) => {
	return moment.unix(date).format(format);
};

const getValidationMessage = (errors) => {
	errors.forEach((err) => {
		switch (err.type) {
			case 'any.required':
				err.message = `${module.exports.camelCase(err.context.label)} field is required.`;
				break;
			case 'string.pattern.base':
				err.message = `${module.exports.camelCase(err.context.label)} validation failed.`;
				break;

			case 'string.empty':
				err.message = `${module.exports.camelCase(err.context.label)} should not be empty.`;
				break;
			case 'string.min':
				err.message = `${module.exports.camelCase(err.context.label)} should have at least ${
					err.context.limit
				} characters.`;
				break;
			case 'string.max':
				err.message = `${module.exports.camelCase(err.context.label)} should have at most ${
					err.context.limit
				} characters.`;
				break;
			case 'any.allowOnly':
				err.message = `${module.exports.camelCase(err.context.label)} must be any of these ${err.context.valids}`;
				break;
		}
	});
	return errors;
};

const camelCase = (str, seperator = '_') => {
	if (str) {
		return str
			.split(seperator)
			.map(function (word, index) {
				return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
			})
			.join(' ');
	}
};

const download = (url, path) => {
	return new Promise((resolve, reject) => {
		try {
			request.head(url, (err, res, body) => {
				request(url).pipe(fs.createWriteStream(path)).on('close', resolve);
			});
		} catch (error) {
			reject(error);
		}
	});
};

const generateHashAccessToken = (plaintext) => {
	const saltRounds = 10;

	return new Promise((resolve, reject) => {
		bcrypt.hash(plaintext, saltRounds, (err, hash) => {
			if (err) {
				reject(err);
			} else {
				resolve(hash);
			}
		});
	});
};

const verifyHashAccessToken = (plaintext, hashed) => {
	return new Promise((resolve, reject) => {
		bcrypt.compare(plaintext, hashed, (err, res) => {
			if (err) {
				reject(err); // Handle error
			} else {
				resolve(res); // Resolve with the result (true or false)
			}
		});
	});
};

const renameFile = async (oldPath, newPath) => {
	try {
		await fs_promises.rename(oldPath, newPath);
		return true;
	} catch (err) {
		console.error(err);
		return false;
	}
};

const deleteFile = async (filePath) => {
	try {
		await fs_promises.unlink(filePath);
		return true;
	} catch (err) {
		console.error(err);
		return false;
	}
};

const capitalizeWords = (inputString) => {
	// convert into uppercase of first letter of each word
	// example - "super admin" => "Super Admin"
	return inputString.trim().replace(/\b\w/g, (match) => match.toUpperCase());
};

const getPagination = (limit, offset = 0, page = 0) => {
	if (page > 0) {
		offset = (page - 1) * limit;
	}
	return { limit, offset };
};

const logOnConsole = (err) => {
	const stackLines = err.error ? err.error.stack.split('\n') : err.stack.split('\n');
	const firstLine = stackLines[1].trim();
	const errorCustomObj = {
		error_location: firstLine,
		error_message: err.error ? JSON.stringify(err.error.message) : JSON.stringify(err.message),
		// error_object: err.error ? JSON.stringify(err.error) : JSON.stringify(err),
		error_object: JSON.stringify(err),
	};
	console.log(errorCustomObj);
};

const nl2br = async (str) => {
	if (!str) {
		return str;
	}
	return str.replace(/(?:\r\n|\r|\n)/g, '<br>');
};

const validatePassword = (password) => {
	/**
	 * (?=.*[A-Z]): At least one uppercase letter.
	 * (?=.*[a-z]): At least one lowercase letter.
	 * (?=.*\d): At least one digit.
	 * (?=.*[!@#$%^&*()_+]): At least one special character.
	 * [A-Za-z\d!@#$%^&*()_+]{10,}: Match a string with at least 10 characters
	 * composed of letters, digits, and the specified special characters.
	 */
	const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{10,}$/;
	return pattern.test(password);
};

const csvHeaderValidation = (uploadHeader, expectedHeader) => {
	// Check if headers have the same length
	if (uploadHeader.length !== expectedHeader.length) {
		return false;
	}

	// Iterate over each element and compare
	for (let i = 0; i < uploadHeader.length; i++) {
		if (uploadHeader[i] !== expectedHeader[i]) {
			return false;
		}
	}

	// If no differences found, headers are equal
	return true;
};

const generateApplicationNumber = (application_id, lastPartOfFinancialYear) => {
	let zeros = '';
	if (application_id > 0 && application_id < 10000) {
		zeros = '0'.repeat(4 - String(application_id).length);
	}
	const newApplicationNumber = 'SN' + lastPartOfFinancialYear + zeros + application_id;
	return newApplicationNumber;
};

const getDateOnly = (date) => {
	if (date) {
		// 2022-09-05
		return moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD');
	} else {
		return null;
	}
};

const getDateTimeOnly = (date) => {
	// 2022-09-05 15:00:59
	return moment(date, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss');
};

const getFileMimeType = async (fileUrl) => {
	const stream = got.stream(fileUrl);
	const response = await FileType.fromStream(stream);
	return response;
};

const createFolderIfNotExists = (folders) => {
	folders.forEach((folder) => {
		if (!fs.existsSync(folder)) {
			fs.mkdirSync(folder);
		}
	});
};

module.exports = {
	commonDateFormat,
	commonDateFormat1,
	dbDateFormat,
	getHourMin,
	getTimestamp,
	getDate,
	getDBDateOnly,
	getFromUnix,
	getValidationMessage,
	camelCase,
	download,
	generateHashAccessToken,
	verifyHashAccessToken,
	renameFile,
	deleteFile,
	capitalizeWords,
	getPagination,
	logOnConsole,
	nl2br,
	validatePassword,
	csvHeaderValidation,
	generateApplicationNumber,
	getDateOnly,
	getDateTimeOnly,
	getFileMimeType,
	createFolderIfNotExists,
};
