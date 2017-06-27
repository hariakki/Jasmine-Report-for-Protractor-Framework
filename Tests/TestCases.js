/**
 * Created by Deepak Kumar Susarla.
 */

const Steps = require('../index.js');
const testSteps = Steps.getTestStepInstance();


describe('Main Header -->', function () {

    const url = 'https://angularjs.org';

    afterAll(async function (done) {
        process.nextTick(done);
    });

    it('Title Verification', async function () {
        await testSteps.log('1', 'before browser.get', "passed");
        await browser.get(url);
        await testSteps.log('2', 'After browser.get', "passed");
        const title = await browser.driver.getTitle();
        await testSteps.log('3', 'After get title', "passed");

        expect(title).toEqual("AngularJS — Superheroic JavaScript MVW Framework");
        expect(title).toEqual("AngularJS — Superheroic JavaScript MVW Framework");

    });

    it('Title Verification12', async function () {
        const title = await browser.driver.getTitle();

        expect(title).toEqual("AngularJS — Superheroic JavaScript MVW Framewor");
        expect(title).toEqual("AngularJS — Superheroic JavaScript MVW Framewor");

    });

    it('Title Verification123', async function () {
        const title = await browser.driver.getTitle();

        expect(title).toEqual("AngularJS — Superheroic JavaScript MVW Framewor");
        expect(title).toEqual("AngularJS — Superheroic JavaScript MVW Framework");
        expect(title).toEqual("AngularJS — Superheroic JavaScript MVW Framewor");
        expect(title).toEqual("AngularJS — Superheroic JavaScript MVW Framework");
    });

});


