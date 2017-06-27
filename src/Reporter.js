/**
 * Created by Deepak Kumar Susarla.
 */

let _ = require('lodash');
let dateFormat = require('dateformat');

const resultsEnum = require('./Library/Enum.js');
const Steps = require('./ReportCreationHelpers/TestStepsHelper.js');
const Cases = require('./ReportCreationHelpers/TestCasesHelper.js');
const Suites = require('./ReportCreationHelpers/TestSuitesHelper.js');
const index = require('./ReportCreationHelpers/IndexHelper.js');
const utils = require('./Library/BrowserUtils.js');

const testSteps = new Steps();
const testCases = new Cases();
const testSuites = new Suites();
const allSuites = new index();


let suiteCount = 0;
let testCaseCount = 0, suiteStartTime = '', suiteEndTime = '', specStartTime = '', specEndTime = '';
let totalPass = 0, totalFail = 0, totalSkipped = 0;
let suiteFail = 0, suiteSkip = 0;
let suiteName, SpecName = '';

function trim(str) {
    return str.replace(/^\s+/, "").replace(/\s+$/, "");
}
function elapsed(start, end) {
    return parseDecimalRoundAndFixed(((end - start) / 1000), 0);
}
function isFailed(obj) {
    return obj.status === "failed";
}
function isSkipped(obj) {
    return obj.status === "pending";
}
function isDisabled(obj) {
    return obj.status === "disabled";
}
function parseDecimalRoundAndFixed(num, dec) {
    let d = Math.pow(10, dec);
    return (Math.round(num * d) / d).toFixed(dec);
}


