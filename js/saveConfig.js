"use strict";

let pw = '';
let secret = '';

(function() {
    $(document).ready(function() {
        tableau.extensions.initializeAsync().then(
            function() {
                //alert('extensions ready');
                loadSecret();
                //loadConfigs();
                createParameterListener();
            },
        );
    });

    function createParameterListener() {
        tableau.extensions.dashboardContent.dashboard.getParametersAsync().then(function(t) {
            var p = t.find(p1 => p1.name === "AdminPassword");
            const pChanged = tableau.TableauEventType.ParameterChanged;
            p.addEventListener(pChanged, function(parameterEvent) {
                loadPassword();
            });
        })
    };

    function loadPassword() {
        tableau.extensions.dashboardContent.dashboard.getParametersAsync().then(function(t1) {
            var param = t1.find(
                p => p.name === "AdminPassword");
            pw = param.currentValue._value;
            //alert(pw);
        });
    }

    function loadSecret() {
        var l = tableau.extensions.dashboardContent.dashboard.worksheets.find(
            w => w.name === "secret"
        );

        l.getSummaryDataAsync().then(function(sumdata) {
            var worksheetData = sumdata.data;
            secret = worksheetData[0][0]._value;
            //alert(secret);
            loadConfigs();
        });
    };

    function loadConfigs() {
        var url = "https://nswebhook.checksix.com/api/config?secret=" + secret;
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            success: function(data) {
                $.each(data, function(i, val) {
                    alert(i._value);
                })

            }
        })

        // $.getJSON(url).done(function(data) {
        //     $.each(data.items, function(i, item) {
        //         alert(i);
        //     })
        // })
    };

    function saveConfigs() {
        // var url = "https://nswebhook.checksix.com/api/config?secret="+secret;
        // $.postJSON(url, {
        //     password: pw,
        //     json: ""
        //     secretkey:
        // })
    };

    var onClick = function() {
        alert("Hi - I'm just a placeholder for now");
        saveConfigs();
        loadConfigs();
    };

    $('#saveBtn').click(onClick);

})();