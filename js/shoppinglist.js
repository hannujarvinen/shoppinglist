var listid = null;
var listname = null;
var database = null;
var initializing = true;
$(document).on("domChanged", function () {
    putDB(listid);
    $("div.itemtext").off("click");
    $("div.item").off("swipeleft");
    $("div.item").off("swiperight");
    $("span.ctrl").off("click");
    $("div.itemtext").on("click", function () {
        var item = $(this);
        bootbox.prompt({
            title: "Modify",
            value: item.html(),
            callback: function (result) {
                if (result != null && result != "") {
                    item.html(result);
                }
            }
        });
    });
    $("div.item").on("swiperight", function () {
        var item = $(this);
        if (item.parent().attr("id") == "reservelist") {
            removeItem(item);
        } else {
            if (item.parent().attr("id") == "currentlist") {
                moveToReserve(item);
            }
        }
    });

    $("div.item").on("swipeleft", function () {
        var item = $(this);
        moveToList(item);
    });

    $("span.ctrl").on("click", function () {
        var item = $(this);
        if (item.hasClass("glyphicon-arrow-right")) {
            moveToReserve(item.parent().parent().parent());
        } else if (item.hasClass("glyphicon-arrow-left")) {
            moveToList(item.parent().parent().parent());
        } else if (item.hasClass("glyphicon-trash")) {
            removeItem(item.parent().parent().parent());
        } else if (item.hasClass("glyphicon-minus")) {
            minusOne(item.parent().parent().parent());
        } else if (item.hasClass("glyphicon-plus")) {
            plusOne(item.parent().parent().parent());
        }
    });
});

function docInit() {
    initFB();
    init();
};

function initFB() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBsmf8KwJu6dcr9r_4c6SWUKXM60s0zlMI",
        authDomain: "shoppinglist-b7c89.firebaseapp.com",
        databaseURL: "https://shoppinglist-b7c89.firebaseio.com",
        projectId: "shoppinglist-b7c89",
        storageBucket: "shoppinglist-b7c89.appspot.com",
        messagingSenderId: "282798514422"
    };
    firebase.initializeApp(config);
    // Get a reference to the database service
    database = firebase.database();
}

function plusOne(item) {
    var itemtext = item.children().first().html();
    var splitted = itemtext.split(" ");
    var num = splitted[0];
    if (!isNaN(num++)) {
        splitted[0] = num;
        item.children().first().html(splitted.join(" "));
        putDB(listid);
        return;
    } else {
        item.children().first().html("1 " + splitted.join(" "));
    }
}

function minusOne(item) {
    var itemtext = item.children().first().html();
    var splitted = itemtext.split(" ");
    if (!isNaN(splitted[0]--)) {
        if (splitted[0] == 0) {
            splitted.shift();
        }
        item.children().first().html(splitted.join(" "));
        putDB(listid);
    }
}

function addNewItem(itemname) {
    if (itemname != null && itemname != "") {
        var newItem = createNewCurrentListItem(itemname);
        newItem.appendTo("#currentlist");
    }
    $("body").trigger("domChanged");
}

function createNewCurrentListItem(text) {
    // the row item
    var item = $('<div></div>');
    item.attr("class", "row item");

    // text area
    var textdiv = $('<div></div>');
    textdiv.attr("class", "col col-xs-7 text-center itemtext");
    textdiv.attr("id", "label");
    textdiv.text(text);

    // buttons area
    var buttonsdiv = $('<div></div>');
    buttonsdiv.attr("class", "col col-xs-5 pull-right");
    var buttonsrow = $('<div></div>');
    buttonsrow.attr("class", "row row-xs-12");
    buttonsrow.append(newminus());
    buttonsrow.append(newplus());
    buttonsrow.append(newarrowright());

    buttonsdiv.append(buttonsrow);

    // add everything
    item.append(textdiv);
    item.append(buttonsdiv);
    return item;
}

function createNewReserveListItem(text) {
    // the row item
    var item = $('<div></div>');
    item.attr("class", "row item");

    // text area
    var textdiv = $('<div></div>');
    textdiv.attr("class", "col col-xs-7 text-center itemtext");
    textdiv.attr("id", "label");
    textdiv.text(text);

    // buttons area
    var buttonsdiv = $('<div></div>');
    buttonsdiv.attr("class", "col col-xs-5 pull-right");
    var buttonsrow = $('<div></div>');
    buttonsrow.attr("class", "row row-xs-12");
    buttonsrow.append(newarrowleft());
    buttonsrow.append(newtrash());

    buttonsdiv.append(buttonsrow);

    // add everything
    item.append(textdiv);
    item.append(buttonsdiv);
    return item;
}

