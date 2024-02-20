/*
|--------------------------------------------------------------------------
| import npm packages
|--------------------------------------------------------------------------
*/
const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const nocache = require('nocache');
const helmet = require('helmet');
const frameguard = require('frameguard');
const listEndpoints = require('express-list-endpoints');
const chalk = require('chalk');
const url = require('url');

/*
|--------------------------------------------------------------------------
| import node default module
|--------------------------------------------------------------------------
*/
const path = require('path');

/*
|--------------------------------------------------------------------------
| import user define files
|--------------------------------------------------------------------------
*/
const config = require('./configuration/config');
const { httpStatusCodeMessages } = require('./utilities/constants');
const { logOnConsole, createFolderIfNotExists } = require('./utilities/common');
const { limiter } = require('./helpers/customMiddleware');

/*
|--------------------------------------------------------------------------
| import routes
|--------------------------------------------------------------------------
*/
const routes = require('./routes/index');

/*
|--------------------------------------------------------------------------
| create express app
|--------------------------------------------------------------------------
*/
const app = express();

/*
|--------------------------------------------------------------------------
| Remove the X-Powered-By headers.
|--------------------------------------------------------------------------
*/
app.disable('x-powered-by');

/*
|--------------------------------------------------------------------------
| set middlewares
|--------------------------------------------------------------------------
*/
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(cookieParser());
app.disable('etag');
app.use(nocache());
app.use(helmet.noSniff());
app.use(frameguard({ action: 'deny' }));
app.use(helmet.xssFilter());
app.use(helmet.contentSecurityPolicy());
app.use(helmet.referrerPolicy());
app.use(helmet.expectCt());

/*
|--------------------------------------------------------------------------
| set file upload path
|--------------------------------------------------------------------------
*/
const foldersToCreate = [config.uploadFolder];
createFolderIfNotExists(foldersToCreate);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads_temp', express.static(path.join(__dirname, 'uploads_temp')));
app.use('/static', express.static(path.join(__dirname, 'email_templates')));

/*
|--------------------------------------------------------------------------
| add rateLimit as middleware
|--------------------------------------------------------------------------
*/
// app.use(limiter);

/*
|--------------------------------------------------------------------------
| cors policy
|--------------------------------------------------------------------------
*/
app.use((req, res, next) => {
	// Website you wish to allow to connect
	if (config.environment == 'production') {
		const allowedOrigins = [config.allowedOrigin];
		const origin = req.headers.origin;
		if (allowedOrigins.includes(origin)) {
			res.setHeader('Access-Control-Allow-Origin', origin);
		}
	} else if (config.environment == 'development') {
		const allowedOrigins = [config.allowedOrigin];
		const origin = req.headers.origin;
		if (allowedOrigins.includes(origin)) {
			res.setHeader('Access-Control-Allow-Origin', origin);
		}
	}

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);
	res.setHeader('X-XSS-Protection', '1; mode=block');

	// for dynamic file name
	res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

	// Pass to next layer of middleware
	next();
});

/*
|--------------------------------------------------------------------------
| db connection error
|--------------------------------------------------------------------------
*/
app.use(async (req, res, next) => {
	next();
});

/*
|--------------------------------------------------------------------------
| all routes
|--------------------------------------------------------------------------
*/
app.use('/api', routes);

/*
|--------------------------------------------------------------------------
| catch 404 and forward to error handler
|--------------------------------------------------------------------------
*/
app.use((req, res, next) => {
	next(createError(404, httpStatusCodeMessages.http_404));
});

/*
|--------------------------------------------------------------------------
| error handler
|--------------------------------------------------------------------------
*/
app.use((err, req, res, next) => {
	logOnConsole(err);

	// render the error page
	res.status(err.status || 500);

	res.json({
		status: false,
		error: { message: err.message },
	});
});

/*
|--------------------------------------------------------------------------
| this route is to test for 404
|--------------------------------------------------------------------------
*/
app.get('/', async (req, res) => {
	return res.send({
		success: true,
		message: 'Welcome',
	});
});

const listOfRoutes = () => {
	console.log(`${chalk.yellow('List of routes:')}`);
	console.log(listEndpoints(app));
	console.log('--------------------------------------------------------------------------');
	console.log(listEndpoints(app).length);
	console.log(`${chalk.yellow('List of routes end.')}`);
};

/*
|--------------------------------------------------------------------------
| console.log list of routes, methods and middlewares
|--------------------------------------------------------------------------
*/
// listOfRoutes();

module.exports = app;
