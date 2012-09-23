/* Utilities */
defineCoreProperty = function (core, prop, func) {
    Object.defineProperty(core, prop, {
        "value": func,

        writable: true,
        enumerable: false,
        configurable: true
    });
}

defineCoreProperty(String.prototype, "isEmpty", function () {
    var mess = this;
    return mess == "" || mess.trim() == "";
});

defineCoreProperty(String.prototype, "contains", function (string) {
    var str = this;
    return str.indexOf(string) > -1;
});

defineCoreProperty(String.prototype, "has", function (string) {
    return this.contains(string);
});

defineCoreProperty(String.prototype, "format", function () {
    var str = this,
        exp, i, args = arguments.length,
        icontainer = 0;
    for (i = 0; i < args; i++) {
        icontainer++;
        exp = new RegExp("%" + icontainer, "");
        str = str.replace(exp, arguments[i]);
    }
    return str;
});

defineCoreProperty(String.prototype, "fontsize", function (size) {
    var str = this;

    return "<font size='" + size + "'>" + str + "</font>";
});

defineCoreProperty(Boolean.prototype, "isEmpty", function () {
    return this === false;
});

defineCoreProperty(Number.prototype, "isEmpty", function () {
    return !isFinite(this) || this === 0;
});

defineCoreProperty(Number.prototype, "positive", function () {
    return !this.isEmpty();
});

defineCoreProperty(Object.prototype, "isEmpty", function () {
    return this.length() === 0;
});

defineCoreProperty(Object.prototype, "keys", function () {
    return Object.keys(this);
});

defineCoreProperty(Object.prototype, "has", function (prop) {
    return typeof this[prop] !== "undefined";
});

defineCoreProperty(Object.prototype, "contains", function (prop) {
    return this.has(prop);
});

defineCoreProperty(Object.prototype, "insert", function (name, val) {
    this[name] = val;
});

defineCoreProperty(Object.prototype, "extend", function (other) {
    var x;

    if (typeof other === "object" && !Array.isArray(other) && other !== null) {
        for (x in other) {
            this[x] = other[x];
        }
    }

    return this;
});

defineCoreProperty(Object.prototype, "length", function () {
    return Object.keys(this).length;
});

defineCoreProperty(Array.prototype, "has", function (prop) {
    var x;
    for (x in this) {
        if (this[x] == prop) {
            return true;
        }
    }

    return false;
});

defineCoreProperty(Array.prototype, "isEmpty", function () {
    return this.length === 0;
});

defineCoreProperty(Array.prototype, "contains", function (prop) {
    return this.has(prop);
});

/* End Utilities */

/* jQuery UI Stuff */

dialog = function (title, text) {
    var x, res = "<label><b>",
        obj = $("#Dialog");

    for (x in text) {
        res += "<p>" + text[x] + "</p>";
    }

    res += "</b></label>";

    res = res.replace(/\{INFO\}/g, "<span class='ui-icon ui-icon-info' style='float:left; margin:0 7px 50px 0;'></span>").replace(/\{ALERT\}/g, "<span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 50px 0;'></span>");

    return obj.html(res).dialog({
        modal: true,
        width: 300,
        height: 220,
        resizable: false
    }).dialog("option", "title", title);
}

initButton = function (id) {
    return $("#" + id).button();
}

initSlider = function (id, callback) {
    return $("#Theme-" + id).slider({
        range: "min",
        min: 1,
        max: 100,
        value: 1,
        slide: function (event, ui) {
            callback(ui.value / 100);
            $("#Theme-"+id+"-value").html("<br/>("+ui.value / 100 +")");
        }
    }).append("<br/><span id='#Theme-"+id+"-value'>(0.01)</span>");
}

initAutoCompleter = function (id, tags, join) {
    if (!join) {
        join = " ";
    }
    
    return $("#Theme-" + id).autocomplete({
        minLength: 0,
        source: function (request, response) {
            response($.ui.autocomplete.filter(tags, request.term.split(join).pop()));
        },
        focus: function () {
            return false;
        },
        select: function (event, ui) {
            var terms = this.value.split(join);
            
            terms.pop();
            terms.push(ui.item.value);

            this.value = terms.join(join);

            return false;
        }
    });
}

/* End jQuery UI Stuff */

/* Core JS */
Theme = false;

loadTheme = function (text) {
    var res;
    try {
        res = JSON.parse(text);
    } catch (e) {
        dialog("JSON parse error", ["{ALERT} Could not parse JSON.", "{INFO} Please use <a href='http://jsonlint.com'>JSONLint</a> to check your syntax."]);
        return false;
    }

    Theme = res;
}

importTheme = function () {
    loadTheme($("#ThemeContent").val());
}

getInput = function (id) {
    var prop = $("#Theme-" + id);
    return {
        "property": prop.prop("name"),
        "value": prop.val()
    };
}

