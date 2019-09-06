'use strict';
var singleID = null;

$(document).ready(function() {
    tableau.extensions.initializeAsync().then(function() {
        getSingleID();
        createFilterListener();
    }, function() { console.log('Error while Initializing: ' + err.toString()); });
});


function createFilterListener() {
    const wss = tableau.extensions.dashboardContent.dashboard.worksheets;
    var allWS = wss.find(function(sheet) {
        return sheet.name === 'All User Projects Heat Map';
    });
    var singleWS = wss.find(function(sheet) {
        return sheet.name === 'Single Project Heat Map';
    })

    allWS.addEventListener(pChanged, function(parameterEvent) {

    });
};

function getSingleID() {
    var dash = tableau.extensions.dashboardContent.dashboard;
    var sObj = dash.objects.find(o => o.name === "singleV");
    singleID = sObj.id;
};

async function showSingle() {
    var zoneVisibilityMap = {};
    zoneVisibilityMap[loadingID] = tableau.ZoneVisibilityType.Show;
    await tableau.extensions.dashboardContent.dashboard.setZoneVisibilityAsync(zoneVisibilityMap).then(() => {

    });
};


async function hideSingle() {
    var zoneVisibilityMap = {};
    zoneVisibilityMap[loadingID] = tableau.ZoneVisibilityType.Hide;
    await tableau.extensions.dashboardContent.dashboard.setZoneVisibilityAsync(zoneVisibilityMap).then(() => {

    });
};