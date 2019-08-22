'use strict';

(function() {

    //let unregisterFilterEventListener = null;
    //let unregisterMarkSelectionEventListener = null;
    let worksheet = null;
    let worksheetName = null;

    let callsign = [];
    var secret = [];

    new Vue({
        el: '#app',
        template: "#app-template",
        data: () => ({
            callsign,
            secret,
            selected: '',
            text: ''
        }),
        methods: {
            exclud3: function() {
                var worksheetName = 'Single Coach View-Basics';
                const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
                var worksheet = worksheets.find(function(sheet) {
                    return sheet.name === worksheetName;
                });
                worksheet.getSummaryDataAsync().then(function(sumdata) {
                    var worksheetData = sumdata.data;
                    //alert(worksheetData[0][0]._value);
                    callsign.push({ name: worksheetData[0][0] });
                    $.post("https://nswebhook.checksix.com/api/exclude/",
                        JSON.stringify({ FkCallSign: callsign[0].name._value, secretkey: secret[0].name._value }),
                        function(status) { alert(status); });
                    refreshData();
                });
            }
        }
    });


    $(document).ready(function() {
        tableau.extensions.initializeAsync().then(function() {
            loadSecret();
            createFilterListener();
            createParameterListener();
            loadCallSign();
        }, function() { console.log('Error while Initializing: ' + err.toString()); });
    });

    function refreshData() {
        var d = tableau.extensions.dashboardContent.dashboard;
        var ws = d.worksheets;
        var l = ws.find(w => w.name === "Single Coach View-Basics");

        var ds = l.getDataSourcesAsync().then(d1 => {
            for (var i = 0; i < d1.length; i++) {
                d1[i].refreshAsync().then(rA => {
                    loadCallSign();
                })
            }
        })
    };

    function createFilterListener() {
        var wsN = 'Single Coach View-Basics';
        const wss = tableau.extensions.dashboardContent.dashboard.worksheets;
        var ws = wss.find(function(sheet) {
            return sheet.name === wsN;
        });
        ws.addEventListener(tableau.TableauEventType.FilterChanged, (filterEvent) => {
            loadCallSign();
        });
    }

    function createParameterListener() {

        tableau.extensions.dashboardContent.dashboard.getParametersAsync().then(function(t) {
            var p = t.find(p1 => p1.name === "Callsign");
            const pChanged = tableau.TableauEventType.ParameterChanged;
            p.addEventListener(pChanged, function(parameterEvent) {
                loadCallSign();
            });
        });

    };

    function loadCallSign() {
        callsign.splice(0, callsign.length);
        var worksheetName = 'Single Coach View-Basics';
        const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
        var worksheet = worksheets.find(function(sheet) {
            return sheet.name === worksheetName;
        });
        worksheet.getSummaryDataAsync().then(function(sumdata) {
            var worksheetData = sumdata.data;
            //alert(worksheetData[0][0]._value);
            callsign.push({ name: worksheetData[0][0] });
        });
    };


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

})();