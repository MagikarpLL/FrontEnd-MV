define([], function () {
    var serverUrl, userSn, appToken;

    var readText = function (url, callback) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", url, true);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4 && rawFile.status === 200) {
                callback(rawFile.responseText);
            }
        };
        rawFile.send(null);
    };

    var request = function (action, params, callback) {
        if (params) params = params + "&";
        params = params + '&userSn=' + userSn + '&secUserSn=' + userSn + '&appToken=' + appToken;

        readText(serverUrl + action + "?" + params, function (response) {
            var pack = JSON.parse(response);
            if (pack.s === 0) {   //获取成功
                var data = JSON.parse(pack.d);
                callback(data);
            }
        });
    };

    return {
        init: function (server, sn, token) {
            serverUrl = server;
            userSn = sn;
            appToken = token;
        },
        getStage: function (stageId, callback) {
            request("getStage", "stageId=" + stageId, callback);
        },
        getScenes: function (sceneIdsString, callback) {
            request("getScenes", "sceneIds=" + sceneIdsString.toString(), callback);
        },
        getUserSn: function() {
            return userSn;
        },
    }
});