set = function (obj, id, hook) {
    if (arguments.length === 1) {
        id = obj;
        obj = Theme;
    }

    var input = getInput(id);

    if (!input.value) {
        if (obj.has(input.property)) {
            delete obj[input.property];
        }
        return;
    }

    if (hook) {
        input = hook(input);
    }

    obj[input.property] = input.value;
}

/* Hooks*/
Hooks = {
    StringToNumber: function (input) {
        input.value = input.value * 1;
        return input;
    },
    StringToArray: function (input) {
        input.value = input.value.split(", ");

        if (input.value.length < 2) {
            input.value = input.value[0];
        }

        return input;
    },
    String2Array: function (input) { // For array only properties 
        input.value = input.value.split(", ");

        if (input.value.length < 2) {
            input.value = input.value[0];
        }

        return input;
    },
    ArrayToString: function (input) {
        if (Array.isArray(input)) {
            return input.join(", ");
        } else {
            return input;
        }
    }
};

/* End Hooks */

/* End Core JS */

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

    $("#Globals-List").append("<li><b>" + name + "</b>: <input id=\"Theme-" + id + "\" name=\"" + propName + "\" title=\"" + tooltip + "\" size='35'>");
}

setGlobalOption = function (id, text, hook) {
    if (text) {
        if (hook) {
            text = hook(text);
        }
        $("input[id=Theme-" + id + "]").val(text);
    }
}

setThemeValues = function () {
    set("Name");
    set(Theme, "Author", Hooks.StringToArray);
    set("Summary");
    set("Border");

    set("KillMsg");
    set("KillUserMsg");
    set("LynchMsg");
    set("DrawMsg");

    set(Theme, "VillageCantLoseRoles", Hooks.String2Array);
}

getThemeValues = function () {
    setGlobalOption("Name", Theme.name);
    setGlobalOption("Author", Theme.author, Hooks.ArrayToString);
    setGlobalOption("Summary", Theme.summary);
    setGlobalOption("Border", Theme.border);

    setGlobalOption("KillMsg", Theme.killmsg);
    setGlobalOption("KillUserMsg", Theme.killusermsg);
    setGlobalOption("LynchMsg", Theme.lynchmsg);
    setGlobalOption("DrawMsg", Theme.drawmsg);

    setGlobalOption("VillageCantLoseRoles", Theme.villageCantLoseRoles, Hooks.ArrayToString);
}

initalizeGlobals = function () {
    /* Add buttons */
    addGlobalOption("Name", "Your theme's name");
    addGlobalOption("Author", "Your theme's author(s)");
    addGlobalOption("Border", "Your theme's border");

    addGlobalOption("Kill Message", "KillMsg", "Your theme's kill message");
    addGlobalOption("Kill User Message", "KillUserMsg", "Your theme's kill message sent to the player who died");
    addGlobalOption("Lynch Message", "LynchMsg", "Your theme's lynch message");
    addGlobalOption("Draw Message", "DrawMsg", "Your theme's draw message");

    addGlobalOption("Village Can't Lose Roles", "VillageCantLoseRoles", "villageCantLoseRoles", "Your theme's villageCantLoseRoles list");
    
    $("#Globals-List").append("<div id='Theme-EvadeChance'></div>");
    initSlider("EvadeChance", function (val) {
    Theme["evadeChance"] = val;
    });
    
    /* Initalize Auto Completers */
    initAutoCompleter("KillMsg", ["~Player~", "~Role~", "±Game"]);
}

/* Document onload */
$(document).ready(function () {
    /* Initalize Tabs */
    var Tabs = $("#Tabs");

    Tabs.tabs({
        "select": function (event, ui) {
            if (ui.index === 0) { // Importing
                if (Theme !== false) {
                    setThemeValues();
                }
            }
            if (ui.index === 1) { // Editing
                if (Theme === false) {
                    dialog("Editing", ["{ALERT} Click on 'Create New' or import an existing theme to edit it."]);
                    return false;
                }

                getThemeValues();
            }
            if (ui.index === 2) { // Source
                if (Theme === false) {
                    dialog("Source", ["{ALERT} Click on 'Create New' or import an existing theme to get the source."]);
                    return false;
                }

                setThemeValues();
                $("#Source").val(JSON.stringify(Theme));

            }
        }
    });

    /* Initalize Accordion */
    $("#Theme").accordion({
        autoHeight: false,
        collapsible: true
    });

    /* Initalize Buttons */
    initButton("CreateNew");
    initButton("ImportTheme");

    $("#CreateNew").click(function () {
        Theme = {};
        dialog("Importing", ["Successfully created a new theme."]);

        setTimeout(function () {
            $("#Dialog").dialog("close");
        }, 1500);

        Tabs.tabs("select", 1); // Editing
    });
    
    $("#ImportTheme").click(function () {
        importTheme();
    });

    /* Initalize Editing */
    initalizeGlobals();
});

/* End Document onload */