'use strict';

(function() {

    $(document).ready(function() {
        tableau.extensions.initializeDialogAsync().then(function(openPayload) {
            buildDialog();
        });
    });

    function buildDialog() {
        var srcSheet = tableau.extensions.settings.get("srcSheet");
        var srcField = tableau.extensions.settings.get("srcField");
        var param = tableau.extensions.settings.get("param");

        let dashboard = tableau.extensions.dashboardContent.dashboard;

        dashboard.getParametersAsync().then(function(params) {
            params.forEach(function(p) {
                $('#param').append("<option value='" + p.id + "'>" + p.name + "</option>");
            })
        })

        dashboard.worksheets.forEach(function(worksheet) {
            $("#srcSheet").append("<option value='" + worksheet.name + "'>" + worksheet.name + "</option>");
        });


        var worksheetName = tableau.extensions.settings.get("worksheet");
        if (worksheetName != undefined) {
            $("#srcSheet").val(worksheetName);
            sheetUpdate();
        }

        $('#srcSheet').on('change', '', function(e) {
            sheetUpdate();
        });
        $("#srcSheet").val(srcSheet);
        $("#srcField").val(srcField);
        $("#param").val(param);
        $('#cancel').click(closeDialog);
        $('#save').click(saveButton);
    }


    function sheetUpdate() {
        var worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
        var worksheetName = $("#srcSheet").val();

        var worksheet = worksheets.find(function(sheet) {
            return sheet.name === worksheetName;
        });

        worksheet.getSummaryDataAsync({ maxRows: 1 }).then(function(sumdata) {
            var cols = sumdata.columns;
            $("srcField").text("");
            var counter = 1;
            cols.forEach(function(c) {
                console.log(counter + '\t' + c.fieldName);
                $("#srcField").append("<option value='" + counter + "'>" + c.fieldName + "</option>");
                counter++;
            })
        })
    }

    function closeDialog() {
        tableau.extensions.ui.closeDialog("10");
    }

    function saveButton() {
        tableau.extensions.settings.set("srcSheet", $("#srcSheet").val());
        tableau.extensions.settings.set("srcField", $("#srcField").val());
        tableau.extensions.settings.set("param", $("#param").val());
        tableau.extensions.settings.saveAsync().then((currentSettings) => {
            tableau.extensions.ui.closeDialog("10");
        });
    }
})();