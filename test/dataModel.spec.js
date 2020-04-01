const DataModel = require('../server/dataModel');
const reqBody = require('./fixtures/reqBody');
const expect = require('chai').expect;
const config = require('./fixtures/config');
const rows = require('./fixtures/rows');
const sinon = require('sinon');

describe('dataModel', async () => {
    let req;
    let res;
    let data;

    beforeEach(() => {
        req = (method, body, cookies) => ({
            method: method || 'GET',
            get: () => { },
            post: () => { },
            cookies: cookies || {},
            query: {},
            body: { ...body || {} }
        });

        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('constructor', () => {
        it('sets edit_mode based on the correct cookie', () => {
            const data = new DataModel(config, req());
            expect(data.edit_mode).to.equal(false);
            const reqWithCookie = req('GET', {}, { programmeCollectorCookie: true });
            const data2 = new DataModel(config, reqWithCookie);            
            expect(data2.edit_mode).to.equal(true);
        });
    });

    describe('getUniqueList', () => {
        it('returns a unique list of values given an array containing duplicates', async () => {
            const data = new DataModel(config, req());
            const seasons = data._getUniqueList(rows, 'season');
            const opponents = data._getUniqueList(rows, 'opponent');
            expect(seasons).to.be.an('array');
            expect(seasons.lastIndexOf('1948/49')).to.equal(seasons.indexOf('1948/49'));
            expect(opponents.lastIndexOf('Ipswich Town')).to.equal(opponents.indexOf('Ipswich Town'));
        });
    });

    describe('_getFilterArray', () => {
        it('returns a string containing the relevant values for filtering the data from req.body', () => {
            const data = new DataModel(config, req());
            expect(data._getFilterArray(reqBody.filterOne)).to.eql(['1947/48,1948/49', 'Want']);
            expect(data._getFilterArray(reqBody.filterTwo)).to.eql(['Ticket', 'Bournemouth,Swansea City,Walsall']);
            expect(data._getFilterArray(reqBody.filterThree)).to.eql(['Tickets and Programmes', 'First Team', 'Want']);
            expect(data._getFilterArray(reqBody.filterFour)).to.eql(['Ticket', 'Non First Team', 'Got']);
        });
    });

    describe('_setSeasonList', () => {
        it('', () => {
            const data = new DataModel(config, req());
            data._setSeasonList(rows);
            expect(data.season_list).to.have.lengthOf(2);
            expect(data.season_list[0]).to.have.equal('1947/48');
        });
    });

    describe('setOpponentList', () => {
        it('sets data.opponent_list to an array of unique opponents', () => {
            const data = new DataModel(config, req());
            data.setOpponentList(rows);
            expect(data.opponent_list).to.have.lengthOf(17);
            expect(data.opponent_list[0]).to.equal('Bournemouth');
        });
    });

    describe('setPasswordFail', () => {
        it('sets passwordFail to true', () => {
            const data = new DataModel(config, req());
            data.setPasswordFail()
            expect(data.passwordFail).to.equal(true);
        });
    });

    //!! ?? why is TypeError: data._setCollectionDatastructure is not a function
    // describe.only('_setCollectionDataStructure', () => {
    //     it('contains an empty matchData array for each season', () => {
    //         const data = new DataModel(config, req());
    //         data._setSeasonList(rows);
    //         data._setCollectionDatastructure();
    //         expect(data.collection_data.every(value => value.matchData)).to.be.true;
    //         expect(data.collection_data.every(value => value.matchData)).to.be.an.array;

    //     });
    //     it('returns an array containing a season string for each season', () => {
    //         const data = new DataModel(config, req());
    //         data._setSeasonList(rows);
    //         data._setCollectionDatastructure();
    //         expect(data.collection_data.every(value => value.season_string)).to.be.true;
    //         expect(data.collection_data.every(value => value.season_string)).to.be.a.string;
    //     });
    // });

    describe('setCollectionData', () => {
        it('sets is_also_ticket_collection if config specifies that is is also a ticket collection', () => {
            const data = new DataModel(config, req());
            data.setCollectionData(rows);            
            expect(data.collection_data[0].is_ticket_collection).to.be.true;
            expect(data.collection_data[0].matchData[0].is_ticket_collection).to.be.true;
        });
        it('does not set is_also_ticket_collection if config specifies that is is also a ticket collection', () => {
            config.options.data_points.is_ticket_collection = undefined;
            const data = new DataModel(config, req());
            data.setCollectionData(rows);
            expect(data.collection_data[0].is_ticket_collection).to.be.false;
            expect(data.collection_data[0].matchData[0].is_ticket_collection).to.be.false;
        });
        it.only('returns an array containing an a set of data for each match in the season', () => {
            const data = new DataModel(config, req());
            data.setCollectionData(rows);
            expect(data.collection_data.every(value => value.matchData)).to.be.true;
            expect(data.collection_data[0].matchData).to.have.lengthOf(15);
            expect(data.collection_data[0].nft_matchData).to.have.lengthOf(1);
        });
        it('populates match data with `position` if that is specified as a datapoint in the config', () => {
            const data = new DataModel(config, req());
            data.setCollectionData(rows);
            expect(data.collection_data[0].matchData[0].position).to.exist;
        });
        it('and doesn\'t populate match data with `position` if that is not specified as a datapoint in the config', () => {
            config.options.data_points.position = undefined;
            const data = new DataModel(config, req());
            data.setCollectionData(rows);
            expect(data.collection_data[0].matchData[0].position).to.not.exist;
        });
        it('specifies whether a collection is not complete for a season', () => {
            const data = new DataModel(config, req());
            data.setCollectionData(rows);
            expect(data.collection_data[0].programmeIsNotComplete).to.be.true;
        });
        it('does not specify "programmeIsNotComplete" value for a completed season', () => {
            const data = new DataModel(config, req());
            data.setCollectionData(rows);
            expect(data.collection_data[1].programmeIsNotComplete).to.be.undefined;
        });
    });

});
