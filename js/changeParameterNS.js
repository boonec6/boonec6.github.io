"use strict";

let loadingID = null;
var secret = "";

$(document).ready(function() {
    tableau.extensions.initializeAsync().then(
        function() {
            loadSecret();
            //alert('extensions ready');
            getLoadingID();
            createFilterListener();
            //hideLoading();
            //showObj();
            //createParameterListener();
        },
    );
});

function loadSecret() {
    tableau.extensions.dashboardContent.dashboard.getParametersAsync().then(function(t) {
        var p = t.find(p1 => p1.name === "secret");
        secret = p.currentValue._value;
    })
};

function getLoadingID() {
    var dash = tableau.extensions.dashboardContent.dashboard;
    var loadingObj = dash.objects.find(o => o.name === "loadingVert");
    //alert("Loading ID: " + loadingObj.id);
    loadingID = loadingObj.id;
    //console.log("loading ID: " + loadingID);
    //alert("loadingID variable = " + loadingID);
    //showLoading();
};

async function showLoading() {
    var zoneVisibilityMap = {};
    zoneVisibilityMap[loadingID] = tableau.ZoneVisibilityType.Show;
    await tableau.extensions.dashboardContent.dashboard.setZoneVisibilityAsync(zoneVisibilityMap).then(() => {
        console.log("Loading Screen Shown");
    });
};


async function hideLoading() {
    var zoneVisibilityMap = {};
    zoneVisibilityMap[loadingID] = tableau.ZoneVisibilityType.Hide;
    await tableau.extensions.dashboardContent.dashboard.setZoneVisibilityAsync(zoneVisibilityMap).then(() => {
        console.log("Loading Screen Hidden");
    });
};

function refreshData() {
    var d = tableau.extensions.dashboardContent.dashboard;
    var ws = d.worksheets;

    for (var ii = 0; ii < ws.length; ii++) {
        var ds = ws[ii].getDataSourcesAsync().then(d1 => {
            for (var i = 0; i < d1.length; i++) {
                d1[i].refreshAsync().then(rA => {})
            }
        })
    }

};


function createFilterListener() {
    var wsN = 'Title';
    const wss = tableau.extensions.dashboardContent.dashboard.worksheets;
    var ws = wss.find(function(sheet) {
        return sheet.name === wsN;
    });
    ws.addEventListener(tableau.TableauEventType.FilterChanged, (filterEvent) => {
        //showLoading().then(() => {
        //alert("showLoading done");
        tableau.extensions.dashboardContent.dashboard.getParametersAsync().then(function(t) {
                var selectedLead = t.find(p1 => p1.name === "selectedLead");
                var selectedProject = t.find(p2 => p2.name === "selectedProjectLead");
                //alert('changed');

                ws.getSummaryDataAsync().then(function(sumdata) {
                        var l1 = sumdata.columns.find(lll => lll.fieldName === "Id").index;
                        var l1a = sumdata.columns.find(llla => llla.fieldName === "ProjectLead").index;
                        var l2 = (sumdata.data[0][l1]._value);
                        var l2a = (sumdata.data[0][l1a]._value);
                        selectedLead.changeValueAsync(l2);
                        selectedProject.changeValueAsync(l2a);
                        //refreshData();
                    })
                    // .then(function(x) {
                    //     //alert("sumdataAsync complete");
                    //     hideLoading();
                    // })
            })
            //});

    });
};

function showObj() {
    var dash = tableau.extensions.dashboardContent.dashboard;
    //alert(dash);
    getLoadingID();

    // dash.objects.forEach(function(object) {
    //     console.log(object.name + ":" + object.type + ":" + object.id + ":" + object.isVisible);
    // })
};

function refreshCall() {
    tableau.extensions.dashboardContent.dashboard.getParametersAsync().then(function(t) {
        var p = t.find(p1 => p1.name === "selectedLead");
        var pCS = p.currentValue._value;
        $.post("https://nswebhook.checksix.com/api/refreshLead/",
            JSON.stringify({
                "leadId": pCS,
                secretkey: secret
            }),
            function(status) { alert(status); });
        //refreshData();
    })
};

function appendCall() {
    showLoading();
    $.post("https://nswebhook.checksix.com/api/Append/",
        JSON.stringify({
            secretkey: secret
        }),
        function(status) {
            console.log(status);
            hideLoading();
            if (status.includes('none')) {
                alert('Database is up to date');
            } else {

            }
        });
    //refreshData();

};
var refreshClick = function() {
    //showObj();
    refreshCall();
};

function appendClick() {
    //showObj();
    appendCall();
};