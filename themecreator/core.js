/* Utilities */
(function () {
    Object.defineProperty(String.prototype, "isEmpty", {
        "value": function () {
            var mess = this;
            return mess == "" || mess.trim() == "";
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(String.prototype, "contains", {
        "value": function (string) {
            var str = this;
            return str.indexOf(string) > -1;
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(String.prototype, "format", {
        "value": function () {
            var str = this,
                exp, i, args = arguments.length,
                icontainer = 0;
            for (i = 0; i < args; i++) {
                icontainer++;
                exp = new RegExp("%" + icontainer, "");
                str = str.replace(exp, arguments[i]);
            }
            return str;
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(Boolean.prototype, "isEmpty", {
        "value": function () {
            return this === false;
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(Number.prototype, "isEmpty", {
        "value": function () {
            return isNaN(this) || this === 0;
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(Object.prototype, "isEmpty", {
        "value": function () {
            return this.length() === 0;
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(Object.prototype, "keys", {
        "value": function () {
            return Object.keys(this);
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(Object.prototype, "has", {
        "value": function (prop) {
            return typeof this[prop] !== "undefined";
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(Object.prototype, "insert", {
        "value": function (name, val) {
            this[name] = val;
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(Object.prototype, "length", {
        "value": function () {
            return Object.keys(this).length;
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(Array.prototype, "has", {
        "value": function (prop) {
            var x;
            for (x in this) {
                if (this[x] == prop) {
                    return true;
                }
            }

            return false;
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(Array.prototype, "isEmpty", {
        "value": function () {
            return this.length === 0;
        },

        writable: true,
        enumerable: false,
        configurable: true
    });
})();

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

    obj.html(res).dialog({
        modal: true,
        width: 300,
        height: 220,
        resizable: false,
        title: title
    });

    return obj;
}

initButton = function (id) {
    $("#" + id).button();
}

initSlider = function (id, callback) {
    $("#" + id).slider({
        min: 1,
        max: 100,
        value: 1,
        slide: function (event, ui) {
            callback(ui.value / 100);
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

useTheme = function () {
    var val = $("#LoadTheme").val();
    loadTheme(val);
}

addGlobalOption = function (name, id, propName, tooltip) {
    if (arguments.length === 2) {
        tooltip = id;
        id = name;
        propName = id.toLowerCase();
    } else if (arguments.length === 3) {
        tooltip = propName;
        propName = id.toLowerCase();
    }
    
    $("#Globals-List").append("<li><b>"+name+"</b>: <input id=\"Theme-"+id+"\" name=\""+propName+"\" title=\""+tooltip+"\">");
}

setGlobalOption = function (id, text, hook) {
    if (text) {
        if (hook) {
            text = hook(text);
        }
        $("input[id=Theme-"+id+"]").val(text);
    }
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
    } else if (arguments.length === 2 && typeof id === "function") {
        hook = id;
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
setThemeValues = function () {
    set("Name");
    set("Author", Hooks.Array);
    set("Summary");
    set("Border");
    
    set("KillMsg");
    set("KillUserMsg");
    set("LynchMsg");
    set("DrawMsg");

    set("VillageCantLoseRoles", Hooks.StringToArray);
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
    addGlobalOption("Name", "Your theme's name");
    addGlobalOption("Author", "Your theme's author(s)");
    addGlobalOption("Border", "Your theme's border");
    
    addGlobalOption("Kill Message", "KillMsg", "Your theme's kill message");
    addGlobalOption("Kill User Message", "KillUserMsg", "Your theme's kill message sent to the player who died");
    addGlobalOption("Lynch Message", "LynchMsg", "Your theme's lynch message");
    addGlobalOption("Draw Message", "DrawMsg", "Your theme's draw message");
    
    addGlobalOption("Village Can't Lose Roles", "VillageCantLoseRoles", "villageCantLoseRoles", "Your theme's villageCantLoseRoles list");
}

/* Document onload */
$(document).ready(function () {
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

    $("#Theme").accordion({
        autoHeight: false,
        collapsible: true
    });

    initButton("CreateNew");
    initButton("UseTheme");

    $("#CreateNew").click(function () {
        Theme = {};
        dialog("Importing", ["Successfully created a new theme."]);

        setTimeout(function () {
            $("#Dialog").dialog("close");
        }, 1500);

        Tabs.tabs("select", 1); // Editing
    });
    
    initalizeGlobals();
});

/* End Document onload */