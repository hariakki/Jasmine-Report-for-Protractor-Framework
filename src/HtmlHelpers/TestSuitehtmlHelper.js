/**
 Created by Deepak Kumar Susarla.
 */

let TestcaseSteps;
exports.suiteHtmlReport = function (jsonfile,generateTestSteps) {

    TestcaseSteps = true;
    let report = `<html lang="en" ng-app="automation"><head><meta charset="UTF-8"> <title>Test Suite Summary Report</title></head>
        <style>table#table1, th, td {border: 1px solid darkgray;border-collapse: collapse;}th, td {padding: 3px;}
        tr#t01 {background-color:#99ccff;}
        tr#t02 {background-color:#2a6496;}#header1 {padding:5px;}#header2 {padding:5px;}#header3 {padding:2px;}
        a:link {color: blueviolet;background-color: transparent;text-decoration: none;}
        </style>
        <style>p{font-size: 0.775em;color:brown}</style>
        ${popupstyle()}
        <style>.success{color : green;}.failure{color : red;}.pending{color : orange;}</style>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js"></script>
        <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular.min.js"></script>
        <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
        <script type="text/javascript">
        ${angular(jsonfile)}
        </script>
        <body bgcolor="#f0f8ff" ng-controller="summaryController"><div id="header">
        ${chartDisplay()}
        </div>
        <div id="header1">
        <table id="table1" border="1" style="width:70%" align="center" CELLPADDING="2" CELLSPACING="0">
        <tr id="t02"><th colspan="6" style="font-family:Copperplate Gothic Bold; font-size:1.2em; color: lightsteelblue"> Test Suite Report </th></tr>
        <tr id="t01"><th align="center" style="width:15%">Date & Time : </th><td colspan="1" style="width:20%" align="center">{{data.datetime}}</td>
        <th align="center" style="width:16%">Browser Name : </th><td style="width:16%" align="center">{{data.browserName}}</td>
        <th align="center" style="width:14%">Version : </th><td style="width:18%" align="center">{{data.browserVersion}}</td></tr>
        <tr id="t01"><th align="center" style="width:15%">Application : </th><td style="width:15%" align="center">{{data.applciationType}}</td>
        <th align="center">Execution Env : </th><td align="center" style="width:10%">{{data.execEnv}}</td><td colspan="2"></td></tr>
        <tr id="t01"><th align="center">Url : </th><td colspan="6" align="center"><a ng-href="{{data.baseUrl}}" target="_blank">{{data.baseUrl}}</a></td></tr></table></div>
        <br id="header2">
        ${viewTestCaseText(generateTestSteps)}
        <table id="table1" border="1" style="width:70%" align="center" CELLPADDING="2" CELLSPACING="0">
        <tr id="t01"><th align="center">Test Suite Name : </th><td colspan="5" align="center">{{data.test_suite_name}}</td></tr>
        <tr id="t01"><th colspan="0" style="width:20%">S.No</th>
        <th colspan="0" style="width:40%">Test case Name</th>
        <th colspan="1" style="width:20%">Result</th>
        <th colspan="1" style="width:20%">Executed Time</th></tr>
        ${testcaserows(generateTestSteps)} 
        </table></br>
        </div></br>
        </body>
        ${poupup_script()}
         </html>`;


    return report;
}
function angular(jsonfile) {
    let angluar = `let  myapp=angular.module("automation",[]);
        myapp.controller("summaryController",function ($scope,$http) {
        $scope.openPopup = function(result,data){
            if(result==="failed"){
             $scope.stackTrace = data;
                $("#myModal").modal({keyboard : true});
                //$("#myModal").modal("show");
            }
        };
        $scope.assertion = [];
        $scope.setOpenedAssertion = function(index){  
            if(index === $scope.assertionIndex){
                $scope.assertionIndex = -1;
            }
            else{
                $scope.assertionIndex =  index;
            }
        };
        
        $http({method: "GET", url: " `+jsonfile +` "})
        .success(function (response) {
            $scope.data=response;
            $scope.suites=response.testcases;
            google.charts.load("current", {"packages":["corechart"]});
            google.charts.setOnLoadCallback(drawChart);
            function drawChart(){
            let  data = google.visualization.arrayToDataTable([
                ["Task", "Summary"],["Pass", response.total_pass], ["Fail",response.total_fail],["Pending",response.total_skip]]);
            let  options = {title: "Suite Summary",is3D: true,pieHole: 0.4,backgroundColor :"#f0f8ff"};
            let  chart = new google.visualization.PieChart(document.getElementById("piechart"));
            chart.draw(data, options);}
        });
        });`
    return angluar;
}

