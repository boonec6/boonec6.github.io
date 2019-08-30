'use strict';

(function() {

    $(document).ready(function() {
        tableau.extensions.initializeDialogAsync().then(function(openPayload) {
            buildDialog();
        });
    });

    function buildDialog() {
        var apiPoint = tableau.extensions.settings.get("apiPoint");
        var username = tableau.extensions.settings.get("username");
        var password = tableau.extensions.settings.get("password");
        var extractId = tableau.extensions.settings.get("extractId");

        $("#apiPoint").val(apiPoint);
        $("#name").val(username);
        $("#pword").val(password);
        $("#exId").val(extractId);
        $('#cancel').click(closeDialog);
        $('#save').click(saveButton);
    }

    function closeDialog() {
        tableau.extensions.ui.closeDialog("10");
    }

    function saveButton() {

        tableau.extensions.settings.set("apiPoint", $("#apiPoint").val());
        tableau.extensions.settings.set("username", $("#name").val());
        tableau.extensions.settings.set("password", $("#pword").val());
        tableau.extensions.settings.set("extractId", $("#exId").val());
        tableau.extensions.settings.saveAsync().then((currentSettings) => {
            tableau.extensions.ui.closeDialog("10");
        });
    }
})();