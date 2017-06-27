/**
 * Created by Deepak Kumar Susarla.
 */

const IndexHtmlReport = require("../HtmlHelpers/IndexHtmlHelper.js");
const jsonUtils = require("./JsonHelper.js");
const fileUtils = require('../Library/FileUitls.js');
const path = require('path');
let testSuiteJsonObjArr = [];

const Suites = function () {

    /*
     * Creates Index json file
     * @param : sNo
     * @param : suiteName
     * @param : browserName
     * @param : browserResolution
     * @param : result
     * @param : totalTime
     * @param : suiteHtmlFile
     */

    this.createSuitesJson = function (sNo, suiteName, browserName, browserResolution, result, totalTime, suiteHtmlFile) {
        try {
            if (browserResolution === undefined) {
                browserResolution = null;
            }
            const json = jsonUtils.createIndexJson(sNo, suiteName, browserName, browserResolution, result, totalTime, suiteHtmlFile);
            testSuiteJsonObjArr.push(json);
        } catch (e) {
            console.log("Exception in create Suites json method :" + e.stack);
        }
    };

    /*
     * Creates Index html file
     * @param : filepath
     * @param : fileName
     */

    this.createHtmlFile = function (filepath, fileName) {

        try {

            const jsonFileName = fileName + ".json";
            const htmlFileName = fileName + ".html";

            const text1 = jsonUtils.getTestSuiteJsonArray(testSuiteJsonObjArr);
            let text = jsonUtils.createIndexFullJson(text1);
            if (fileUtils.isFileExists(filepath, jsonFileName)) {
                let arr = [];
                const json_data = JSON.parse(fileUtils.readfile(filepath, jsonFileName));

                for (let i = 0; i < json_data.suites.length; i++) {
                    arr.push(JSON.stringify(json_data.suites[i]));
                }
                let suite_json_data = text1;
                for (let i = 0; i < suite_json_data.length; i++) {
                    arr.push(JSON.stringify(suite_json_data[i]));
                }
                const text2 = jsonUtils.getTestSuiteJsonArray(arr);
                text = jsonUtils.createIndexFullJson(text2);
                fileUtils.writeFile(filepath, jsonFileName, text);
            }
            else {
                fileUtils.writeFile(filepath, jsonFileName, text);
            }
            fileUtils.writeFile(filepath, htmlFileName, IndexHtmlReport.IndexHtmlReport(jsonFileName));

        } catch (e) {
            console.log("Exception index html file creation method :" + e.stack);
        }
    };
};
module.exports = Suites;