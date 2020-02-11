/* eslint no-console: 0 */
const dotenv = require('dotenv');
dotenv.config();
const { GoogleSpreadsheet }= require('google-spreadsheet');

const updateSpreadsheet = async (rows, reqBody) => {
	try {
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
		return changedValue;

	} catch (err) {
		console.error('updateSpreadsheet error', err);
	}
};

const getSheet = async (config) => {
	const doc = new GoogleSpreadsheet(config.sheet_id);
	await doc.useServiceAccountAuth({
		client_email: config.client_email,
		private_key: config.private_key
	});
	await doc.loadInfo();
	const sheet = await doc.sheetsByIndex[0];
	return sheet;
};

const getRows = async (config) => {
	const sheet = await getSheet(config);
	const rows = await sheet.getRows({
		'offset': 1,
		'limit': 5000
	});
	const headers = sheet.headerValues;
	return { rows, headers };
};

const getUniqueList = (rows, value) => {
	return rows.reduce((acc, row) => {
		if (row[value]) {
			acc.includes(row[value]) ? '' : acc.push(row[value]);
		}
		return acc;
	}, []);
};

//TODO split this into multiple functions
const getFullListData = (rows, headers) => {
	try {
		let headersForRender = {};
		headers.forEach(val => headersForRender[val] = val);

		const seasons = getUniqueList(rows, 'Season');
		// create empty array / objects for each season:
		// {
		//     season: 1998/99,
		//     season_string: 199899, // eg 200102 rather than 2001/02 - so that this can be inserted into html class and searched on later
		//     matches: []
		// }
		const seasonsArray = seasons.reduce((acc, season) => {
			const obj = {};
			obj.headers = headersForRender;
			obj.season = season;
			obj.season_string = season.substring(0, 4) + season.substring(5);
			obj.matches = [];
			acc.push(obj);
			return acc;
		}, []);

		const dataPointOptions = [
			{ varName: 'season', rowName: 'Season' },
			{ varName: 'date', rowName: 'Date' },
			{ varName: 'opponent', rowName: 'Opponent' },
			{ varName: 'home_away', rowName: 'Home/Away' },
			{ varName: 'score', rowName: 'Score' },
			{ varName: 'position', rowName: 'Position' },
			{ varName: 'points', rowName: 'Points' },
			{ varName: 'competition', rowName: 'Competition' },
			{ varName: 'match_notes', rowName: 'Match Notes' },
			{ varName: 'got_want', rowName: 'Got/Want' },
			{ varName: 'price', rowName: 'Programme Price' },
			{ varName: 'notes', rowName: 'Programme Notes' },
			{ varName: 'id', rowName: 'ID' },
			{ varName: 'ground', rowName: 'Ground' },
			{ varName: 'attendance', rowName: 'Attn' }
		];
		const dataPoints = dataPointOptions.filter(dataPoint => headers.includes(dataPoint.rowName));

		const values = rows.reduce((seasonsArray, row) => {
			seasonsArray.forEach(obj => {
				// create an object with with data from each row, only using the data points filtered out above
				const matchObject = dataPoints.reduce((acc, dataPoint) => {
					acc[dataPoint.varName] = row[dataPoint.rowName];
					return acc;
				}, {});

				if (row.Season === obj.season) {
					if (row['Got/Want'] === 'Want' && !obj.isNotComplete) {
						obj.isNotComplete = true;
					}
					obj.matches.push(matchObject);
				}
			});
			return seasonsArray;
		}, seasonsArray);
		console.log('==================');
		console.log('values[0]', values[0]);
		console.log('==================');
		
		return values;
	} catch (err) {
		console.error('getData error', err);
	}
};

const filterRows = async (rows, reqBody) => {
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
	let result = [];
	if (reqBody.seasonFilter) { result.push(`${reqBody.seasonFilter}`); }
	if (reqBody.opponentFilter) { result.push(`${reqBody.opponentFilter}`); }
	if (reqBody.gotWantFilter) { result.push(`${reqBody.gotWantFilter}`); }
	if (reqBody.homeAwayFilter) { result.push(`${reqBody.homeAwayFilter}`); }
	return result;
};

const init = async (req, res, config) => {
	try {
		const rowInfo = await getRows(config);
		const rows = rowInfo.rows;
		const headers = rowInfo.headers;
		const seasonData = getUniqueList(rows, 'Season');
		const opponentData = getUniqueList(rows, 'Opponent').sort();
		const variables = config.options;
		const baseRenderData = { seasonData, opponentData, variables };
		let renderData;

		if (req.method === 'POST') {
			if (req.body.filter) {
				const filteredRows = await filterRows(rows, req.body);
				const allData = await getFullListData(filteredRows, headers);
				const isFiltered = true;
				const appliedFilter = getFilterArray(req.body);
				renderData = { ...baseRenderData, allData, isFiltered, appliedFilter };
			} else {
				await updateSpreadsheet(rows, req.body);
				const updatedRows = await getRows(config);
				const allData = await getFullListData(updatedRows, headers);
				renderData = { ...baseRenderData, allData };
			}
		} else {
			const allData = await getFullListData(rows, headers);
			renderData = { ...baseRenderData, allData };
		}
		return res.render('landing', renderData);
	} catch (err) {
		console.error('render error', err);
	}
};

module.exports = { getRows, getUniqueList, updateSpreadsheet, getFullListData, filterRows, getFilterArray, init };
