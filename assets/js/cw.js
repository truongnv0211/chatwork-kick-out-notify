$(window).ready(function() {
    setTimeout(function() {
        executeExtension();
        $("#_roomListItems").bind("DOMSubtreeModified", function() {
            executeExtension();
        });
    }, 1000);
});

executeExtension = function() {
    var roomList = getRoomList();
    var listKickedRoom = checkIsKickedOut(roomList);

    if (listKickedRoom.length > 0) {
        localStorage.CW_KICKOUT_NOTIFY_ROOM_LIST = getRoomList();
        alert("You got to kick off [" + listKickedRoom.join(" / ") + "] box");
    }
}

getRoomList = function() {
    var roomList = [];

    $("#_roomListItems li[role=listitem]").each(function() {
        if (!($(this).hasClass("roomUnread") && $(this).hasClass("roomMentionUnread"))) {
            var roomId = $(this).attr("data-rid"),
            roomName = $(this).attr("aria-label"),
            roomInfo = {};
            roomInfo[roomId] = roomName;

            roomList.push(roomInfo);
        }
    });

    return JSON.stringify(roomList);
}

checkIsKickedOut = function(currentRoomList) {
    var oldRoomList = localStorage.CW_KICKOUT_NOTIFY_ROOM_LIST,
        listKickedRoom = [];

    if (oldRoomList) {
        oldRoomList = JSON.parse(oldRoomList);
        currentRoomList = JSON.parse(currentRoomList);
        if (oldRoomList.length > currentRoomList.length) {
            listKickedRoom = getKickedRoomName(oldRoomList, currentRoomList);
        } else if (oldRoomList.length < currentRoomList.length) {
            localStorage.CW_KICKOUT_NOTIFY_ROOM_LIST = JSON.stringify(currentRoomList);
        }
    } else {
        localStorage.CW_KICKOUT_NOTIFY_ROOM_LIST = currentRoomList;
    }

    return listKickedRoom;
}

getKickedRoomName = function(oldList, currentList) {
    var listRoom = [];
    currentList = arrayObjectReduce(currentList);

    for (var i = 0; i < oldList.length; i++) {
        var roomId = Object.keys(oldList[i]).join();

        if (typeof currentList[roomId] === "undefined") {
            listRoom.push(oldList[i][roomId]);
        }
    }

    return listRoom;
}

arrayObjectReduce = function(arrObj) {
    return arrObj.reduce(function(result, item) {
        var key = Object.keys(item)[0];
        result[key] = item[key];

        return result;
    }, {});
}
