RoleLists = {}; // Helper
CurrentRoleList = -1; // Helper

Modules["RoleLists"] = {
    init: function () {
        initButton("NewRoleList", function () {
            Modules.RoleLists.createNewRoleList();
        });
        initButton("RemoveRoleList", function () {
            Modules.RoleLists.removeCurrentRoleList();
        });

        var that = this;
        
        $("#RoleList-Select").change(function (event) {
            var value = event.currentTarget.value;
            if (value !== "null") {
                Modules.RoleLists.switchToList(value);
            } else {
                $("#RemoveRoleList").addClass("invisible");
                $("#RoleList-List").html("");
                CurrentRoleList = -1;
            }
        }).each(function () {
            that.each($(this));
        });
    },
    switchToList: function (name) {
        $("#RemoveRoleList").removeClass("invisible");
        CurrentRoleList = name;

        $("#RoleList-List").html(this.listHtml());
    },
    each: function (element) {
        element.select(function () {
            setTimeout(function () {
                var $input = $("#RoleListInput"),
                    old = this._eachArgs.old,
                    current = this._eachArgs.current || CurrentRoleList;
                
                if (RoleLists[old]) {
                    RoleLists[old] = ($input.val() || "").split("\n");
                }
                
                if (RoleLists[current]) {
                    $input.val(RoleLists[current].join("\n"));
                }
                
                this._eachArgs = {};
            }, 1);
        });
    },
    _eachArgs: {},
    addRoleList: function () {
        var name = "roles" + (RoleLists.length() + 1), 
            oldname = "roles" + (RoleLists.length()),
            that = this,
            oldRoleList;

        $("#RoleList-Select")
            .append("<option value='" + name + "' id='RoleList-Select-" + name + "'>" + name + "</option>")
            .find("#RoleList-Select-" + name, function () {
                that.each($(this));
            });
        
        RoleLists[name] = [];

        if (RoleLists[oldname]) {
            RoleLists[name] = RoleLists[oldname];
        }
        CurrentRoleList = name;
        this._eachArgs = {old: oldRoleList, current: CurrentRoleList};
    },
    createNewRoleList: function () {
        this.addRoleList();

        $("#RoleList-Select-OptionDefault").attr("selected", "unselected");
        $("#RoleList-Select-" + CurrentRoleList).attr("selected", "selected");

        this.switchToList(CurrentRoleList); // Fix
    },
    removeCurrentRoleList: function () {
        if (CurrentRoleList === -1) {
            dialog("Remove Role List", "No role list selected.", "warning-sign"); // Invalid behavior, but still.
        } else {
            delete RoleLists[CurrentRoleList];
            delete Theme[CurrentRoleList];

            $("#RoleList-List").html("");
            $("#RoleList-Select-" + CurrentRoleList).remove();
            $("#RoleList-Select-OptionDefault").attr("selected", "selected");
            $("#RemoveRoleList").addClass("invisible");

            CurrentRoleList = -1;
        }
    },
    listHtml: function () {
        var list = RoleLists[CurrentRoleList];
        if (!list) {
            list = [];
        }

        return '<i>Specify a list of proto roles here, separated with a new line</i><br/><textarea rows="15" cols="80" id="RoleListInput">' + list.join("\n") + '</textarea>';
    },
    setValues: function () {
        var x;
        
        if (CurrentRoleList) {
            RoleLists[CurrentRoleList] = ($("#RoleListInput").val() || "").split("\n");
        }
        
        for (x in RoleLists) {
            Theme[x] = RoleLists[x];
        }
    },
    loadValues: function () {
        var $options = $("#RoleList-Select"), i = 1;

        while (Array.isArray(Theme["roles" + i])) {
            if (!$("#RoleList-Select-roles" + i).length) {
                $options.append("<option value='roles" + i + "' id='RoleList-Select-roles" + i + "'>roles" + i + "</option>");
            }
            RoleLists["roles" + i] = Theme["roles" + i];
            i++;
        }
    },
    onImport: function () {
        var length = RoleLists.length();
        RoleLists = {}; // Fix for some weird behavior

        $("#RoleList-Select").html('<option value="null" selected="selected" id="RoleList-Select-OptionDefault">Select a side to edit</option>'); // Should fix a few bugs
        $("#RoleList-List").html("");

        while (length != 0) {
            $('#RoleList-Select-roles' + length).remove();
            length--;
        }
        $("#RoleList-Select-OptionDefault").attr("selected", "selected");
        $("#RemoveRoleList").addClass("invisible");

        CurrentRoleList = -1;
    }
};
