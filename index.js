/**
 * Created by Deepak Kumar Susarla.
 */
const fs = require('fs'),
    mkdirp = require('mkdirp'),
    path = require('path');
const JasmineReports=require('./src/Reporter.js');
const testSteps=require('./src/ReportCreationHelpers/TestStepsHelper.js');
let generateTestSteps=false;
let dirPath;
const Reporter=function (options) {

    if(options.savePath===undefined){
        throw new Error("Save path is not set. Please set save path in conf.js ...");
    }
    dirPath=options.savePath;
    rmdir(options.savePath, options.fileName);
    return new JasmineReports(options);

};
module.exports.Reporter=Reporter;

function rmdir(dir, file) {
    try {
        let list = fs.readdirSync(dir);
        for (let i = 0; i < list.length; i++) {
            let filename = path.join(dir, list[i]);
            let stat = fs.statSync(filename);

            if (stat.isDirectory()) {
                // rmdir recursively
                rmdir(filename);
            } else {

                fs.unlinkSync(filename);
            }
        }
        if (dir != dirPath)
            fs.rmdirSync(dir);
    } catch (e) {
        console.error("Problem....Trying to remove a folder" + e.message);
    }
}

const getTestStepInstance=function () {
    return new testSteps();

};
module.exports.getTestStepInstance=getTestStepInstance;