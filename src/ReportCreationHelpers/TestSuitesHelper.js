/**
 * Created by Deepak Kumar Susarla.
 */

const TestSuiteHtmlReport = require("../HtmlHelpers/TestSuitehtmlHelper.js");
const jsonUtils = require('./JsonHelper.js');
const fileUtils = require('../Library/FileUitls.js');
const utils = require('../Library/BrowserUtils.js');
const path = require('path');

const TestSuites = function () {

    let suiteJson = '';
    const self = this;

    /*
     * creates test suite json (public method)
     * @param : suiteName
     * @param : suiteStartTime
     * @param : browserName
     * @param : appType
     * @param : browserVersion
     * @param : execEnv
     * @param : baseUrl
     * @param : totalTestCasesPassed
     * @param : totalTestCasesFailed
     * @param : totalTestCasesSkipped
     * @param : testCasesJson
     * @return : suiteJson
     */

    self.createTestSuiteJson = function (suiteName, suiteStartTime, browserName, appType,
                                         browserVersion, execEnv, baseUrl, totalTestCasesPassed,
                                         totalTestCasesFailed, totalTestCasesSkipped, testCasesJson) {
        try {

            suiteJson = jsonUtils.createTestSuiteJson(suiteName, suiteStartTime, browserName, appType,
                browserVersion, execEnv, baseUrl, totalTestCasesPassed,
                totalTestCasesFailed, totalTestCasesSkipped, testCasesJson);

            return suiteJson;

        } catch (e) {
            console.log('Exception in test case json method :' + e.stack);
        }
        ;
    };

    /*
     * returns test suite json (private method)
     */
    const getTestSuitesJson = function () {
        return suiteJson;
    }

    /*
     * creates suite html file and returns fileName (public method)
     * @param : filePath
     * @param : suiteName
     * @returns  : html file Name
     */

    self.createHtmlFile = async function (filePath, suiteName,generateTestSteps) {
        try {

            const filename = suiteName;
            const htmlFileName = filename + ".html";
            const file_Path =await utils.filesSavePath();
            const jsonFileName = createJsonFile(filePath+"/"+file_Path.savePath, filename);
            fileUtils.writeFile(filePath+"/"+file_Path.savePath, htmlFileName, TestSuiteHtmlReport.suiteHtmlReport(jsonFileName,generateTestSteps));
            return file_Path.urlPath + "/" + htmlFileName;

        } catch (e) {
            console.log('Exception in test suite create htm file method :' + e.stack);
        }

    };

    /*
     * creates suite json file and returns fileName (private method)
     * @param : filePath
     * @param : jsonFileName
     * @returns  : json file Name
     */


    const createJsonFile = function (filePath, jsonFileName) {
        try {
            jsonFileName = jsonFileName + ".json";
            const jsonText = getTestSuitesJson();
            const jsonFile = path.join(filePath, jsonFileName);
            fileUtils.writeFile(filePath, jsonFileName, jsonText);
            return jsonFileName;
        } catch (e) {
            console.log('Exception in test steps create json file method :' + e.stack);
        }
    };


};
module.exports = TestSuites;