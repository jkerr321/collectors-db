/* eslint no-console: 0 */
const dotenv = require('dotenv');
dotenv.config();
const DataModel = require('../dataModel');
const { updateSpreadsheet, getRows } = require('../helpers/googleSpreadSheetHelpers');

const filterRows = async (rows, reqBody) => {
	console.info('filterRows: inside');
	return rows.filter(row => {
		let result = true;
		if (reqBody.nonFirstTeamFilter && reqBody.nonFirstTeamFilter === 'Yes' && row['Non First Team'] !== 'Yes') { result = false; }
		if (reqBody.nonFirstTeamFilter && reqBody.nonFirstTeamFilter === 'No' && row['Non First Team'] === 'Yes') { result = false; }
		if (reqBody.seasonFilter && !reqBody.seasonFilter.includes(row.Season)) { result = false; }
		if (reqBody.opponentFilter && !reqBody.opponentFilter.includes(row.Opponent)) { result = false; }
		if (reqBody.homeAwayFilter && row['Home/Away'] !== reqBody.homeAwayFilter) { result = false; }
		if (reqBody.ticketProgrammeFilter) {
			const collectionType = reqBody.ticketProgrammeFilter;
			if (collectionType === 'All') {
				if (reqBody.gotWantFilter && row['Programme Got/Want'] !== reqBody.gotWantFilter &&
				reqBody.gotWantFilter && row['Ticket Got/Want'] !== reqBody.gotWantFilter) {
					result = false;
				}
			} else {
				if (reqBody.gotWantFilter && row[`${collectionType} Got/Want`] !== reqBody.gotWantFilter) { result = false; }
			}
		} else {
			if (reqBody.gotWantFilter && row['Programme Got/Want'] !== reqBody.gotWantFilter) { result = false; }
		}
		return result;
	});
};

const init = async (req, res, config) => {
	try {
		const data = new DataModel(config, req);
		const sheetRows = await getRows(config);
		data.setOpponentList(sheetRows);
		data.setCollectionData(sheetRows);
		console.info('init: DataModel created');

		if (req.method === 'POST') {
			console.info(`Request Body: ${JSON.stringify(req.body)}`);
			if (req.body.password) {
				if (req.body.password.toLowerCase() === config.password.toLowerCase()) {
					await res.cookie('programmeCollectorCookie', { httpOnly: true });
					console.info('init: POST - password correct, cookie set');
					return res.redirect('/');
				} else {
					data.setPasswordFail();
					console.info('init: password failed');
				}

			} else if (req.body.filter) {
				const filteredRows = await filterRows(sheetRows, req.body);
				data.setCollectionData(filteredRows);
				data.setFilterData(req.body);
				console.info(`init: POST - filter data requested - ${data.appliedFilter}`);

			} else {
				console.info('init: POST - data update requested');
				await updateSpreadsheet(sheetRows, req.body);
				const updatedRows = await getRows(config);
				data.setCollectionData(updatedRows);
			}

		} else {
			console.info('init: vanilla GET request');
		}
		return res.render('landing', { data });
	} catch (err) {
		const errorName = err.message;
		console.error('render error', err);
		return res.render('error', { errorName });
	}
};

module.exports = { init, filterRows };
