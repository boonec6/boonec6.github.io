'use strict';

(function() {

    let worksheet = null;
    let worksheetName = null;

    let callsign = [];
    var secret = [];

    $(document).ready(function() {
        tableau.extensions.initializeAsync().then(function() {
            loadSecret();
        }, function() { console.log('Error while Initializing: ' + err.toString()); });
    });

    function btnClick() {
        var d = tableau.extensions.dashboardContent.dashboard;
        var ws = d.worksheets;
        var l = ws.find(w => w.name === "ExclusionList");

        l.getSelectedMarksAsync().then(function(marks) {
                const worksheetData = marks.data[0];
                worksheetData['_data'].forEach(e => {
                    //console.log(worksheetData['_data'][0][0]._value);    
                    console.log(e[0]._value);
                    deleteExc(e[0]._value);
                })
            })
            .then(console.log('Removal complete. Refresh Extract to see changes.'));
    }

    function deleteExc(fkcs) {
        $.ajax({
            url: "https://nswebhook.checksix.com/api/exclude/",
            type: "DELETE",
            success: function(status) { alert(status); },
            data: JSON.stringify({ FkCallSign: fkcs, secretkey: secret[0].name._value })
        });
    }

    function loadSecret() {
        secret.splice(0, secret.length);
        var worksheetName = 'secret';
        const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
        var worksheet = worksheets.find(function(sheet) {
            return sheet.name === worksheetName;
        });
        worksheet.getSummaryDataAsync().then(function(sumdata) {
            secret.push({ name: sumdata.data[0][0] });
        })
    };


    $('#mainBtn').click(btnClick);
})();