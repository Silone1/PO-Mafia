Modules["Global"] = {
    add: function (name, id, propName, tooltip) {
        if (arguments.length === 2) {
            tooltip = id;
            id = name;
            propName = id.toLowerCase();
        } else if (arguments.length === 3) {
            tooltip = propName;
            propName = id.toLowerCase();
        }

        $("#Globals-List").append("<li><span class='button-span' title=\"" + tooltip + "\">" + name + ":</span> <br/> <input type='text' id=\"Theme-" + id + "\" name=\"" + propName + "\" title=\"" + tooltip + "\" size='20'></li>");
    },
    set: function (id, text, hook) {
        if (text) {
            if (hook) {
                text = hook(text);
            }
            $("#Theme-" + id).val(text);
        }
    },
    addCheckbox: function (name, id, tooltip, callback) {
        addCheckbox("Globals-List", name, "Theme-" + id, tooltip, callback);
    },
    setCheckbox: function (id, enabled) {
        var checked = "Enabled";

        if (!enabled) {
            checked = "Disabled";
        }

        $("#Theme-" + id).text(checked);
    },
    init: function () {
        /* Add buttons */
        this.add("Name", "Your theme's name");
        this.add("Author", "Your theme's author(s)");
        this.add("Border", "Your theme's border");

        this.add("Kill Message", "KillMsg", "Your theme's kill message");
        this.add("Kill User Message", "KillUserMsg", "Your theme's kill message sent to the player who died");
        this.add("Lynch Message", "LynchMsg", "Your theme's lynch message");
        this.add("Draw Message", "DrawMsg", "Your theme's draw message");

        this.add("Village Can't Lose Roles", "VillageCantLoseRoles", "villageCantLoseRoles", "Your theme's villageCantLoseRoles (roles that can be a tiebreaker if any other side has more players alive for side 'village')");

        this.addCheckbox("No Lynching", "NoLynch", "If the voting phase is enabled");
        this.addCheckbox("Vote Sniping", "VoteSniping", "If lynch sniping is enabled");
        this.addCheckbox("Silent Vote", "SilentVote", "If player who are voted against names will be NOT be seen");

        addSlider("Globals-List", "Minimum Players", "MinPlayers", "Your theme's minimum players requirement", {"min": 3, "max": 50, "value": 5}, function (val) {
            setProp(Theme, "minplayers", val);
        });

        addSlider("Globals-List", "Ticks - Night", "Ticks-Night", "Your theme's ticks for phase 'night'", {"min": 1, "max": 60, "value": 30}, function (val) {
            if (!Theme.ticks) {
                Theme.ticks = {};
            }

            setProp(Theme.ticks, "night", val);
        });

        addSlider("Globals-List", "Ticks - Standby", "Ticks-Standby", "Your theme's ticks for phase 'standby'", {"min": 1, "max": 60, "value": 30}, function (val) {
            if (!Theme.ticks) {
                Theme.ticks = {};
            }

            setProp(Theme.ticks, "standby", val);
        });

        /* Initialize Auto Completer */
        initAutoCompleter("Theme-KillMsg", ["~Player~", "~Role~", "±Game:", "***"]);
        initAutoCompleter("Theme-LynchMsg", ["~Player~", "~Role~", "~Side~", "~Count~", "±Game:", "***"]);
        initAutoCompleter("Theme-KillUserMsg", ["±Game:", "***"]);
        initAutoCompleter("Theme-DrawMsg", ["±Game:", "***"]);
    },
    setValues: function () {
        set("Name");
        set("Author", Hooks.StringToArray);
        set("Summary");
        set("Border");

        set("KillMsg");
        set("KillUserMsg");
        set("LynchMsg");
        set("DrawMsg");

        setFromCheckbox("NoLynch", Theme, "nolynch");
        setFromCheckbox("VoteSniping", Theme, "votesniping");
        setFromCheckbox("SilentVote", Theme, "silentVote");

        setSliderValue("MinPlayers", null, "minplayers");

        set("VillageCantLoseRoles", Hooks.String2Array);

        if (!Theme.has("ticks")) {
            Theme.ticks = {};
        }

        setSliderValue("Ticks-Night", Theme.ticks, "night");
        setSliderValue("Ticks-Standby", Theme.ticks, "standby");
    },
    loadValues: function () {
        this.set("Name", Theme.name);
        this.set("Author", Theme.author, Hooks.ArrayToString);
        this.set("Summary", Theme.summary);
        this.set("Border", Theme.border);

        this.set("KillMsg", Theme.killmsg);
        this.set("KillUserMsg", Theme.killusermsg);
        this.set("LynchMsg", Theme.lynchmsg);
        this.set("DrawMsg", Theme.drawmsg);

        this.set("VillageCantLoseRoles", Theme.villageCantLoseRoles, Hooks.ArrayToString);

        this.setCheckbox("NoLynch", Theme.nolynch);
        this.setCheckbox("VoteSniping", Theme.votesniping);
        this.setCheckbox("SilentVote", Theme.silentVote);

        setSliderData("MinPlayers", Theme.minplayers);

        if (Theme.has("ticks")) {
            setSliderData("Ticks-Night", Theme.ticks.night);
            setSliderData("Theme-Standby", Theme.ticks.standby);
        }

    }
};