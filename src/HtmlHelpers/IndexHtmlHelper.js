/**
 * Created by Deepak Kumar Susarla.
 */


exports.IndexHtmlReport = function (jsonfile) {
    let report = `<html lang="en" ng-app="automation"><head><meta charset="UTF-8"> <title>Automation Summary Report</title></head>
        <style>table, th, td {border: 1px solid darkgray;border-collapse: collapse;}
        th, td {padding: 5px;text-align: center;}tr#t01 {background-color:#99ccff;}a:link {color: blueviolet;background-color: transparent;text-decoration: none;}
        tr#t02 {background-color:#2a6496;}#header1 {padding:5px;}#header2 {padding:5px;}#header3 {padding:2px;}
        header h1 {position: relative;}</style>
        <style>.success{color : green;}.failure{color : red;}.pending{color : orange;}</style>
        <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular.min.js"></script>
        <script type="text/javascript">
        ${angular( jsonfile )}
        </script>
        <body bgcolor="#f0f8ff"><div>
        <div id="header2">
        <table  border="1" style="width:70%" align="center" CELLPADDING="1" CELLSPACING="0" ng-controller="summaryController">
        <tr id="t02" align="center"><th colspan="6" style="font-family:Copperplate Gothic Bold; font-size:1.2em; color: lightsteelblue"> Automation Summary Report </th></tr>
        <tr id="t01" align="center"><th style="width:5%" align="center">S.No</th>
        <th style="width:22%" align="center">Test Suite Name</th>
        <th style="width:13%" align="center">Browser Name</th>
        <th style="width:13%" align="center">Resolution</th>
        <th style="width:10%" align="center">Result</th>
        <th style="width:10%" align="center">Executed Time</th></tr>
        ${testSuiteRows()}
        </table>
        </div></body></html>`;


    return report;
}


function angular(jsonFile) {
    let angluar = `var myapp=angular.module("automation",[]);
        myapp.controller("summaryController",function ($scope,$http) {
        $http({method: "GET", url: " `+jsonFile +` "})
        .success(function (response) {
        $scope.suite=response.suites;
        });
        });`;
    return angluar;
}

function testSuiteRows() {
    let row = `<tr ng-repeat="item in suite">
        <td align="center">{{item.SNo}}</td>
        <td align="center"><a ng-href="{{item.SuiteHtmlUrl}}">{{item.SuiteName}}</a></td>
        <td align="center">{{item.BrowserName}}</td>
        <td align="center">{{item.Resolution}}</td>
        <td align="center">
        <span ng-class="{success:item.Result=='Pass',failure:item.Result=='Fail',pending:item.Result=='Pending'}">{{item.Result}}</span></td>
        <td align="center">{{item.ExecutedTime}} sec(s)</td></tr>`;

    return row;
};