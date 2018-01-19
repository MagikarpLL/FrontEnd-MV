var xmlHttp = null;
var listData = null;

var userSn;

window.onload = function () {

    //从跳转网址获取sn
    var param = getRequest();
    userSn = param.sn;
    getData();

    $('#refreshImg').click(function () {
        refresh();
    });
    $('#searchImage').click(function () {
        var tempResult = search();
        if((typeof tempResult) === 'undefined'){
            window.alert('请输入搜索条件!');
        }else{
            removeAllChild();
            insertDiv(tempResult);
        }
    });



}

function getData() {
    var url = 'http://secpano.indoorstar.com:6628/sec/pano/listStages?userSn='+ userSn + '&secUserSn=' + userSn + '&appToken=2CC772253C0F8F35744437A03897564F';
    createXmlHttp();
    sendRequest('get',url);
}

//虚拟数据
function createData(data){
    var result = [];
    var num = data.length;
    var newDate = new Date();
    for(var i = 0; i < num; i++){
        var position = data[i].title;
        newDate.setTime(data[i].updateTime);
        var time = newDate.toLocaleDateString() + "   " + newDate.toTimeString().substring(0,9);
        var equipmentName = '无人机' + i;
        var imgUrl = 'http://www.indoorstar.com:6601/' + data[i].thumbUrl;
        var panoramaUrl = 'view.html?stageId=' + data[i].id + '&userSn=' + userSn;
        result.push({
            position:position,
            time:time,
            equipmentName:equipmentName,
            imgUrl:imgUrl,
            panoramaUrl: panoramaUrl,
            timestamp:data[i].updateTime
        })
    }
    return result;
}

//插入数据到界面中
function insertDiv(tempData){
    for(var i = 0; i < tempData.length; i++){
        $('#mainDiv').append( $(' <div class="subMain">       <div class="imageDiv">\n' +
            '         <a href="'+ tempData[i].panoramaUrl + '"><img class="image" src="' + tempData[i].imgUrl + '" alt="image"/></a>\n' +
            '            <p class="subContainer">\n' +
            '                <span class="subTitle">' + tempData[i].position + '</span>\n' +
            '            </p>\n' +
            '            <p class="subContainer">\n' +
            '                <span class="time">' + tempData[i].time + '</span>\n' +
            '                <a class="name" href=' + tempData[i].panoramaUrl + '>' + tempData[i].equipmentName + '</a>\n' +
            '            </p>\n' +
            '        </div></div>'));
    }

    // '<span class="name">'+ tempData.length +'个场景</span>' +

    // for(var i = 0; i < 14; i++){
    //     $('#mainDiv').append( $('<div class = "wrapDiv">       <div class="imageDiv">\n' +
    //         '            <img class="image" src="' + tempData[0].imgUrl + '" alt="image"/>\n' +
    //         '            <p class="subContainer">\n' +
    //         '                <span class="subTitle">' + tempData[0].position + '</span>\n' +
    //         '                <a class="name" href=' + tempData[0].panoramaUrl + '>'+ tempData[0].name +'</a>\n' +
    //         '            </p>\n' +
    //         '            <p class="subContainer">\n' +
    //         '                <span class="time">' + tempData[0].time + '</span>\n' +
    //         '                <a class="name" href=' + tempData[0].panoramaUrl + '>' + tempData[0].equipmentName + '</a>\n' +
    //         '            </p>\n' +
    //         '        </div></div> '));
    // }

}

//刷新按钮的点击事件
function refresh() {
    removeAllChild();
    getData();
}

//搜索按钮的点击事件
function search() {

    var startTime = $('#startTime').val();
    var endTime = $('#endTime').val();
    var inputVal = $('#searchInput').val();
    var startTimestamp;
    var endTimestamp;
    var result = [];

    console.log(startTime);
    console.log(endTime);
    console.log(inputVal);

    if((typeof startTime) === 'undefined' || startTime.length === 0){
        startTimestamp = Number.MIN_VALUE;
    }else{
        startTimestamp = dateToTimestamp(startTime);
    }

    if((typeof endTime) === 'undefined'|| endTime.length === 0){
        endTimestamp = Number.MAX_VALUE;
    }else{
        endTimestamp = dateToTimestamp(endTime);
    }

    if((typeof inputVal) === 'undefined'){
        inputVal = '';
    }

    console.log('aaa');

    for(var i = 0; i < listData.length; i++){

        console.log('bbb');

        if(listData[i].timestamp > startTimestamp && listData[i].timestamp < endTimestamp && (listData[i].position.indexOf(inputVal)!= -1  ||  listData[i].equipmentName.indexOf(inputVal)!= -1 )){

            console.log(listData[i]);
            result.push(listData[i]);
        }
    }

    return result;
}

function dateToTimestamp(time) {

    console.log('changeTime');

    var tempDate = new Date(time);
    return tempDate.getTime();
}

//删除子节点
function removeAllChild()
{
    var div = document.getElementById("mainDiv");
    while(div.hasChildNodes()) //当div下还存在子节点时 循环继续
    {
        div.removeChild(div.firstChild);
    }
}


function createXmlHttp(){
    if(window.XMLHttpRequest){
        xmlHttp = new XMLHttpRequest();
    }else{
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
}

function sendRequest(method,url,data){
    if(xmlHttp != null){
        xmlHttp.open(method,url,true);
        xmlHttp.send(data);
        xmlHttp.onreadystatechange = doResult;
    }
}

function doResult() {
    if(xmlHttp.readyState == 4){
        if(xmlHttp.status == 200){
            var tempData = JSON.parse(xmlHttp.responseText);
            if(tempData.s === 0){   //成功获取数据
                var data = JSON.parse(tempData.d);
                data = filterEmptyData(data);
                // console.log(data);

                data.sort(sortData);
                listData = createData(data);



                insertDiv(listData);

            }else{      //获取数据失败，请检查网络并重新登录
                alert('获取数据失败，请检查网络并重新登录');
                self.location= 'login.html';
            }
        }
    }
}

function getRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

function sortData(obj1,obj2){

    var val1 = obj1.updateTime;
    var val2 = obj2.updateTime;
    if (val1 < val2) {
        return 1;
    } else if (val1 > val2) {
        return -1;
    } else {
        return 0;
    }

}

function filterEmptyData(data) {
    for(var i = 0; i < data.length; i++){
        if(data[i].thumbUrl === '' || (typeof data[i].thumbUrl) === 'undefined'){
            data.splice(i,1);
            i--;
        }
    }
    return data;
}

