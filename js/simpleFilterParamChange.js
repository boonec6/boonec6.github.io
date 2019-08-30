'use strict';

$(document).ready(function() {
    tableau.extensions.initializeAsync({ 'configure': configure }).then(function() {
        console.log("configuration");
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
};