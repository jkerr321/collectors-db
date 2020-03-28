module.exports = class DataModel {

	constructor (config, req) {
		this.heading = config.options.heading;
		this.sub_heading = config.options.sub_heading;
		this.colour_one = config.options.colour_one;
		this.colour_two = config.options.colour_two;
		this.colour_three = config.options.colour_three;
		this.table_colour = config.options.table_colour;
		this.img_one_src = config.options.img_one_src;
		this.img_two_src = config.options.img_two_src;
		this.img_three_src = config.options.img_three_src;
		this.sheet_id = config.sheet_id;
		this.intro = config.options.intro;
		this.data_points = config.options.data_points;

		this.is_ticket_collection = config.options.data_points.is_ticket_collection || false;
		this.includes_non_first_team = config.options.data_points.includes_non_first_team || false;
		this.edit_mode = !!req.cookies.programmeCollectorCookie || false;
		this.season_list = '';
		this.opponent_list = '';
		this.collection_data = [];
	}

	_setSeasonList (rows) {
		this.season_list = this._getUniqueList(rows, 'Season');
	}

	setOpponentList (rows) {
		this.opponent_list = this._getUniqueList(rows, 'Opponent').sort();
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
		if (reqBody.ticketProgrammeFilter && reqBody.ticketProgrammeFilter === 'All') { result.push('Tickets and Programmes'); }
		if (reqBody.ticketProgrammeFilter && reqBody.ticketProgrammeFilter !== 'All') { result.push(`${reqBody.ticketProgrammeFilter}`); }
		if (reqBody.nonFirstTeamFilter && reqBody.nonFirstTeamFilter === 'No') { result.push('First Team'); }
		if (reqBody.nonFirstTeamFilter && reqBody.nonFirstTeamFilter === 'Yes') { result.push('Non First Team'); }
		if (reqBody.seasonFilter) { result.push(`${reqBody.seasonFilter}`); }
		if (reqBody.opponentFilter) { result.push(`${reqBody.opponentFilter}`); }
		if (reqBody.gotWantFilter) { result.push(`${reqBody.gotWantFilter}`); }
		if (reqBody.homeAwayFilter) { result.push(`${reqBody.homeAwayFilter}`); }
		return result;
	}

	_setCollectionDataStructure () {
		// create structure for match data:
		// this.collection_data = {
		//     1998/99: {
		//         season: 1998/99,
		//         season_string: 199899, // eg 200102 rather than 2001/02 - so that this can be inserted into html class and searched on later
		//         matchData: []
		//     }
		// }
		this.season_list.forEach(season => {
			this.collection_data.push({
				season: season,
				season_string: season.substring(0, 4) + season.substring(5),
				matchData: [],
				nft_matchData: this.includes_non_first_team ? [] : undefined,
				is_ticket_collection: this.is_ticket_collection
			});
		});
	}

	setCollectionData (rows) {
		// clear any existing data
		this.collection_data = [];
		// get list of unique seasons
		this._setSeasonList(rows);
		this._setCollectionDataStructure();

		rows.forEach(row => {
			this.collection_data.forEach(seasonObject => {
				if (row.Season === seasonObject.season) {
					if (row[`${this.data_points.programme_got_want}`] === 'Want' && !seasonObject.isNotComplete) {
						seasonObject.programmeIsNotComplete = true;
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
					Object.keys(this.data_points).forEach(key => {
						matchObj[key] = row[`${this.data_points[key]}`];
					});

					if (this.includes_non_first_team && row['Non First Team'] === 'Yes') {
						matchObj.is_non_first_team = true;
						seasonObject.nft_matchData.push(matchObj);
					} else {
						matchObj.is_ticket_collection = this.is_ticket_collection; // don't want to show ticket collection for non first-team fixtures
						seasonObject.matchData.push(matchObj);
					}
				}
			});
		});
	}

};
