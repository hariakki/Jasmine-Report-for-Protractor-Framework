/**
 * Created by Deepak Kumar Susarla.
 */

const testSteps = require('./TestStepsHelper.js');
const jsonUtils = require('./JsonHelper.js');
const resultEnum = require('../Library/Enum.js');
const TestCaseHtmlReport = require("../HtmlHelpers/TestCaseHtmlHelper.js");
const fileUtils = require('../Library/FileUitls.js');
const utils = require('../Library/BrowserUtils.js');
const path = require('path');
let testCaseName = '';
let testCaseCount = 0;
let testCaseJsonObjArray = [];
let AssertionJsonObjArray = [];
const steps = new testSteps();


const TestCases = function () {

    const self = this;


    /*
     * Logs test Cases result only when logging test steps is false(Public method)
     * @param : Assertion
     * @param : AssertionDescription
     * @param : result
     * @param : stackTrace(Only for failed assertion)
     */

    self.log = async function (Assertion, AssertionDescription, result, stackTrace,count) {
        try {
            if (result === resultEnum.results.PASS) {
                await success(Assertion, AssertionDescription, result,stackTrace,count);
            }
            if (result === resultEnum.results.FAIL) {
                await failure(Assertion, AssertionDescription, result, stackTrace,count);
            }

        } catch (e) {
            console.log('Exception in test case log method :' + e.stack);
        }
    };

    /*
     * Sets test case name (Public method)
     * @param : TestCaseName
     */

    self.setTestCaseName = function (TestCaseName) {
        testCaseName = TestCaseName;
    };

    /*
     * returns test case name(Public method)
     */

    self.getTestCaseName = function () {
        return testCaseName;
    };

    /*
     * creates test case json (Public method)
     * @param : sNo
     * @param : testCaseResult
     * @param : execTime
     * @param : testStepHtmlFile
     */

    self.createTestCasesJson = function (testCaseResult, execTime, testStepHtmlFile) {
        const deferred = protractor.promise.defer();
        try {
            ++testCaseCount;
            if(testStepHtmlFile.indexOf(".html")>0){
                const json = jsonUtils.createTestCaseJson(testCaseCount, self.getTestCaseName(), testCaseResult, execTime, testStepHtmlFile);
                testCaseJsonObjArray.push(json);
                deferred.fulfill();
            }else{
                const json = jsonUtils.createTestCaseAssertionJson(testCaseCount, self.getTestCaseName(), testCaseResult, execTime, testStepHtmlFile);
                testCaseJsonObjArray.push(json);
                AssertionJsonObjArray=[];
                deferred.fulfill();
            }
        } catch (e) {
            console.log("Exception in test case method :" + e.stack);
        }
        return deferred.promise;
    };

    /*
     * returns test cases json Array (Public method)
     */

    self.getTestCasesJson = function () {
        const json=jsonUtils.getJsonArray(testCaseJsonObjArray);
        return json;
    };


    /*
     * returns test cases assertion json Array (Public method)
     */

    self.getTestCasesAssertionJson = function () {
        const json=jsonUtils.getJsonArray(AssertionJsonObjArray);
        return json;
    };

    /*
     * creates test cases html file and returns file Name(public method)
     * @param : filePath
     * @param : suiteName
     * @param : specName
     * @return : htmlFileName
     */

    self.createHtmlFile = async function (filePath, suiteName, specName) {
        const deferred = protractor.promise.defer();
        try {
            const filename = suiteName + '-' + specName;
            const htmlFileName = filename + ".html";
            const file_Path =await utils.filesSavePath(self.getTestCaseName());
            const jsonFileName = await createTestStepsJsonFile(filePath+"/"+file_Path.savePath, filename, specName);
            fileUtils.writeFile(filePath+"/"+file_Path.savePath, htmlFileName,
                TestCaseHtmlReport.TestStepHtmlReport(jsonFileName));
            steps.clearCount();
            steps.clearTestStepsJsonArray();
            deferred.fulfill(file_Path.urlPath+"/"+htmlFileName);
        } catch (e) {
            console.log('Exception in test case create html file method :' + e.stack);
        }
            return deferred.promise;
    };

    /*
     * creates test cases json file and returns file Name(private method)
     * @param : filePath
     * @param : jsonFileName
     * @param : specName
     * @return : jsonFileName
     */

    let createTestStepsJsonFile = function (filePath, jsonFileName, specName) {
        const deferred = protractor.promise.defer();
        try {
            jsonFileName = jsonFileName + ".json";
            const jsonText = steps.getTestStepsJson(specName);
            const jsonFile = path.join(filePath, jsonFileName);
            fileUtils.writeFile(filePath, jsonFileName, jsonText);
            deferred.fulfill(jsonFileName);
        } catch (e) {
            console.log('Exception in test case create json file method :' + e.stack);
        }
        return deferred.promise;
    };


    /*
     * creates Success assertion json for a test a case (private method)
     * @param : Name
     * @param : Desc
     * @param : Result
     */

    const success = async function (Name, Desc, Result,stackTrace,count) {
        const deferred = protractor.promise.defer();
        try {
            let screenShotPath = '';
            if (steps.getViewScreenShotOnPass()) {
                const filePath=await utils.filesSavePath(self.getTestCaseName());
                screenShotPath = await utils.getScreenShot(steps.getScreenShotSavePath()+"/"+filePath.savePath,self.getTestCaseName()+"--"+ Desc + count);
                screenShotPath=self.getTestCaseName()+"/"+screenShotPath;
            }
            else {
                screenShotPath = null;
            }
            const json = jsonUtils.createTestStepJson(Name, Desc, Result, stackTrace,
                screenShotPath, steps.getViewScreenShotOnPass());
            AssertionJsonObjArray.push(json);


            deferred.fulfill();
        } catch (e) {
            console.log("Exception in success method :" + e.stack);
            deferred.reject(e.stack);
        }

        return deferred.promise;
    }

    /*
     * creates Success assertion json for a test a case(private method)
     * @param : specName
     * @param : StepDesc
     * @param : Result
     */

    const failure = async function (Name, Desc, Result, stacktrace,count) {
        const deferred = protractor.promise.defer();
        try {
            let screenShotPath = '';
            if (steps.getViewScreenShotOnFailure()) {
                const filePath=await utils.filesSavePath(self.getTestCaseName());
                screenShotPath = await utils.getScreenShot(steps.getScreenShotSavePath()+"/"+filePath.savePath,self.getTestCaseName()+"--"+ Desc + count);
                screenShotPath=self.getTestCaseName()+"/"+screenShotPath;
            }
            else {
                screenShotPath = null;
            }
            const json = jsonUtils.createTestStepJson(Name, Desc, Result, stacktrace,
                screenShotPath, steps.getViewScreenShotOnFailure());
                AssertionJsonObjArray.push(json);
                deferred.fulfill();

        } catch (e) {
            console.log("Exception in failure method :" + e.stack);
            deferred.reject(e.stack);
        }
        return deferred.promise;
    };


};
module.exports = TestCases;