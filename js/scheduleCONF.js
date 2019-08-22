'use strict';


(function() {

    let worksheet = null;
    let worksheetName = null;

    let callsign = '';
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
        el: '#app',
        template: "#app-template",
        data: {
            req: {
                date1: '',
                date2: '',
                callsign: '',
                allCallSigns,
                allEvents,
                password: '',
                secret: '',
                Comment: '',
                EventStatusCode: '',
                calColor: '',
                isAdmin: false,
                eventId: '',
                allStatus: ['Requested', 'Confirmed', 'Cancelled']
            }
        },
        methods: {
            G3t: function() {
                var ws = tableau.extensions.dashboardContent.dashboard.worksheets.find(
                    w => w.name === "Calendar View (All)"
                );
                var sel = ws.getSelectedMarksAsync().then(function(seldata) {
                    app.req.callsign = seldata.data[0].data[0][4].value;
                    app.req.date1 = seldata.data[0].data[0][9].value;
                    app.req.date2 = seldata.data[0].data[0][6].value;
                    app.req.Comment = seldata.data[0].data[0][5].value;
                    app.req.calColor = seldata.data[0].data[0][2].value;
                    app.req.isAdmin = seldata.data[0].data[0][1].value;
                    app.req.eventId = seldata.data[0].data[0][8].value;
                });
            },
            P0st: function() {
                if (app.req.eventId == null) {
                    alert('Select an Event');
                } else if (app.req.password == null || app.req.password == '') {
                    alert('Please enter a password');
                } else {
                    $.post("https://nswebhook.checksix.com/api/scheduleReq/",
                        JSON.stringify({
                            "PkEntryId": app.req.eventId,
                            "status": app.req.allStatus.selected,
                            "password": app.req.password,
                            "secretkey": app.req.secret
                        }),
                        function(status) { alert(status); });
                    refreshData();
                }

            }
        }
    });

    $(document).ready(function() {
        tableau.extensions.initializeAsync().then(function() {
            //createMarksListener();
            loadSecret();
            loadCallSign();
            loadEvents();
            //loadallexperiences();
            //createParameterListener();
        }, function() { console.log('Error while Initializing: ' + err.toString()); });
    });

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


    function loadCallSign() {
        //callsign.splice(0,callsign.length);
        var worksheet = tableau.extensions.dashboardContent.dashboard.worksheets.find(w => w.name === "Cal-CallSign");

        worksheet.getSummaryDataAsync().then(function(sumdata) {
            var worksheetData = sumdata.data;
            for (var i = 0; i < worksheetData.length; i++) {
                allCallSigns.push({
                    name: worksheetData[i][0]._value
                });
            }
        });
    };

    function loadEvents() {
        var worksheet = tableau.extensions.dashboardContent.dashboard.worksheets.find(w => w.name === "AllEvent");

        worksheet.getSummaryDataAsync().then(function(sumdata) {
            var worksheetData = sumdata.data;
            for (var i = 0; i < worksheetData.length; i++) {
                allEvents.push({
                    name: worksheetData[i][0]._value,
                    FkEventId: worksheetData[i][1]._value
                });
            }
        });
    };

    function refreshData() {
        var l = tableau.extensions.dashboardContent.dashboard.worksheets.find(w => w.name === "Calendar View (All)");

        var ds = l.getDataSourcesAsync().then(d1 => {
            for (var i = 0; i < d1.length; i++) {
                d1[i].refreshAsync().then(rA => {
                    //                     loadCurrentexperiences();
                })
            }
        })
    };

    function loadSecret() {
        var l = tableau.extensions.dashboardContent.dashboard.worksheets.find(w => w.name === "secret");

        l.getSummaryDataAsync().then(function(sumdata) {
            var worksheetData = sumdata.data;
            app.req.secret = worksheetData[0][0]._value;
        })
    };
})();
789