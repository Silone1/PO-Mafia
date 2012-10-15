initButton = function (id, callback) {
    var element = $("#" + id).button().addClass("btn btn-primary");
    /* Nice effect from Bootstrap */

    if ($.isFunction(callback)) {
        element.click(callback);
    }

    return element;
};

addCheckbox = function (main_id, name, id, tooltip, callback) {
    var button_id;

    $("#" + main_id).append("<li><span title=\"" + tooltip + "\" class='button-span'>" + name + ":</span> <br/> <button title=\"" + tooltip + "\" id='" + id + "' class='btn btn-mini'>Disabled</button></li>");
    button_id = $("#" + id);

    if ($.isFunction(callback)) {
        button_id.click(callback);
    }

    button_id.click(function () {
        var self = $(this) , self_text = self.text();

        if (self_text === "Enabled") {
            self.text("Disabled");
        } else {
            self.text("Enabled");
        }
    });
};

addSlider = function (id, name, slider_id, tooltip, options, callback) {
    if (!options.min) {
        options.min = 1;
    }
    if (!options.max) {
        options.max = 100;
    }
    if (!options.value) {
        options.value = options.min;
    }

    $("#" + id).append("<li><span class='button-span' title=\"" + tooltip + "\">" + name + ":</span> <input type='text' id='Theme-" + slider_id + "-value' class='slider-value' title=\"" + tooltip + "\" value='" + options.value + "' disabled><div id='Theme-" + slider_id + "' class='slider'></div> <br/> </li>");
    initSlider(slider_id, options, callback);
};

initSlider = function (id, options, callback) {
    return $("#Theme-" + id).slider({
        range: "min",
        min: options.min,
        max: options.max,
        value: options.value,
        slide: function (event, ui) {
            if ($.isFunction(callback)) {
                callback(ui.value);
            }
            $("#Theme-" + id + "-value").val(ui.value);
        }
    });
};

addChanceSlider = function (id, slider_id, tooltip, callback) {
    $("#" + id).append("<li><span class='button-span' title=\"" + tooltip + "\">" + name + ":</span> <input type='text' id='Theme-" + slider_id + "-value' class='slider-value' title=\"" + tooltip + "\" value='" + options.value + "' disabled><div id='Theme-" + slider_id + "' class='slider'></div> <br/> </li>");

    initChanceSlider(slider_id, callback);
};

initChanceSlider = function (id, callback) {
    $("#Theme-" + id + "-value").val(1);

    return $("#Theme-" + id).slider({
        range: "min",
        min: 1,
        max: 100,
        value: 1,
        slide: function (event, ui) {
            callback(ui.value / 100);
            $("#Theme-" + id + "-value").val(ui.value / 100);
        }
    });
};

setSliderData = function (id, val) {
    if ($.isNumeric(val)) {
        $("#Theme-" + id).slider("value", val);
        $("#Theme-" + id + "-value").val(val);
    }
};

initAutoCompleter = function (id, tags, join, onSelect) {
    if (!join) {
        join = " ";
    }

    return $("#" + id).autocomplete({
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

            if ($.isFunction(onSelect)) {
                onSelect(this.value);
            }

            return false;
        }
    });
};

icon = function (icon) {
    return '<i class="icon-' + icon + '"></i>';
};

dialog = function (title, text, dialogIcon) {
    var x, res = "<b>",
        obj = $("#Dialog");

    if (!dialogIcon) {
        dialogIcon = "info-sign";
    }

    dialogIcon = icon(dialogIcon);

    if (typeof text === "string") {
        text = [dialogIcon + " " + text];
    } else {
        text[0] = dialogIcon + " " + text[0];
    }

    for (x in text) {
        res += "<p>" + text[x] + "</p>";
    }

    res += "</b>";

    return obj.attr("title", title).html(res).dialog({
        modal: true,
        width: 300,
        height: 225,
        resizable: false
    });
};

getInput = function (id) {
    var prop = $("#Theme-" + id);
    return {
        "property": prop.prop("name"),
        "value": prop.val()
    };
};

hasInput = function (id) {
    return !!getInput(id).value;
};

set = function (obj, id, hook) {
    if (arguments.length === 1) {
        id = obj;
        obj = Theme;
    } else if (arguments.length === 2 && typeof id !== "string") {
        hook = id;
        id = obj;
        obj = Theme;
    }

    var input = getInput(id);

    if (!hasInput(id)) {
        eval("if (obj." + input.property + ") { delete obj." + input.property + "; }");
    } else {
        if (hook) {
            input = hook(input);
            if (input === false) {
                return obj;
            }
        }

        eval("obj." + input.property + " = " + Hooks.InputToEval(input).value);
    }
}
;

setFromCheckbox = function (id, obj, name) {
    var isEnabled = $("#Theme-" + id).text() === "Enabled";
    eval("obj." + name + " = " + isEnabled);
};

setSliderValue = function (id, obj, property) {
    if (!obj) {
        obj = Theme;
    }

    var value = $("#Theme-" + id + "-value").val();

    if (!value) {
        eval("if (obj." + property + ") { delete obj." + property + "; }");
    } else {
        eval("obj." + property + " = " + value * 1);
    }
};

setProp = function (obj, name, value) {
    eval("obj." + name + " = " + value);
};

Hooks = {
    StringToNumber: function (input) {
        var val = input.value;
        if (isNaN(val * 1)) {
            return false;
        }

        input.value = val * 1;

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
    },
    InputToEval: function (input) {
        if ($.isArray(input.value)) {
            input.value = "[" + Hooks.ArrayToEval(input.value) + "]";
        }
        else {
            input.value = '"' + input.value + '"';
        }

        return input;
    },
    ArrayToEval: function (value) {
        var map = function (val) {
            var type = typeof val;
            if (type === "array") {
                return val.join(", ");
            } else if (type === "object") {
                return JSON.stringify(val);
            }

            return '"' + val + '"';
        }

        return value.map(map).join(", ");
    }
};