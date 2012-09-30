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

isEmptyObject = function (obj) {
    return typeof obj !== "object" || obj.length() === 0;
};

