const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const renderLandingPage = require('./server/controllers/renderLandingPage');
const exampleConfig = require('./config');
const fs = require('fs');

//TODO DRY out
const getImages = (configOptions) => {
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
	fs.rename(imgOnePath, `${newPath}/${imgOne}`, (err) => {
		if (err) throw err;
	});
	fs.rename(imgTwoPath, `${newPath}/${imgTwo}`, (err) => {
		if (err) throw err;
	});
	console.log('rename complete!');
}

const init = (userConfig) => {
	config = userConfig || exampleConfig;

	if (userConfig) {
		getImages(userConfig.options);
	}

	app.engine('html', exphbs({
		defaultLayout: 'main',
		extname: '.html',
		layoutsDir: 'node_modules/collectors-db/views/layouts/'
	}));

	app.set('view engine', 'html');
	app.set('views', path.join(__dirname, '/views'));
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(express.static(path.join(__dirname, 'public')));

	app.get('/', (req, res) => renderLandingPage(req, res, config));
	app.post('/', (req, res) => renderLandingPage(req, res, config));

	app.listen(process.env.PORT || 8001, () => {
		console.log('collectors-db: listening on port 8001');
	});
}

module.exports = init;