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

    Object.defineProperty(String.prototype, "has", {
        "value": function (string) {
            return this.contains(string);
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

    Object.defineProperty(Object.prototype, "contains", {
        "value": function (prop) {
            return this.has(prop);
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

    Object.defineProperty(Object.prototype, "remove", {
        "value": function (name) {
            if (!this.has(name)) {
                return;
            }

            delete this[name];
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

    Object.defineProperty(Array.prototype, "contains", {
        "value": function (prop) {
            return this.has(prop);
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    STATUS_RESET = true;

    html = function (msg, color) {
        var toAppend = msg ? "<font color='" + color + "'><b>" + msg + "</b></font>" : "";
        $("span").append(toAppend + "<br/>"); // errorList
    }

    setStatus = function (msg, reset) {
        var func = reset ? "html" : "append",
            status_obj = $("#status");

        if (status_obj.html() === "") {
            msg = "<hr/>" + msg;
        }

        status_obj[func](msg + "<br/>");
    }

    out = function (msg) {
        setStatus(msg);
    }

    println = function (msg) {
        html(msg, "green");
    }

    minor = function (msg) {
        html(msg, "orange");
    }

    fatal = function (msg) {
        html(msg, "red");
    }

    readable = function (arr, last_delim) {
        if (!Array.isArray(arr)) {
            return arr;
        }

        if (arr.length > 1) {
            return arr.slice(0, arr.length - 1).join(", ") + " " + last_delim + " " + arr.slice(-1)[0];
        } else if (arr.length == 1) {
            return arr[0];
        } else {
            return "";
        }
    }

    printErrors = function (errors) {
        var errorlist = "<ul>",
            x;
        for (x in errors) {
            errorlist += "<li>" + errors[x] + "</li>";
        }

        html(errorlist + "</ul>", "black");
    }

    var minorErrors = [],
        fatalErrors = [];

    addMinorError = function (msg) {
        minorErrors.push(msg);
    }

    addFatalError = function (msg) {
        fatalErrors.push(msg);
    }

    resetErrors = function () {
        minorErrors = [];
        fatalErrors = [];
    }

	resetErrorMessages = function () {
        $("#status").html("");
        $("span").html("");
	}
	
    /* End of utilities */
    /* Mafia Theme Checker */

    Theme = function () {
        this.sides = {};
        this.roles = {};
    }

    var themeProto = Theme.prototype;
    themeProto.addSide = function (obj) {
        var side = "One of your sides";
        if (obj.has("side")) {
            side = "Your side \"" + obj.side + "\"";
        }
        checkAttributes(obj, ["side", "translation"], ["winmsg"], side);
        if (this.sides.has(obj.side)) {
            addFatalError("Your theme has a repeated side \"" + obj.side + "\".");
        }

        this.sides.insert(obj.side, obj.translation);
    }

    themeProto.addRole = function (obj) {
        var yourRole = "One of your roles",
            e;
        if (obj.has("role")) {
            yourRole = 'Your role "' + obj.role + '"';
        }

        checkAttributes(obj, ["role", "translation", "side", "help"], ["actions", "info", "winningSides", "winIfDeadRoles"], yourRole);

        if (!obj.has("actions")) {
            obj.actions = {};
        }
        if (this.roles.has(obj.role)) {
            addFatalError("Your theme has a repeated role \"" + obj.role + "\".");
        }

        this.roles.insert(obj.role, obj);

        if (typeof obj.side == "object") {
            if (obj.side.has("random")) {
                for (e in obj.side.random) {
                    if (!this.isValidSide(e)) {
                        addFatalError(yourRole + " has random side \"" + e + "\" which doesn't exist in \"sides\".");
                    }
                }
            } else {
                addFatalError(yourRole + " has an invalid object as it's side.");
            }
        } else {
            if (!this.isValidSide(obj.side)) {
                addFatalError(yourRole + " has side \"" + obj.side + "\" which doesn't exist in \"sides\".");
            }
        }
    }

    themeProto.addActions = function () {
        var r, e, i, role, action, yourRole;
        for (r in this.roles) {
            role = this.roles[r];
            yourRole = role.role;

            if (role.has("winningSides")) {
                if (Array.isArray(role.winningSides)) {
                    for (e in role.winningSides) {
                        this.checkValidSide(role.winningSides[e], "Role " + yourRole + "'s \"winningSides\"");
                    }
                } else {
                    if (role.winningSides !== "*") {
                        addFatalError("Role " + yourRole + " has an invalid value for \"winningSides\". It should be an array or \"*\"");
                    }
                }
            }
            if (role.has("winIfDeadRoles")) {
                if (Array.isArray(role.winIfDeadRoles)) {
                    for (e in role.winIfDeadRoles) {
                        this.checkValidRole(role.winIfDeadRoles[e], "Role " + yourRole + "'s \"winIfDeadRoles\"");
                    }
                } else {
                    addFatalError(yourRole + " has an invalid value for \"winIfDeadRoles\". It should be an array.");
                }
            }

            checkAttributes(role.actions, [], ["night", "standby", "hax", "onDeath", "initialCondition", "avoidHax", "kill", "poison", "distract", "daykill", "daykillrevengemsg", "inspect", "protect", "safeguard", "convert", "vote", "voteshield", "startup", "onlist", "lynch"], "Role " + yourRole);

            var possibleNightActions = ["kill", "protect", "inspect", "distract", "poison", "safeguard", "stalk", "convert"],
                command, o, possibleStandbyActions = ["kill", "reveal", "expose"];


            if (role.actions.has("night") && checkType(role.actions.night, ["object"], "Role " + yourRole + "'s night actions")) {
                for (e in role.actions.night) {
                    action = role.actions.night[e];
                    if (checkType(action, ["object"], "Role " + yourRole + "'s night action \"" + e + "\"")) {
                        command = e;
                        if (action.command) {
                            command = action.command;
                        }

                        if (command == "kill") {
                            checkAttributes(action, ["target", "common", "priority"], ["broadcast", "command", "limit", "msg", "failChance", "recharge", "initialrecharge", "broadcastmsg"], "Role " + yourRole + "'s night action \"" + command + "\"");
                            commonNightActions(yourRole, action, command);
                            if (action.has("msg")) {
                                checkType(action.msg, ["string"], "Role " + yourRole + "'s attribute \"msg\" for night action \"" + command + "\"");
                            }
                        } else if (command == "protect") {
                            checkAttributes(action, ["target", "common", "priority"], ["broadcast", "command", "limit", "failChance", "recharge", "initialrecharge", "broadcastmsg"], "Role " + yourRole + "'s night action \"" + command + "\"");
                            commonNightActions(yourRole, action, command);
                        } else if (command == "inspect") {
                            checkAttributes(action, ["target", "common", "priority"], ["broadcast", "command", "limit", "Sight", "failChance", "recharge", "initialrecharge", "broadcastmsg"], "Role " + yourRole + "'s night action \"" + command + "\"");
                            commonNightActions(yourRole, action, command);
                            if (action.has("Sight")) {
                                if (typeof action.Sight == "string") {
                                    checkValidValue(action.Sight, ["Team"], "Role " + yourRole + "'s night action \"" + command + "\" has a invalid value for \"target\": %1 (%2)");
                                } else if (typeof action.Sight == "object") {
                                    for (i in action.Sight) {
                                        if (i !== "true") {
                                            this.checkValidRole(i, "Role " + yourRole + "'s \"Sight\" attribute for night action \"" + command + "\"");
                                        }
                                        checkType(action.Sight[i], ["number"], "Role " + yourRole + "'s attribute \"Sight: " + i + "\" for night action \"" + command + "\"");
                                    }
                                } else {
                                    checkType(action.Sight, ["string", "object"], "Role " + yourRole + "'s attribute \"Sight\" for night action \"" + command + "\"");
                                }
                            }
                        } else if (command == "distract") {
                            checkAttributes(action, ["target", "common", "priority"], ["broadcast", "command", "limit", "distractmsg", "teammsg", "failChance", "recharge", "initialrecharge", "broadcastmsg"], "Role " + yourRole + "'s night action \"" + command + "\"");
                            commonNightActions(yourRole, action, command);
                            if (action.has("distractmsg")) {
                                checkType(action.distractmsg, ["string"], "Role " + yourRole + "'s attribute \"distractmsg\" for night action \"" + command + "\"");
                            }
                            if (action.has("teammsg")) {
                                checkType(action.teammsg, ["string"], "Role " + yourRole + "'s attribute \"teammsg\" for night action \"" + command + "\"");
                            }
                        } else if (command == "poison") {
                            checkAttributes(action, ["target", "common", "priority"], ["broadcast", "command", "limit", "count", "poisonDeadMessage", "failChance", "recharge", "initialrecharge", "broadcastmsg"], "Role " + yourRole + "'s night action \"" + command + "\"");
                            commonNightActions(yourRole, action, command);
                            if (action.has("count")) {
                                checkType(action.count, ["number"], "Role " + yourRole + "'s attribute \"count\" for night action \"" + command + "\"");
                            }
                            if (action.has("poisonDeadMessage")) {
                                checkType(action.poisonDeadMessage, ["string"], "Role " + yourRole + "'s attribute \"poisonDeadMessage\" for night action \"" + command + "\"");
                            }
                        } else if (command == "safeguard") {
                            checkAttributes(action, ["target", "common", "priority"], ["broadcast", "command", "limit", "failChance", "recharge", "initialrecharge", "broadcastmsg"], "Role " + yourRole + "'s night action \"" + command + "\"");
                            commonNightActions(yourRole, action, command);
                        } else if (command == "stalk") {
                            checkAttributes(action, ["target", "common", "priority"], ["broadcast", "command", "limit", "failChance", "recharge", "initialrecharge", "broadcastmsg"], "Role " + yourRole + "'s night action \"" + command + "\"");
                            commonNightActions(yourRole, action, command);
                        } else if (command == "convert") {
                            checkAttributes(action, ["target", "common", "priority", "newRole"], ["broadcast", "command", "limit", "canConvert", "convertmsg", "failChance", "recharge", "initialrecharge", "silent", "broadcastmsg"], "Role " + yourRole + "'s night action \"" + command + "\"");
                            commonNightActions(yourRole, action, command);
                            if (action.has("silent")) {
                                checkValidValue(action.silent, [true, false], "Role " + yourRole + "'s night action \"" + command + "\" has a invalid value for \"silent\": %1 (%2)");
                            }
                            if (action.has("newRole")) {
                                if (typeof action.newRole == "string") {
                                    this.checkValidRole(action.newRole, "Role " + yourRole + "'s \"newRole\" attribute for night action \"" + command + "\"");
                                } else if (typeof action.newRole == "object") {
                                    for (i in action.newRole) {
                                        this.checkValidRole(i, "Role " + yourRole + "'s \"newRole: " + i + "\" attribute for night action \"" + command + "\"");
                                        if (checkType(action.newRole[i], ["array"], "Role " + yourRole + "'s attribute \"newRole: " + i + "\" for night action \"" + command + "\"")) {
                                            for (o in action.newRole[i]) {
                                                this.checkValidRole(action.newRole[i][o], "Eole " + yourRole + "'s \"newRole: " + i + "\" attribute for night action \"" + command + "\"");
                                            }
                                        }
                                    }
                                }
                            }
                            if (action.has("canConvert")) {
                                if (typeof action.canConvert == "string") {
                                    checkValidValue(action.canConvert, ["*"], "Role " + yourRole + "'s night action \"" + command + "\" has a invalid value for \"canConvert\": %1 (%2)");
                                } else if (checkType(action.canConvert, ["array"], "Role " + yourRole + "'s attribute \"canConvert\" for night action \"" + command + "\"")) {
                                    for (i in action.canConvert) {
                                        this.checkValidRole(action.canConvert[i], "Role " + yourRole + "'s \"canConvert\" attribute for night action \"" + command + "\"");
                                    }
                                }
                            }
                            if (action.has("convertmsg")) {
                                checkType(action.convertmsg, ["string"], "Role " + yourRole + "'s attribute \"convertmsg\" for night action \"" + command + "\"");
                            }
                            if (action.has("usermsg")) {
                                checkType(action.usermsg, ["string"], "Role " + yourRole + "'s attribute \"usermsg\" for night action \"" + command + "\"");
                            }
                        } else {
                            addMinorError("Role " + yourRole + "'s night action \"" + command + "\" is not a valid action (Valid night actions are " + readable(possibleNightActions, "and") + ")");
                        }
                    }
                }
            }
            if (role.actions.has("standby") && checkType(role.actions.standby, ["object"], "Role " + yourRole + "'s standby actions")) {
                for (e in role.actions.standby) {
                    action = role.actions.standby[e];
                    if (checkType(action, ["object"], "Role " + yourRole + "'s standby action \"" + e + "\"")) {
                        command = e;
                        if (action.command) {
                            command = action.command;
                        }
                        if (command == "kill") {
                            checkAttributes(action, ["target"], ["command", "limit", "msg", "killmsg", "revealChance", "revealmsg", "recharge", "initialrecharge"], "Role " + yourRole + "'s standby action \"" + e + "\"");
                            if (action.has("target")) {
                                checkValidValue(action.target, ["Any", "Self", "AnyButTeam", "AnyButRole", "AnyButSelf"], "Role " + yourRole + "'s standby action \"" + e + "\" has a invalid value for \"target\": %1 (%2)");
                            }
                            if (action.has("limit")) {
                                checkType(action.limit, ["number"], "Role " + yourRole + "'s attribute \"limit\" for standby action \"" + command + "\"");
                            }
                            if (action.has("msg")) {
                                checkType(action.msg, ["string"], "Role " + yourRole + "'s attribute \"msg\" for standby action \"" + command + "\"");
                            }
                            if (action.has("killmsg")) {
                                checkType(action.killmsg, ["string"], "Role " + yourRole + "'s attribute \"killmsg\" for standby action \"" + command + "\"");
                            }
                            if (action.has("revealChance")) {
                                checkType(action.revealChance, ["number"], "Role " + yourRole + "'s attribute \"revealChance\" for standby action \"" + command + "\"");
                            }
                            if (action.has("revealmsg")) {
                                checkType(action.revealmsg, ["string"], "Role " + yourRole + "'s attribute \"revealmsg\" for standby action \"" + command + "\"");
                            }
                            if (action.has("recharge")) {
                                checkType(action.recharge, ["number"], "Role " + yourRole + "'s attribute \"recharge\" for standby action \"" + command + "\"");
                            }
                            if (action.has("initialrecharge")) {
                                checkType(action.initialrecharge, ["number"], "Role " + yourRole + "'s attribute \"initialrecharge\" for standby action \"" + command + "\"");
                            }
                        } else if (command == "expose") {
                            checkAttributes(action, ["target"], ["command", "limit", "msg", "exposemsg", "revealChance", "revealmsg", "recharge", "initialrecharge"], "Role " + yourRole + "'s standby action \"" + e + "\"");
                            if (action.has("target")) {
                                checkValidValue(action.target, ["Any", "Self", "AnyButTeam", "AnyButRole", "AnyButSelf"], "Role " + yourRole + "'s standby action \"" + e + "\" has a invalid value for \"target\": %1 (%2)");
                            }
                            if (action.has("limit")) {
                                checkType(action.limit, ["number"], "Role " + yourRole + "'s attribute \"limit\" for standby action \"" + command + "\"");
                            }
                            if (action.has("msg")) {
                                checkType(action.msg, ["string"], "Role " + yourRole + "'s attribute \"msg\" for standby action \"" + command + "\"");
                            }
                            if (action.has("exposemsg")) {
                                checkType(action.exposemsg, ["string"], "Role " + yourRole + "'s attribute \"exposemsg\" for standby action \"" + command + "\"");
                            }
                            if (action.has("revealChance")) {
                                checkType(action.revealChance, ["number"], "Role " + yourRole + "'s attribute \"revealChance\" for standby action \"" + command + "\"");
                            }
                            if (action.has("revealmsg")) {
                                checkType(action.revealmsg, ["string"], "Role " + yourRole + "'s attribute \"revealmsg\" for standby action \"" + command + "\"");
                            }
                            if (action.has("recharge")) {
                                checkType(action.recharge, ["number"], "Role " + yourRole + "'s attribute \"recharge\" for standby action \"" + command + "\"");
                            }
                            if (action.has("initialrecharge")) {
                                checkType(action.initialrecharge, ["number"], "Role " + yourRole + "'s attribute \"initialrecharge\" for standby action \"" + command + "\"");
                            }
                        } else if (command == "reveal") {
                            checkAttributes(action, [], ["command", "limit", "msg", "revealmsg", "recharge", "initialrecharge"], "Role " + yourRole + "'s standby action \"" + e + "\"");
                            if (action.has("limit")) {
                                checkType(action.limit, ["number"], "Role " + yourRole + "'s attribute \"limit\" for standby action \"" + command + "\"");
                            }
                            if (action.has("msg")) {
                                checkType(action.msg, ["string"], "Role " + yourRole + "'s attribute \"msg\" for standby action \"" + command + "\"");
                            }
                            if (action.has("revealmsg")) {
                                checkType(action.revealmsg, ["string"], "Role " + yourRole + "'s attribute \"revealmsg\" for standby action \"" + command + "\"");
                            }
                            if (action.has("recharge")) {
                                checkType(action.recharge, ["number"], "Role " + yourRole + "'s attribute \"recharge\" for standby action \"" + command + "\"");
                            }
                            if (action.has("initialrecharge")) {
                                checkType(action.initialrecharge, ["number"], "Role " + yourRole + "'s attribute \"initialrecharge\" for standby action \"" + command + "\"");
                            }
                        } else {
                            addMinorError("Role " + yourRole + "'s standby action \"" + command + "\" is not a valid action (Valid standby actions are " + readable(possibleStandbyActions, "and") + ")");
                        }
                    }
                }
            }
            if (role.actions.has("hax") && checkType(role.actions.hax, ["object"], "Role " + yourRole + "'s hax")) {
                for (e in role.actions.hax) {
                    checkAttributes(role.actions.hax[e], [], ["revealTeam", "revealPlayer", "revealRole"], "Role " + yourRole + "'s hax on \"" + e + "\"");
                    if (typeof role.actions.hax[e] == "object") {
                        if (role.actions.hax[e].has("revealTeam")) {
                            checkType(role.actions.hax[e].revealTeam, ["number"], "Role " + yourRole + "s hax on " + e + " (revealTeam)");
                        }
                        if (role.actions.hax[e].has("revealPlayer")) {
                            checkType(role.actions.hax[e].revealPlayer, ["number"], "Role " + yourRole + "s hax on " + e + " (revealPlayer)");
                        }
                        if (role.actions.hax[e].has("revealRole")) {
                            checkType(role.actions.hax[e].revealRole, ["number"], "Role " + yourRole + "s hax on " + e + " (revealRole)");
                        }
                    }
                }
            }
            if (role.actions.has("onDeath") && checkType(role.actions.onDeath, ["object"], "Role " + yourRole + "'s onDeath")) {
                action = role.actions.onDeath;
                checkAttributes(action, [], ["killRoles", "poisonRoles", "convertRoles", "exposeRoles", "killmsg", "convertmsg", "poisonmsg", "poisonDeadMessage", "exposemsg"], "Role " + yourRole + "'s onDeath");
                if (action.has("killRoles") && checkType(action.killRoles, ["array"], "Role " + yourRole + "s onDeath: killRoles")) {
                    for (e in action.killRoles) {
                        this.checkValidRole(action.killRoles[e], "Role " + yourRole + "'s \"onDeath: killRoles\"");
                    }
                }
                if (action.has("killmsg")) {
                    checkType(action.killmsg, ["string"], "Role " + yourRole + "'s onDeath: killmsg");
                }
                if (action.has("poisonRoles") && checkType(action.poisonRoles, ["object"], "Role " + yourRole + "s onDeath: poisonRoles")) {
                    for (e in action.poisonRoles) {
                        this.checkValidRole(e, "Role " + yourRole + "'s \"onDeath: poisonRoles\"");
                        checkType(action.poisonRoles[e], ["number"], "Role " + yourRole + "s onDeath: poisonRoles: " + e);
                    }
                }
                if (action.has("poisonmsg")) {
                    checkType(action.poisonmsg, ["string"], "Role " + yourRole + "'s onDeath: poisonmsg");
                }
                if (action.has("convertRoles") && checkType(action.convertRoles, ["object"], "Role " + yourRole + "s onDeath: convertRoles")) {
                    for (e in action.convertRoles) {
                        this.checkValidRole(e, "Role " + yourRole + "'s \"onDeath: convertRoles\"");
                        this.checkValidRole(action.convertRoles[e], "role " + yourRole + "'s \"onDeath: convertRoles\"");
                    }
                }
                if (action.has("convertmsg")) {
                    checkType(action.convertmsg, ["string"], "Role " + yourRole + "'s onDeath: convertmsg");
                }
                if (action.has("exposeRoles") && checkType(action.exposeRoles, ["array"], "Role " + yourRole + "s onDeath: exposeRoles")) {
                    for (e in action.exposeRoles) {
                        this.checkValidRole(action.exposeRoles[e], "role " + yourRole + "'s \"onDeath: exposeRoles\"");
                    }
                }
                if (action.has("exposemsg")) {
                    checkType(action.exposemsg, ["string"], "Role " + yourRole + "'s onDeath: exposemsg");
                }
            }
            if (role.actions.has("vote")) {
                checkType(role.actions.vote, ["number"], "Role " + yourRole + "s vote");
            }
            if (role.actions.has("voteshield")) {
                checkType(role.actions.voteshield, ["number"], "Role " + yourRole + "'s voteshield");
            }
            for (e in possibleNightActions) {
                if (role.actions.has(possibleNightActions[e])) {
                    command = possibleNightActions[e];
                    action = role.actions[command];
                    if (command == "inspect") {
                        checkAttributes(action, [], ["mode", "revealSide", "revealAs", "msg", "targetmsg", "hookermsg", "count", "poisonDeadMessage", "silent"], "Role " + yourRole + "'s " + command + " mode");
                        if (action.has("revealSide")) {
                            checkValidValue(action.revealSide, [true, false], "Role " + yourRole + " has an \"inspect\" action with an invalid \"revealSide\" value: ~Value~ (~Valid~).");
                        }
                        if (action.has("revealAs")) {
                            if (typeof action.revealAs == "string") {
                                if (action.revealAs !== "*") {
                                    this.checkValidRole(action.revealAs, "role " + yourRole + "'s \"inspect: revealAs\"");
                                }
                            } else if (Array.isArray(action.revealAs)) {
                                for (e in action.revealAs) {
                                    this.checkValidRole(action.revealAs[e], "role " + yourRole + "'s \"inspect: revealAs\"");
                                }
                            }
                        }
                    } else {
                        checkAttributes(action, [], ["mode", "msg", "targetmsg", "hookermsg", "count", "poisonDeadMessage", "silent"], "Role " + yourRole + "'s " + command + " mode");
                    }
                    if (action.has("mode")) {
                        var mode = action.mode;
                        checkType(action.mode, ["string", "object"], "Role " + yourRole + "'s mode for \"" + command + "\"");
                        if (typeof mode == "string") {
                            checkValidValue(mode, ["ignore", "ChangeTarget", "killattacker", "killattackerevenifprotected", "poisonattacker", "poisonattackerevenifprotected"], "Role " + yourRole + "'s " + command + "'s mode has an invalid value: ~Value~ (~Valid~)");
                        } else if (typeof mode == "object") {
                            if (mode.has("evadeChance")) {
                                checkType(mode.evadeChance, ["number"], "Role " + yourRole + "'s \"evadeChance\" for \"" + command + "\"");
                            }
                            if (mode.has("ignore")) {
                                if (checkType(mode.ignore, ["array"], "Role " + yourRole + "'s \"ignore\" for \"" + command + "\" mode")) {
                                    for (e in mode.ignore) {
                                        this.checkValidRole(mode.ignore[e], "Role " + yourRole + "'s \"" + command + ": ignore\"");
                                    }
                                }
                            }
                            if (mode.has("killif")) {
                                if (checkType(mode.killif, ["array"], "Role " + yourRole + "'s \"mode: killif\" for \"" + command + "\"")) {
                                    for (e in mode.killif) {
                                        this.checkValidRole(mode.killif[e], "Role " + yourRole + "'s \"" + command + ": killif\"");
                                    }
                                }
                            }
                        }
                    }
                    if (action.has("msg")) {
                        checkType(action.msg, ["string"], "Role " + yourRole + "'s msg for " + command + "'s mode");
                    }
                    if (action.has("hookermsg")) {
                        checkType(action.hookermsg, ["string"], "Role " + yourRole + "'s hookermsg for " + command + "'s mode");
                    }
                    if (action.has("targetmsg")) {
                        checkType(action.targetmsg, ["string"], "Role " + yourRole + "'s targetmsg for " + command + "'s mode");
                    }
                    if (action.has("poisonDeadMessage")) {
                        checkType(action.poisonDeadMessage, ["string"], "Role " + yourRole + "'s poisonDeadMessage for " + command + "'s mode");
                    }
                    if (action.has("count")) {
                        checkType(action.count, ["number"], "Role " + yourRole + "'s count for " + command + "'s mode");
                    }
                    if (action.has("silent")) {
                        checkValidValue(action.silent, [true, false], "Role " + yourRole + " has an \"" + command + "\" mode with an invalid \"silent\" value: ~Value~ (~Valid~).");
                    }
                }
            }
            if (role.actions.has("daykill") && checkType(role.actions.daykill, ["object", "string"], "Role " + yourRole + "'s daykill attribute")) {
                action = role.actions.daykill;
                checkType(action, ["string", "object"], "Role " + yourRole + "'s \"daykill\" mode");
                if (typeof action == "string") {
                    checkValidValue(action, ["evade", "revenge", "bomb", "revealkiller"], "Role " + yourRole + " has a \"daykill\" action with invalid value: ~Value~ (~Valid~).");
                } else if (typeof action == "object") {
                    checkAttributes(action, ["mode"], [], "Role " + yourRole + "'s \"daykill\" action");
                    if (action.has("mode") && checkType(action.mode, ["object"], "Role " + yourRole + "'s \"daykill\" mode")) {
                        if (action.mode.has("evadeChance")) {
                            checkType(action.mode.evadeChance, ["number"], "Role " + yourRole + "'s \"evadeChance\" for \"daykill\"");
                        }
                    }
                }
            }
            if (role.actions.has("daykillrevengemsg") && checkType(role.actions.daykillrevengemsg, ["string"], "Role " + yourRole + "'s daykillrevengemsg attribute")) {
                if (!role.actions.has("daykill")) {
                    addMinorError("Role " + yourRole + " has a \"daykillrevengemsg\" attribute, but no \"daykill\" attribute.");
                } else {
                    checkType(role.actions.daykillrevengemsg, ["string"], "Role " + yourRole + "'s daykillrevengemsg attribute");
                }
            }
            if (role.actions.has("avoidHax") && checkType(role.actions.avoidHax, ["array"], "Role " + yourRole + "'s avoidHax")) {
                action = role.actions.avoidHax;
                checkType(action, ["array"], "Role " + yourRole + "'s avoidHax action");
                if (Array.isArray(action)) {
                    for (e in action) {
                        checkType(action[e], ["string"], "Role " + yourRole + "'s \"avoidHax on " + action[e] + "\"");
                    }
                }
            }
            if (role.actions.has("initialCondition") && checkType(role.actions.initialCondition, ["object"], "Role " + yourRole + "'s initialCondition attribute")) {
                action = role.actions.initialCondition;
                checkAttributes(action, [], ["poison"], "Role " + yourRole + "'s \"initialCondition\" action");
                if (action.has("poison")) {
                    checkAttributes(action.poison, [], ["count", "poisonDeadMessage"], "Role " + yourRole + "'s \"initialCondition: poison\" action");
                    if (action.poison.has("count")) {
                        checkType(action.poison.count, ["number"], "Role " + yourRole + "'s \"initialCondition: poison\" action");
                    }
                    if (action.poison.has("poisonDeadMessage")) {
                        checkType(action.poison.poisonDeadMessage, ["string"], "Role " + yourRole + "'s \"initialCondition: poison\" action");
                    }
                }
            }
            if (role.actions.has("startup") && checkType(role.actions.startup, ["string", "object"], "Role " + yourRole + "'s startup attribute")) {
                action = role.actions.startup;
                if (typeof action == "string") {
                    checkValidValue(action, ["team-reveal", "role-reveal", "team-reveal-with-roles"], "Role " + yourRole + " has \"startup\" action with invalid value: ~Value~ (~Valid~).");
                } else if (typeof action == "object") {
                    checkAttributes(action, [], ["revealRole", "team-revealif", "revealAs"], "Role " + yourRole + "'s startup attribute");
                    if (action.has("revealAs")) {
                        if (checkType(action.revealAs, ["string"], "Role " + yourRole + "'s \"revealAs\" attribute for \"startup\"")) {
                            this.checkValidRole(action.revealAs, "Role " + yourRole + "'s \"startup: revealAs\"");
                        }
                    }
                    if (action.has("revealRole")) {
                        checkType(action.revealRole, ["string", "array"], "Role " + yourRole + "'s \"revealRole\" attribute for \"startup\"");
                        if (typeof action.revealRole == "string") {
                            this.checkValidRole(action.revealRole, "role " + yourRole + "'s \"startup: revealRole\"");
                        } else if (!Array.isArray(action.revealRole)) {
                            for (e in action.revealRole) {
                                this.checkValidRole(action.revealRole[e], "Role " + yourRole + "'s \"startup: revealRole\"");
                            }
                        }
                    }
                    if (action.has("team-revealif")) {
                        checkType(action["team-revealif"], ["array"], "Role " + yourRole + "'s \"team-revealif\" attribute for \"startup\"");
                        if (Array.isArray(action["team-revealif"])) {
                            for (e in action["team-revealif"]) {
                                this.checkValidSide(action["team-revealif"][e], "Role " + yourRole + " \"startup: team-revealif\" action");
                            }
                        }
                    }
                }
            }
            if (role.actions.has("onlist") && checkType(role.actions.onlist, ["string"], "Role " + yourRole + "'s onlist attribute")) {
                this.checkValidRole(role.actions.onlist, yourRole + "'s \"onlist\" action");
            }
            if (role.actions.has("lynch") && checkType(role.actions.lynch, ["object"], "Role " + yourRole + "'s lynch attribute")) {
                checkAttributes(role.actions.lynch, [], ["revealAs", "convertTo", "convertmsg"], "Role " + yourRole + "s \"lynch\" action");
                if (role.actions.lynch.has("revealAs")) {
                    this.checkValidRole(role.actions.lynch.revealAs, "Role " + yourRole + " \"lynch: revealAs\" action");
                }
                if (role.actions.lynch.has("convertTo")) {
                    this.checkValidRole(role.actions.lynch.convertTo, "Role " + yourRole + " \"lynch: convertTo\" action");
                    if (role.actions.lynch.has("convertmsg")) {
                        checkType(role.actions.lynch.convertmsg, ["string"], "Role " + yourRole + "'s \"convertmsg\" attribute for \"lynch\"");
                    }
                }
            }
        }
    };

    themeProto.checkActions = function () {
        var r, e, i, role, action, night = [],
            roles = this.roles;

        for (r in roles) {
            role = roles[r].actions;
            if (role.has("night")) {
                for (e in role.night) {
                    if (!night.has(e)) {
                        night.push(e);
                    }
                }
            }
        }

        for (r in roles) {
            role = roles[r].actions;
            if (role.has("hax")) {
                for (e in role.hax) {
                    if (!night.has(e)) {
                        addMinorError("Your role \"" + r + "\" gets hax on an inexistent " + e + " action.");
                    }
                }
            }
            if (role.has("avoidHax")) {
                for (e in role.avoidHax) {
                    if (!night.has(role.avoidHax[e])) {
                        addMinorError("Your role \"" + r + "\" avoids hax from an inexistent " + role.avoidHax[e] + " action.");
                    }
                }
            }
        }
    }

    themeProto.isValidSide = function (side) {
        return this.sides.has(side);
    }

    themeProto.isValidRole = function (role) {
        return this.roles.has(role);
    }

    themeProto.checkValidSide = function (side, what) {
        if (!this.isValidSide(side)) {
            addFatalError("An invalid side \"" + side + "\" was found in " + what + ". ");
        }
    }

    themeProto.checkValidRole = function (role, what) {
        if (!this.isValidRole(role)) {
            addFatalError("An invalid role \"" + role + "\" was found in " + what + ". ");
        }
    }

    checkValidValue = function (attr, valid, msg) {
        if (!valid.has(attr)) {
            addMinorError(msg.format(attr, "Valid values are " + valid.join(", ")));
        }
    }

    checkType = function (atr, types, what) {
        if (types.has(typeof atr)) {
            return true;
        }
        if (types.has("array") && Array.isArray(atr)) {
            return true;
        }

        addFatalError(what + " must be a(n) " + readable(types, "or") + ".");
        return false;
    }

    checkAttributes = function (obj, mandatory, optional, what, mainObject) {
        var x, curr;
        if (typeof obj == "object") {
            for (x in mandatory) {
                curr = mandatory[x];
                if (!obj.has(curr)) {
                    addFatalError(what + ' is missing the attribute "' + curr + '".');
                }
            }
            for (e in obj) {
                if (!mandatory.has(e) && !optional.has(e)) {
                    if (!(e.contains("roles") && mainObject)) { // Roles
                        addMinorError(what + ' has an extra attribute "' + e + '".');
                    }
                }
            }
        } else {
            addFatalError(what + ' is not an object.');
        }
    }

    commonNightActions = function (yourRole, action, command) {
        if (action.has("target")) {
            checkValidValue(action.target, ["Any", "Self", "AnyButTeam", "AnyButRole", "AnyButSelf", "OnlySelf"], "Role " + yourRole + "'s night action \"" + command + "\" has a invalid value for \"target\": %1 (%2)");
        }
        if (action.has("common")) {
            checkValidValue(action.common, ["Self", "Team", "Role"], "Role " + yourRole + "'s night action \"" + command + "\" has a invalid value for \"common\": %1 (%2)");
        }
        if (action.has("priority")) {
            checkType(action.priority, ["number"], "Role " + yourRole + "'s attribute \"priority\" for night action \"" + command + "\"");
        }
        if (action.has("broadcast")) {
            checkValidValue(action.broadcast.toLowerCase(), ["none", "team", "role"], "Role " + yourRole + "'s night action \"" + command + "\" has a invalid value for \"broadcast\": %1 (%2)");
        }
        if (action.has("limit")) {
            checkType(action.limit, ["number"], "Role " + yourRole + "'s attribute \"limit\" for night action \"" + command + "\"");
        }
        if (action.has("failChance")) {
            checkType(action.failChance, ["number"], "Role " + yourRole + "'s attribute \"failChance\" for night action \"" + command + "\"");
        }
        if (action.has("recharge")) {
            checkType(action.recharge, ["number"], "Role " + yourRole + "'s attribute \"recharge\" for night action \"" + command + "\"");
        }
        if (action.has("initialrecharge")) {
            checkType(action.initialrecharge, ["number"], "Role " + yourRole + "'s attribute \"initialrecharge\" for night action \"" + command + "\"");
        }
        if (action.has("broadcastmsg")) {
            checkType(action.broadcastmsg, ["string"], "Role " + yourRole + "'s attribute \"broadcastmsg\" for night action \"" + command + "\"");
        }
    }

    loadTheme = function (content) {
        var json, x, y, roleList, cantLose, errorsFound = false,
            theme;
			resetErrorMessages();
        try {
            json = JSON.parse(content);
            setStatus("Theme parsed", STATUS_RESET);
        } catch (err) {
            fatal("Could not parse JSON.<br/>You might want to hone your syntax with <a href='http://jsonlint.com'>JSONLint</a>", STATUS_RESET);
            return;
        }
        theme = new Theme();

        try {
            checkAttributes(json, ["name", "sides", "roles", /*"roles1"*/ ], ["villageCantLoseRoles", "author", "summary", "border", "killmsg", "killusermsg", "lynchmsg", "drawmsg"], "Your theme", true);

            // Init from the theme
            for (x in json.sides) {
                theme.addSide(json.sides[x]);
            }
            for (x in json.roles) {
                theme.addRole(json.roles[x]);
            }

            x = 1;
            while (json.has("roles" + x)) {
                roleList = json["roles" + x];
                for (y in roleList) {
                    if (!theme.isValidRole(roleList[y])) {
                        addFatalError("Your \"roles" + i + "\" list has an invalid role \"" + roleList[y] + "\".");
                    }
                }
                x++;
            }

            if (!json.roles1) {
                addFatalError("This theme has no roles1, it can not be played.");
            }

            if (json.has("villageCantLoseRoles")) {
                cantLose = json.villageCantLoseRoles;
                for (x in cantLose) {
                    if (!theme.isValidRole(cantLose[x])) {
                        addFatalError("Your \"villageCantLoseRoles\" list contains an invalid role \"" + cantLose[x] + "\".");
                    }
                }
            }

            theme.addActions();
            theme.checkActions();
        } catch (err) {
            fatal("Couldn't check the entire code. The following error has occured: " + err);
        }

        println("");
        if (!fatalErrors.isEmpty()) {
            errorsFound = true;
            fatal("Fatal errors found in your theme:");

            printErrors(fatalErrors);
        }
        else {
            println("No fatal errors found in your theme. Good job!");
        }

        println("");
        if (!minorErrors.isEmpty()) {
            errorsFound = true;
            minor("Minor errors found in your theme:");

            printErrors(minorErrors);
        } else {
            println("No minor errors found in your theme.");
        }

        if (!errorsFound) {
            println("");
            println("No errors found! Your theme should work.");
        }

        resetErrors();

        println("");
    }

    checkTheme = function () {
        var textarea = $("textarea"),
            button = $("input");
        loadTheme(textarea.val());

        textarea.fadeOut("slow");
        button.fadeOut("slow");

        setTimeout(function () {
            textarea.fadeIn("slow");
            button.fadeIn("slow");
        }, 2800);
    }

})();