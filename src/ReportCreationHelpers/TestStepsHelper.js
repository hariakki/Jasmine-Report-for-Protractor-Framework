/**
 * Created by Deepak Kumar Susarla.
 */

const fileUtils = require('../Library/FileUitls.js');
const jsonUtils = require('./JsonHelper.js');
const resultEnum = require('../Library/Enum.js');
const utils = require('../Library/BrowserUtils.js');
const path = require('path');

let step_pass_count = 0;
let step_fail_count = 0;
let testStep_json_obj_arr = [];
let viewScreenShotOnPass = false;
let viewScreenShotOnFailure = false;
let screenShotSavePath = '';
let testCaseName = '';


const TestSteps = function () {

    const self = this;


    /*
     * Logs testSteps result(Public method)
     * @param : testStepName
     * @param : testStepDescription
     * @param : result
     * @param : needScreenShot
     * @param : testStepStackTrace(Only for failed step)
     */

    self.log = async function (testStepName, testStepDescription, result, testStepStackTrace) {

        if (result === resultEnum.results.PASS) {
            await success(testStepName, testStepDescription, result);
        }
        if (result === resultEnum.results.FAIL) {
            await failure(testStepName, testStepDescription, result, testStepStackTrace);
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
     * Clears pass and fail steps count for each test case(Public method)
     */

    self.clearCount = function () {
        step_pass_count = 0;
        step_fail_count = 0;
    }


    /*
     * Clears test step json object array for each test case(Public method)
     */

    self.clearTestStepsJsonArray = function () {
        testStep_json_obj_arr=[];
    }

    /*
     * Sets Screen Shot save path(Public method)
     * @param : savePath
     */

    self.setScreenShotSavePath = function (savePath) {
        screenShotSavePath = savePath;
    }

    /*
     * returns Screen Shot save path(Public method)
     * @return : savePath
     */

    self.getScreenShotSavePath = function () {
        return screenShotSavePath;
    }

    /*
     * Sets View Screen Shot on Pass or not(Public method)
     * @param : ViewScreenShot
     */

    self.setViewScreenShotOnPass = function (ViewScreenShot) {
        viewScreenShotOnPass = ViewScreenShot;
    };

    /*
     * returns View Screen Shot on Pass or not(Public method)
     * @return : viewScreenShotOnPass
     */

    self.getViewScreenShotOnPass = function () {
        return viewScreenShotOnPass ;
    };

    /*
     * Sets View Screen Shot on Failure or not(Public method)
     * @param : ViewScreenShotOnFailure
     */

    self.setViewScreenShotOnFailure = function (ViewScreenShotOnFailure) {
        viewScreenShotOnFailure = ViewScreenShotOnFailure;
    };

    /*
     * returns View Screen Shot on Failure or not(Public method)
     * @return : ViewScreenShotOnFailure
     */

    self.getViewScreenShotOnFailure = function () {
        return viewScreenShotOnFailure;
    };


    /*
     * returns all test steps json for a test a case(Public method)
     * @param : specName
     * @return : json array
     */

    self.getTestStepsJson = function (specName) {
        try {
            const json = jsonUtils.createTestStepFullJson(step_pass_count, step_fail_count, specName, testStep_json_obj_arr);
            return json;

        } catch (e) {
            console.log('Exception in test steps json method :' + e.stack);
        }
    };

    /*
     * creates Success test step json for a test a case (private method)
     * @param : specName
     * @param : StepDesc
     * @param : Result
     */

    const success = async function (StepName, StepDesc, Result) {

        if(StepName===undefined){
            throw new Error("Test Step Name is undefined..");
        }

        if(StepDesc===undefined){
            throw new Error("Test step Description is undefined..");
        }

        if(Result===undefined){
            throw new Error("Test Step result is undefined..");
        }


        ++step_pass_count;
        let screenShotPath = '';
        if (viewScreenShotOnPass) {
            const filePath=await utils.filesSavePath(self.getTestCaseName());
            screenShotPath = await utils.getScreenShot(screenShotSavePath+"/"+filePath.savePath,self.getTestCaseName()+"--"+ StepDesc + "-"+ step_pass_count);
        }
        else {
            screenShotPath = null;
        }
        const stepsJson = jsonUtils.createTestStepJson(StepName, StepDesc, Result, null,
            screenShotPath, viewScreenShotOnPass);
        testStep_json_obj_arr.push(stepsJson);
    }

    /*
     * creates Failure test step json for a test a case(private method)
     * @param : specName
     * @param : StepDesc
     * @param : Result
     */

    const failure = async function (StepName, StepDesc, Result, stacktrace) {

        if(StepName===undefined){
            throw new Error("Test Step Name is undefined..");
        }

        if(StepDesc===undefined){
            throw new Error("Test step Description is undefined..");
        }

        if(Result===undefined){
            throw new Error("Test Step result is undefined..");
        }

        if(stacktrace===undefined){
            throw new Error("Test Step failure stack Trace is undefined..");
        }

        ++step_fail_count;
        let screenShotPath = '';
        if (viewScreenShotOnFailure) {
            const filePath=await utils.filesSavePath(self.getTestCaseName());
            screenShotPath = await utils.getScreenShot(screenShotSavePath+"/"+filePath.savePath,self.getTestCaseName()+"--"+ StepDesc + "-"+step_fail_count);
        }
        else {
            screenShotPath = null;
        }
        const stepsJson = jsonUtils.createTestStepJson(StepName, StepDesc, Result, stacktrace,
            screenShotPath, viewScreenShotOnFailure);
        testStep_json_obj_arr.push(stepsJson);
    };



};
module.exports = TestSteps;