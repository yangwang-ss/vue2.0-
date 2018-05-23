var preventDuplicationAdd = false;
var u3c_taskBarId = "taskBarid";
var u3c_insert_button = [];
var u3c_reject_object = {type:0,ivr:""};
var u3c_permis_hidden = false;
var u3c_charsetName = "utf-8";
var u3c_isui = "1";
var registerList = [];
var phonePrefix = "";
var crossDomain = false;
var agentbar_horizontal_layout = true;
var agentbar_ratio = 1.0;
var u3c_webcall_proxy = "";
var u3c_push_proxy = "";
var video_window_left = 0;
var video_window_top = 0;
var u3c_rtmpserver_list = "";
var u3c_webcall_proxy_list = "";
var u3c_invisible_totarget = "";
var agentProfile = null;
var u3c_permis_json = [];
var commonJsFile = "common.js";
var u3c_proxy_deptId;
var u3c_proxy_deptName;
var u3c_isProxyWithDeptId;

function getWidthOrHeightByRatio(w)
{
     return Math.floor(agentbar_ratio*w);
}

function AgentBar(ucagentUrl, agentId, loginStatus) {
	var u3c_js_count = 0;
	var u3c_js_count_sj = 0;
	var u3c_proxy_url = "";
	var u3c_ucagentUrl = ucagentUrl;
	var u3c_agentId = agentId;
	var u3c_loginStatus = loginStatus;
	var u3c_status_monitor_list = [];
	var u3c_permissions;
	var u3c_jquery_version = 1.5;
	var u3c_transfer_show_virtual_agent = "";
	var css_files = [];
	var js_files  = [];
	var u3c_version = new Date().getTime();

    this.setRtmpServerList = function (rtmpserver_list)
	{
		u3c_rtmpserver_list = rtmpserver_list;
	};

	this.setInvisible = function (toTarget)
	{
		u3c_invisible_totarget = toTarget;
	};

	this.setDeptId = function(deptId)
	{
		u3c_proxy_deptId = deptId;
	}

	this.setDeptName = function(deptName)
	{
		u3c_proxy_deptName = deptName;
	}

	this.setIsProxyWithDeptId = function(isProxyWithDeptId)
	{
		u3c_isProxyWithDeptId = isProxyWithDeptId;
	}

	this.setWebCallProxyList = function (proxy_list)
	{
		u3c_webcall_proxy_list = proxy_list;
	};

	this.setProxy = function (proxy) {
		u3c_proxy_url = proxy;
	};

	this.setWebCallProxy = function (proxy)
	{
		u3c_webcall_proxy = proxy;
	}

    this.setPushProxy = function(proxy)
    {
        u3c_push_proxy = proxy;
    }

	this.setShowVirtualAgent = function(showVirtualAgent){
		u3c_transfer_show_virtual_agent = showVirtualAgent;
	}

	this.setVideoWindowPosition = function(eventX,eventY){
		 video_window_left = eventX;
		 video_window_top = eventY;
	}

	this.setCharsetName = function (charsetName){
		u3c_charsetName = charsetName;
	}

	this.setLayout = function (layout)
	{
		if (layout != 'true') {
			agentbar_horizontal_layout = false;
            agentbar_ratio = 1.25;
        }
	}

	this.setIsUI = function (isui){
		u3c_isui = isui;
	}

	this.setPhonePrefix = function (prefix){
	    phonePrefix = prefix;
	}

	this.setPermissions = function(permissions,hidden) {
		u3c_permissions = permissions;
		if(hidden){
			u3c_permis_hidden = hidden;
		}
	}

	this.setJqueryVersion = function(version) {
		u3c_jquery_version = version;
	}

	this.setStatusMonitorList = function(status_monitor_list2) {
		u3c_status_monitor_list = status_monitor_list2;
	}

	this.setReject = function(type,ivr){
		u3c_reject_object.type = type;
		u3c_reject_object.ivr = ivr;
	}

	this.insert = function(a,b,obj) {
		obj.a = a;
		obj.b = b;
		u3c_insert_button.push(obj);
        u3c_permis_json.push({"id":obj.id ,"agentbar":true,"permis":true,"plist":{"offLineing":true,"beReadying":true,"noDisturb":true,"busy":true,"phoneBusy":true,"ringing":true,"tryCalling":true,"speaking":true,"holding":true,"reholding":true,"muting":true,"rehabilitation":true,"beLocaked":true}});
	}
	this.register = function(type,method,trigger,fun){
		var obj = {type:type,method:method,trigger:trigger,fun:fun};
		registerList.push(obj);
	}

	this.setCommonJsFile = function(filename){
		commonJsFile = filename;
	}

	this.load = function(domId) {
		var btnIconCss =  agentbar_horizontal_layout ?  "/css/btnIcon.css" : "/css/btnIcon-vertical.css";
		css_files = [
			"/css/layOut.css",
			btnIconCss,
			"/extjs/resources/css/ext-all.css",
			"/extjs/fileuploadfield/fileuploadfield.css" ];
		js_files = [ "/extjs/adapter/ext/ext-base.js",
			"/extjs/ext-all.js",
			"/extjs/src/locale/ext-lang-zh_CN.js",
			"/widgetJs/ux/RowExpander.js",
			"/widgetJs/ux/U3cHtmlEditor.js",
			"/extjs/fileuploadfield/FileUploadField.js",
			//"/jquery/jquery.atmosphere.js",
			"/sockjs/sockjs-0.3.min.js",
			"/jquery/jquery.form.js",
			"/log4js/log4js.js",
			"/socket.io/socket.io.js",
			"/widgetJs/ucagentApp.js"
		];

		if(u3c_isui == "0"){
			css_files = [];
			js_files = [//"/jquery/jquery.atmosphere.js",
				"/jquery/jquery.form.js",
				"/widgetJs/IAgentBar.js",
				"/widgetJs/AgentProfileDo.js",
				"/widgetJs/swfobject.js",
				"/sockjs/sockjs-0.3.min.js",
				"/widgetJs/websocketSdk.js",
				"/widgetJs/tips.js"
			];
		}

      if(navigator.userAgent.indexOf("MSIE")>0){
			if (document.getElementById(domId) == undefined){
			    writeInnerHTML();
		    }
	  }

      var commonjs = u3c_ucagentUrl + "/widgetJs/common_201.js?version="+u3c_version;
      if ("gbk" == u3c_charsetName)
	   {
    	  commonjs = u3c_ucagentUrl + "/widgetJs_gbk/common_201.js?version="+u3c_version;
	   }

	  include_js(commonjs , function() {
		  u3c_version = u3c_agentbar_version;
		  loadAgentbarResources();
	  });
		u3c_taskBarId = domId;
		if (window.addEventListener) {
			window.addEventListener('DOMContentLoaded', beOnload, false); // firefox
		} else if (window.attachEvent) {
			window.attachEvent('onload', beOnload); // IE
		}

	}

	function beOnload() {
		if (u3c_js_count == 0 || u3c_js_count != u3c_js_count_sj) {
			window.setTimeout(function() {
				beOnload();
			}, 200);
			return;
		}

		if ( agentProfile == undefined || agentProfile == null) {
			agentProfile = new AgentProfileDo();
		}

        agentServerPath = u3c_ucagentUrl;
		agentProfile.configure_userName = u3c_agentId;
		firstLoginStatus = u3c_loginStatus;
		LoginStatus = u3c_loginStatus;
		permissions = u3c_permissions;
		status_monitor_list = u3c_status_monitor_list;
		if(isProxy==true)
		{
			u3c_proxy_url = "http://"+appserver_proxy_url + "/uipcc/"+(u3c_isProxyWithDeptId=="true" ? ("/deptid/"+u3c_proxy_deptId) : ("/deptname/"+u3c_proxy_deptName));
//			var proxy_port = "10000".substring(0, 5-u3c_proxy_deptId.length)+u3c_proxy_deptId;
			var proxy_port = rtmp_proxy_port;
			u3c_webcall_proxy = appserver_proxy_url+":" + proxy_port;
			eval("rtmpserver_ip = '" + appserver_proxy_url + "'");
			eval("rtmpserver_port= '" + proxy_port + "'");
			eval("rtmpPush_ip= '" + appserver_proxy_url + "'");
			eval("rtmpPush_port= '" + proxy_port + "'");
			eval("remote_Desktop_ip= '" + appserver_proxy_url + "'");
			eval("remote_Desktop_port= '" + proxy_port + "'");
		}
		modifyVar();
		if(u3c_isui=="1"){
            Ext.BLANK_IMAGE_URL = u3c_ucagentUrl + '/extjs/resources/images/default/s.gif';
			if (agentProfile.configure_userName == "null" || agentProfile.configure_userName == "") {
				setTitle();
			}
			window_init();

			for(var i=0;i<registerList.length;i++){
				var o = registerList[i];
				if(o.type=="event"){
					$.register.event(o.trigger,o.method,o.fun);
				}
			}
		}
        if(isFunction("onloadSuccess")){
            onloadSuccess();                     //js加载成功回调方法
        }
	}

	function modifyVar() {
		var u3c_contentPath_tmp = u3c_contentPath;
		if (u3c_proxy_url != ""&&u3c_proxy_url!=u3c_contentPath) {
			for ( var i = 0; i < modifyVarList.length; i++) {
				eval(modifyVarList[i] + "=" + modifyVarList[i]
					+ ".replaceAll('" + u3c_contentPath_tmp + "','"
					+ u3c_proxy_url + "')");
			}
		}
		if (u3c_contentPath.indexOf(document.domain) == -1) {
				crossDomain = true;
		}
		if(u3c_transfer_show_virtual_agent!=""){
			eval("transfer_show_virtual_agent="+u3c_transfer_show_virtual_agent);
		}
	}

	function loadAgentbarResources() {
		for ( var i = 0; i < css_files.length; i++) {
			loadCss(u3c_ucagentUrl + css_files[i]);
		}
        if(agentbar_horizontal_layout==false){
            loadCss(u3c_ucagentUrl + "/extjs/resources/css/temptheme.css");
            loadCss(u3c_ucagentUrl + "/css/bigfont.css");
        }
		try{
			jQuery;
			loadAgentbarResource(0);
			u3c_js_count_sj = 0 + js_files.length;
		}catch(e){
			var u3c_jquery_url = "/jquery/jquery-1.5.min.js";
			if (u3c_jquery_version == 1.4) {
				u3c_jquery_url = "/jquery/jquery-1.4.2.js";
			}
			include_js(u3c_ucagentUrl + u3c_jquery_url , function() {
				u3c_js_count++;
				loadAgentbarResource(0);
			});
			u3c_js_count_sj = 1 + js_files.length;
		}
	}

	function loadAgentbarResource(i) {
		if (i == js_files.length)
			return;
		var js_file_name = js_files[i];
		if ("gbk" == u3c_charsetName)
		{
			js_file_name = js_file_name.replace("widgetJs", "widgetJs_gbk");
			js_file_name = js_file_name.replace("ext-lang-zh_CN.js","ext-lang-zh_CN_gbk.js");
		}
		var jslink = u3c_ucagentUrl + js_file_name;
		if (jslink.indexOf("widgetJs") > 0)
			jslink += "?version="+u3c_version;
		include_js(jslink, function(){
			u3c_js_count++;
			loadAgentbarResource(i + 1);
		});
	}

	function loadCss(file) {
		var d = document.createElement("link");
		d.rel = "stylesheet";
		d.rev = "stylesheet";
		d.type = "text/css";
		d.media = "screen";
		d.href = file;
		document.getElementsByTagName("head")[0].appendChild(d);
	}

	include_js = (function() {
		var uid = 0;
		return function(file, callback) {
			var id = ++uid;
			var head = document.getElementsByTagName('head')[0];
			var js = document.createElement('script');
			js.type = "text/javascript";
			js.src = file;
			if (navigator.userAgent.indexOf("MSIE")>0||this.readyState)
			{
				js.onload = js.onreadystatechange = function() {
					if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
					   callback();
					   this.onload = this.onreadystatechange = null;
					   this.parentNode.removeChild(this);
					}
				};
			}
			else
			{
				js.onload = callback;
			}
			head.appendChild(js);
			return uid;
		};
	})();

	function write(msg) {
		document.write(msg);
	}

	function writeInnerHTML()
	{
		var U3C_AGENT_HTML = "";
		U3C_AGENT_HTML +="<table width='100%' height='39' cellspacing='0' cellpadding='0'>";
		U3C_AGENT_HTML +="	<tr>";
		U3C_AGENT_HTML +="		<td width='100%' valign='top'>";
		U3C_AGENT_HTML +="			<div style='border:1px'  id='taskBarid'></div>";
		U3C_AGENT_HTML +="		</td>";
		U3C_AGENT_HTML +="	</tr>";
		U3C_AGENT_HTML +="</table>";
		U3C_AGENT_HTML +="</div>";
		U3C_AGENT_HTML +="<div  class='middleLayOut' style='display:none'>";
		U3C_AGENT_HTML +="<table width='100%' cellspacing='0' cellpadding='0' border=0  >";
		U3C_AGENT_HTML +="	<tr>";
		U3C_AGENT_HTML +="		<td  valign='top' width='100%'>";
		U3C_AGENT_HTML +="			<div id='dialogPortalDiv' style='dispaly:none'></div>";
		U3C_AGENT_HTML +="		</td>";
		U3C_AGENT_HTML +="	</tr>";
		U3C_AGENT_HTML +="</table>";
		U3C_AGENT_HTML +="<div class='messageBox' id='innerPhone'></div>";
		U3C_AGENT_HTML +="<div class='messageBox' id='forumtree'></div>";
		var div = document.createElement('div');
		div.innerHTML  = U3C_AGENT_HTML;
    div.parentNode.appendChild(div);
	}

}
