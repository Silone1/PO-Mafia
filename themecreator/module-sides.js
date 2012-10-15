Sides = {}; // Helper
CurrentSide = -1; // Helper

Modules["Sides"] = {
    init: function () {
        initButton("NewSide", function () {
            Modules.Sides.createNewSide();
        });
        initButton("RemoveSide", function () {
            Modules.Sides.removeCurrentSide();
        });

        $("#Sides-Select").change(function (event) {
            var value = event.currentTarget.value;
            if (value !== "null") {
                Modules.Sides.switchToSide(value);
            } else {
                $("#RemoveSide").addClass("invisible");
                $("#Sides-List").html("");
                CurrentSide = -1;
            }
        });
    },
    switchToSide: function (name) {
        $("#RemoveSide").removeClass("invisible");
        CurrentSide = name;

        $("#Sides-List").html(this.sideHtml());
        this.manipulateHtml();
    },
    addSide: function () {
        var $options = $("#Sides-Select");

        if (!Sides.Unnamed) {
            $options.append("<option value='Unnamed' id='Sides-Select-Unnamed'>Unnamed</option>");
        }

        Sides.Unnamed = {"side": "Unnamed", "translation": "Unnamed"};
    },
    createNewSide: function () {
        this.addSide();

        $("#Sides-Select-OptionDefault").attr("selected", "unselected");

        $("#Sides-Select-Unnamed").attr("selected", "selected");
        this.switchToSide("Unnamed"); // Fix
    },
    removeCurrentSide: function () {
        if (CurrentSide === -1) {
            dialog("Remove Side", "No side selected.", "warning-sign"); // Invalid behavior, but still.
        } else {
            delete Sides[CurrentSide];

            $("#Sides-List").html("");
            $("#Sides-Select-" + CurrentSide).remove();
            $("#Sides-Select-OptionDefault").attr("selected", "selected");
            $("#RemoveSide").addClass("invisible");

            CurrentSide = -1;
        }
    },
    sideHtml: function () {
        var side = Sides[CurrentSide];
        if (!side) {
            side = {};
        }
        if (!side.side) {
            side.side = "Unnamed";
        }
        if (!side.translation) {
            side.translation = "Unnamed";
        }
        if (!side.winmsg) {
            side.winmsg = "±Game: ";
        }

        var ret = "<ul>";

        ret += "<li><span class='button-span' title=\"Your side's proto side. village is special for villageCantLoseRoles\">Proto Side:</span> <br/> <input type='text' id=\"Side-ProtoSide\" title=\"Your side's proto side. village is special for villageCantLoseRoles\" size='20' value='" + side.side + "'> </li>";

        ret += "<li><span class='button-span' title=\"Your side's translation sent in-game\">Translation:</span> <br/> <input type='text' id=\"Side-Translation\" title=\"Your side's translation sent in-game\" size='20' value='" + side.translation + "'> </li>";

        ret += "<li><span class='button-span' title=\"Your side's win message\">Win Message:</span> <br/> <input type='text' id=\"Side-WinMsg\" title=\"Your side's win message\" size='20' value='" + side.winmsg + "'> </li>";

        ret += "</ul>";

        return ret;
    },
    manipulateHtml: function () {
        // Different approach here for the better
        $("#Side-ProtoSide").change(function (event) {
            Sides[CurrentSide].side = event.currentTarget.value;
        });

        $("#Side-Translation").change(function (event) {
            var val = event.currentTarget.value, oldSide = Sides[CurrentSide], oldProp;

            delete Sides[CurrentSide];

            oldProp = $("#Sides-Select-" + CurrentSide);
            CurrentSide = val;

            oldProp.attr("value", CurrentSide).attr("id", "Sides-Select-" + CurrentSide).text(CurrentSide);

            Sides[CurrentSide] = oldSide;
            Sides[CurrentSide].translation = val;
        });

        $("#Side-WinMsg").change(function (event) {
            Sides[CurrentSide].winmsg = event.currentTarget.value;
        });

        initAutoCompleter("Side-WinMsg", ["±Game:", "~Players~", "***"], null, function (value) {
            Sides[CurrentSide].winmsg = value;
        })
    },
    setValues: function () {
        var result = [], x, curr, obj, hadSides = false;
        for (x in Sides) {
            curr = Sides[x];
            obj = {"side": curr.side, "translation": curr.translation};

            if (curr.has("winmsg")) {
                obj.winmsg = curr.winmsg;
            }

            result.push(obj);
            hadSides = true;
        }

        if (!hadSides) {
            return;
        }

        Theme.sides = result;
    },
    loadValues: function () {
        var x, sides, curr, $options = $("#Sides-Select");
        if (!Theme.sides) {
            return;
        }

        sides = Theme.sides;

        for (x in sides) {
            curr = sides[x];
            if (Sides[curr.translation]) {
                continue;
            }

            Sides[curr.translation] = {"side": curr.side, "translation": curr.translation};

            if (curr.winmsg) {
                Sides[curr.translation].winmsg = curr.winmsg;
            }

            $options.append("<option value='" + curr.translation + "' id='Sides-Select-"+ curr.translation +"'>" + curr.translation + "</option>");
        }
    },
    onImport: function () {
        Sides = {}; // Fix for some weird behavior

        $("#Sides-Select").html('<option value="null" selected="selected" id="Sides-Select-OptionDefault">Select a side to edit</option>'); // Should fix a few bugs
        $("#Sides-List").html("");
        $("#Sides-Select-" + CurrentSide).remove();
        $("#Sides-Select-OptionDefault").attr("selected", "selected");
        $("#RemoveSide").addClass("invisible");

        CurrentSide = -1;
    }
};