//TODO _underscore private methods
module.exports = class DataModel {

    constructor (config, req) {
        this.heading = config.options.heading;
        this.sub_heading = config.options.sub_heading;
        this.colour_one = config.options.colour_one;
        this.colour_two = config.options.colour_two;
        this.img_one_src = config.options.img_one_src;
        this.img_two_src = config.options.img_two_src;
        this.sheet_id = config.sheet_id;

        this.isAlsoTicketCollection = config.tickets;
        this.editMode = !!req.cookies.programmeCollectorCookie || false;
        this.seasonList = '';
        this.opponentList = '';
        this.collectionData = [];
    }

    setSeasonList (rows) {
        this.seasonList = this.getUniqueList(rows, 'Season');
    }

    setOpponentList (rows) {
        this.opponentList = this.getUniqueList(rows, 'Opponent').sort();
    }

    setPasswordFail () {
        this.passwordFail = true;
    }

    setFilterData (reqBody) {
        this.isFiltered = true;
        this.appliedFilter = this.getFilterArray(reqBody);
    }

    getUniqueList(rows, value) {
        return rows.reduce((acc, row) => {
            if (row[value]) {
                acc.includes(row[value]) ? '' : acc.push(row[value]);
            }
            return acc;
        }, []);
    };

    getFilterArray (reqBody) {
        let result = [];
        if (reqBody.seasonFilter) { result.push(`${reqBody.seasonFilter}`); }
        if (reqBody.opponentFilter) { result.push(`${reqBody.opponentFilter}`); }
        if (reqBody.gotWantFilter) { result.push(`${reqBody.gotWantFilter}`); }
        if (reqBody.homeAwayFilter) { result.push(`${reqBody.homeAwayFilter}`); }
        return result;
    }

    setCollectionDataStructure() {
        // create structure for match data:
        // this.collectionData = {
        //     1998/99: {
        //         season: 1998/99,
        //         season_string: 199899, // eg 200102 rather than 2001/02 - so that this can be inserted into html class and searched on later
        //         matches: []
        //     }
        // }
        this.seasonList.forEach(season => {
            this.collectionData.push({
                season: season,
                season_string: season.substring(0, 4) + season.substring(5),
                matchData: []
            });
        })
    };

    setCollectionData(rows) {
        // clear any existing data
        this.collectionData = [];
        // get list of unique seasons
        this.setSeasonList(rows);
        this.setCollectionDataStructure();

        rows.forEach(row => {
            this.collectionData.forEach(seasonObject => {
                if (row.Season === seasonObject.season) {

                    if (row['Got/Want'] === 'Want' && !seasonObject.isNotComplete) {
                        seasonObject.isNotComplete = true;
                    }

                    seasonObject.matchData.push({
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
        });
    }

}
