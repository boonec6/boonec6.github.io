'use strict';

(function() {

    //let unregisterFilterEventListener = null;
    //let unregisterMarkSelectionEventListener = null;
    let worksheet = null;
    let worksheetName = null;

    let allLangs = [];
    let allLevs = [];
    let langs = [];
    var callsign = [];
    let deletes = [];
    let secret = [];

    new Vue({
        el: '#app',
        template: "#app-template",
        data: () => ({
            callsign,
            secret,
            langs,
            allLangs,
            allLevs,
            selected: '',
            text: ''
        }),
        methods: {
            P0st: function() {
                tableau.extensions.dashboardContent.dashboard.getParametersAsync().then(function(t) {
                    var p = t.find(p1 => p1.name === "Callsign");
                    var pCS = p.currentValue._value;
                    if (allLangs.selected == null) {
                        alert('Select a Language to enter');
                    } else if (allLevs.selected == null) {
                        alert('Select a Level to enter')
                    } else {
                        $.post("https://nswebhook.checksix.com/api/Lang/",
                            JSON.stringify({ FkLangId: allLangs.selected, FkLevId: allLevs.selected, FkCallSign: pCS, secretkey: secret[0].name._value }),
                            function(status) { alert(status); });
                        refreshData();
                    }
                })
            },
            D3lete: function() {
                var d = 0;
                for (var i = 0; i < langs.length; i++) {
                    if (langs[i].delete) {
                        //alert('Delete clicked');
                        $.post("https://nswebhook.checksix.com/api/QualDelete/",
                            JSON.stringify({ delEntryId: langs[i].pkId.value, delTable: 'LanguageEntry', delColumn: 'PkLanguageEntryId', secretkey: secret[0].name._value }),
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
            loadCurrentLanguages();
            loadAllLanguages();
            createParameterListener();
        }, function() { console.log('Error while Initializing: ' + err.toString()); });
    });

    $.delete = function(url, data, callback, type) {

        if ($.isFunction(data)) {
            type = type || callback,
                callback = data,
                data = {}
        }

        return $.ajax({
            url: url,
            type: 'DELETE',
            success: callback,
            data: data,
            contentType: type
        });

    }

    function refreshData() {
        var d = tableau.extensions.dashboardContent.dashboard;
        var ws = d.worksheets;
        var l = ws.find(w => w.name === "Languages");

        var ds = l.getDataSourcesAsync().then(d1 => {
            for (var i = 0; i < d1.length; i++) {
                d1[i].refreshAsync().then(rA => {
                    loadCurrentLanguages();
                })
            }
        })
    };

    function createFilterListener() {
        var wsN = 'Languages';
        const wss = tableau.extensions.dashboardContent.dashboard.worksheets;
        var ws = wss.find(function(sheet) {
            return sheet.name === wsN;
        });
        ws.addEventListener(tableau.TableauEventType.FilterChanged, (filterEvent) => {
            loadCurrentLanguages();
        });
    }

    function createParameterListener() {

        tableau.extensions.dashboardContent.dashboard.getParametersAsync().then(function(t) {
            var p = t.find(p1 => p1.name === "Callsign");
            const pChanged = tableau.TableauEventType.ParameterChanged;
            p.addEventListener(pChanged, function(parameterEvent) {
                loadCurrentLanguages();
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

    function loadCurrentLanguages() {
        langs.splice(0, langs.length);
        var worksheetName = 'Languages';
        const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
        var worksheet = worksheets.find(function(sheet) {
            return sheet.name === worksheetName;
        });

        worksheet.getSummaryDataAsync().then(function(sumdata) {
            var worksheetData = sumdata.data;
            for (var i = 0; i < worksheetData.length; i++) {
                var levelText = "level" + worksheetData[i][2].value;
                if (langs.length < worksheetData.length) {
                    langs.push({
                        name: worksheetData[i][0],
                        level: levelText,
                        delete: false,
                        pkId: worksheetData[i][1]
                    });
                }
            }
        });
    };

    function loadAllLanguages() {
        //alert("all");
        var worksheetName = 'AllLang';
        const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
        var worksheet = worksheets.find(function(sheet) {
            return sheet.name === worksheetName;
        });
        //alert(worksheet.name);

        worksheet.getSummaryDataAsync().then(function(sumdata) {
            var worksheetData = sumdata.data;
            for (var i = 0; i < worksheetData.length; i++) {
                allLangs.push({
                    name: worksheetData[i][0],
                    langId: worksheetData[i][1]
                });
            }
        });

        worksheetName = 'AllLevs';

        var worksheet = worksheets.find(function(sheet) {
            return sheet.name === worksheetName;
        });
        //alert(worksheet.name);

        worksheet.getSummaryDataAsync().then(function(sumdata) {
            var worksheetData = sumdata.data;
            for (var i = 0; i < worksheetData.length; i++) {
                allLevs.push({
                    name: worksheetData[i][0],
                    levId: worksheetData[i][1]
                });
            }
        });
    };

})();