const { updateSpreadsheet, getRows } = require('./helpers/googleSpreadSheetHelpers');

module.exports = class DataModel {
    constructor(config, req) {
        this.isAlsoTicketCollection = config.tickets;
        this.colour_one = config.options.colour_one;
        this.colour_two = config.options.colour_two;
        this.heading = config.options.heading;
        this.sheet_id = config.sheet_id;
        this.variables = config.options;
        this.editMode = !!req.cookies.programmeCollectorCookie || false;
        // ?? I can't do this right?
        // this.rows = await this.getSpreadsheetRowData(config);
    }

    //TODO!! put this in the controller - don't actually want to send all row data in the view model
    async getSpreadsheetRowData (config) {
        this.rows = await getRows(config);
    }

    getUniqueList (rows, value) {
        return rows.reduce((acc, row) => {
            if (row[value]) {
                acc.includes(row[value]) ? '' : acc.push(row[value]);
            }
            return acc;
        }, []);
    };

    getSeasonsContainerArray (data) {
        // create empty array / objects for each season:
        // {
        //     season: 1998/99,
        //     season_string: 199899, // eg 200102 rather than 2001/02 - so that this can be inserted into html class and searched on later
        //     matches: []
        // }
        return data.reduce((acc, season) => {
            const obj = {};
            obj.season = season;
            obj.season_string = season.substring(0, 4) + season.substring(5);
            //TODO rename this to something better
            obj.matches = [];
            acc.push(obj);
            return acc;
        }, []);
    };

    setSeasonData (rows) {
        //QQ should this be this.rows?
        //QQ should I have these as separate setters?
        this.seasonData = this.getUniqueList(rows, 'Season');
    }

    setOpponentData (rows) {
        this.opponentData = this.getUniqueList(rows, 'Opponent').sort();
    }

    setAllMatchData (rows) {
        try {
            // ?? TODO not sure if I need the line below so commenting out, but have a feeling it will come back to bite me, so not removing entirely yet!
            // const seasons = getUniqueList(rows, 'Season');
            const seasonsContainerArray = this.getSeasonsContainerArray(this.seasonData);
            const values = rows.reduce((seasonsContainerArray, row) => {
                seasonsContainerArray.forEach(obj => {
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
                            cup_round: row['Cup Round'],
                            match_notes: row['Match Notes'],
                            got_want: row['Got/Want'],
                            ticket_got_want: row['Ticket Got/Want'],
                            price: row['Programme Price'],
                            notes: row['Programme Notes'],
                            id: row.ID,
                            ground: row.Ground,
                            attendance: row.Att,
                            other_items: row['Other Items']
                        });
                    }
                });
                return seasonsContainerArray;
            }, seasonsContainerArray);
            console.info('getFullListData: complete');

            this.allMatchData = values;
        } catch (err) {
            console.error('getFullListData error', err);
            throw new Error('getFullListData error');
        }
    }

    setPasswordFail () {
        this.passwordFail = true;
    }

    setFilterData (reqBody) {
        this.isFiltered = true;
        this.appliedFilter = this.getFilterArray(reqBody);
    }

    getFilterArray (reqBody) {
        let result = [];
        if (reqBody.seasonFilter) { result.push(`${reqBody.seasonFilter}`); }
        if (reqBody.opponentFilter) { result.push(`${reqBody.opponentFilter}`); }
        if (reqBody.gotWantFilter) { result.push(`${reqBody.gotWantFilter}`); }
        if (reqBody.homeAwayFilter) { result.push(`${reqBody.homeAwayFilter}`); }
        return result;
    }

}
