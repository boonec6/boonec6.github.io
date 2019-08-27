'use strict';

(function() {
    $(document).ready(function() {
        tableau.extensions.initializeAsync().then(function() {}, function() { console.log('Error while Initializing: ' + err.toString()); });
    });

    function btnClick() {
        console.clear();
        var d = tableau.extensions.dashboardContent.dashboard;
        var ws = d.worksheets;
        //var l = ws.find(w => w.name === "Calendar View (All)");

        ws.forEach(e => {
            console.log(e.name + '\t' + e.sheetType + '\n');
            //console.log(' ');  
            e.getFiltersAsync().then(f => {
                if (f.length > 0) {
                    console.log(JSON.stringify(f));
                    //f.forEach(f1 => {
                    //    console.log(f1._worksheetName +'\t' + f1._fieldName + '\t'+f1._filterType+'\t' + f1._fieldId);
                    //    console.log(f1.maxValue);
                    //})
                }
            })
        })

    }
    $('#mainBtn').click(btnClick);
})();