function testcaserows(generateTestSteps) {
    let row = rowTreeScript()+
        rowTreeStyle()+
        `<tbody ng-repeat="item in suites" ng-repeat="setAssertion(item)" class="expands">
        <tr ng-click="setOpenedAssertion($index)">
        <td align="center">{{item.SNo}}</td>
        ${teststeps(TestcaseSteps)}
        <td align="center">
        <span ng-class="{success:item.Result=='passed',failure:item.Result=='failed',pending:item.Result=='pending'}">{{item.Result}}</span></td>
        <td align="center">{{item.ExecutedTime}} sec(s)</td>
        </tr>
        ${viewAssertions(generateTestSteps)}
        </tbody>`;


    return row;
};

function viewAssertions(status) {
    let html='';
    if(!status){
        html=`<tr ng-if="$index === assertionIndex">
            <td style="width:70%" colspan="4">
            ${viewAssertionText(status)}
        ${rowTree()}
        </td>
        </tr>`;
    }
    return html;
};

function chartDisplay() {
    let chart = '';
    chart = `<div id="piechart" style="width: 300px; height: 200px; margin-left: 65%"></div>`;
    return chart;
}

function teststeps(TestCaseSteps) {
    let steps = '';
    if (TestCaseSteps)
        steps = `<td align="center"><a ng-href="{{item.TestcaseHtmlUrl}}">{{item.TestcaseName}}</a></td>`;
    else
        steps = `<td align="center">{{item.TestcaseName}}</td>`;

    return steps;
}

function rowTreeScript() {
    let rowScript=`<script>
    function toggle()
    {
        for(var i=0; i<arguments.length; i++)
        {
            with(document.getElementById(arguments[i]))
            {
                if(className.indexOf("removed") > -1)
                {
                    className = className.replace("removed");
                }
                else
                {
                    className += " removed";
                }
            }
        }
    }
    </script>`;

    return rowScript;
};

function rowTreeStyle() {
    let style=`<style>
.removed
    {
        'display:none;
    }
    .expands
    {
        'cursor:pointer; cursor:hand;
    }
    .child1 td:first-child
    {
        'padding-left: 1em;
    }

 .child2 td:first-child
    {
        'padding-left: 2em;
    }
 </style>`;
    return style;
};

function rowTree() {

    let row =
        `<table id="table1" border="1" style="width:95%" align="center" CELLPADDING="1" CELLSPACING="0">
            <tr>
            <th colspan="0" style="width:15%">Name</th>
            <th colspan="0" style="width:50%">Description</th>
            <th colspan="1" style="width:10%">Result</th>
            <th colspan="1" style="width:25%">ScreenShot</th>
            </tr>
            <tr ng-repeat="assertion in item.Assertions">
            <td align="center">{{assertion.TestStepName}}</td>
            <td align="center">{{assertion.TestStepDescription}}</td>
            <td align="center" ng-click="openPopup(assertion.Result,assertion.StackTrace)">
            <span ng-class="{success:assertion.Result=='passed',pending:assertion.Result=='pending',failure:assertion.Result=='failed'}">{{assertion.Result}}</span>
            </td>
             <td align="center">
             <a ng-href="{{assertion.ScreenShotPath}}" ng-if="assertion.viewScreenShot==true">View</a>
             </td>
            </tr>
            <div class="modal fade" id="myModal" role="dialog">
            <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
            <span class="close" data-dismiss="modal">&times;</span>
            <h4 class="modal-title">Failure Stack</h4>
            </div>
            <div class="modal-body">
            <p>{{stackTrace}}</p>
            </div>
            </div>
            </div>
            </div>
         </table>`;
    return row;

};

