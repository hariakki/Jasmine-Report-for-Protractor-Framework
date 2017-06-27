/**
 * Created by Deepak Kumar Susarla.
 */

const fileUtils = require('./FileUitls.js');
const imagesPath = 'images/';
let resolutionImagePath = '';

const getScreenShot = function (screenShotSavePath, screenShotName) {
    const deferred = protractor.promise.defer();
    try {
        global.browser.takeScreenshot().then(function (png) {
                resolutionImagePath = screenShotSavePath + '/' + imagesPath;
                        screenShotName = screenShotName + ".png";
            fileUtils.writeFileForScreenshot(resolutionImagePath, screenShotName, png);
            const imageName=imagesPath + screenShotName;
            deferred.fulfill(imageName);
        });
        return deferred.promise;
    } catch (e) {
        console.log("Exception in takeScreenShot Method :" + e.stack);
        deferred.reject(e.stack);
    }

};
module.exports.getScreenShot = getScreenShot;


const getBrowserName = function () {
    const deferred = protractor.promise.defer();
    try {
        let BrowserName = '';
        browser.driver.getCapabilities().then(function (capabilities) {
            BrowserName = capabilities.get('browserName');
            deferred.fulfill(BrowserName);
        });
    } catch (e) {
        console.log("Exception in get Browser Name method :" + e.stack);
        deferred.reject(e.stack);
    }
    return deferred.promise;
};
module.exports.getBrowserName = getBrowserName;


const getBrowserResolution = function () {
    const deferred = protractor.promise.defer();
    try {
        let BrowserResolution = '';
        global.browser.getProcessedConfig().then(function (config) {
            BrowserResolution = config.capabilities.resolution;
            deferred.fulfill(BrowserResolution);
        });
    } catch (e) {
        console.log("Exception in get Browser Resolution method :" + e.stack);
        deferred.reject(e.stack);
    }
    return deferred.promise;
};
module.exports.getBrowserResolution = getBrowserResolution;


const getBrowserVersion = function () {
    const deferred = protractor.promise.defer();
    try {
        let BrowserVersion = '';
        browser.driver.getCapabilities().then(function (capabilities) {
            const browser_Name = capabilities.get('browserName');
            if (browser_Name === 'firefox') {
                BrowserVersion = capabilities.get('browserVersion');
            } else {
                BrowserVersion = capabilities.get('version');
            }
            deferred.fulfill(BrowserVersion);
        });
    } catch (e) {
        console.log("Exception in get Browser Version method :" + e.stack);
        deferred.reject(e.stack);
    }
    return deferred.promise;
};
module.exports.getBrowserVersion = getBrowserVersion;



const filesSavePath=async function (testCaseName) {
    let fileSavePath='';
    let fileNavigationPath='';
    let paths={};
    const browserName=await getBrowserName();
    const browserResolution= await getBrowserResolution();
    if(browserResolution!==undefined){
        if(testCaseName!==undefined){
            fileSavePath=browserName+"/"+browserResolution+"/"+testCaseName;
            fileNavigationPath=testCaseName;
        }
        else{
            fileSavePath=browserName+"/"+browserResolution;
            fileNavigationPath=browserName+"/"+browserResolution;
        }

    }else{
        if(testCaseName!==undefined){
            fileSavePath=browserName+"/"+testCaseName;
            fileNavigationPath=testCaseName;
        }

        else{
            fileSavePath=browserName;
            fileNavigationPath=browserName;
        }

    }
    paths.savePath=fileSavePath;
    paths.urlPath=fileNavigationPath;
    return paths;
};
module.exports.filesSavePath = filesSavePath;