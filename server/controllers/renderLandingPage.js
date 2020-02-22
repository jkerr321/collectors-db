/* eslint no-console: 0 */
const dotenv = require('dotenv');
dotenv.config();
const { GoogleSpreadsheet }= require('google-spreadsheet');

const updateSpreadsheet = async (rows, reqBody) => {
	try {
		console.info('UpdateSpreadsheet: starting');
		// defending against previous bug
		if (!reqBody.ID) {
			throw new Error('UpdateSpreadsheet - missing ID error');
		}
		let changedValue = '';
		rows.forEach(async row => {
			if (row.ID === reqBody.ID) {
				Object.keys(reqBody).forEach(key => {
					if (reqBody[key]) {
						// e.g. if (reqBody.colour) {row.colour = reqBody.colour};
						row[key] = reqBody[key];
						changedValue += row[key];
					}
				});
				await row.save();
			}
		});
		console.info('UpdateSpreadsheet: complete');
		return changedValue;
	} catch (err) {
		console.error('updateSpreadsheet error', err);
		throw new Error('updateSpreadsheet error');
	}
};

const getSheet = async (config) => {
	try {
		const doc = new GoogleSpreadsheet(config.sheet_id);
		await doc.useServiceAccountAuth({
			client_email: config.client_email,
			private_key: config.private_key
		});
		await doc.loadInfo();
		const sheet = await doc.sheetsByIndex[0];
		return sheet;
		console.info('getSheet: complete');
	} catch (err) {
		console.error('getSheet error', err);
		throw new Error('getSheet error');
	}
};

const getRows = async (config) => {
	try {
		console.info('getRows: starting');
		const sheet = await getSheet(config);
		const rows = await sheet.getRows({
			'limit': 5000
		});
		console.info('getRows: complete');
		return rows;
	} catch (err) {
		console.error('getRows error', err);
		throw new Error('getRows error');
	}
};

const getUniqueList = (rows, value) => {
	return rows.reduce((acc, row) => {
		if (row[value]) {
			acc.includes(row[value]) ? '' : acc.push(row[value]);
		}
		return acc;
	}, []);
};

//TODO split this into multiple functions?
const getFullListData = (rows) => {
	try {
		console.info('getFullListData: starting');
		const seasons = getUniqueList(rows, 'Season');
		// create empty array / objects for each season:
		// {
		//     season: 1998/99,
		//     season_string: 199899, // eg 200102 rather than 2001/02 - so that this can be inserted into html class and searched on later
		//     matches: []
		// }
		const seasonsArray = seasons.reduce((acc, season) => {
			const obj = {};
			obj.season = season;
			obj.season_string = season.substring(0, 4) + season.substring(5);
			obj.matches = [];
			acc.push(obj);
			return acc;
		}, []);

		const values = rows.reduce((seasonsArray, row) => {
			seasonsArray.forEach(obj => {
				if (row.Season === obj.season) {
					if (row['Got/Want'] === 'Want' && !obj.isNotComplete) {
						obj.isNotComplete = true;
					}
					obj.matches.push({
						season: row.Season,
						date: row.Date,
						opponent: row.Opponent,
						home_away: row['Home/Away'],
						score: row.Score,
						position: row.Position,
						points: row.Points,
						competition: row.Competition,
						match_notes: row['Match Notes'],
						got_want: row['Got/Want'],
						price: row['Programme Price'],
						notes: row['Programme Notes'],
						id: row.ID,
						ground: row.Ground,
						attendance: row.Att
					});
				}
			});
			return seasonsArray;
		}, seasonsArray);
		console.info('getFullListData: complete');
		return values;
	} catch (err) {
		console.error('getFullListData error', err);
		throw new Error('getFullListData error');
	}
};

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

const getFilterArray = (reqBody) => {
	console.info('getFilterArray: inside');
	let result = [];
	if (reqBody.seasonFilter) { result.push(`${reqBody.seasonFilter}`); }
	if (reqBody.opponentFilter) { result.push(`${reqBody.opponentFilter}`); }
	if (reqBody.gotWantFilter) { result.push(`${reqBody.gotWantFilter}`); }
	if (reqBody.homeAwayFilter) { result.push(`${reqBody.homeAwayFilter}`); }
	return result;
};

const init = async (req, res, config) => {
	try {
		console.info('init: landing page controller invoked');
		const rows = await getRows(config);
		const seasonData = getUniqueList(rows, 'Season');
		const opponentData = getUniqueList(rows, 'Opponent').sort();
		const sheet_id = config.sheet_id;
		const variables = config.options;
		const editMode = !!req.cookies.programmeCollectorCookie || false;
		const baseRenderData = { seasonData, opponentData, variables, sheet_id, editMode };
		let renderData;

		if (req.method === 'POST') {
			console.info(`Request Body: ${JSON.stringify(req.body)}`)
			if (req.body.password) {
				console.info('init: POST request with password entered');
				if (req.body.password.toLowerCase() === config.password.toLowerCase()) {
					await res.cookie('programmeCollectorCookie', { httpOnly: true });
					console.info('init: POST - password correct, cookie set');
					return res.redirect('/');
				} else {
					const allData = await getFullListData(rows);
					const passwordFail = true;
					console.info('init: password failed');
					renderData = { ...baseRenderData, allData, passwordFail };
				}
			} else if (req.body.filter) {
				const filteredRows = await filterRows(rows, req.body);
				const allData = await getFullListData(filteredRows);
				const isFiltered = true;
				const appliedFilter = getFilterArray(req.body);
				console.info(`init: POST - filter data requested - ${appliedFilter}`);
				renderData = { ...baseRenderData, allData, isFiltered, appliedFilter };
			} else {
				console.info('init: POST - data update requested');
				await updateSpreadsheet(rows, req.body);
				const updatedRows = await getRows(config);
				const allData = await getFullListData(updatedRows);
				renderData = { ...baseRenderData, allData };
			}
		} else {
			console.info('init: vanilla GET request');
			const allData = await getFullListData(rows);
			renderData = { ...baseRenderData, allData };
		}
		return res.render('landing', renderData);
	} catch (err) {
		const errorName = err.message;
		console.error('render error', err);
		return res.render('error', {errorName});
	}
};

module.exports = { getRows, getUniqueList, updateSpreadsheet, getFullListData, filterRows, getFilterArray, init };
