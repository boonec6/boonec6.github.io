'use strict';

(function() {

    let unregisterFilterEventListener = null;
    let unregisterMarkSelectionEventListener = null;
    let worksheet = null;
    let worksheetName = null;

    let alltravelDocs = [];
    let allCountries = [];
    let travelDocs = [];
    let callsign = [];
    var secret = [];
    let deletes = [];

    new Vue({
        el: '#app',
        template: "#app-template",
        data: () => ({
            callsign,
            secret,
            travelDocs,
            alltravelDocs,
            allCountries,
            selected: '',
            text: ''
        }),
        methods: {
            T3st: function() {
                alert(
                    $("#datepicker").val());
            },
            P0st: function() {
                tableau.extensions.dashboardContent.dashboard.getParametersAsync().then(function(t) {
                    var p = t.find(p1 => p1.name === "Callsign");
                    var pCS = p.currentValue._value;
                    if (alltravelDocs.selected == null) {
                        alert('Select a Travel Document');
                    } else if (allCountries.selected == null) {
                        alert('Select a Country or Not Applicable')
                    } else if ($("#datepicker").val() == null || $("#datepicker").val() == '') {
                        //alert('Select an Expiration Date');
                        if (confirm('Insert without an Expiration Date?')) {
                            $.post("https://nswebhook.checksix.com/api/travelDoc/",
                                JSON.stringify({
                                    "FkTravelDocId": alltravelDocs.selected,
                                    "FkCallSign": pCS,
                                    "CountryCode": allCountries.selected,
                                    "ExpDate": "1-1-1900",
                                    secretkey: secret[0].name._value
                                }),
                                function(status) { alert(status); });
                            refreshData();
                            alert('refreshing');
                        } else {
                            alert('cancelled');
                        }
                    } else {
                        $.post("https://nswebhook.checksix.com/api/travelDoc/",
                            JSON.stringify({
                                "FkTravelDocId": alltravelDocs.selected,
                                "FkCallSign": pCS,
                                "CountryCode": allCountries.selected,
                                "ExpDate": $("#datepicker").val() == null || $("#datepicker").val(),
                                secretkey: secret[0].name._value
                            }),
                            function(status) { alert(status); });
                        refreshData();
                    }
                })
            },
            D3lete: function() {
                var d = 0;
                for (var i = 0; i < travelDocs.length; i++) {
                    if (travelDocs[i].delete) {
                        $.post("https://nswebhook.checksix.com/api/QualDelete/",
                            JSON.stringify({ delEntryId: travelDocs[i].pkId.value, delTable: 'TravelDocEntry', delColumn: 'PkTravelDocEntryId', secretkey: secret[0].name._value }),
                            function(status) { alert(status); });
                        d = d + 1;
                    }
                }
                if (d > 0) {
                    refreshData();
                } else {
                    alert('No entries checked to delete');
                }
            },
            R3fresh: function() {
                refreshData();
            },
            reloadPage() {
                window.location.reload();
            }
        }
    });


    $(document).ready(function() {
        tableau.extensions.initializeAsync().then(function() {
            createFilterListener();
            loadCallSign();
            loadSecret();
            loadCurrentTravelDocs();
            loadAllTravelDocs();
            loadAllCountries();
            createParameterListener();
        }, function() { console.log('Error while Initializing: ' + err.toString()); });
    });

    function refreshData() {
        var d = tableau.extensions.dashboardContent.dashboard;
        var ws = d.worksheets;
        var l = ws.find(w => w.name === "Travel Documents");

        var ds = l.getDataSourcesAsync().then(d1 => {
            for (var i = 0; i < d1.length; i++) {
                d1[i].refreshAsync().then(rA => {
                    loadCurrentTravelDocs();
                })
            }
        })
    };

    function createFilterListener() {
        var wsN = 'Travel Documents';
        const wss = tableau.extensions.dashboardContent.dashboard.worksheets;
        var ws = wss.find(function(sheet) {
            return sheet.name === wsN;
        });
        ws.addEventListener(tableau.TableauEventType.FilterChanged, (filterEvent) => {
            loadCurrentTravelDocs();
        });
    }

    function createParameterListener() {

        tableau.extensions.dashboardContent.dashboard.getParametersAsync().then(function(t) {
            var p = t.find(p1 => p1.name === "Callsign");
            const pChanged = tableau.TableauEventType.ParameterChanged;
            p.addEventListener(pChanged, function(parameterEvent) {
                loadCurrentTravelDocs();
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

    function loadCurrentTravelDocs() {
        travelDocs.splice(0, travelDocs.length);
        var worksheetName = 'Travel Documents';
        const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
        var worksheet = worksheets.find(function(sheet) {
            return sheet.name === worksheetName;
        });

        worksheet.getSummaryDataAsync().then(function(sumdata) {
            var worksheetData = sumdata.data;
            // alert(worksheetData[0][0]._value);
            // alert(worksheetData[0][1]._value);
            // alert(worksheetData[0][2]._value);
            // alert(worksheetData[0][3]._value);
            // alert(worksheetData[0][4]._value);
            // alert(worksheetData[0][5]._value);
            // alert(worksheetData[0][6]._value);
            for (var i = 0; i < worksheetData.length; i++) {
                if (travelDocs.length < worksheetData.length) {
                    travelDocs.push({
                        name: worksheetData[i][6],
                        country: worksheetData[i][0],
                        expDate: worksheetData[i][1],
                        delete: false,
                        pkId: worksheetData[i][5],
                        isExpired: worksheetData[i][4]._value
                    });
                }
            }
        });
    };

    function loadAllTravelDocs() {
        //alert("all");
        var worksheetName = 'AllTravelDoc';
        const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
        var worksheet = worksheets.find(function(sheet) {
            return sheet.name === worksheetName;
        });
        //alert(worksheet.name);

        worksheet.getSummaryDataAsync().then(function(sumdata) {
            var worksheetData = sumdata.data;
            for (var i = 0; i < worksheetData.length; i++) {
                alltravelDocs.push({
                    name: worksheetData[i][1],
                    travelDocId: worksheetData[i][0]
                });
            }
        });
    };

    function loadAllCountries() {
        //alert("all");
        var worksheetName = 'AllCountries';
        const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
        var worksheet = worksheets.find(function(sheet) {
            return sheet.name === worksheetName;
        });
        //alert(worksheet.name);

        worksheet.getSummaryDataAsync().then(function(sumdata) {
            var worksheetData = sumdata.data;
            for (var i = 0; i < worksheetData.length; i++) {
                allCountries.push({
                    name: worksheetData[i][1],
                    countryId: worksheetData[i][0]
                });
            }
        });
    };


    $(function() {
        $("#datepicker").datepicker();
        //Pass the user selected date format
        $("#format").change(function() {
            $("#datepicker").datepicker("option", "dateFormat", $(this).val());
        });
    });

})();