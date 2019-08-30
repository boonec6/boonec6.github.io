'use strict';

$(document).ready(function() {
    tableau.extensions.initializeAsync({ 'configure': configure }).then(function() {
        createFilterListener();
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
    var srcSheet = tableau.extensions.settings.get("srcSheet");
    var srcField = tableau.extensions.settings.get("srcField");
    var param = tableau.extensions.settings.get("param");
    console.log(srcSheet);
    console.log(srcField);
    console.log(param);
    const wss = tableau.extensions.dashboardContent.dashboard.worksheets;
    var ws = wss.find(function(sheet) {
        return sheet.name === srcSheet;
    });
    ws.addEventListener(tableau.TableauEventType.FilterChanged, (filterEvent) => {
        tableau.extensions.dashboardContent.dashboard.getParametersAsync().then(function(t) {
            var selParam = t.find(p1 => p1.name === param);

            ws.getSummaryDataAsync().then(function(sumdata) {
                var value = sumdata.data[0][0].value;
                console.log(value);
                selParam.changeValueAsync(value);
            })
        })
    });
};