'use strict';

$(document).ready(function() {
    tableau.extensions.initializeAsync().then(function() {}, function() { console.log('Error while Initializing: ' + err.toString()); });
});

function btnClick() {
    var d = tableau.extensions.dashboardContent.dashboard;
    var ws = d.worksheets;
    var l = ws.find(w => w.name === "Calendar View (All)");

    var date = new Date();
    var sDate = new Date(date.getFullYear(), date.getMonth(), 1);
    var eDate = new Date(date.getFullYear(), date.getMonth() + 4, 0);
    var filterOptions = {
        min: sDate,
        max: eDate
    };

    l.applyRangeFilterAsync("End Date Time", filterOptions);
    console.log("Filter should be: " + sDate + "-" + eDate);
}
//$('#mainBtn').click(btnClick);