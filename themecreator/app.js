Theme = {};

loadTheme = function (text) {
    var res;
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

setThemeValues = function () {
    set("Name");
    set("Author", Hooks.StringToArray);
    set("Summary");
    set("Border");

    set("KillMsg");
    set("KillUserMsg");
    set("LynchMsg");
    set("DrawMsg");
    setSliderValue("MinPlayers", null, "minplayers");

    set("VillageCantLoseRoles", Hooks.String2Array);

    if (!Theme.has("ticks")) {
        Theme.ticks = {};
    }

    setSliderValue("Ticks-Night", Theme.ticks, "night");
    setSliderValue("Ticks-Standby", Theme.ticks, "standby");
};

getThemeValues = function () {
    setGlobalOption("Name", Theme.name);
    setGlobalOption("Author", Theme.author, Hooks.ArrayToString);
    setGlobalOption("Summary", Theme.summary);
    setGlobalOption("Border", Theme.border);

    setGlobalOption("KillMsg", Theme.killmsg);
    setGlobalOption("KillUserMsg", Theme.killusermsg);
    setGlobalOption("LynchMsg", Theme.lynchmsg);
    setGlobalOption("DrawMsg", Theme.drawmsg);
    setSliderData("MinPlayers", Theme.minplayers);

    setGlobalOption("VillageCantLoseRoles", Theme.villageCantLoseRoles, Hooks.ArrayToString);

    if (Theme.has("ticks")) {
        setSliderData("Ticks-Night", Theme.ticks.night);
        setSliderData("Theme-Standby", Theme.ticks.standby);
    }

};

/* Tab: Global */
addGlobalOption = function (name, id, propName, tooltip) {
    if (arguments.length === 2) {
        tooltip = id;
        id = name;
        propName = id.toLowerCase();
    } else if (arguments.length === 3) {
        tooltip = propName;
        propName = id.toLowerCase();
    }

    $("#Globals-List").append("<li><span class='button-span' title=\"" + tooltip + "\">" + name + ":</span> <br/> <input type='text' id=\"Theme-" + id + "\" name=\"" + propName + "\" title=\"" + tooltip + "\" size='20'>");
};

setGlobalOption = function (id, text, hook) {
    if (text) {
        if (hook) {
            text = hook(text);
        }
        $("input[id=Theme-" + id + "]").val(text);
    }
};

globalLabel = function (text, icon) {
    label("Globals-List", text + ":", icon);
};

initializeGlobals = function () {
    /* Add buttons */
    addGlobalOption("Name", "Your theme's name");
    addGlobalOption("Author", "Your theme's author(s)");
    addGlobalOption("Border", "Your theme's border");

    addGlobalOption("Kill Message", "KillMsg", "Your theme's kill message");
    addGlobalOption("Kill User Message", "KillUserMsg", "Your theme's kill message sent to the player who died");
    addGlobalOption("Lynch Message", "LynchMsg", "Your theme's lynch message");
    addGlobalOption("Draw Message", "DrawMsg", "Your theme's draw message");

    addGlobalOption("Village Can't Lose Roles", "VillageCantLoseRoles", "villageCantLoseRoles", "Your theme's villageCantLoseRoles (roles that can be a tiebreaker if any other side has more players alive for side 'village')");

    addSlider("Globals-List", "Minimum Players", "MinPlayers", "Your theme's minimum players requirement", {"min": 3, "max": 50, "value": 5}, function (val) {
        setProp(Theme, "minplayers", val);
    });

    addSlider("Globals-List", "Ticks: Night", "Ticks-Night", "Your theme's ticks for phase 'night'", {"min": 1, "max": 60, "value": 30}, function (val) {
        if (!Theme.ticks) {
            Theme.ticks = {};
        }

        setProp(Theme.ticks, "night", val);
    });

    addSlider("Globals-List", "Ticks: Standby", "Ticks-Standby", "Your theme's ticks for phase 'standby'", {"min": 1, "max": 60, "value": 30}, function (val) {
        if (!Theme.ticks) {
            Theme.ticks = {};
        }

        setProp(Theme.ticks, "standby", val);
    });

    /* Initialize Auto Completer */
    initAutoCompleter("KillMsg", ["~Player~", "~Role~", "±Game:"]);
    initAutoCompleter("LynchMsg", ["~Player~", "~Role~", "~Side~", "~Count~", "±Game:"]);
    initAutoCompleter("KillUserMsg", ["±Game:"]);
    initAutoCompleter("DrawMsg", ["±Game:"]);

};

/* End Tab: Global */

/* Document ready */
$(function () {

    /* Load from localStorage */
    if (window.localStorage) {
        var item = localStorage.getItem("Theme");

        if (item) {
            $("#ThemeContent").val(item);
        }
    }

    /* Initialize Tabs */
    var Tabs = $("#Tabs");

    Tabs.tabs({
        select: function (event, ui) {
            if (ui.index === 0) { // Importing
                if (!isEmptyObject(Theme)) {
                    setThemeValues();
                    $("#ThemeContent").val(JSON.stringify(Theme));
                }
            }
            if (ui.index === 1) { // Editing
                if (!isEmptyObject(Theme)) {
                    getThemeValues();
                }
            }
            if (ui.index === 2) { // Source
                if (isEmptyObject(Theme)) {
                    dialog("Source", "Work on the theme to get the source.", "warning-sign");
                    return false;
                }

                setThemeValues();
                $("#Source").val(JSON.stringify(Theme));

            }
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

    /* Initialize Editing */
    initializeGlobals();
});

/* End Document onload */

/* Window onunload */
$(window).unload(function () {
    if (!isEmptyObject(obj) && window.localStorage) {
        localStorage.setItem("Theme", JSON.stringify(Theme));
    }
});