function viewTestCaseText(status) {
    let text='';
    if(!status)
    text='<p style="margin-left: 15%;margin-bottom: 0px">Click row to view assertion statuses.</p>';
    else
        text='<p style="margin-left: 15%;margin-bottom: 0px">Click on test case name to view test steps.</p>';
    return text;
}

function viewAssertionText(status) {
    let text='';
    if(!status)
        text='<p style="margin-left: 15%;margin-bottom: 0px">Click on assertion result to view full stack trace of failed step.</p>';
    return text;
}

function popup(text) {
    let popup = '<div class="modal fade" id="myModal" role="dialog" tabindex="-1">' +
        '<div class="modal-dialog">' +


        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<span class="close" data-dismiss="modal">&times;</span>' +
        '<h4 class="modal-title">Failure Stack</h4>' +
        '</div>' +
        '<div class="modal-body">' +
        '<p>eval(' + text + ')</p>' +
        '</div>' +

        '</div>' +

        '</div>' +
        '</div>';

    return popup;
}
function popupstyle() {
    let style = '<style>\n' +
        '.modal {' +
        'display: none;' + /* Hidden by default */
        'position: fixed;' + /* Stay in place */
        'z-index: 1;' + /* Sit on top */
        'padding-top: 70px;' + /* Location of the box */
        'left: 0;' +
        'top: 0;' +
        'width: 100%;' + /* Full width */
        'height: 100%;' + /* Full height */
        'overflow: auto;' + /* Enable scroll if needed */
        'background-color: rgb(0,0,0);' + /* Fallback color */
        'background-color: rgba(0,0,0,0.4);' + /* Black w/ opacity */
        '}' +

        /* Modal Content */
        '.modal-content {' +
        'position: relative;' +
        'background-color: #fefefe;' +
        'margin: auto;' +
        'padding: 0;' +
        'border: 1px solid #888;' +
        'width: 40%;' +
        'box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);' +
        '-webkit-animation-name: animatetop;' +
        '-webkit-animation-duration: 0.3s;' +
        'animation-name: animatetop;' +
        'animation-duration: 0.3s' +
        '}' +

        /* Add Animation */
        '@-webkit-keyframes animatetop {' +
        'from {top:-300px; opacity:10}' +
        'to {top:0; opacity:1}' +
        '}' +

        '@keyframes animatetop {' +
        'from {top:-300px; opacity:0}' +
        'to {top:0; opacity:1}' +
        '}' +

        /* The Close Button */
        '.close {' +
        'color: white;' +
        'float: right;' +
        'font-size: 23px;' +
        'font-weight: bold;' +
        '}' +

        '.close:hover,' +
        '.close:focus {' +
        'color: #000;' +
        'text-decoration: none;' +
        'cursor: pointer;' +
        ' }' +

        '.modal-header {' +
        ' padding: 2px 16px;' +
        'background-color: #5cb85c;' +
        ' color: white;' +
        ' }' +

        '.modal-body {padding: 2px 16px;height: 320px; overflow: scroll;}' +


        '</style>';

    return style;
};

function poupup_script() {
    let script = '<script>' +
        // Get the modal
        'let   modal = document.getElementById("myModal");' +

        // Get the button that opens the modal
        'let   btn = document.getElementById("pop");' +

        // Get the <span> element that closes the modal
        'let   span = document.getElementById("close")[0];' +

        // When the user clicks the button, open the modal
        'btn.onclick = function() {' +
        'modal.style.display = "block";}\n' +

        // When the user clicks on <span> (x), close the modal
        'span.onclick = function() {' +
        'modal.style.display = "none";}\n' +

        // When the user clicks anywhere outside of the modal, close it
        'window.onclick = function(event) {' +
        'if (event.target == modal) {' +
        'modal.style.display = "none";' +
        '}}' +
        '</script>';
    return script;
};

