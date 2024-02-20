/*
|--------------------------------------------------------------------------
| import npm packages
|--------------------------------------------------------------------------
*/
const dotenv = require('dotenv');

/*
|--------------------------------------------------------------------------
| import env file path
|--------------------------------------------------------------------------
*/
dotenv.config({ path: __dirname + '/../.env' });

const config = {
	// Server Config
	environment: process.env.APP_ENV,
	host: process.env.HOST,
	port: process.env.PORT,
	appAccessTokenSecret: process.env.APP_ACCESS_TOKEN_SECRET,
	dataEncryptionSecret: process.env.DATA_ENCRYPTION_SECRET,
	allowedOrigin: process.env.ALLOWED_ORIGIN,

	// Folders
	uploadFolder: process.env.UPLOAD_FOLDER,

	// Email Config
	mailDetails: {
		transporter: {
			transport: process.env.MAIL_MAILER,
			host: process.env.MAIL_HOST,
			port: process.env.MAIL_PORT,
			auth: {
				user: process.env.MAIL_USERNAME,
				pass: process.env.MAIL_ACCESS_TOKEN,
			},
		},
		from: process.env.MAIL_FROM_ADDRESS,
		name: process.env.MAIL_FROM_NAME,
	},

	// DB Config
	dbDetails: {
		user: process.env.DB_USERNAME,
		accesstoken: process.env.DB_ACCESS_TOKEN,
		database: process.env.DB_NAME,
		server: process.env.DB_SERVER,
		port: process.env.DB_PORT,
	},
};

module.exports = config;
