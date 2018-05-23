
var loginAgentBar = true;
var loginStartTime = 0;

function videoInit(callback){
	logInfo("开始加载flash控件：" + u3c_contentPath + "  " + agentProfile.configure_isEmbed);

    if (agentProfile.configure_isEmbed) {// 嵌入式
        try {
            var swfVersionStr = "11.5.0";
            // To use express install, set to playerProductInstall.swf, otherwise the empty string.
            var xiSwfUrlStr = u3c_contentPath + "/ucagent/cab/playerProductInstall.swf";
            var flashvars = {};
            var params = {};
            params.quality = "high";
            params.bgcolor = "#ffffff";
            params.allowscriptaccess = "always";
            params.allowfullscreen = "true";
            var attributes = {};
            attributes.id = "VideoPhone";
            attributes.name = "VideoPhone";
            attributes.align = "middle";
            attributes.style = "visibility: visible;";
            swfobject.embedSWF(u3c_contentPath + "/ucagent/cab/VideoPhone.swf?version=utry", "stateBar_flashContent", "100", "20", swfVersionStr, xiSwfUrlStr, flashvars, params, attributes,callback);
            //swfobject.embedSWF(contextPath + "/cab/VideoPhone.swf", "flashContent", "215", "138", swfVersionStr, xiSwfUrlStr, flashvars, params, attributes,callback);

        } catch (e) {
            logInfo('视频加载失败');
        }
    }
}

function videoDisconnect() {
    try {
        logInfo('断开连接');
        VideoPhone.disConnect();
    } catch (e) {
        logInfo('rtmp连接已经断开');
    }
}

function startVideo() {
    try {
    logInfo('开启视频');
    VideoPhone.startVideo();
    } catch (e) {
        logInfo('开启视频出错');
    }
}

function stopVideo() {
    try {
    logInfo('停止视频');
    VideoPhone.stopVideo();
    } catch (e) {
        logInfo('停止视频出错');
    }
}

function setCamQuality(quality) {
    try {
        logInfo('设置视频质量为'+quality);
        VideoPhone.setCamQuality(quality);
    } catch (e) {
        logInfo('设置视频质量出错');
    }
}

//成功加载
function onLoadVideoPhone() {
    try {
    	ipccBar.isLogoutSelf = false;//是否自己登出 (设回初始)
    	isLogoutSelf = false;
    	ipccBar.isReconnect = false;//是否重连(设回初始)
        logInfo('加载VideoPhone成功...');
        //VideoPhone.connect('rtmp://192.168.154.25/phone', 'sip:1003@192.168.154.25');
        if (agentProfile.configure_isEmbed) {// 嵌入式
            setVideoMode("0");
            setVideoLayoutStyle("0");
            videoPhoneConnect();
        }
    } catch (e) {
        logInfo('视频连接失败..');
        onVideoPhoneDisConnect();
    }
}

function sendVideoDTMF(dtmf) {
    logInfo('发送按键： ' + dtmf);
    VideoPhone.sendDTMF(dtmf);
}


function sendChatMessage(message) {
    logInfo('发送消息： ' + message);
    VideoPhone.sendChatMessage(message);
}

function onVideoPhoneConnectFail(cause) {
    logInfo('建立连接失败 ' + cause);

}

//连接建立成功
function onVideoPhoneConnectScuuess(rtmpserver) {
    logInfo('建立连接成功'+rtmpserver);
	if(loginAgentBar==true){
		logInfo("rtmpserver连接成功，agentbar签入开始....");
		ipccBar.loginSuccess();
	}
    try {
        if (videoConnectTimer != null) {
            clearInterval(videoConnectTimer);
            videoConnectTimer = null;
        }
    } catch (e) {
        logInfo('销毁rtmp重连定时器');
    }


}

//连接断开
var videoConnectTimer = null;
function onVideoPhoneDisConnect(rtmpserver) {
    logInfo('连接断开,进行重连'+rtmpserver);
    try {
        if (!ipccBar.isLogoutSelf) {
            if (videoConnectTimer == null) {
                //videoDisconnect();
                videoConnectTimer = setInterval("videoPhoneConnect()", 5000);
            }
        }
    } catch (e) {
        logInfo('重连失败' + e);
    }
}


function videoPhoneConnect() {
    try {
        var curtime = new Date().getTime();
        if(loginAgentBar==true&&curtime - loginStartTime >=10000 ){
        	printlnLog("rtmpserver连接异常超时，agentbar签入开始....");
        	ipccBar.loginSuccess();
        }

        var registerNum = 'webcall' + agentProfile.configure_userName;

        if(u3c_rtmpserver_list.length<=0){
          logInfo("向rtmpserver" + rtmpserver_ip + ":" + rtmpserver_port + "发起连接,注册号码为：" + registerNum);
          VideoPhone.connect((u3c_webcall_proxy == '') ? (rtmpserver_ip + ":" + rtmpserver_port) : u3c_webcall_proxy, registerNum, '1');
        }else{
          logInfo("注册 rtmpserver list 开始..... ");
          var rtmpServerList = 	u3c_webcall_proxy_list==""?u3c_rtmpserver_list.split(","):u3c_webcall_proxy_list.split(",");
          for(var i=0;i<rtmpServerList.length;i++){
        	  logInfo("向rtmpserver[" + rtmpServerList[i] + "]发起连接,注册号码为：" + registerNum);
        	  VideoPhone.connect(rtmpServerList[i], registerNum, '1');
          }
        }
    } catch (e) {
        logInfo('连接失败');
        if (videoConnectTimer != null) {
            clearInterval(videoConnectTimer);
            videoConnectTimer = null;
        }
    }
}

