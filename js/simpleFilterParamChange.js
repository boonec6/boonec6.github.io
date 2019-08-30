'use strict';

$(document).ready(function() {
    tableau.extensions.initializeAsync({ 'configure': configure }).then(function() {
        //createFilterListener();
    }, function() { console.log('Error while Initializing: ' + err.toString()); });
});

// This opens the configuration window.
function configure() {
    const popupUrl = `https://boonec6.github.io/configDialogFPC.html`;
    let defaultPayload = "";
    tableau.extensions.ui.displayDialogAsync(popupUrl, defaultPayload, { height: 450, width: 500 }).then((closePayload) => {}).catch((error) => {
        switch (error.errorCode) {
            case tableau.ErrorCodes.DialogClosedByUser:
                console.log("Dialog was closed by user");
                break;
            default:
                console.error(error.message);
        }
    });
}

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