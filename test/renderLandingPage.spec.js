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
        'Got Want': 'Got',
        'Programme Price': '',
        'Programme Notes': '',
        ID: '923'
    }
    const reqBodyUpdateFour = {
        gotWant: '',
        'Programme Price': '£2.80',
        'Programme Notes': '',
        ID: '924'
    }

    beforeEach(() => {
        sandbox = sinon.createSandbox();        
        req = (method, body) => ({
            method: method || 'GET',
            get: () => { },
            post: () => { },
            cookies: {},
            query: {},
            body: { ...body || {} }
        });

        res = {
            render: sinon.spy(),
            redirect: sinon.spy()
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('getRows', async () => {
        it('returns an array of objects', async () => {
            const rows = await getRows(config);
            expect(rows).to.be.an('array');
            expect(rows[0]).to.be.an('object');
        });
        it('rows contain an id value', async () => {
            const rows = await getRows(config);
            expect(rows[0]).to.haveOwnProperty('ID');
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
            expect(getFilterArray(reqBodyFilterOne)).to.eql(['1947/48,1948/49', 'Want']);
            expect(getFilterArray(reqBodyFilterTwo)).to.eql(['Bournemouth,Swansea City,Walsall']);
        });
    });

    describe('filterRows', () => {
        it('returns the rows that match the given filter conditions in req.body', async () => {
            const filteredRowsOne = await filterRows(rows, reqBodyFilterOne);
            const filteredRowsTwo = await filterRows(rows, reqBodyFilterTwo);

            expect(filteredRowsOne.every(value => value['Got/Want'] === 'Want')).to.be.true;
            expect(filteredRowsOne.every(value => value.Season === '1947/48' || '1948/49')).to.be.true;
            expect(filteredRowsTwo.every(value => value.Opponent !== 'Queens Park Rangers')).to.be.true;
            expect(filteredRowsTwo.some(value => value.Opponent === 'Walsall')).to.be.true;
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
        it('specifies whether a collection is not complete for a season', () => { //TODO This should really be its own tested function I think
            expect(getFullListData(rows)[0].isNotComplete).to.be.true;
        });
        it('does not specify "isNotComplete" value for a completed season', () => {
            expect(getFullListData(rows)[1].isNotComplete).to.be.undefined;
        });
    });

    describe('updateSpreadsheet', () => {
        it('returns the correct changed value based on req.body', async () => {
            expect(await updateSpreadsheet(rows, reqBodyUpdateThree)).to.equal('Got923');
            expect(await updateSpreadsheet(rows, reqBodyUpdateFour)).to.equal('£2.80924');
        });
    });

    describe('init', () => {
        it('renders the site', async () => {
            await init(req(), res, config);
            expect(res.render.calledOnce).to.be.true;
        });

        // it('renders the site with password fail object if password provided doesn\'t match config', async () => {
        //     await init(req('POST', { password: 'password' }), res, config);
        //     expect(res.redirect.calledOnce).to.be.true;
        // });

        // it('redirects to itself when password provided matches config and sets cookie', async () => {
        //     await init(req('POST', { password: 'wrongPassword' }), res, config);
        //     expect(res.render.getCall(0).args[1].passwordFail).to.be.true;
        // });

        // it('calls res.render with the correct render data when the request method is POST and req.body contains isFiltered', async () => {
            //TODO need to stub getRows function - do I need to make renderLandingPage a class for that?
            // const getRowsStub = sinon.stub(RenderLandingPage, 'getRows');
        //     await init(req('POST', reqBodyFilterOne), res, config);
        //     expect(res.render.getCall(0).args[1].isFiltered).to.be.true;
        //     expect(res.render.getCall(0).args[1].appliedFilter).to.eql(['1947/48,1948/49', 'Want']);
        // });
        // it('calls res.render with the correct render data when the request method is POST', async () => {
        //     //TODO need to stub update SS function - do I need to make renderLandingPage a class for that?
        //     await init(req('POST', reqBodyUpdateFour), res, config);
        //     expect(res.render.getCall(0).args[1].isFiltered).to.be.undefined;
        //     //expect updateSpreadsheet to have been called

        // });
    }); 
});
