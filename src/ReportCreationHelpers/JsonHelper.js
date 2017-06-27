/**
 * Created by Deepak Kumar Susarla.
 */


const createTestStepJson = function (StepName, StepDesc, Result, stackTrace, screenShotPath, viewScreenShot) {
    try {
        const json = {
            "TestStepName": StepName,
            "TestStepDescription": StepDesc,
            "Result": Result,
            "StackTrace": stackTrace,
            "ScreenShotPath": screenShotPath,
            "viewScreenShot": viewScreenShot
        };
        return JSON.stringify(json);

    } catch (e) {
        console.log("Exception in getJson method of test steps :" + e.stack);
    }
};
module.exports.createTestStepJson = createTestStepJson;

const createTestStepFullJson = function (step_pass_count, step_fail_count, specName, testStep_json_obj_arr) {
    try {
        const fullJson = {
            "total_pass": step_pass_count,
            "total_fail": step_fail_count,
            "TestcaseName": specName,
            "TestSteps": getJsonArray(testStep_json_obj_arr)
        };
        return JSON.stringify(fullJson);

    } catch (e) {
        console.log("Exception in getFullJson method of test steps :" + e.stack);
    }
};
module.exports.createTestStepFullJson = createTestStepFullJson;


const createTestCaseJson = function (sNo, testCaseName, testCaseResult, execTime, htmlFileUrl) {
    try {
        const json = {
            "SNo": sNo,
            "TestcaseName": testCaseName,
            "Result": testCaseResult,
            "ExecutedTime": execTime,
            "TestcaseHtmlUrl": htmlFileUrl
        };
        return JSON.stringify(json);

    } catch (e) {
        console.log("Exception in createTestCaseJson method :" + e.stack);
    }
};
module.exports.createTestCaseJson = createTestCaseJson;


const createTestCaseAssertionJson = function (sNo, testCaseName, testCaseResult, execTime, assertionJsonObjArray) {
    try {
        const json = {
            "SNo": sNo,
            "TestcaseName": testCaseName,
            "Result": testCaseResult,
            "ExecutedTime": execTime,
            "Assertions": assertionJsonObjArray
        };
        return JSON.stringify(json);

    } catch (e) {
        console.log("Exception in createTestCaseAssertionJson method :" + e.stack);
    }
};
module.exports.createTestCaseAssertionJson = createTestCaseAssertionJson;


const createTestCasesJson = function (sNo, testCaseName, testCaseResult, stackTrace, execTime, screenShotPath, viewScreenShot) {
    try {
        const json = {
            "SNo": sNo,
            "TestcaseName": testCaseName,
            "Result": testCaseResult,
            "StackTrace": stackTrace,
            "ScreenShotPath": screenShotPath,
            "viewScreenShot": viewScreenShot,
            "ExecutedTime": execTime
        };
        return JSON.stringify(json);

    } catch (e) {
        console.log("Exception in createTestCaseJson method :" + e.stack);
    }
};
module.exports.createTestCasesJson = createTestCasesJson;

const createTestSuiteJson = function (suiteName, suiteStartTime, browserName, appType,
                                      browserVersion, execEnv, baseUrl, totalTestCasesPassed,
                                      totalTestCasesFailed, totalTestCasesSkipped, testCasesJson) {
    try {
        const json = {
            "test_suite_name": suiteName,
            "datetime": suiteStartTime,
            "browserName": browserName,
            "browserVersion": browserVersion,
            "applciationType": appType,
            "execEnv": execEnv,
            "baseUrl": baseUrl,
            "total_pass": totalTestCasesPassed,
            "total_fail": totalTestCasesFailed,
            "total_skip": totalTestCasesSkipped,
            "testcases": testCasesJson
        };
        return JSON.stringify(json);

    } catch (e) {
        console.log("Exception in createJson method :" + e.stack);
    }
};
module.exports.createTestSuiteJson = createTestSuiteJson;


const createIndexJson = function (sNo, suiteName, browserName, resolution, result, totalTime, suiteHtmlFile) {
    try {
        const json = {
            "SNo": sNo,
            "SuiteName": suiteName,
            "BrowserName": browserName,
            "Resolution": resolution,
            "Result": result,
            "ExecutedTime": totalTime,
            "SuiteHtmlUrl": suiteHtmlFile
        };
        return JSON.stringify(json);

    } catch (e) {
        console.log("Exception in createIndexJson method :" + e.stack);
    }
};
module.exports.createIndexJson = createIndexJson;

const createIndexFullJson = function (jsonData) {
    try {
        const json = {
            "suites": jsonData
        };
        return JSON.stringify(json);

    } catch (e) {
        console.log("Exception in createIndexFullJson method :" + e.stack);
    }
};
module.exports.createIndexFullJson = createIndexFullJson;


const getTestSuiteJsonArray = function (jsonObject) {
    let arraylist = [];

    for (let i = 0; i < jsonObject.length; i++) {
        let jsonobj = [];

        jsonobj = JSON.parse(jsonObject[i]);
        if (jsonobj.length > 1) {
            for (let j = 0; j < jsonobj.length; j++) {
                arraylist.push(jsonobj[j]);
            }
        }
        else
            arraylist.push(jsonobj);
    }
    return arraylist;
};
module.exports.getTestSuiteJsonArray = getTestSuiteJsonArray;


const getJsonArray = function (jsonObject) {
    try {
        let arrayList = new Array();
        for (let i = 0; i < jsonObject.length; i++) {
            arrayList.push(JSON.parse(jsonObject[i]));
        }
        return arrayList;

    } catch (e) {
        console.log("Exception in getJsonArray method of test steps :" + e.stack);
    }
};
module.exports.getJsonArray = getJsonArray;