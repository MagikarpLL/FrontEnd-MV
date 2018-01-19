var xmlHttp;


window.onload=function (ev) {
    // var inputWidth = document.getElementById().style.width;
    // console.log(inputWidth);
    // $('.inputClass').css('width','');
    document.getElementById('loginBtn').onclick = loginFuc;
}

window.resize = function (ev) {



}


// http://secpano.indoorstar.com:6628/sec/pano/login?username=hangzhou&password=DA70C317D67C460AF404AA382DA55D52

function loginFuc() {

    if($.trim($('#username').val()) == ''||$.trim($('#password').val()) == ''){
        alert('请输入用户名或者密码!');
    }{
        var url = 'http://secpano.indoorstar.com:6628/sec/pano/login' + '?username=' + $('#username').val() + '&password=' + md5.encodePassword($('#password').val());
        createXmlHttp();
        sendRequest('get',url);
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

            var temp = JSON.parse(xmlHttp.responseText)
            if(temp.s === 0){//登陆成功，跳转
                var data = JSON.parse(temp.d);
                self.location='selectList.html?sn=' + data.sn;
            }else{//登录失败
                window.alert('用户名或密码错误!');
            }
        }
    }
}

