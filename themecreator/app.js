Theme = {};
Modules = {};

loadTheme = function (text) {
    var res, x;
    try {
        res = JSON.parse(text);
    } catch (e) {
        dialog("JSON Parse Error", [
            "Could not parse JSON.",
            "Use <a href='http://jsonlint.com'>JSONLint</a> to check your syntax."
        ], "warning-sign");
        return false;
    }

    Theme = res;

    dialog("Importing", "Your theme was successfully imported.");
    setTimeout(function () {
        $("#Dialog").dialog("close");
    }, 1500);

    for (x in Modules) {
        if (Modules[x].onImport) {
            Modules[x].onImport();
        }
    }

    $("#Tabs").tabs("select", 1); // Editing

};

importTheme = function () {
    var val = $("#ThemeContent").val();

    if (!val) {
        dialog("Importing", "Specify a theme to import it.", "warning-sign");
        return;
    }

    loadTheme(val);
};

updateThemeValues = function () {
    var x;
    for (x in Modules) {
        Modules[x].setValues();
    }
};

loadThemeValues = function () {
    var x;
    for (x in Modules) {
        Modules[x].loadValues();
    }
};

/* Document ready */
$(function () {
    var Tabs, x;
    /* Load from localStorage */
    if (window.localStorage) {
        var item = localStorage.getItem("Theme");

        if (item) {
            $("#ThemeContent").val(item);
        }
    }

    /* Initialize Tabs */
    Tabs = $("#Tabs");

    Tabs.tabs({
        select: function (event, ui) {
            var $content = $("#ThemeContent");

            if (ui.index === 0) { // Importing
                if (!isEmptyObject(Theme)) {
                    updateThemeValues();
                    $content.val(JSON.stringify(Theme));
                }
            }
            if (ui.index === 1) { // Editing
                if (isEmptyObject(Theme)) {
                    try {
                        Theme = JSON.parse($content.val());
                    }
                    catch (JSONParseError) {
                        Theme = {};
                    }
                }
                if (!isEmptyObject(Theme)) {
                    loadThemeValues();
                }
            }
            if (ui.index === 2) { // Source
                updateThemeValues();

                if (isEmptyObject(Theme)) {
                    dialog("Source", "Work on the theme to get the source.", "warning-sign");
                    return false;
                }

                $("#ThemeResult").val(JSON.stringify(Theme));

            }
            
            $("[title]").tipsy({gravity: $.fn.tipsy.autoNS});
        }
    });

    /* Initialize Accordion */
    $("#Theme").accordion({
        autoHeight: false,
        collapsible: true
    });

    /* Initialize Buttons and Click Events */
    initButton("CreateNew", function () {
        Theme = {};

        dialog("Importing", "Successfully created a new theme.");
        $("#ThemeContent").val("");

        if (localStorage) {
            if (localStorage.getItem("Theme")) {
                localStorage.removeItem("Theme");
            }
        }

        setTimeout(function () {
            $("#Dialog").dialog("close");
        }, 1500);

        Tabs.tabs("select", 1); // Editing
    });
    initButton("ImportTheme", function () {
        importTheme();
    });

    /* Initialize all modules */
    for (x in Modules) {
        Modules[x].init();
    }
});

/* End Document onload */

/* Window onunload */
$(window).bind('beforeunload', function () {
    if (!isEmptyObject(Theme)) {
        return "Are you sure that you want to quit? Your progress will be saved.";
    }
});

$(window).unload(function () {
    if (!isEmptyObject(Theme) && window.localStorage) {
        localStorage.setItem("Theme", JSON.stringify(Theme));
    }
});
