Theme = false;

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

    Object.defineProperty(Object.prototype, "first", {
        "value": function () {
            var x;
            for (x in this) {
                return this[x]; // Grab the first property
            }
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

    dialog = function (title, text) {
        var x, res = "<b>";

        for (x in text) {
            res += "<p>" + text[x] + "</p>";
        }

        res += "</b>";

        res = res.replace(/\{INFO\}/g, "<span class='ui-icon ui-icon-info' style='float:left; margin:0 7px 50px 0;'></span>").replace(/\{ALERT\}/g, "<span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 50px 0;'></span>");

        $("#Dialog").html(res).prop("title", title).dialog({
            modal: true,
            width: 300,
            height: 200,
            buttons: {
                "Ok": function () {
                    $(this).dialog("close");
                }
            }
        });
    }

    getInput = function (id) {
        var prop = $("#" + id);
        return {
            "property": prop.prop("name"),
            "value": prop.val()
        };
    }

    set = function (obj, id) {
        var input = getInput(id);
        if (!input.value) {
            return;
        }

        obj[input.property] = input.property;
    }
})();

$(document).ready(function () {
    var CreateNew = $("#CreateNew"),
        Tabs = $("#Tabs");

    Tabs.tabs({
        "select": function (event, ui) {
            if (ui.index === 0) { // Importing Panel
            }
            if (ui.index === 1) { // Editing Panel
                if (Theme === false) {
                    dialog("Editing Panel", ["{ALERT} Click on 'Create New' or import an existing theme to edit it."]);
                    return false;
                }

                console.log(getInput("Theme-Name"));
                set(Theme, "Theme-Name");
            }
            if (ui.index === 2) { // Source
                if (Theme === false) {
                    dialog("Source", ["{ALERT} Click on 'Create New' or import an existing theme to get the source."]);
                    return false;
                }
                $("#Source").val(JSON.stringify(Theme));
            }
        }
    });

    $("#Theme").accordion({
        autoHeight: false,
        navigation: true
    });

    CreateNew.button({
        icons: {
            primary: "ui-icon-plusthick"
        }
    });
    CreateNew.click(function () {
        Theme = {};
    });

    $("#UseTheme").button({
        icons: {
            primary: "ui-icon-script",
            secondary: "ui-icon-pencil"
        }
    });
});