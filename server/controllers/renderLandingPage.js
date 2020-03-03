/* eslint no-console: 0 */
const dotenv = require('dotenv');
dotenv.config();
const DataModel = require('../DataModel');
// const { requiredDataPoints, optionalDataPoints } = require('../dataPoints');

const filterRows = async (rows, reqBody) => {
	console.info('filterRows: inside');
	return rows.filter(row => {
		let result = true;
		if (reqBody.seasonFilter && !reqBody.seasonFilter.includes(row.Season)) {result = false;}
		if (reqBody.opponentFilter && !reqBody.opponentFilter.includes(row.Opponent)) {result = false;}
		if (reqBody.gotWantFilter && row['Got/Want'] !== reqBody.gotWantFilter) {result = false;}
		if (reqBody.homeAwayFilter && row['Home/Away'] !== reqBody.homeAwayFilter) {result = false;}
		return result;
	});
};



const init = async (req, res, config) => {
	try {
		const data = await new DataModel(config, req);
		await data.getSpreadsheetRowData(config);
		data.setSeasonData(data.rows);
		data.setOpponentData(data.rows);
		data.setAllMatchData(data.rows);

		console.info('init: landing page controller invoked');

		// if (req.method === 'POST') {
		// 	console.info(`Request Body: ${JSON.stringify(req.body)}`);
		// 	if (req.body.password) {
		// 		console.info('init: POST request with password entered');
		// 		if (req.body.password.toLowerCase() === config.password.toLowerCase()) {
		// 			await res.cookie('programmeCollectorCookie', { httpOnly: true });
		// 			console.info('init: POST - password correct, cookie set');
		// 			return res.redirect('/');
		// 		} else {
		// 			const allMatchData = await getFullListData(rows);
		// 			data.setPasswordFail();
		// 			console.info('init: password failed');
		// 			renderData = { ...baseRenderData, allMatchData, passwordFail };
		// 		}
		// 	} else if (req.body.filter) {
		// 		const filteredRows = await filterRows(rows, req.body);
		// 		const allMatchData = await getFullListData(filteredRows);
		// 		data.setFilterData(req.body);
		// 		console.info(`init: POST - filter data requested - ${data.appliedFilter}`);
		// 		renderData = { ...baseRenderData, allMatchData, isFiltered, appliedFilter };
		// 	} else {
		// 		console.info('init: POST - data update requested');
		// 		await updateSpreadsheet(data.rows, req.body);
		// 		const updatedRows = await getRows(config);
		// 		const allMatchData = await getFullListData(updatedRows);
		// 		renderData = { ...baseRenderData, allMatchData };
		// 	}
		// } else {
			console.info('init: vanilla GET request');
		// }
		return res.render('landing', {data});
	} catch (err) {
		const errorName = err.message;
		console.error('render error', err);
		return res.render('error', {errorName});
	}
};

module.exports = { init };
