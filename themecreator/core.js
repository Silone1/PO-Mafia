themeImported = false;

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

    useTheme = function (text) {
        var textarea = $("#LoadTheme"),
            button = $("#UseTheme"),
            val = textarea.val();
        if (text != undefined) {
            val = text;
        }

        if (!loadTheme(val)) {
            return; // Parsing Error.
        }

        textarea.fadeOut("slow");
        button.fadeOut("slow");
        themeImported = true;
    }
})();

$(document).ready(function () {
    var CreateNew = $("#CreateNew"),
        Tabs = $("#Tabs");

    Tabs.tabs({
        "select": function (event, ui) {
            if (ui.index === 0) { // Importing Panel
                if (themeImported) {
                    $("#LoadTheme").fadeIn("fast");
                    $("#UseTheme").fadeIn("fast");
                    themeImported = false;
                }
            }
            if (ui.index === 2) { // Source
                $("#Source").val("{}");
            }
        }
    });

    $("#Theme").accordion({
			autoHeight: false,
			navigation: true});

    CreateNew.button({icons: {primary: "ui-icon-plusthick"}});
    CreateNew.click(function () {
        useTheme("{}");
    });

    $("#UseTheme").button({icons: {primary: "ui-icon-script"}});
    
/*$("#Dialog-Start").addClass("ui-state-highlight").dialog({
			height: 140,
			modal: true
		});*/
});