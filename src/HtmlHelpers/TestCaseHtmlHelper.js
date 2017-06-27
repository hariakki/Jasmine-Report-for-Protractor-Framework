/**
 * Created by Deepak Kumar Susarla.
 */

exports.TestStepHtmlReport = function (jsonfile) {


    let report = '<html lang="en" ng-app="automation"><head><meta charset="UTF-8"> <title>Test Suite Summary Report</title></head>' +
        '<style>table#table1, th, td {border: 1px solid darkgray;border-collapse: collapse; }th, td {padding: 3px;}' +
        'tr#t01 {background-color:#99ccff;}' +
        'tr#t02 {background-color:#2a6496;}#header1 {padding:5px;}#header2 {padding:5px;}#header3 {padding:2px;}' +
        'a:link {color: blueviolet;background-color: transparent;text-decoration: none;}' +
        '</style>' +
        '<style>p{font-size: 0.775em;color:brown}</style>'+
        popupstyle() +
        '<style>.success{color : green;}.failure{color : red;}.pending{color : orange;}</style>' +
        '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js"></script>' +
        '<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular.min.js"></script>' +
        '<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>' +
        '<script src="https://www.gstatic.com/charts/loader.js"></script>' +
        '<script type="text/javascript">' +
        angular(jsonfile) +
        '</script>' +
        '<body bgcolor="#f0f8ff" ng-controller="summaryController"><div id="header">' +
        chartDisplay() +
        '</div>' +
        '<div id="header2">' +
        '<p style="margin-left: 10%;margin-bottom: 0px">Click on result to view full stack trace of failed step.</p>'+
        '<table id="table1" border="1" style="width:80%" align="center" CELLPADDING="2" CELLSPACING="0">' +
        '<tr id="t02"><th colspan="6" style="font-family:Copperplate Gothic Bold; font-size:1.2em; color: lightsteelblue"> Test Case Report </th></tr>' +
        '<tr id="t01"><th align="center">Test Case Name : </th><td colspan="5" align="center">{{data.TestcaseName}}</td></tr>' +
       '<tr id="t01"><th colspan="0" style="width:15%">S.No</th>' +
        '<th colspan="0" style="width:15%">Test Step</th>' +
        '<th colspan="0" style="width:50%">Description</th>' +
        '<th colspan="1" style="width:10%">Result</th>' +
        '<th colspan="1" style="width:25%">ScreenShot</th></tr>' +
        teststeprows() +
        '</table>' +
        '<br> </br><br> </br><br> </br>' +
        '</div>' +
        poupup_script() +
        '</body></html>';


    return report;
}
function angular(jsonfile) {

    angluar = ' let   myapp=angular.module("automation",[]);' +
        ' myapp.controller("summaryController",function ($scope,$http) {' +
        '$scope.openPopup = function(result,data){' +
        'if(result==="failed"){' +
        '$scope.stackTrace = data;' +
        '$("#myModal").modal({keyboard : true});'+
        '$("#myModal").modal("show");}};' +
        '$http({method: "GET", url: "' + jsonfile + '"})' +
        '.success(function (response) {' +
        '$scope.data=response;' +
        '$scope.suites=response.TestSteps;' +
        'google.charts.load("current", {"packages":["corechart"]});' +
        'google.charts.setOnLoadCallback(drawChart);' +
        'function drawChart(){let   data = google.visualization.arrayToDataTable([' +
        '["Task", "Summary"],["Pass", response.total_pass], ["Fail",response.total_fail],["Pending",response.total_skip]]);' +
        'let   options = {title: "Test case Summary",is3D: true,pieHole: 0.4,backgroundColor :"#f0f8ff"};' +
        'let   chart = new google.visualization.PieChart(document.getElementById("piechart"));' +
        'chart.draw(data, options);}' +
        '});' +
        '});';
    return angluar;
}

function teststeprows() {

    let row = '<tr ng-repeat="item in suites" >' +
        '<td align="center" >{{$index+1}}</td>' +
        '<td align="center" >{{item.TestStepName}}</td>' +
        '<td align="center">{{item.TestStepDescription}}</td>' +
        '<td align="center" ng-click="openPopup(item.Result,item.StackTrace)">'  +
        '<span ng-class="' +
        "{success:item.Result=='passed',pending:item.Result=='pending',failure:item.Result=='failed'" +
        '}"' +
        '>{{item.Result}}' +
        '</span></td>' +
        '<td align="center">' + viewScreenShot() + '</td></tr>' +
        '<div class="modal fade" id="myModal" role="dialog">' +
        '<div class="modal-dialog">' +


        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<span class="close" data-dismiss="modal">&times;</span>' +
        '<h4 class="modal-title">Failure Stack</h4>' +
        '</div>' +
        '<div class="modal-body">' +
        '<p>{{stackTrace}}</p>' +
        '</div>' +

        '</div>' +

        '</div>' +
        '</div>';


    return row;
}

function viewScreenShot() {
    const tag = '<a ng-href="{{item.ScreenShotPath}}" ng-if="item.viewScreenShot==true">View</a>';
        return tag;
};

function chartDisplay() {
    let chart = '';
    chart = '<div id="piechart" style="width: 300px; height: 200px; margin-left: 65%"></div>';
    return chart;
};

function popup(text) {
    let popup = '<div class="modal fade" id="myModal" role="dialog">' +
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