function moveToReserve(item) {
    var name = $("#label", item).text();
    item.remove();
    $("#reservelist").append(createNewReserveListItem(name));
    $("body").trigger("domChanged");
}

function moveToList(item) {
    var name = $("#label", item).text();
    item.remove();
    $("#currentlist").append(createNewCurrentListItem(name));
    $("body").trigger("domChanged");
}

function addBtnPress() {
    bootbox.prompt("New item", function (result) {
        addNewItem(result);
    });
}

function moveAllToReserve() {
    var child = $("#currentlist").children().first();
    while ($("#currentlist").children().length != 0) {
        moveToReserve(child);
        child = $("#currentlist").children().first();
    }
    $("body").trigger("domChanged");
}

function removeItem(item) {
    bootbox.confirm("Delete '" + $("#label", item).text() + "' permanently?", function (result) {
        if (result) {
            item.remove();
            $("body").trigger("domChanged");
        }
    });
}

function newminus() {
    var div = document.createElement("div");
    div.setAttribute("class", "col ctrl");
    var span = document.createElement("span");
    span.setAttribute("class", "ctrl glyphicon glyphicon-minus pull-right");
    span.setAttribute("aria-hidden", "true");
    div.appendChild(span);
    return span;
}

function newplus() {
    var div = document.createElement("div");
    div.setAttribute("class", "col ctrl");
    var span = document.createElement("span");
    span.setAttribute("class", "ctrl glyphicon glyphicon-plus pull-right");
    span.setAttribute("aria-hidden", "true");
    div.appendChild(span);
    return span;
}

function newarrowright() {
    var div = document.createElement("div");
    div.setAttribute("class", "col ctrl");
    var span = document.createElement("span");
    span.setAttribute("class", "ctrl glyphicon glyphicon-arrow-right pull-right");
    span.setAttribute("aria-hidden", "true");
    div.appendChild(span);
    return span;
}

function newarrowleft() {
    var div = document.createElement("div");
    div.setAttribute("class", "col ctrl");
    var span = document.createElement("span");
    span.setAttribute("class", "ctrl glyphicon glyphicon-arrow-left pull-right");
    span.setAttribute("aria-hidden", "true");
    div.appendChild(span);
    return span;
}

function newtrash() {
    var div = document.createElement("div");
    div.setAttribute("class", "col ctrl");
    var span = document.createElement("span");
    span.setAttribute("class", "ctrl glyphicon glyphicon-trash pull-right");
    span.setAttribute("aria-hidden", "true");
    div.appendChild(span);
    return span;
}

function newitemtextforcurrent(text) {
    var div = document.createElement("div");
    div.setAttribute("class", "text-center itemtext");
    div.innerHTML = text;
    return div;
}

function newitemtextforreserve(text) {
    var div = document.createElement("div");
    div.setAttribute("class", "col-xs-7 text-center itemtext");
    div.innerHTML = text;
    return div;
}

function init() {
    // try to read listid from local storage
    listid = localStorage.listid;
    // if listid found
    if (!listid || listid == null || listid == "null") {
        // prompt if user wants to create a new list or use an existing shared list
        bootbox.confirm({
            message: "Looks like this is your first time using the app with this device. Would you like to create a new list or use an existing shared list?",
            buttons: {
                confirm: {
                    label: 'Create a new list',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'Use an existing shared list',
                    className: 'btn-success'
                }
            },
            callback: function (result) {
                if (result) {
                    // create new list
                    listid = token();
                    localStorage.listid = listid;
                    setupDBlistener(listid);
                    initializing = false;
                    putDB(listid);
                    $("body").trigger("domChanged");
                } else {
                    // load existing shared list
                    bootbox.prompt("Please type the list identifier", function (result) {
                        localStorage.listid = result;
                        setupDBlistener(result);
                    });
                }
            }
        });
    } else {
        setupDBlistener(listid);
    }
}

function token() {
    return Math.random().toString(36).substr(2);
}

function setupDBlistener(listid) {
    if (listid != null && listid != "") {
        var dataRef = firebase.database().ref('lists/' + listid);
        dataRef.on('value', function (updated) {
            updatelists(updated.val());
        });
    }
}

