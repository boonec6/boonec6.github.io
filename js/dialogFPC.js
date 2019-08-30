'use strict';

(function() {

    $(document).ready(function() {
        tableau.extensions.initializeDialogAsync().then(function(openPayload) {
            buildDialog();
        });
    });

    function buildDialog() {
        var apiPoint = tableau.extensions.settings.get("srcSheet");
        var username = tableau.extensions.settings.get("srcFilter");
        var password = tableau.extensions.settings.get("param");

        let dashboard = tableau.extensions.dashboardContent.dashboard;
        dashboard.worksheets.forEach(function(worksheet) {
            $("#srcSheet").append("<option value='" + worksheet.name + "'>" + worksheet.name + "</option>");
        });
        var worksheetName = tableau.extensions.settings.get("worksheet");
        if (worksheetName != undefined) {
            $("#srcSheet").val(worksheetName);
            filterUpdate();
        }

        $('#selectWorksheet').on('change', '', function(e) {
            filterUpdate();
        });
        $("#srcSheet").val(srcSheet);
        $("#srcFilter").val(srcFilter);
        $("#param").val(param);
        $('#cancel').click(closeDialog);
        $('#save').click(saveButton);
    }


    function filterUpdate() {

        var worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
        var worksheetName = $("#srcSheet").val();

        var worksheet = worksheets.find(function(sheet) {
            return sheet.name === worksheetName;
        });

        var counter = 1;
        worksheet.getFiltersAsync().then(function(filters) {
            filters.forEach(function(f) {
                $("#srcFilter").append("<option value='" + counter + "'>" + current_value.fieldId + "</option>");
                counter++;
            });
        });
    }

    function closeDialog() {
        tableau.extensions.ui.closeDialog("10");
    }

    function saveButton() {
        tableau.extensions.settings.set("srcSheet", $("#srcSheet").val());
        tableau.extensions.settings.set("srcFilter", $("#srcFilter").val());
        tableau.extensions.settings.set("param", $("#param").val());
        tableau.extensions.settings.saveAsync().then((currentSettings) => {
            tableau.extensions.ui.closeDialog("10");
        });
    }
})();