function printlnLog(str) {
    logInfo(str);
}

function setVideoMode(type) {
    logInfo('设置模式： ' + type);
    VideoPhone.setMode(type);
}

function setVideoLayoutStyle(layout) {
    logInfo('横竖屏设置:' + layout);
    VideoPhone.setLayoutStyle(layout);
}

function getVideoRecorderFileUri()
{
   logInfo('@@@@@获取录像文件名...');
   VideoPhone.getVideoRecorderFileUri();
   //VideoPhone.startPlayVideoRecord("192.168.52.121","rtmp://192.168.52.121/rtmpclient/2013-01-17/1005/webcall100377_74d099d9-be20-4f27-9def-78584b3d1b00.flv","rtmp://192.168.52.121/rtmpclient/2013-01-17/1005/webcall1005_cf7f878e-0fff-4f6e-9b39-e09cf9d2e382.flv");
}

function setPictureInPicture(PIPValue)
{
   logInfo('画中画设置(0:全屏 1:画中画):'+PIPValue);
   VideoPhone.setPictureInPicture(PIPValue);
}

function testDevice() {
    logInfo('测试flash硬件环境');
    VideoPhone.testDevice();
}
//出错
function onVideoPhoneError(type, text) {
    logInfo('@@@@@onError,type=' + type + ',text=' + text);
}

var incomingCallUUID = "";
//来电通知事件
var isVideoOutcall = false;//当前呼叫是外呼
var isVideoReterieve = false;//当前呼叫拾回
function onVideoPhoneInvite(uuid, name, account, peeruuid) {
    logInfo('@@@@@来电:uuid=' + uuid + ',name=' + name + ',account=' + account + ',peeruuid=' + peeruuid);
    incomingCallUUID = uuid;
    isVideoRing = true;
    if(/*(phone_is_auto_answer==="1")||*/isVideoOutcall || ipccBar.isHolding || agentMode=="2"){
    	logInfo("@@@@@自动接听-"+uuid);
        videoPhoneAnswer();
        isVideoOutcall=false;
        ipccBar.isHolding=false;//重设拾回状态
    }else{
       try{
         window.setTimeout(function () {
             if (!isVideoOutcall) {

             }
              stop(u3c_contentPath+'//ucagent//record//ringback.mp3');
           }, 1000);
       }catch(e){
       }
        logInfo("@@@@@不自动接听-"+uuid);
    }
}

//接通事件
function videoPhoneAnswer() {
  try{
    isVideoRing=false;
    logInfo('@@@@@电话接听'+VideoPhone.getConnectorName());
    VideoPhone.accept();
  }catch(e){
	  logInfo("@@@自动接听异常:"+e);
  }
}

function videoPhoneReject()
{
    try {
        isVideoRing = false;
        logInfo('@@@@@电话拒接');
        VideoPhone.reject();
    } catch (e) {
    }
}
//接通事件
function onVideoPhoneEstablished() {
    logInfo('@@@@@电话接通');
}

//来电取消
function onVideoPhoneCancel() {
	incomingCallUUID = "";
    logInfo('@@@@@onCancel');
}

//呼叫挂断
function onVideoPhoneHangup() {
	incomingCallUUID = "";
    logInfo('@@@@@呼叫挂断');
  sessionStorage.setItem('hangupNow', 'hangup');
}

//状态变化
function onVideoPhoneState(state) {
    logInfo('@@@@@onState, state=' + state);
}

//录像文件uri
var videoRecorderFileUri = null;
function onGetVideoRecorderFileUri(data)
{
	videoRecorderFileUri = data;
	var connectiIp = (u3c_webcall_proxy == '') ? rtmpserver_ip : u3c_webcall_proxy;
	logInfo('@@@@@录像文件uri：'+data+" connectiIp="+connectiIp);
	startPlayVideoRecord(connectiIp,videoRecorderFileUri.split(";")[1],videoRecorderFileUri.split(";")[0]);
}

function startPlayVideoRecord(rtmpserverIp,fileUrlOne,fileUrlTwo)
{
  try {
   logInfo('@@@@@开始播放视频...');
   VideoPhone.startPlayVideoRecord(rtmpserverIp,fileUrlOne,fileUrlTwo);
  }catch (e) {
       logInfo('开始播放视频失败' + e);
   }
}


function stopPlayVideoRecord()
{
  try {
   logInfo('@@@@@停止播放视频...');
   VideoPhone.stopPlayVideoRecord();
  }catch (e) {
       logInfo('停止播放视频失败' + e);
   }
}

function onCamQuality(state)
{
    logInfo('CamQuality, quality='+state/10);
    videoQuality =state/10;
}

/**
 * 获取摄像头和麦克风权限后触发事件
 */
function onSecuritySetting(isAllowed) {
	if(isAllowed==true || (isFlashFirstCheck==false && isAllowed==false)){
		logInfo("已获取摄像头和麦克风权限");
		var videoPhone = $("#VideoPhone");
		videoPhone.attr("width", "1");
		videoPhone.attr("height", "1");
    document.getElementsByClassName('ipcc_flash')[0].style.display='none';
	}
	isFlashFirstCheck=false;
}

function onVideoPhoneDebug(info) {
	logInfo(info);
}
