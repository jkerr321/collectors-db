const { GoogleSpreadsheet } = require('google-spreadsheet');

const updateSpreadsheet = async (rows, reqBody) => {
	try {
		console.info('UpdateSpreadsheet: starting');
		// defending against previous bug
		if (!reqBody.ID) {
			throw new Error('UpdateSpreadsheet - missing ID error');
		}
		rows.forEach(async row => {
			if (row.ID === reqBody.ID) {
				Object.keys(reqBody).forEach(key => {
					if (reqBody[key]) {
						// e.g. if (reqBody.colour) {row.colour = reqBody.colour};
						row[key] = reqBody[key];
					}
				});
				await row.save();
			}
		});
		console.info('UpdateSpreadsheet: complete');
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
		console.info('getSheet: complete');
		return sheet;
	} catch (err) {
		console.error('getSheet error', err);
		throw new Error(`getSheet error: ${err}`);
	}
};

const getRows = async (config) => {
	try {
		console.info('getRows: starting');
		const sheet = await getSheet(config);
		const rows = await sheet.getRows({
			'limit': 10000
		});
		console.info('getRows: complete');
		return rows;
	} catch (err) {
		console.error('getRows error', err);
		throw new Error(`getRows error: ${err}`);
	}
};

module.exports = { updateSpreadsheet, getRows, getSheet };