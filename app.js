const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const renderLandingPage = require('./server/controllers/renderLandingPage');
const config = require('./config');

const init = () => {
	app.engine('html', exphbs({
		defaultLayout: 'main',
		extname: '.html',
		layoutsDir: 'views/layouts/'
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

init();

module.exports = init;