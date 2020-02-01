const expect = require('chai').expect;
const { getRows, getUniqueList, updateSpreadsheet, getFullListData, filterRows, getFilterArray, init } = require('../server/controllers/renderLandingPage');
const config = require('../config');
const rows = require('./fixtures/rows');
const sinon = require('sinon');

describe('renderLandingPage', async () => {
    let req;
    let res;

    const reqBodyFilterOne = {
        isFiltered: true,
        gotWantFilter: 'Want',
        seasonFilter: ['1947/48', '1948/49'],
        filter: 'filter'
    }
    const reqBodyFilterTwo = {
        isFiltered: true,
        opponentFilter: ['Bournemouth', 'Swansea City', 'Walsall'],
        filter: 'filter'
    }
    const reqBodyUpdateThree = {
        gotWant: 'Got',
        programmePrice: '',
        programmeNotes: '',
        id: '923'
    }
    const reqBodyUpdateFour = {
        gotWant: '',
        programmePrice: '£2.80',
        programmeNotes: '',
        id: '924'
    }

    beforeEach(() => {
        req = (method, body) => ({
            method: method || 'GET',
            get: () => { },
            post: () => { },
            query: {},
            body: { ...body || {} }
        });

        res = {
            render: sinon.spy(),
        };
    });

    describe('getRows', async () => {
        it('returns an array of objects', async () => {
            const rows = await getRows(config);
            expect(rows).to.be.an('array');
            expect(rows[0]).to.be.an('object');
        });
        it('rows contain an id value', async () => {
            const rows = await getRows(config);
            expect(rows[0]).to.haveOwnProperty('id');
        });
    });

    describe('getUniqueList', () => {
        it('returns a unique list of values given an array containing duplicates', async () => {
            const seasons = getUniqueList(rows, 'season');
            const opponents = getUniqueList(rows, 'opponent');
            expect(seasons).to.be.an('array');
            expect(seasons.lastIndexOf('1948/49')).to.equal(seasons.indexOf('1948/49'));
            expect(opponents.lastIndexOf('Ipswich Town')).to.equal(opponents.indexOf('Ipswich Town'));
        });
    });

    describe('getFilterArray', () => {
        it('returns a string containing the relevant values for filtering the data from req.body', () => {
            expect(getFilterArray(reqBodyOne)).to.eql(['1947/48,1948/49', 'Want']);
            expect(getFilterArray(reqBodyTwo)).to.eql(['Bournemouth,Swansea City,Walsall']);
        });
    });

    describe('filterRows', () => {
        it('returns the rows that match the given filter conditions in req.body', async () => {
            const filteredRowsOne = await filterRows(rows, reqBodyOne);
            const filteredRowsTwo = await filterRows(rows, reqBodyTwo);

            expect(filteredRowsOne.every(value => value.gotwant === 'Want')).to.be.true;
            expect(filteredRowsOne.every(value => value.season === '1947/48' || '1948/49')).to.be.true;
            expect(filteredRowsTwo.every(value => value.opponent !== 'Queens Park Rangers')).to.be.true;
            expect(filteredRowsTwo.some(value => value.opponent === 'Walsall')).to.be.true;
        });
    });

    describe('getFullListData', () => {
        it('returns an array containing an object for each season', () => {
            expect(getFullListData(rows).every(value => value.season)).to.be.true;
        });
        it('returns an array containing a season string for each season', () => {
            expect(getFullListData(rows).every(value => value.season_string)).to.be.true;
        });
        it('returns an array containing an a set of data for each match in the season', () => {
            expect(getFullListData(rows).every(value => value.matches)).to.be.true;
            expect(getFullListData(rows)[0].matches).to.have.lengthOf(16);
        });
        it('specifies whether a collection is not complete for a season', () => { //This should really be its own tested function I think
            expect(getFullListData(rows)[0].isNotComplete).to.be.true;
        });
        it('does not specify "isNotComplete" value for a completed season', () => {
            expect(getFullListData(rows)[1].isNotComplete).to.be.undefined;
        });
    });

    describe('updateSpreadsheet', () => {
        it('returns the correct changed value based on req.body', async () => {
            expect(await updateSpreadsheet(rows, reqBodyThree)).to.equal('Got923');
            expect(await updateSpreadsheet(rows, reqBodyFour)).to.equal('£2.80924');
        });
    });

    describe('init', () => {
        it('renders the site', async () => {
            await init(req, res, config);
            expect(res.render.calledOnce).to.be.true;
        });

        it('calls res.render with the correct render data when the request method is POST and req.body contains isFiltered', async () => {
            //TODO need to stub getRows function - do I need to make renderLandingPage a class for that?
            await init(req('POST', reqBodyFilterOne), res, config);
            expect(res.render.getCall(0).args[1].isFiltered).to.be.true;
            expect(res.render.getCall(0).args[1].appliedFilter).to.eql(['1947/48,1948/49', 'Want']);
        });
        it.only('calls res.render with the correct render data when the request method is POST', async () => {
            //TODO need to stub update SS function - do I need to make renderLandingPage a class for that?
            await init(req('POST', reqBodyUpdateFour), res, config);
            expect(res.render.getCall(0).args[1].isFiltered).to.be.undefined;
            //expect updateSpreadsheet to have been called

        });
    }); 
});
