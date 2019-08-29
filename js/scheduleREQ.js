"use strict";

(function() {
    let worksheet = null;
    let worksheetName = null;

    let callsign = "";
    let allCallSigns = [];
    let allEvents = [];
    var secret = [];
    // $(function(){
    //     $( "#datepicker" ).datepicker();
    //     //Pass the user selected date format
    //     $( "#format" ).change(function() {
    //     $( "#datepicker" ).datepicker( "option", "dateFormat", $(this).val() );
    //     });
    // });

    var app = new Vue({
        el: "#app",
        template: "#app-template",
        data: {
            req: {
                date1: "",
                date2: "",
                callsign: "",
                allCallSigns,
                allEvents,
                password: "",
                secret: "",
                Comment: "",
                buttonText: "Add Request",
                eventId: '',
                allStatus: ['Requested', 'Confirmed', 'Cancelled'],
                sheetName: ''
            }
        },
        methods: {
            G3t: function() {
                var ws = tableau.extensions.dashboardContent.dashboard.worksheets.find(
                    w => w.name === "Calendar View (All)"
                );
                //loadPassword();



                var sel = ws.getSelectedMarksAsync().then(function(seldata) {
                    // app.req.callsign = seldata.data[0].data[0][4].value;
                    // app.req.date1 = seldata.data[0].data[0][9].value;
                    // app.req.date2 = seldata.data[0].data[0][6].value;
                    // app.req.Comment = seldata.data[0].data[0][5].value;
                    // app.req.calColor = seldata.data[0].data[0][2].value;
                    // app.req.isAdmin = seldata.data[0].data[0][1].value;
                    // app.req.eventId = seldata.data[0].data[0][8].value;
                    // allEvents.selected = seldata.data[0].data[0][0].value;
                    // app.req.allStatus.selected = seldata.data[0].data[0][17].value;


                    seldata.data[0].columns.forEach(c => {
                        console.log(c._fieldName);
                        if (c.fieldName == 'Call Sign') {
                            app.req.callsign = seldata.data[0].data[0][c._index].value;
                            console.log(app.req.callsign);
                        } else if (c.fieldName == 'Start Date Time') {
                            app.req.date1 = seldata.data[0].data[0][c._index].value;
                            console.log(app.req.date1);
                        } else if (c.fieldName == 'End Date Time') {
                            app.req.date2 = seldata.data[0].data[0][c._index].value;
                            console.log(app.req.date2);
                        } else if (c.fieldName == 'Comment') {
                            app.req.Comment = seldata.data[0].data[0][c._index].value;
                            console.log(app.req.Comment);
                        } else if (c.fieldName == 'Calendar Color') {
                            app.req.calColor = seldata.data[0].data[0][c._index].value;
                            console.log(app.req.calColor);
                        } else if (c.fieldName == 'isAdmin') {
                            app.req.isAdmin = seldata.data[0].data[0][c._index].value;
                            console.log(app.req.isAdmin);
                        } else if (c.fieldName == 'ATTR(Fk Event Id)') {
                            app.req.eventId = seldata.data[0].data[0][c._index].value;
                            console.log(app.req.eventId);
                        } else if (c.fieldName == 'qualFkEventId') {
                            allEvents.selected = seldata.data[0].data[0][c._index].value;
                            console.log(allEvents.selected);
                        } else if (c.fieldName == 'ATTR(Status1') {
                            app.req.allStatus.selected = seldata.data[0].data[0][c._index].value;
                            console.log(app.req.allStatus.selected);
                        }
                    })
                    app.req.buttonText = "Update Request: " + app.req.eventId;
                });
            },
            P0st: function() {
                //loadPassword();

                if (app.req.callsign == null) {
                    alert("Select a Coach");
                } else if (app.req.date1 == null) {
                    alert("Select a Starting Date");
                } else if (app.req.date2 == null) {
                    alert("Select an Ending Date");
                } else if (app.req.password == null || app.req.password == "") {
                    alert("Please enter a password");
                } else {
                    $.post(
                            "https://nswebhook.checksix.com/api/scheduleReq/",
                            JSON.stringify({
                                PkEntryId: app.req.eventId,
                                FkEventId: allEvents.selected,
                                start: app.req.date1,
                                end: app.req.date2,
                                FkCallSign: app.req.callsign,
                                comment: app.req.Comment,
                                password: app.req.password,
                                secretkey: app.req.secret,
                                status: app.req.allStatus.selected
                            }))
                        // .success(function(data) {
                        //     console.log(data);
                        //     alert(data);
                        //})
                    refreshData();
                }
            },
            R3fresh: function() {
                loadPassword();
            }
        }
    });

    $(document).ready(function() {
        tableau.extensions.initializeAsync().then(
            function() {
                createParameterListener();
                createFilterListener();
                //createMarksListener();
                loadSecret();
                loadPassword();
                loadCallSign();
                loadEvents();
                //loadallexperiences();
            },
            function() {
                console.log("Error while Initializing: " + err.toString());
            }
        );
    });

    function resetData() {
        app.req.date1 = "";
        app.req.date2 = "";
        app.req.callsign = "";
        app.req.allCallSigns;
        app.req.allEvents;
        //app.req.secret = "";
        app.req.Comment = "";
        app.req.EventStatusCode = "";
        app.req.eventId = null;
        allEvents.selected = "";
        app.req.allStatus.selected = "";
        app.req.buttonText = "Add Request";
    }


    function createParameterListener() {
        tableau.extensions.dashboardContent.dashboard.getParametersAsync().then(function(t) {
            var p = t.find(p1 => p1.name === "AdminPassword");
            const pChanged = tableau.TableauEventType.ParameterChanged;
            p.addEventListener(pChanged, function(parameterEvent) {
                loadPassword();
            });

        })
    };

    function createFilterListener() {
        var ws = tableau.extensions.dashboardContent.dashboard.worksheets.find(
            w => w.name === "Calendar View (All)"
        );
        ws.addEventListener(
            tableau.TableauEventType.FilterChanged,
            filterEvent => {
                resetData();
                loadCallSign();
            }
        );
    }

    function createMarksListener() {
        var ws = tableau.extensions.dashboardContent.dashboard.worksheets.find(
            w => w.name === "Calendar View (All)"
        );
        ws.addEventListener(
            tableau.TableauEventType.MarkSelectionChanged,
            filterEvent => {
                // resetData();
                // loadCallSign();
                alert("mark changed");
            }
        );
    }

    function loadPassword() {
        tableau.extensions.dashboardContent.dashboard.getParametersAsync().then(function(t1) {
            // for (var i = 0; i < t1.length; i++) {
            //     alert(t1[i].id._value + "\n" + t1[i].name._value + "\n" + t1[i].currentValue._value)
            // }
            var param = t1.find(
                p => p.name === "AdminPassword"
            );
            //alert(param.id + "\n" + param.name + "\n" + param.currentValue._value);
            app.req.password = param.currentValue._value;
            //alert(app.req.password);
            doNothing();
        });
    }

    function doNothing() {}

    function loadCallSign() {
        app.req.allCallSigns.splice(0, app.req.allCallSigns.length);
        var worksheet = tableau.extensions.dashboardContent.dashboard.worksheets.find(
            w => w.name === "Cal-CallSign"
        );

        worksheet.getSummaryDataAsync().then(function(sumdata) {
            var worksheetData = sumdata.data;
            for (var i = 0; i < worksheetData.length; i++) {
                allCallSigns.push({
                    name: worksheetData[i][0]._value
                });
            }
        });
    }

    function loadEvents() {
        var worksheet = tableau.extensions.dashboardContent.dashboard.worksheets.find(
            w => w.name === "AllEvent"
        );

        worksheet.getSummaryDataAsync().then(function(sumdata) {
            var worksheetData = sumdata.data;
            for (var i = 0; i < worksheetData.length; i++) {
                allEvents.push({
                    name: worksheetData[i][0]._value,
                    FkEventId: worksheetData[i][1]._value
                });
            }
        });
    }

    function refreshData() {
        var l = tableau.extensions.dashboardContent.dashboard.worksheets.find(
            w => w.name === "Calendar View (All)"
        );

        var ds = l.getDataSourcesAsync().then(d1 => {
            for (var i = 0; i < d1.length; i++) {
                d1[i].refreshAsync().then(rA => {
                    resetData();
                });
            }
        });
    }

    function loadSecret() {
        var l = tableau.extensions.dashboardContent.dashboard.worksheets.find(
            w => w.name === "secret"
        );

        l.getSummaryDataAsync().then(function(sumdata) {
            var worksheetData = sumdata.data;
            app.req.secret = worksheetData[0][0]._value;
            //alert(app.req.secret);
        });

    }
})();