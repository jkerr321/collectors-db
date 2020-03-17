//TODO _underscore private methods
//TODO change all _ in names to camel case
module.exports = class DataModel {

	constructor (config, req) {
		this.heading = config.options.heading;
		this.sub_heading = config.options.sub_heading;
		this.colour_one = config.options.colour_one;
		this.colour_two = config.options.colour_two;
		this.img_one_src = config.options.img_one_src;
		this.img_two_src = config.options.img_two_src;
		this.sheet_id = config.sheet_id;

		this.dataPoints = config.options.data_points;

		this.is_ticket_collection = config.options.data_points.is_ticket_collection || false;
		this.editMode = !!req.cookies.programmeCollectorCookie || false;
		this.seasonList = '';
		this.opponentList = '';
		this.collectionData = [];
	}

	setSeasonList (rows) {
		this.seasonList = this._getUniqueList(rows, 'Season');
	}

	setOpponentList (rows) {
		this.opponentList = this._getUniqueList(rows, 'Opponent').sort();
	}

	setPasswordFail () {
		this.passwordFail = true;
	}

	setFilterData (reqBody) {
		this.isFiltered = true;
		this.appliedFilter = this._getFilterArray(reqBody);
	}

	_getUniqueList (rows, value) {
		return rows.reduce((acc, row) => {
			if (row[value]) {
				acc.includes(row[value]) ? '' : acc.push(row[value]);
			}
			return acc;
		}, []);
	}

	_getFilterArray (reqBody) {
		let result = [];
		if (reqBody.ticketProgrammeFilter) { result.push(`${reqBody.ticketProgrammeFilter}`); }
		if (reqBody.seasonFilter) { result.push(`${reqBody.seasonFilter}`); }
		if (reqBody.opponentFilter) { result.push(`${reqBody.opponentFilter}`); }
		if (reqBody.gotWantFilter) { result.push(`${reqBody.gotWantFilter}`); }
		if (reqBody.homeAwayFilter) { result.push(`${reqBody.homeAwayFilter}`); }
		if (reqBody.homeAwayFilter) { result.push(`${reqBody.homeAwayFilter}`); }
		return result;
	}

	_setCollectionDataStructure () {
		// create structure for match data:
		// this.collectionData = {
		//     1998/99: {
		//         season: 1998/99,
		//         season_string: 199899, // eg 200102 rather than 2001/02 - so that this can be inserted into html class and searched on later
		//         matchData: []
		//     }
		// }
		this.seasonList.forEach(season => {
			this.collectionData.push({
				season: season,
				season_string: season.substring(0, 4) + season.substring(5),
				matchData: [],
				is_ticket_collection: this.is_ticket_collection
			});
		});
	}

	setCollectionData (rows) {
		// clear any existing data
		this.collectionData = [];
		// get list of unique seasons
		this.setSeasonList(rows);
		this._setCollectionDataStructure();

		rows.forEach(row => {
			this.collectionData.forEach(seasonObject => {
				if (row.Season === seasonObject.season) {
					//TODO this will change if prog row heading changes - make more robust??
					if (row['Programme Got/Want'] === 'Want' && !seasonObject.isNotComplete) {
						seasonObject.isNotComplete = true;
					}

					// result is
					// matchData: [
					//     {
					//         season: 1949/50,
					//         date: 12/10/49,
					//         opponent: Shrewsbury,
					//         home_away: Home,
					//         etc...
					//     }
					// ]
					let matchObj = {};
					Object.keys(this.dataPoints).forEach(key => {
						matchObj[key] = row[`${this.dataPoints[key]}`];
					});
					matchObj.is_ticket_collection = this.is_ticket_collection;

					seasonObject.matchData.push(matchObj);
				}
			});
		});
	}

};
