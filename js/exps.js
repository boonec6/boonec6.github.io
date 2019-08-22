'use strict';

(function() {

    //let unregisterFilterEventListener = null;
    //let unregisterMarkSelectionEventListener = null;
    let worksheet = null;
    let worksheetName = null;

    let allexperiences = [];
    let experiences = [];
    let callsign = [];
    var secret = [];
    let deletes = [];

    new Vue({
        el: '#app',
        template: "#app-template",
        data: () => ({
            callsign,
            secret,
            experiences,
            allexperiences,
            selected: '',
            text: ''
        }),
        methods: {
            P0st: function() {
                tableau.extensions.dashboardContent.dashboard.getParametersAsync().then(function(t) {
                    var p = t.find(p1 => p1.name === "Callsign");
                    var pCS = p.currentValue._value;
                    if (allexperiences.selected == null) {
                        alert('Select an Experience');
                    } else {
                        $.post("https://nswebhook.checksix.com/api/Exp/",
                            JSON.stringify({
                                "FkExperienceId": allexperiences.selected,
                                "FkCallSign": pCS,
                                secretkey: secret[0].name._value
                            }),
                            function(status) { alert(status); });
                        refreshData();
                    }
                })

            },
            D3lete: function() {
                var d = 0;
                for (var i = 0; i < experiences.length; i++) {
                    if (experiences[i].delete) {
                        //alert(JSON.stringify({delEntryId: experiences[i].pkId._value, delTable: 'ExperienceEntry', delColumn: 'PkExperienceEntryId',secretkey:secret[0].name._value}));
                        $.post("https://nswebhook.checksix.com/api/QualDelete/",
                            JSON.stringify({ delEntryId: experiences[i].pkId, delTable: 'ExperienceEntry', delColumn: 'PkExperienceEntryId', secretkey: secret[0].name._value }),
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
            loadCurrentexperiences();
            loadallexperiences();
            createParameterListener();
        }, function() { console.log('Error while Initializing: ' + err.toString()); });
    });

    function refreshData() {
        var d = tableau.extensions.dashboardContent.dashboard;
        var ws = d.worksheets;
        var l = ws.find(w => w.name === "Experiences");

        var ds = l.getDataSourcesAsync().then(d1 => {
            for (var i = 0; i < d1.length; i++) {
                d1[i].refreshAsync().then(rA => {
                    loadCurrentexperiences();
                })
            }
        })
    };

    function createFilterListener() {
        var wsN = 'Experiences';
        const wss = tableau.extensions.dashboardContent.dashboard.worksheets;
        var ws = wss.find(function(sheet) {
            return sheet.name === wsN;
        });
        ws.addEventListener(tableau.TableauEventType.FilterChanged, (filterEvent) => {
            loadCurrentexperiences();
        });
    }

    function createParameterListener() {

        tableau.extensions.dashboardContent.dashboard.getParametersAsync().then(function(t) {
            var p = t.find(p1 => p1.name === "Callsign");
            const pChanged = tableau.TableauEventType.ParameterChanged;
            p.addEventListener(pChanged, function(parameterEvent) {
                loadCurrentexperiences();
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

    function loadCurrentexperiences() {
        experiences.splice(0, experiences.length);
        var worksheetName = 'Experiences';
        const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
        var worksheet = worksheets.find(function(sheet) {
            return sheet.name === worksheetName;
        });

        worksheet.getSummaryDataAsync().then(function(sumdata) {
            var worksheetData = sumdata.data;
            //  alert(worksheetData[0][0]._value);
            //  alert(worksheetData[0][1]._value);
            //  alert(worksheetData[0][2]._value);
            // alert(worksheetData[0][3]._value);
            // alert(worksheetData[0][4]._value);
            // alert(worksheetData[0][5]._value);
            // alert(worksheetData[0][6]._value);
            for (var i = 0; i < worksheetData.length; i++) {
                if (experiences.length < worksheetData.length) {
                    experiences.push({
                        name: worksheetData[i][1],
                        delete: false,
                        pkId: worksheetData[i][2]._value,
                        expType: worksheetData[i][0]._value,
                    });
                    //alert(experiences[i].name._value + "\t" + experiences[i].pkId + "\t" + experiences[i].expType);
                }
            }
        });
    };

    function loadallexperiences() {
        //alert('xcxx');
        var worksheetName = 'AllExperience';
        const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
        var worksheet = worksheets.find(function(sheet) {
            return sheet.name === worksheetName;
        });
        worksheet.getSummaryDataAsync().then(function(sumdata) {
            var worksheetData = sumdata.data;
            for (var i = 0; i < worksheetData.length; i++) {
                allexperiences.push({
                    name: worksheetData[i][0],
                    experienceId: worksheetData[i][1]
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
})();