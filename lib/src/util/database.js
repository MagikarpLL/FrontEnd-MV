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
                if(callback === null){
                    console.log('send data');
                }else{
                    callback(data);
                }
            }
        });
    };
    
    var postData = function (action, params, sceneData) {
        if (params) params = params + "&";
        params = params + '&userSn=' + userSn + '&secUserSn=' + userSn + '&appToken=' + appToken;
        var data = new FormData();
        data.append("data", sceneData);
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log('send data' );
            }
        });
        xhr.open("POST", serverUrl + action + "?" + params);
        xhr.withCredentials = false;
        xhr.send(data);
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
        updateSceneData: function (sceneId, sceneData) {
            // console.log(sceneData);
            var data = JSON.stringify(sceneData);
            postData("updateSceneData", "sceneId=" + sceneId, data);
        },
    }
});