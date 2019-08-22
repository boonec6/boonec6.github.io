'use strict';

(function() {

    //let unregisterFilterEventListener = null;
    //let unregisterMarkSelectionEventListener = null;
    let worksheet = null;
    let worksheetName = null;

    let allCertifications = [];
    let certifications = [];
    let callsign = [];
    var secret = [];
    let deletes = [];

    new Vue({
        el: '#app',
        template: "#app-template",
        data: () => ({
            callsign,
            secret,
            certifications,
            allCertifications,
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
                    if (allCertifications.selected == null) {
                        alert('Select a Travel Document');
                    } else if ($("#datepicker").val() == null || $("#datepicker").val() == '') {
                        //alert('Select an Expiration Date');
                        if (confirm('Insert without an Expiration Date?')) {
                            $.post("https://nswebhook.checksix.com/api/Cert/",
                                JSON.stringify({
                                    "FkCertificationId": allCertifications.selected,
                                    "FkCallSign": pCS,
                                    "ExpDate": "1-1-1900",
                                    secretkey: secret[0].name._value
                                }),
                                function(status) { alert(status); });
                            refreshData();
                        } else {}
                    } else {
                        $.post("https://nswebhook.checksix.com/api/Cert/",
                            JSON.stringify({
                                "FkCertificationId": allCertifications.selected,
                                "FkCallSign": pCS,
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
                for (var i = 0; i < certifications.length; i++) {
                    if (certifications[i].delete) {
                        $.post("https://nswebhook.checksix.com/api/QualDelete/",
                            JSON.stringify({ delEntryId: certifications[i].pkId.value, delTable: 'CertificationEntry', delColumn: 'PkCertificationEntryId', secretkey: secret[0].name._value }),
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
            loadCurrentCertifications();
            loadallCertifications();
            createParameterListener();
        }, function() { console.log('Error while Initializing: ' + err.toString()); });
    });

    function refreshData() {
        var d = tableau.extensions.dashboardContent.dashboard;
        var ws = d.worksheets;
        var l = ws.find(w => w.name === "Certifications");

        var ds = l.getDataSourcesAsync().then(d1 => {
            for (var i = 0; i < d1.length; i++) {
                d1[i].refreshAsync().then(rA => {
                    loadCurrentCertifications();
                })
            }
        })
    };

    function createFilterListener() {
        var wsN = 'Certifications';
        const wss = tableau.extensions.dashboardContent.dashboard.worksheets;
        var ws = wss.find(function(sheet) {
            return sheet.name === wsN;
        });
        ws.addEventListener(tableau.TableauEventType.FilterChanged, (filterEvent) => {
            loadCurrentCertifications();
        });
    }

    function createParameterListener() {

        tableau.extensions.dashboardContent.dashboard.getParametersAsync().then(function(t) {
            var p = t.find(p1 => p1.name === "Callsign");
            const pChanged = tableau.TableauEventType.ParameterChanged;
            p.addEventListener(pChanged, function(parameterEvent) {
                loadCurrentCertifications();
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

    function loadCurrentCertifications() {
        certifications.splice(0, certifications.length);
        var worksheetName = 'Certifications';
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
                if (certifications.length < worksheetData.length) {
                    certifications.push({
                        name: worksheetData[i][0],
                        expDate: worksheetData[i][1],
                        delete: false,
                        pkId: worksheetData[i][3],
                        isExpired: worksheetData[i][2]._value
                    });
                }
            }
        });
    };

    function loadallCertifications() {
        var worksheetName = 'AllCertification';
        const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
        var worksheet = worksheets.find(function(sheet) {
            return sheet.name === worksheetName;
        });
        worksheet.getSummaryDataAsync().then(function(sumdata) {
            var worksheetData = sumdata.data;
            for (var i = 0; i < worksheetData.length; i++) {
                allCertifications.push({
                    name: worksheetData[i][0],
                    certificationId: worksheetData[i][1]
                });
            }
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

    $(function() {
        $("#datepicker").datepicker();
        //Pass the user selected date format
        $("#format").change(function() {
            $("#datepicker").datepicker("option", "dateFormat", $(this).val());
        });
    });

})();