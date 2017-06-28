/**
 * Created by Deepak Kumar Susarla.
 */


var fs = require( 'fs' );
var path = require( 'path' );
const jasmineReports = require( './index.js' );

exports.config = {
    //directConnect: false,

    // Capabilities to be passed to the webdriver instance.

    //pass this in command prompt --capabilities.browserName='chrome'
    capabilities: {
        'browserName': ''||'chrome',
        'resolution': '1024x768'
    },
   /*seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
     multiCapabilities: [{
         'browserName': 'chrome',
         'resolution': '1024x768',
        split: false,
         maxSessions:1
     }, {
         'browserName': 'firefox',
         split: false,
        maxSessions:1,
         'resolution': '1024x768',
         'marionette': 'true'
     }],*/

    // Framework to use. Jasmine is recommended.
    framework: 'jasmine',

    // Spec patterns are relative to the current working directory when
    // protractor is called.
    specs: [''|| 'Tests/TestCases.js'],

    // Options to be passed to Jasmine.
    jasmineNodeOpts: {
        onComplete: null,
        isVerbose: true,
        showColors: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 60000
    },


    onPrepare: function () {

        const options={
            savePath:'Test_Results',
            removeResultsDirectory:true,
            takeScreenshotsOnPass:false,
            takeScreenshotsOnFailures:true,
            fileName:'index',
            generateTestSteps:true
        };
        const report= jasmineReports.Reporter(options);
        jasmine.getEnv().addReporter( report );


    }
};
