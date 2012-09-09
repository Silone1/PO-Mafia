(function() {

    /* sides : Array of objects, {side: str, translation: str}
     * roles: Array of objects, 
     * roles1, roles2: Array of strings
     * villageCantLoseRoles: Array of strings
     * name: str
     * author: str
     * killmsg: str
     * killusermsg: str
     */


	function setText (msg) {
	$("#message").text(msg);
	}
	
    function isRole(r) {
        for (var i = 0; i < theme.roles.length; ++i) {
            if (theme.roles[i].role == r) return true;
        }
        return false;
    }

    function buildThemeFromUrl(url) {
        getTheme(url, function(resp) {
		setText(resp);
            try {
                theme = JSON.parse(resp);
                buildUI(theme);
            } catch(e) {
                //$("#message").text("Error: "+e);
            }
			setText("Theme loaded.");
        })
    }

    function getTheme(url, callback) {
	setText("Loading theme..");
       $.get(url, callback); 
    }

    function warnUnknownRoles(arr) {
        var warn_roles = [];
        for (var i = 0; i < arr.length;/* omit increase */) {
            var role = arr[i];
            if (!isRole(role)) {
               if (role != "")
                   warn_roles.push(role); 
               arr.splice(i,1);
            } else ++i;
        }
        return warn_roles;
    }
    function displayDialogWarning() {
        if (!warn_roles.length == 0) {
            $("#dialog p").html('I found some unknown roles from the villageCantLoseList:<br><b>'+warn_roles.join(", ")+'</b><br>Please add only correct roles, I have removed these for you.');
            $("#dialog").dialog("option", "title", "Unknown roles").dialog("open");
            $("#center-content input[name=villageCantLoseRoles]").attr("value",theme.villageCantLoseRoles ? theme.villageCantLoseRoles.join(", ") : "")
        }
    }

    function buildGlobal() {
        $("#mid-title").text("Editing theme globals");
        $("#center-content").html('');
        $("#center-content").append("<label for='name'>Theme name</label><input type='text' name='name'><label for='author'>Theme Author</label><input type='text' name='author'><br><label for='killmsg' title='~Player~ is replaced by the player name, and ~Role~ by the role of the death player.'>Message to be displayed when someone dies</label><input type='text' name='killmsg'><br><label for='killusermsg' title='This message is displayed to user when they die.'>Message to be displayed to death player</label><input type='text' name='killusermsg'><br><label for='villageCantUseRoles' title='Usually if there are two teams, mafia and village, mafia wins when it has more players. If you input any roles here, they prevent this situation from happening (they have to be killed off first)'>Roles which allow village to win in a tie situation</label><input type='text' name='villageCantLoseRoles'>");
        $("#center-content input[name=name]").attr("value",theme.name ? theme.name : "").change(function(event) {
            theme.name = event.currentTarget.value;
            $("#message").text("Editing - " + theme.name + " by " + theme.author) 
        });
        $("#center-content input[name=author]").attr("value",theme.author ? theme.author : "you").change(function(event) {
            theme.author = event.currentTarget.value;
            $("#message").text("Editing - " + theme.name + " by " + theme.author) 
        });
        $("#center-content input[name=killmsg]").attr("value",theme.killmsg ? theme.killmsg : "").change(function(event) {
            theme.killmsg = event.currentTarget.value;
        });
        $("#center-content input[name=killusermsg]").attr("value",theme.killusermsg ? theme.killusermsg : "").change(function(event) {
            theme.killusermsg = event.currentTarget.value;
        });
        $("#center-content input[name=villageCantLoseRoles]").attr("value",theme.villageCantLoseRoles ? theme.villageCantLoseRoles.join(", ") : "").change(function(event) {
            theme.villageCantLoseRoles = event.currentTarget.value.split(/\s*,\s*/);
            var warn_roles = warnUnknownRoles(theme.villageCantLoseRoles);
            if (warn_roles.length == 0) {
                $("#dialog p").html('I found some unknown roles from the villageCantLoseList:<br><b>'+warn_roles.join(", ")+'</b><br>Please add only correct roles, I have removed these for you.');
                $("#dialog").dialog("option", "title", "Unknown roles").dialog("open");
                $("#center-content input[name=villageCantLoseRoles]").attr("value",theme.villageCantLoseRoles ? theme.villageCantLoseRoles.join(", ") : "")
            }
        });
    }

    function buildSide(index) {
        var side = theme.sides[index];
        $("#mid-title").text("Editing role: " + side.translation);
        $("#center-content").html('');
        $("#center-content").append("<label title='If you type here exactly village you can use villageCantLoseRoles to not make the game end when there are two equal size teams remaining.' for='side'>Side id</label><input type='text' name='side'><label for='translation'>Side name</label><input type='text' name='translation'>");
        $("#center-content input[name=side]").attr("value",side.side).change(function(event) {
            side.side = event.currentTarget.value;
        });
        $("#center-content input[name=translation]").attr("value",side.translation).change(function(event) {
            side.translation = event.currentTarget.value;
            $("#sides option:selected").text(side.translation);
        });
    }

    /* 
Role definition:

role: id
translation: displayed name
side: "side_id" | {random: {side_id: chance, side_id2: chance2}}
help: help message shown at start
actions: object, see below
     
Possible action keys for a role

night: {night-action}
standby: {standby-action}
vote: number
avoidHax: [command, or_commandAlias]
kill: {mode: "ignore" | "killattacker", msg: str optional}
hax: {command: {}, ...]
inspect: {revealAs: role_id}
distract: {mode: "ChangeTarget" | "ignore" | {"ignore": role_id | [role_id, ...]} | killif: [role_id, ...] , hookermsg: str, msg: str} - msg has ~Distracter~ to reveal role
startup: {revealAs: role_id_for_miller} | "team-reveal" | {team-revealif: [side_id1, ...]} | role-reveal | {revealRole: role_id}
inspectMode: {revealAs: role_id, revealSide: side_id}

night-action: one of: kill, poison, protect, inspect, distract, safeguard as action
standby-action: one of: kill as action
phase-action: { limit: number optional, command: real_command_name, common: 'Role' | 'Team' }

*/

    var theme, layout;
    function buildRole(index) {
        var role = theme.roles[index];
        $("#mid-title").text("Editing role: " + role.translation);
        $("#center-content").html('');
        $("#center-content").append("<label for='role'>Role id</label><input type='text' name='role'><label for='translation'>Role name</label><input type='text' name='translation'><br><label for='help' title='This message is displayed at the player at the start of the game.'>Role help</label><input type='text' name='help'><br><label for='side' title='Choose role side'>Role side</label><select name='side'></select><input type='checkbox' name='random_side'>Random side<br><label for='actions'>Role actions</label><input type='checkbox' name='actions_distract'>Special behaviour when distracted: <select name='distract_select'><option value='ignore'>Role is not affected by distract</option><option value='ChangeTarget'>Role kills the one distracting</option><option value='ignoreif'>Ignore if distracter is..</option><option value='killif'>Kill distracter if they are..</option></select><span id='distract-exception-roles'></span><button name='action-distract-set-roles'>Set roles</button>");
        $("#center-content input[name=role]").attr("value",role.role).change(function(event) {
            role.role = event.currentTarget.value;
        });
        $("#center-content input[name=translation]").attr("value",role.translation).change(function(event) {
            role.translation = event.currentTarget.value;
            $("#roles option:selected").text(role.translation);
        });
        $("#center-content input[name=help]").attr("value",role.help).change(function(event) {
            role.help = event.currentTarget.value;
        });
        theme.sides.forEach(function(s) {
            $("#center-content select[name=side]").append("<option name='"+s.side+"'" + (s.side == role.side ? " selected='selected'" : "") + ">" + s.translation + "</option>");
        });
        if (typeof role.side == 'object') {
            if (typeof role.side.random == 'object') {
                $('#center-content select[name=side]').attr("disabled","disabled");
                $("#center-content input[name=random_side]").attr("value", "1").after(JSON.stringyfy(role.side.random));
            } else {
                $('#center-content select[name=side]').removeAttr("disabled");
            }
        }
        $("#center-content select[name=side]").change(function(event) {
            role.side = $("#center-content select option:selected").attr("name");
        });
        /* Actions: starting from distract */
        if (typeof role.actions.distract == 'object') {
            $("#center-content input[name=actions_distract]").attr("checked","checked");
            if (role.actions.distract.mode == "ignore" || role.actions.distract.mode == "ChangeTarget") {
                $("#center-content select[name=distract_select] option[value="+role.actions.distract.mode+"]").attr("selected","selected");
                $("button[name=action-distract-set-roles]").attr("disabled","disabled")
            } else if (typeof role.actions.distract.mode == 'object') {
                if (role.actions.distract.mode.hasOwnProperty("ignore")) {
                    $("#center-content select[name=distract_select]").value = "ignoreif";
                    $("button[name=action-distract-set-roles]").removeAttr("disabled");
                    $("#distract-exception-roles").text(role.actions.distract.mode.ignore > 0 ? role.actions.distract.mode.ignore.join(", ") : "none");
                    $("#center-content select[name=distract_select] option[value=ignoreif]").attr("selected","selected");
                } else if (role.actions.distract.mode.hasOwnProperty("killif")) {
                    $("#center-content select[name=distract_select]").value = "killif";
                    $("button[name=action-distract-set-roles]").removeAttr("disabled");
                    $("#distract-exception-roles").text(role.actions.distract.mode.killif > 0 ? role.actions.distract.mode.killif.join(", ") : "none");
                    $("#center-content select[name=distract_select] option[value=killif]").attr("selected","selected");
                }
            }
        } else {
            $("#center-content input[name=actions_distract]").removeAttr("checked");
            $("#center-content select[name=distract_select]").attr("disabled","disabled");
            $("button[name=action-distract-set-roles]").attr("disabled","disabled");
        }
        $("#center-content input[name=actions_distract]").change(function(event) {
            $("#center-content select[name=distract_select]").val("ignore");
            if ($(this).attr("checked") == "checked") {
                $("#center-content select[name=distract_select]").removeAttr("disabled");
                role.actions.distract = {mode: "ignore"};
            } else {
                $("#center-content select[name=distract_select]").attr("disabled","disabled");
                $("button[name=action-distract-set-roles]").attr("disabled","disabled");
                delete role.actions.distract;
            }
        });
        function arrayChecker(object, array, sel) {
            return function(event) {
                object[array] = $("#dialog input[name=role-list]").val().split(/\s*,\s*/);
                var warn_roles = warnUnknownRoles(object[array]);
                $(this).dialog("close");
                if (warn_roles.length != 0) {
                    $("#dialog p").html('I found some unknown roles from the given list:<br><b>'+warn_roles.join(", ")+'</b><br>Please add only correct roles, I have removed these for you.');
                    $("#dialog").dialog("option", "title", "Unknown roles").dialog("option","buttons",{Ok: function(){$(this).dialog("close")}}).dialog("open");
                }
                $("#distract-exception-roles").text(object[array].length > 0 ? object[array].join(", ") : "none");
            }
        } 
        $("#center-content select[name=distract_select]").change(function(event) {
            if (event.currentTarget.value == "ignore" || event.currentTarget.value == "ChangeTarget") {
                role.actions.distract.mode = event.currentTarget.value;
                $("button[name=action-distract-set-roles]").attr("disabled","disabled");
                $("#distract-exception-roles").text("");
            } else if (event.currentTarget.value == 'killif') {
                $("button[name=action-distract-set-roles]").removeAttr("disabled").unbind('click').bind('click', function(event) {
                    $("#dialog").dialog("option", "title", "Roles to ignore when they are distracting")
                                .dialog("option", "buttons", {Ok: arrayChecker(role.actions.distract.mode, "killif"), Cancel: function(){$(this).dialog('close')}})
                                .dialog("open");
                    $("#dialog input[name=role-list]").val(role.actions.distract.mode.killif.join(", "));
                });
                role.actions.distract.mode = {killif: []};
                $("#distract-exception-roles").text("none");
            } else if (event.currentTarget.value == 'ignoreif') {
                $("button[name=action-distract-set-roles]").removeAttr("disabled").unbind('click').bind('click', function(event) {
                    $("#dialog p").html("<label for='role-list'>Roles sepearted by comma</label><input type='text' name='role-list'>");
                    $("#dialog").dialog("option", "title", "Roles to kill when they are distracting")
                                .dialog("option", "buttons", {Ok: arrayChecker(role.actions.distract.mode, "ignore"), Cancel: function(){$(this).dialog('close')}})
                                .dialog("open");
                    $("#dialog input[name=role-list]").val(role.actions.distract.mode.ignore.join(", "));
                });
                role.actions.distract.mode = {ignore: []};
                $("#distract-exception-roles").text("none");
            }
        });
        $("#center-content").append('')
    }

    function buildRolesListing() {
        $("#rolelists").html("");
        $("#mid-title").text("Editing rolelists");
        $("#center-content").html('');
        var ri = 1;
        while (theme.hasOwnProperty("roles"+ri)) {
            $("#rolelists").append("<button id='edit-rolelist"+ri+"' class='edit-rolelist'>Edit roles" + ri + "</button><button id='delete-rolelist"+ri+"' class='delete-rolelist'>Delete</button><br>");
			ri++;
        }
        $("#rolelists").append("<button id='add-rolelist" +ri+ "' class='add-rolelist'>Add roles" + ri + "</button><br>");
    }

    function buildEditRoles(event) {
        // hackish: extract from id 
        var ri = parseInt(event.target.id.substr(13));
        var roles = theme["roles"+ri];

        $("#mid-title").text("Editing : roles" + ri);
        $("#center-content").html("");
        $("#center-content").append("<div id='role-list-editor'></div>");
        var index1 = 1;
        roles.forEach(function(role1) { 
            $("#role-list-editor").append("<p>" + index1 + ". <select></select></p>");
            var index2 = 0;
            var select_elem = $("#role-list-editor select").last();
            select_elem.change(function(i1, i2){ return function(event) { roles[i1] = theme.roles[event.target.value].role; } }(index1-1));
            theme.roles.forEach(function(role2) { 
                select_elem.append("<option value='" + index2 + "'"+(role1 == role2.role ? " selected='selected'" : "")+">" + role2.translation + "</option>");
                ++index2;
            })
            ++index1;
        })
        $('#role-list-editor').append("<br><button id='pop-role'>Remove last</button><button id='push-role'>Add new role</button><br>")
        $("#push-role").click(function() {
            roles.push(theme.roles[0]);
            $("#pop-role").prev().before("<p>" + roles.length + ". <select></select></p>");
            var index = 0;
            var select_elem = $("#role-list-editor select").last();
            select_elem.change(function(i1, i2){ return function(event) { roles[i1] = theme.roles[event.target.value].role; } }(roles.length-1));
            theme.roles.forEach(function(role) {
                select_elem.append("<option value='" + index + "'>" + role.translation + "</option>");
                ++index;
            });
        });
        $("#pop-role").click(function() {
            roles.pop();
            $("#pop-role").prev().prev().remove();
        });

        $("button").button();
    }

    function deleteRoles(event) {
        // hackish: extract from id 
        var ri = parseInt(event.target.id.substr(15));

        if (theme.hasOwnProperty("roles"+ri)) {
            delete theme["roles"+ri];    
            while (theme.hasOwnProperty("roles"+(1+ri))) {
                theme["roles"+ri] = theme["roles"+(ri+1)];
                delete theme["roles"+(++ri)];
            }
            /* rebuild */
            buildRolesListing();
            $("button").button();
        }
    }

    function addRoles(event) {
        // hackish: extract from id 
        alert(event.target.id);
        var ri = parseInt(event.target.id.substr(12));

        theme["roles"+ri] = ri > 1 ? theme["roles"+(ri-1)].slice() : [];
        $add_rolelist = $("#add-rolelist"+ri);
        $add_rolelist.before("<button id='edit-rolelist"+ri+"' class='edit-rolelist'>Edit roles" + ri + "</button><button id='delete-rolelist"+ri+"' class='delete-rolelist'>Delete</button><br>");
        // prepare for next add roles
        var nr = ri+1;
        $add_rolelist.text("Add roles"+nr).attr("id", "add-rolelist"+nr);

        $("button").button();
    }

	function showSource(event) {
	$("#source").text(JSON.stringify(theme));
	}
	
    function buildUI(theme) {
       $("#message").text("Editing - " + theme.name + " by " + theme.author);

       /* Setup Teams */
       $("#teamlisting").after("<select id='sides'></select><br><button name='removerole'>Remove side</button><br><button name='addrole'>Add new side</button>")
       $("#sides").append("<option value='null' selected='selected'>Select a side to edit</option>");
       var index = 0;
       theme.sides.forEach(function(side) { 
           $("#sides").append("<option value='" + (index++) + "'>" + side.translation + "</option>");
       })

       $("#sides").change(function(event) {
           buildSide(event.currentTarget.value)
           $("#accordion").accordion().resizable();
       });

       /* Setup Roles */
       $("#rolelisting").after("<select id='roles'></select><br><button name='removerole'>Remove role</button><br><button name='addrole'>Add new role</button>")
       $("#roles").append("<option value='null' selected='selected'>Select a role to edit</option>")
       index = 0;
       theme.roles.forEach(function(role) { 
           $("#roles").append("<option value='" + (index++) + "'>" + role.translation + "</option>")
       })

       $("#roles").change(function(event) {
           buildRole(event.currentTarget.value)
           $("#accordion").accordion().resizable();
       });

       /* Setup role lists */
       $("#rolelists").on("click", "button.edit-rolelist", buildEditRoles);
       $("#rolelists").on("click", "button.delete-rolelist", deleteRoles);
       $("#rolelists").on("click", "button.add-rolelist", addRoles);
       buildRolesListing();
	   
	   $("#source").on("click", "button.show-source", showSource);
       $("#source").append("<button id='show-source' class='show-source'>Show Source</button><br>");

       /* Resize accordion */
       $("#accordion").accordion().resizable();
       /* Display global options */
       buildGlobal();

       $("body").before("<div id='dialog' title='Message'><p></p></div>");
       $("#dialog").dialog({autoOpen: false});

       /* style buttons */
       $("button").button();
    }

    $(document).ready(function() {
        layout = $('body').layout({
            west__size: 300,
	    west__onresize: $.layout.callbacks.resizePaneAccordions
        });
		
        $("#accordion").accordion({
            fillSpace: true,
            change: function(event, ui) {
                $("#mid-title").text("Editing " + ui.newHeader.text().toLowerCase());
                if (ui.newHeader.text() == "Theme globals")
                    buildGlobal();
                else
                    $("#center-content").html('');
            }

        });
        $("#message").text("Loaded");
        buildThemeFromUrl("default-old.json");
    });
}())
