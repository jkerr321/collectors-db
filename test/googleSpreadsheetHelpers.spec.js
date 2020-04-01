
const expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();
const { updateSpreadsheet, getRows } = require('../server/helpers/googleSpreadSheetHelpers');
const config = require('../config');
const sinon = require('sinon');
const reqBody = require('./fixtures/reqBody');
const rows = require('./fixtures/rows');

describe('googleSpreadSheetHelpers', async () => {
    describe('getRows', async () => {
        it('returns an array of objects', async () => {
            const rows = await getRows(config);
            expect(rows).to.be.an('array');
            expect(rows[0]).to.be.an('object');
        }).timeout(15000);
        it('rows contain an id value', async () => {
            const rows = await getRows(config);
            expect(rows[0]).to.haveOwnProperty('ID');
        }).timeout(15000);
    });

    describe('updateSpreadsheet', () => {
        it('returns the correct changed value based on req.body', async () => {
            expect(await updateSpreadsheet(rows, reqBody.updateThree)).to.equal('Got923');
            expect(await updateSpreadsheet(rows, reqBody.updateFour)).to.equal('£2.80924');
            expect(await updateSpreadsheet(rows, reqBody.updateFive)).to.equal('GotGotYesYes926');
        }).timeout(15000);
    });

});
