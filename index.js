const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const renderLandingPage = require('./server/controllers/renderLandingPage');
const exampleConfig = require('./config');

//TODO DRY out - could use object literals?
const getImages = (configOptions) => {
	console.info('getImages: starting');
	const imgOne = configOptions.img_one_src;
	const imgTwo = configOptions.img_two_src;

	const imgOnePath = fs.realpathSync(`${imgOne}`, (err) => {
		if (err) { throw err; }
	});
	const imgTwoPath = fs.realpathSync(`${imgTwo}`, (err) => {
		if (err) { throw err; }
	});

	const newPath = fs.realpathSync(`node_modules/collectors-db/public`, (err) => {
		if (err) { console.log('realpath error'); throw err; }
		console.log('realpath complete!');
	});

	fs.copyFile(imgOnePath, `${newPath}/${imgOne}`, (err) => {
		if (err) throw err;
	});
	fs.copyFile(imgTwoPath, `${newPath}/${imgTwo}`, (err) => {
		if (err) throw err;
	});
	console.info('image file copies complete!');
}

const init = (config, isTestApp) => {
	if (isTestApp) {
		console.info('index init: testApp');
		app.engine('html', exphbs({
			defaultLayout: 'main',
			extname: '.html',
			layoutsDir: 'views/layouts/'
		}));
	} else {
		console.info('index init: production');
		getImages(config.options); //copy user provided images to module

		app.engine('html', exphbs({
		defaultLayout: 'main',
			extname: '.html',
			layoutsDir: 'node_modules/collectors-db/views/layouts/'
		}));
	}	
	
	app.set('view engine', 'html');
	app.set('views', path.join(__dirname, '/views'));
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(cookieParser());
	app.get('/', (req, res) => renderLandingPage(req, res, config));
	app.post('/', (req, res) => renderLandingPage(req, res, config));

	app.listen(process.env.PORT || 8001, () => {
		console.log('collectors-db: listening on port 8001');
	});
	console.info('index init: complete');
}

init(exampleConfig, true);  // uncomment to run the module with test config

module.exports = init;