const expect = require('chai').expect;
const { getRows, getUniqueList, updateSpreadsheet, getFullListData, filterRows, getFilterArray, init } = require('../server/controllers/renderLandingPage');
const config = require('../config');
const rows = require('./fixtures/rows');

//!!! TODO remove filter button not working - works on dad's production db

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
    it('returns a string containing the relevant values for filtering the data from req.body', async () => {
        const reqBodyOne  = {
            gotWantFilter: 'Want',
            seasonFilter: [ '1947/48', '1948/49' ],
            filter: 'filter'
        }
        const reqBodyTwo = {
            opponentFilter: [ 'Aldershot', 'Dulwich Hamlet', 'Swansea City', 'Walsall' ],
            filter: 'filter' 
        }
        expect(getFilterArray(reqBodyOne)).to.eql(['1947/48,1948/49', 'Want'])
        expect(getFilterArray(reqBodyTwo)).to.eql(['Aldershot,Dulwich Hamlet,Swansea City,Walsall'])
    });
});

describe('init', () => {
}); 

describe('filterRows', () => {

});

describe('getFullListData', () => {

});


describe('updateSpreadsheet', () => {

});