function Reporter(options) {

    let UNDEFINED, exportObject = exports;

    const self = this;

    self.started = false;
    self.finished = false;
    options = options || {};
    self.savePath = options.savePath || 'Test_Results';
    self.takeScreenshotsOnPass = options.takeScreenshotsOnPass === UNDEFINED ? false : options.takeScreenshotsOnPass;
    self.takeScreenshotsOnFailures = options.takeScreenshotsOnFailures === UNDEFINED ? false : options.takeScreenshotsOnFailures;
    self.fileName = options.fileName === UNDEFINED ? 'htmlReport' : options.fileName;
    self.application = options.application === UNDEFINED ? 'Desktop' : options.application;
    self.exeEnv = options.exeEnv === UNDEFINED ? 'local' : options.exeEnv;
    self.baseUrl = options.baseUrl === UNDEFINED ? 'Not specified' : options.baseUrl;
    self.generateTestSteps = options.generateTestSteps === UNDEFINED ? false : options.generateTestSteps;

    testSteps.setScreenShotSavePath(self.savePath);
    testSteps.setViewScreenShotOnPass(self.takeScreenshotsOnPass);
    testSteps.setViewScreenShotOnFailure(self.takeScreenshotsOnFailures);

    function extend(dupe, obj) {
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                dupe[prop] = obj[prop];
            }
        }
        return dupe;
    }

    let suites = [],
        currentSuite = null,
        totalSpecsExecuted = 0,
        totalSpecsDefined,

        fakeFocusedSuite = {
            id: 'focused',
            description: 'focused specs',
            fullName: 'focused specs'
        };

    let __suites = {}, __specs = {};

    function getSuite(suite) {
        __suites[suite.id] = extend(__suites[suite.id] || {}, suite);

        return __suites[suite.id];
    }

    function getSpec(spec) {
        __specs[spec.id] = extend(__specs[spec.id] || {}, spec);
        return __specs[spec.id];
    }

    self.jasmineStarted = function (summary) {
        totalSpecsDefined = summary && summary.totalSpecsDefined || NaN;
        let now = new Date();
        exportObject.startTime = dateFormat(now, "dd-mm-yyyy h:MM:ss TT");
        self.started = true;


    };
    self.suiteStarted = function (suite) {
        testCaseCount = 0;
        suite = getSuite(suite);
        ++suiteCount;
        suiteStartTime = new Date();
        suiteName = suite.description;
        suite._startTime = dateFormat(suiteStartTime, "dd-mm-yyyy h:MM:ss TT");
        suite._specs = [];
        suite._suites = [];
        suite._failures = 0;
        suite._skipped = 0;
        suite._disabled = 0;
        suite._parent = currentSuite;


        if (!currentSuite) {
            suites.push(suite);
        } else {
            currentSuite._suites.push(suite);
        }
        currentSuite = suite;
    };
    self.specStarted = function (spec) {
        if (!currentSuite) {
            // focused spec (fit) -- suiteStarted was never called
            self.suiteStarted(fakeFocusedSuite);
        }
        spec = getSpec(spec);

        ++testCaseCount;
        specStartTime = new Date();
        spec._startTime = dateFormat(specStartTime, "dd-mm-yyyy h:MM:ss TT");
        spec._suite = currentSuite;
        currentSuite._specs.push(spec);
    };

    self.specDone = async function (spec) {
        SpecName = spec.description;
        testSteps.setTestCaseName(SpecName);
        testCases.setTestCaseName(SpecName);

        spec = getSpec(spec);

        if (isSkipped(spec)) {
            spec._suite._skipped++;
            totalSkipped++;
        }
        if (isDisabled(spec)) {
            spec._suite._disabled++;
        }
        if (isFailed(spec)) {
            spec._suite._failures++;
            totalFail++;
        }
        totalSpecsExecuted++;
        if (spec.passedExpectations.length > 0) {
            for (let i = 0; i < spec.passedExpectations.length; i++) {
                if(self.generateTestSteps){
                    await testSteps.log('Assertion', spec.passedExpectations[i].message,
                        resultsEnum.results.PASS);
                }else{
                    await testCases.log('Assertion', spec.passedExpectations[i].message,
                        resultsEnum.results.PASS,null,i);
                }
            }
            spec.passedExpectations = '';
        }

        if (spec.failedExpectations.length > 0) {
            for (let i = 0; i < spec.failedExpectations.length; i++) {
                if(self.generateTestSteps){
                    await testSteps.log('Assertion', spec.failedExpectations[i].message,
                        resultsEnum.results.FAIL, spec.failedExpectations[i].stack);

                }else {
                    await  testCases.log('Assertion', spec.failedExpectations[i].message,
                        resultsEnum.results.FAIL, spec.failedExpectations[i].stack,i);

                }
            }
            spec.failedExpectations = '';
        }

        specEndTime = new Date();
        spec._endTime = dateFormat(specEndTime, "dd-mm-yyyy h:MM:ss TT");
        let totalTime = elapsed(specStartTime, specEndTime);
        let fileName = '';

        if (self.generateTestSteps) {
            fileName= await testCases.createHtmlFile(self.savePath, suiteName, SpecName);
            testCases.createTestCasesJson(spec.status, totalTime, fileName);

        } else {
            const json=testCases.getTestCasesAssertionJson();
            testCases.createTestCasesJson(spec.status, totalTime, json);

        }


    };

    self.suiteDone = async function (suite) {
        suite = getSuite(suite);
        suiteEndTime = new Date();
        let total_time = elapsed(suiteStartTime, suiteEndTime);

        if (totalFail > 0)
            totalPass = testCaseCount - (totalFail + totalSkipped);
        else
            totalPass = testCaseCount - totalSkipped;

        const testCaseJson = testCases.getTestCasesJson();
        const browserName = await utils.getBrowserName();
        const browserVersion = await utils.getBrowserVersion();
        const browserResolution = await utils.getBrowserResolution();
        testSuites.createTestSuiteJson(suiteName, suite._startTime, browserName, self.application,
            browserVersion, self.exeEnv, self.baseUrl, totalPass, totalFail, totalSkipped, testCaseJson);
        const suiteFileName = await testSuites.createHtmlFile(self.savePath, suiteName,self.generateTestSteps);

        let result;
        if (totalFail == 0 && totalSkipped == 0) {
            result = 'Pass';

        }
        if (totalSkipped != 0) {
            result = "Pending";
            suiteSkip++;
        }
        if (totalFail != 0) {
            result = 'Fail';
            suiteFail++;
        }
        allSuites.createSuitesJson(suiteCount, suite.fullName, browserName,
            browserResolution, result, total_time, suiteFileName);

        if (suite._parent === UNDEFINED) {

            self.suiteStarted(suite);
        }
        suite._endTime = new Date();
        currentSuite = suite._parent;
        totalPass = 0;
        totalFail = 0;
        totalSkipped = 0;
    };

    self.jasmineDone = function () {
        if (currentSuite) {
            self.suiteDone(fakeFocusedSuite);
        }
        allSuites.createHtmlFile(self.savePath, self.fileName);
        self.finished = true;
        exportObject.endTime = new Date();

    };
    return this;
}
module.exports = Reporter;