function updatelists(jsonstr) {
    // clear lists
    $("#currentlist").html("");
    $("#reservelist").html("");

    var json = jsonstr;
    listid = json.listid;
    listname = json.listname;
    if (listname == null || listname == "" || listname == "null" || typeof listname == "undefined") {
        listname = "unnamed";
    }
    $("#listname").html(listname);
    if (json.currentlist) {
        for (var i = 0; i < json.currentlist.length; i++) {
            var newItem = createNewCurrentListItem(json.currentlist[i]);
            newItem.appendTo("#currentlist");
        }
    }
    if (json.reservelist) {
        for (var i = 0; i < json.reservelist.length; i++) {
            var newItem = createNewReserveListItem(json.reservelist[i]);
            newItem.appendTo("#reservelist");
        }
		var ordered = $("#reservelist > div").sort(function(a, b) {
			var atext = $(a).find('div').text();
			var btext = $(b).find('div').text();
			ares = atext;
			bres = btext;
			// remove possible numbers in front of the item text
			if (!isNaN(atext.split(" ")[0])) {
				ares = atext.substring(atext.indexOf(' ')+1);
			}
			if (!isNaN(btext.split(" ")[0])) {
				bres = btext.substring(btext.indexOf(' ')+1);
			}
			if (ares < bres) {
				return -1;
			} else {
				return 1;
			}
		});
		$("#reservelist").html(ordered);

    }
    initializing = false;
    $("body").trigger("domChanged");
}

function getDB(listid) {
    var jsonstr = '{"listid": "CDAsfSDGF", "currentlist": ["iKaffe", "Mysli"], "reservelist": ["Viili", "Maito", "Muroja"] }';
    return jsonstr;
}

function putDB(listid) {
    if (initializing) {
        return;
    }
    var data = new Object();
    data.listid = listid;
    data.listname = listname;
    var clistarray = [];
    var currentlist = $("#currentlist");
    for (var i = 0; i < currentlist.children().length; i++) {
        clistarray.push($("div.itemtext", currentlist.children()[i]).html());
    }
    data.currentlist = clistarray;
    var rlistarray = [];
    var reservelist = $("#reservelist");
    for (var i = 0; i < reservelist.children().length; i++) {
        rlistarray.push($("div.itemtext", reservelist.children()[i]).html());
    }
    data.reservelist = rlistarray;
    writeToFB(listid, data);
}

function writeToFB(listid, data) {
    if (listid != null && listid != "") {
        firebase.database().ref('lists/' + listid).set(data);
    } else {
        //notify.js that unable to write because no listid
    }
}

function share() {
    toClipboard(listid);
    bootbox.alert("Share your list with others by giving them this code: " + listid + " (code is copied automatically to clipboard on Android devices)");
}

function toClipboard(text) {
    var textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    $(textField).remove();
}

function changeList() {
    bootbox.confirm("Are you sure you want to stop using the current list?", function (result) {
        if (result) {
            localStorage.listid = null;
            location.reload();
        }
    });
}

function editlistname() {
    var nameitem = $("#listname");
    bootbox.prompt({
        title: "Modify list name",
        value: nameitem.html(),
        callback: function (result) {
            if (result != null && result != "") {
                nameitem.html(result);
                listname = result;
                putDB(listid);
            }
        }
    });
}

function listmenu() {
    bootbox.alert("List menu is not yet implemented, sorry :(");
}

function toggleReserveList() {
    var reserveListVisible = $("#reservelist").is(":visible");
    if (reserveListVisible) {
        $("#reservelist").animate({
            width: 'toggle'
        }, {
            'duration': "normal",
            'complete': function () {
                $("#visibilityToggleIcon").toggleClass("glyphicon-hand-right");
                $("#visibilityToggleIcon").toggleClass("glyphicon-hand-left");
                $("#reservelist").toggleClass("col-xs-6");
                $("#currentlist").toggleClass("col-xs-6");
                $("#currentlist").toggleClass("col-xs-12");
            }
        });
    } else {
        $("#reservelist").animate({
            width: 'toggle'
        }, {
            'duration': "normal",
            'start': function () {
                $("#visibilityToggleIcon").toggleClass("glyphicon-hand-right");
                $("#visibilityToggleIcon").toggleClass("glyphicon-hand-left");
                $("#reservelist").toggleClass("col-xs-6");
                $("#currentlist").toggleClass("col-xs-6");
                $("#currentlist").toggleClass("col-xs-12");
            }
        });
    }
}


