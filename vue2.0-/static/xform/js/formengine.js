/**
 * Created by cuixihang on 2016/10/20.
 */
//全局对象，用于引出内部方法
//alert("hehheh")
var engineGlobal = {};
(function (window) {
    //取出想要的方法
    engineGlobal.renderJSON = traverseJSON;
    engineGlobal.initForm = initForm;
    engineGlobal.printHTML = printHTML;
    engineGlobal.setHeader = setHeader;
    engineGlobal.saveCheck = saveCheck;
    engineGlobal.renderLayout = renderLayout;

    /*********************************表单json与html分离*******************************/

    //数据提交操作相关扩展
    $.fn.extend({
        //页面第一次加载
        xformRender: function (options) {
            var ops = $.extend({
                showmsg: true,
                data: {},
                url: window.api + "/html/showForm.do"
            }, options || {});

            var $ele = $(this);
            if ($.isArray($ele)) {
                $ele = $ele[0];
            }

           /* if (!ops.data.siteCode || !ops.data.formCode) {
                console && console.error("请配置sitecode和formCode");
                return
            }*/
            var $form;
            $.ajax({
                type: "post",
                url: ops.url,
                async: false,//采用同步,否则$form还未赋值就返回了
                data: ops.data
            }).done(function (formStr) {
                var header = formStr["title"];
                var htmlJson = JSON.parse(formStr["json"]);
                var formJson = htmlJson.children;
                var formHiddenFields=htmlJson.dataOption.hiddenfields;
                var formValue = formStr["defaultVales"];
                var formReadOnly = formStr["readOnlyNames"];
                var formHidden = formStr["hiddenElements"];
                var formParameter=formStr["baseParameter"];
                var formJsAttribute=formStr["attribute"];
                var formUrl=window.api/*formStr["webUrl"]*/;
                setHtmlByParameter(formJson,formValue,formReadOnly,formHidden,formParameter,formUrl);
                var formPreview = traverseJSON(htmlJson);
                formPreview = showHtmlStr(formPreview, (ops.data.siteCode == undefined) ? formStr["siteCode"] :ops.data.siteCode,
                    (ops.data.formCode == undefined) ? formStr["formCode"] : ops.data.formCode,formHiddenFields, setHeader(header),formJsAttribute);
                $ele.html(formPreview);
                $form = $('form', $ele);
                new utry.Application;
                ops.rendered && ops.rendered($form);
                renderLayout($(".ut-container"));
            }).fail(function () {
                ops.fail && ops.fail();
            });
            this.xformFileUpLoad($form);
            return $form;
        },
        //提交数据
        xformSubmit: function (options) {
            var ops = $.extend({
                preventEmpty: true,
                enctype: 'object',
                action: window.api + "/data/submit.do",
                method: 'post'
            }, options || {});

            var $ele = $(this);
            if ($.isArray($ele)) {
                $ele = $ele[0];
            }
            $form = $('form', $ele);
            var form = utry.get($form.attr("id"));
            form.submit(ops);
        },
        //数据回显
        xformEcho: function (options) {
            var ops = $.extend({
                url: window.api + "/html/echo.do",
                data: {}
            }, options || {});
            var $ele = $(this);
            if ($.isArray($ele)) {
                $ele = $ele[0];
            }

            if (!ops.data.dataId) {
                console && console.error("请配置数据ID");
                return
            }
            $.ajax({
                type: "post",
                async: false,
                url: ops.url,
                data: ops.data,
                dataType: "json"
            }).done(function (data) {
                if (data.code == "0") {
                    var header = data.title;
                    var htmlJson = JSON.parse(data.json);
                    var formJson = htmlJson.children;
                    var formHiddenFields=htmlJson.dataOption.hiddenfields;
                    var formValue = data.echoVales;
                    var formReadOnly = data.readOnlyNames;
                    var formHidden = data.hiddenElements;
                    var formParameter=data.baseParameter;
                    var formJsAttribute=data.attribute;
                    var formUrl=window.api/*data.webUrl*/;
                    setHtmlByParameter(formJson,formValue,formReadOnly,formHidden,formParameter,formUrl);
                    var formPreview = traverseJSON(htmlJson);
                    var formHtmlData = showHtmlStr(formPreview, ops.data.siteCode,
                        ops.data.formCode,formHiddenFields, setHeader(header),formJsAttribute);
                    $ele.empty();
                    $ele.html(formHtmlData);
                    new utry.Application;
                    ops.echoed && ops.echoed($('form', $ele));
                    renderLayout($(".ut-container"));
                }
            }).fail(function () {
                ops.fail && ops.fail();
            });

        },
        //数据删除
        xformDel:function(options){
            var ops = $.extend({
                url:window.api + "/data/del.do",
                data:{}
            },options || {});
            var $ele = $(this);
            if($.isArray($ele)){
                $ele = $ele[0];
            }
            if(!ops.data.siteCode){
                console&&console.error("请配置子站编码");
                return
            }
            if(!ops.data.formCode){
                console&&console.error("请配置数据表单编码");
                return
            }
            if(!ops.data.dataId){
                console&&console.error("请配置数据ID");
                return
            }
            $.ajax({
                type : "post",
                async : false,
                url : ops.url,
                data :ops.data,
                dataType : "json"
            })

        },
        //数据更新
        xformUpdate:function(options){

            var ops = $.extend({
                preventEmpty:true,
                enctype:'object',
                action:window.api + "/data/update.do",
                data:{},
                method:'post'
            },options || {});

            var $ele = $(this);
            if($.isArray($ele)){
                $ele = $ele[0];
            }
            if(!ops.params.formdataid){
                console&&console.error("请配置数据ID");
                return
            }
            $form = $('form',$ele);
            //$form.append('<input type="hidden" name="formdataid" value="'+ops.data.dataId+'"/>');
            var form = utry.get($form.attr("id"));
            form.submit(ops);

        },
        //文件上传
        xformFileUpLoad:function($form){
            var form = utry.get($form.attr("id"));
            var components = form.childComponents;
            if(components.length > 0){
                $.each(components, function(index, val){
                    if(val instanceof utry.FileUpload){
                        utry.Application.addLoadListener(function() {
                            var name = val.options.name;
                            val.on("onUploadComplete",function(item, content){
                                console.log("file upload complete");
                                var input = '<input type="hidden" name="'+ name +'" value="'+ content +'">';
                                $("form .hidden").find("input[name='"+ name +"']").remove();
                                $("form .hidden").append(input);
                            });
                        });
                    };
                });
            }
        }
    });

  var temp=0;
    function resolveToList(list,jsonList,i){
		 $.each(list,function (index,val) {
			if(utry.isArray(list[index])){
				resolveToList(list[index],jsonList,i);
	    	}else{
	    		var newChildren=list[index].children
	    		if( newChildren == undefined||newChildren==""||newChildren==null ){
            //jsonList[i]=list[index];
            //i++;
            jsonList[temp]=list[index];
            temp++;
	    		}else{
	    			resolveToList(newChildren,jsonList,i);
	    		}
	    	}
		 });
    }

    //通过所传值(json)对控件的值、是否只读、是否隐藏进行设置
    function setHtmlByParameter(formJson,formValue,formReadOnly,formHidden,formParameter,formUrl){
    	var jsonList=[];
    	var i=0;
    	temp = 0;
    	if(utry.isArray(formJson)){
    		resolveToList(formJson,jsonList,i);
    	}else{
    		var newChildren=formJson.children
    		if( newChildren == undefined||newChildren==""||newChildren==null ){
	    		jsonList[i]=formJson;
	    		i++;
    		}else{
    			resolveToList(newChildren,jsonList,i);
    		}
    	}

        jQuery.each(jsonList, function (k, valJson) {
            var nameJson = jsonList[k].dataOption.name;
            jQuery.each(formValue, function (i, val) {
                if (nameJson == i) {
                    if(val.indexOf("fileName")>0 && val.indexOf("fileUrl")>0){
                        if(jsonList[k].type=="fileupload") {
                        	jsonList[k].dataOption.isDownload=true;
                        	jsonList[k].dataOption.fileName=JSON.parse(val).fileName;
                        	jsonList[k].dataOption.fileUrl=JSON.parse(val).fileUrl;
                            return true;
                        }
                    }
                    else {
                    	jsonList[k].dataOption.value = val;
                        return true;
                    }
                }
            });
            jQuery.each(formReadOnly, function (j, val) {
                if (nameJson == val) {
                	jsonList[k].dataOption.readonly = "readonly";
                    return true;
                }
            });
            jQuery.each(formHidden, function (j, val) {
                if (nameJson == val) {
                	jsonList[k].dataOption.hidden = "hidden";
                    return true;
                }
            });
            if (jsonList[k].type=="parameter") {
                if (typeof jsonList[k].dataOption.value == "undefined") {
                }
                else {
                    var valParameter = jsonList[k].dataOption.value;
                    jQuery.each(formParameter, function (p, val) {
                        if (valParameter == p) {
                        	jsonList[k].dataOption.value = val;
                            return true;
                        }
                    });
                }
            }
            var urlJson=jsonList[k].dataOption.url;
            if(urlJson==undefined||urlJson==""||urlJson==null){
            }else{
            	jsonList[k].dataOption.url=formUrl+urlJson.replace("..","");
            }
        });
    }

    //获取form字符串-设计时使用
    function showHtmlStr(bigTree, siteCode, formCode,
                         formHiddenFields, formheader,formJsAttribute) {
        var formJs="";
        if(formJsAttribute==undefined||formJsAttribute==null||formJsAttribute==""){
            formJs="";
        }else{
            if(formJsAttribute.jsContent==undefined||formJsAttribute.jsContent==""||formJsAttribute.jsContent==null){
            }else{
                formJs=formJs+"<script type='text/javascript' src=\'"+ formJsAttribute.jsContent +"\'></script>"
            }
            if(formJsAttribute.jsUrl==undefined||formJsAttribute.jsUrl==""||formJsAttribute.jsUrl==null){
            }else{
                var jsUrl=formJsAttribute.jsUrl.split("|");
                for(var i=0;i<jsUrl.length;i++){
                    if(jsUrl[i]==undefined||jsUrl[i]==null||jsUrl[i]==""){

                    }else{
                        formJs=formJs+"<script type='text/javascript' src=\'"+ jsUrl[i]+"\'></script>"
                    }
                }
            }
        }
        var hiddenFields="";
        if(formHiddenFields==undefined||formHiddenFields==""||formHiddenFields==null){
            hiddenFields="";
        }else{
            $.each(formHiddenFields, function (index, val) {
                hiddenFields+="<input type='hidden' " +
                    "name='" + formHiddenFields[index]["text"] + "' " +
                    "value='" + formHiddenFields[index]["value"] + "'/>" ;
            });
        }
        var formWrap = "<form class='utry-form' id='xform_utry_dync_form' action='../data/submit.do' method='post'>" +
            "<div class='hidden'>" +
            "<input type='hidden' name='xformSiteCode' value='" + siteCode + "'/>" +
            "<input type='hidden' name='xformFormCode' value='" + formCode + "'/>" +
            hiddenFields +
            "</div>" + formheader +
            "</form>";
        try {
            var formContent =$(formWrap).append(bigTree);
            var formFormJs=$(formContent).append(formJs);
            return formFormJs.prop("outerHTML");
        } catch (e) {
            var msg="<p><span style='font-size: 14px; font-weight: bold; color: red;'>" +
                "相关JavaScript引用出现错误，请确认文件是否存在或脚本是否正确！</span></p>"
            //formWrap=$(formWrap).append(msg);
            var formContent =$(formWrap).append(bigTree);
            return formContent.prop("outerHTML");
        }

    }

    //json模板替换功能
    String.prototype.temp = function (pubObj) {
        var obj = $.extend(true, {}, pubObj);
        if (obj && obj.dataOption) {
            obj.dataOption = JSON.stringify(obj.dataOption);
        }
        return this.replace(/\$\w+\$/gi, function (matchs) {
            var returns = obj[matchs.replace(/\$/g, "")];
            return (returns + "") == "undefined" ? "" : returns;
        });
    };

    var pos = window.api.indexOf('/', 7);
    var apiHost = window.api.substr(0, pos);
    var apiUri = window.api.substr(pos);

    /*********************************表单元素json字典*******************************/
    var JSONDict = {
        "json_container": {
            "type": "container",
            "eleType": "layout",
            "dataOption": {
                "name": "container",
                "hiddenfields": [{"text": "", "value": ""}]
            },
            "children": []
        },
        "json_header": {
            "type": "header",
            "eleType": "widget",
            "dataOption": {
                "name": "header",
                "text": "标题"
            }
        },
        "json_button": {
            "type": "button",
            "eleType": "widget",
            "dataOption": {
                "name": "button",
                "value": "按钮",
                "type": "button"
            }
        },
        "json_text": {
            "type": "text",
            "label": "输入框",
            "eleType": "widget",
            "dataOption": {
                "type": "text",
                "name": "text",
                "placeholder": "请填写...",
                "width": "100%",
                "rules":[{"name":"minlength","value":""},{"name":"maxlength","value":"256"}]
            }
        },
        "json_select": {
            "type": "select",
            "label": "下拉框",
            "eleType": "widget",
            "dataOption": {
                "id": "",
                "name": "select",
                "value": "",
                "url": "",
                "data": [
                    {"text": "--请选择--", "value": ""},
                    {"text": "选项一", "value": generateCode(3)},
                    {"text": "选项二", "value": generateCode(3)},
                    {"text": "选项三", "value": generateCode(3)}
                ],
                "width": "100%"
            },
            expand:{
                score:'',
                answer: ''
            }
        },
        "json_textarea": {
            "type": "textarea",
            "label": "文本域",
            "eleType": "widget",
            "dataOption": {
                "type": "textarea",
                "name": "textarea",
                "width": "100%",
                "rules":[{"name":"minlength","value":""},{"name":"maxlength","value":"256"}]
            }
        },
        "json_date": {
            "type": "date",
            "label": "日期",
            "eleType": "widget",
            "dataOption": {
                "type": "date",
                "name": "date",
                "width": "100%"
            }
        },
        "json_datetime": {
            "type": "datetime",
            "label": "日期时间",
            "eleType": "widget",
            "dataOption": {
                "type": "datetime",
                "name": "datetime",
                "width": "100%"
            }
        },
        "json_placeholder": {
            "type": "placeholder",
            "label": "占位符",
            "eleType": "widget",
            "dataOption": {
                "type": "placeholder",
                "name": "placeholder",
                "width": "100%"
            }
        },
        "json_radiogroup": {
            "type": "radiogroup",
            "label": "单选框",
            "eleType": "widget",
            "dataOption": {
                "id": "",
                "value": '',
                "name": "radiogroup",
                "url": "",
                "data": [
                    {"text": "选项一", "value": generateCode(3)},
                    {"text": "选项二", "value": generateCode(3)},
                    {"text": "选项三", "value": generateCode(3)}
                ],
                "width": "100%"
            },
            expand:{
                score:'',
                answer: ''
            }
        },
        "json_checkgroup": {
            "type": "checkgroup",
            "label": "多选框",
            "eleType": "widget",
            "dataOption": {
                "id": "",
                "value": "",
                "name": "checkgroup",
                "url": "",
                "data": [
                    {"text": "选项一", "value": generateCode(3)},
                    {"text": "选项二", "value": generateCode(3)},
                    {"text": "选项三", "value": generateCode(3)}
                ],
                "width": "100%"
            },
            expand:{
                score:'',
                answer: ''
            }
        },
        "json_row": {
            "type": "row",
            "eleType": "layout",
            "children": []
        },
        "json_col": {
            "type": "col",
            "eleType": "layout",
            "children": []
        },
        "json_tabs": {
            "type": "tabs",
            "eleType": "layout",
            "dataOption": {
                "id": "",
                "name": "tabs",
                "height": "200px",
                "data": [
                    {"title": "选项一"},
                    {"title": "选项二"},
                    {"title": "选项三"}
                ]

            }
        },
        "json_tabContainer": {
            "type": "tabContainer",
            "eleType": "layout",
            "children": []
        },
        "json_panel": {
            "type": "panel",
            "eleType": "layout",
            "dataOption": {
                "name": "panel",
                "title": "面板"
            }
        },
        "json_fileupload": {
            "type": "fileupload",
            "label": "文件上传",
            "eleType": "widget",
            "dataOption": {
                "name": "fileupload",
                "action": apiHost + "/zuul" + apiUri + "/fileForm/upload.do?accessToken=" + window.accessToken,
                "isCheck": false,
                "allow": ""
            }
        },
        "json_statictext": {
            "type": "statictext",
            "eleType": "widget",
            "label": "请添加说明信息",
            "dataOption": {}
        },
        "json_line": {
            "type": "line",
            "eleType": "widget",
            "dataOption": {}
        },
        "json_hiddenfields": {
            "type": "hiddenfields",
            "label": "隐藏域",
            "eleType": "widget",
            "dataOption": {
                "type": "hidden",
                "name": "hiddenfields",
                "value": "",
                "width": "100%"
            }
        },
        "json_parameter": {
            "type": "parameter",
            "label": "基础参数",
            "eleType": "widget",
            "dataOption": {
                "type": "text",
                "name": "parameter",
                "width": "100%",
                "disabled": true,
                "value": ""
            }
        }
    };

    /*********************************控件模板字典*************************************/
    var widgetDict = {
        "text_tmpl": "<input class='utry-input' data-options='$dataOption$'>",

        "textarea_tmpl": "<input class='utry-input' data-options='$dataOption$'>",

        "date_tmpl": "<input class='utry-input' data-options='$dataOption$'>",

        "datetime_tmpl": "<input class='utry-input' data-options='$dataOption$'>",

        "placeholder_tmpl": "<input class='utry-input' disabled data-options='$dataOption$'>",

        "select_tmpl": "<select class='utry-select' data-options='$dataOption$'></select>",

        "radiogroup_tmpl": "<div class='utry-radiogroup' data-options='$dataOption$'></div>",

        "checkgroup_tmpl": "<div class='utry-checkgroup' data-options='$dataOption$'></div>",

        "button_tmpl": "<input class='utry-input' data-options='$dataOption$'/>",

        "header_tmpl": "<p class=\"ut-formEngine-header\">fdfdf</p>",

        "fileupload_tmpl": "<div class='utry-fileupload' data-options='$dataOption$'><div>",

        "statictext_tmpl": "<div class='ut-formEngine-statictext'>$label$</div>",

        "line_tmpl": "<hr class='ut-formEngine-line' />",

        "hiddenfields_tmpl": "<input class='utry-input' data-options='$dataOption$'>",

        "parameter_tmpl": "<input class='utry-input fe-parastatic' data-options='$dataOption$'>"
    };

    /********************************容器模板字典************************************/
    var layoutDict = {
        "row_tmpl": "<div class='ut-layout-shell ut-container fenode'>" +
        "<div class='ut-delete'></div>" +
        "</div>",

        "col_tmpl": "<div class='$gridType$ fenode'></div>",

        "col1_tmpl": "<div class='ut-col-1 fenode'></div>",

        "col2_tmpl": "<div class='ut-col-1 fenode'></div>" +
        "<div class='ut-col-1 fenode'></div>",

        "col3_tmpl": "<div class='ut-col-1 fenode'></div>" +
        "<div class='ut-col-1 fenode'></div>" +
        "<div class='ut-col-1 fenode'></div>",

        "col4_tmpl": "<div class='ut-col-1 fenode'></div>" +
        "<div class='ut-col-1 fenode'></div>" +
        "<div class='ut-col-1 fenode'></div>" +
        "<div class='ut-col-1 fenode'></div>",

        "col2-10_tmpl": "<div class='ut-col-2 fenode'></div>" +
        "<div class='ut-col-10 fenode'></div>",

        "tabs_tmpl": "<div class='utry-tabs' data-options='$dataOption$'></div>",

        "panel_tmpl": "<div class='utry-panel' data-options='$dataOption$'></div>",

        "container_tmpl": '<div class="ut-formEngine-content fenode" datatree=\'{' +
        '               "type":"container"}\'>' +
        '        </div>'
        //可折叠控件暂时没有
    };

    // //扩展json字典
    // var expandFun = function(nodeType, obj, fun){
    //     if(obj){
    //         for(value in obj){
    //             JSONDict[nodeType].expand[value] = obj[value];
    //         }
    //     }
    // }


    //当前操作的控件
    var nowObj;
    //表单提交的信息
    var formInfo;
    //表单结构树
    var bigTree;
    //脚本格式——URL路径
    var _jsUrl="";
    //脚本格式——JS编辑
    var _jsContent="";

    //设置表单标题
    function setHeader(headerContent) {
        var header = "<p class='ut-formEngine-header'>" + headerContent + "</p>"
        return header;
    }

    //初始化表单
    function initForm() {
        //当前选中的编辑对象-全局
        utry.parse(".ut-formEngine-slide");
        nowObj;
        formInfo = {};
        bigTree = JSONDict["json_container"];

        if (typeof formMetadata === 'string') {
          formMetadata = JSON.parse(formMetadata);
        }

        if (operate == "add") {
            //新增表单
            var formContent = traverseJSON(bigTree);
            $(".ut-formEngine-content-wrap > form").html(formContent);
            // formInfo.formCode = formMetadata.formCode;
            formInfo.formJsonStr = JSON.stringify(bigTree);
            formInfo.formHtmlStr = formContent.prop("outerHTML");
            // formInfo.siteCode = formMetadata.siteCode;
            $(".ut-formEngine-content-wrap > form").prepend(setHeader(formMetadata.formTitle));
        } else if (operate == "update") {
            //编辑已有表
            // formInfo.formCode = formMetadata.formCode;
            // formInfo.siteCode = formMetadata.siteCode;

            bigTree = JSON.parse(originalJson);
          //处理bigTree中的url
          if (bigTree.children) {
            bigTree.children.forEach(function (item) {
              if (item.type === "fileupload") {
                var url = item.dataOption.action;
                var newUrl = apiHost + "/zuul" + apiUri + url + "?accessToken=" + window.accessToken;
                item.dataOption.action = newUrl;
                return;
              } else if (item.dataOption && item.dataOption.url && item.dataOption.url != "") {
                var url = item.dataOption.url;
                item.dataOption.url = window.api + url;
                return;
              }
            });
          }

            $(".ut-formEngine-content-wrap > form").html(traverseJSON(bigTree));
            utry.parse($(".ut-formEngine-content-wrap > form"));
            renderLayout($(".ut-container"));
            $(".ut-formEngine-content-wrap > form").prepend(setHeader(formMetadata.formTitle));
            dragInit();
            dragAndSort();
            replaceSingleQuote();
            if(jsUrl==undefined||jsUrl==null||jsUrl==""){
                _jsUrl=""
            }else{
                _jsUrl=jsUrl;
            }
            if(jsContent==undefined||jsContent==null||jsContent==""){
                _jsContent=""
            }else{
            _jsContent=GetJSByKey(jsContent);
            }
        }
        downAndUpByForm();
        dragAndSort();
        deleteInit();
        $(document).on("click", "#ut-form-preview", function (e) {
            previewForm();
        });
        $(document).on("click", ".ut-form-save", function (e) {
            saveForm();
        });
        $(document).on("click", ".ut-form-code", function (e) {
            getCodeOfForm();
        });
        $(document).on("click", "#preview", function (e) {
            preview();
        });
    }

    //通过urlKey去获取js脚本信息
    function GetJSByKey(keyUrl) {
       var sUrl= window.api + "/form/getJS.do?urlKey="+keyUrl;
        var vReturn="";
        $.ajax({
            type: "post",
            url: sUrl,
            async: false//采用同步,否则$form还未赋值就返回了
        }).done(function (data) {
            vReturn=data.data;
        }).fail(function () {
            vReturn="";
        });
        return vReturn;
    }

    //添加新控件-JSON转html
    function realWidgetHTML(widgetName) {
        var widgetJson = JSONDict["json_" + widgetName];
        if (widgetName != "statictext" && widgetName != "line") {
            widgetJson.dataOption.name = generateName(widgetName);
        }
        var widgetTmp = widgetDict[widgetName + "_tmpl"];
        var content = widgetTmp.temp(widgetJson);
        var shellHtml = "";
        if (widgetName == "placeholder") {
            shellHtml = "<div class='ut-widget-shell fenode form_placeholder'>";
        } else if (widgetName == "line") {
            shellHtml = "<div class='ut-widget-shell fenode'>";
        } else if (widgetName == "hiddenfields") {
            shellHtml = "<div class='ut-widget-shell fenode ut-feCanEdit form_hiddenfields'>";
        } else {
            shellHtml = "<div class='ut-widget-shell fenode ut-feCanEdit'>";
        }


        var labelHtml = "";
        if (widgetName != "button" && widgetName != "line" && widgetName != "statictext") {
            labelHtml = "<label for='' class='ut-form-label ut-felabel'>" + widgetJson.label + "</label>";
        } else {
            labelHtml = "";
        }
        var shell = shellHtml +
            "<div class='ut-delete'></div>" +
            getExpandHtml(widgetJson) +
            labelHtml +
            "<div class='contentWrap'>" + content + "</div>" +
            "</div>";
        return shell;
    }

    //添加新容器-JSON转html
    function realLayoutHTML(layoutName) {
        var layoutJson = JSONDict["json_" + layoutName];
        var layoutTmp = layoutDict[layoutName + "_tmpl"];
        var content = layoutTmp.temp(layoutJson);
        var shellHtml;
        if (layoutName == "panel") {
            shellHtml = "<div class='ut-layout-shell ut-container ut-feCanEdit fenode'>";
        } else {
            shellHtml = "<div class='ut-layout-shell ut-container fenode'>";
        }
        var shell = shellHtml +
            "<div class='ut-delete'></div>" +
            content +
            "</div>";
        if (layoutName == "col" || layoutName == "row") {
            shell = content;
        }
        return shell;
    }

    //判断是否为必填项
    function isRequire(json) {
        var result = false;
        if (json.type != "statictext" && json.type != "line") {
            var rules = json.dataOption.rules;
            if (rules != undefined && rules.length > 0) {
                $.each(rules, function (index, val) {
                    if (val.name == "required") {
                        result = true;
                    }
                });
            } else {
                result = false;
            }
        } else {
            result = false;
        }
        return result;
    }

    //控件渲染-json转html
    function renderWidgetHTML(json) {
        if (json.type == "container") {
        }
        else {
            var content = widgetDict[json.type + "_tmpl"];
            //回显上传文件时
            if(json.type=="fileupload"&& json.dataOption.isDownload==true) {
                var jsonContent=json;
                jsonContent.dataOption.showSelectBtn=false;
                jsonContent.dataOption.showUploadBtn=false;
                jsonContent.dataOption.showName=false;
                jsonContent.dataOption.isDelete=false;
                var tempContent=content.temp(jsonContent);
                var contentOptions=$(tempContent).attr("data-options");
                var optionsNew="{" + contentOptions.replace('{',' ').replace('}',' ') +
                    ",\"onDownload\": downloadFileFun "+"}";
                //下载文件方法
                var jsDownLoad="<script type=\"text/javascript\">" +
                    "function downloadFileFun(file){ " +
                    "var url=\"" + window.api + "/fileForm/download.do\";" +
                    "var form = $(\"<form id='downloadForm'><\/form>\");" +
                    "form.attr('action',url);" +
                    "form.attr('method','post');" +
                    "form.appendTo(\"body\");" +
                    "form.append(\"<input type='hidden' name='fileUrl' id='fileUrl'/>\");" +
                    "$(\"#fileUrl\").val(file.fileUrl);" +
                    "form.css('display','none'); " +
                    "form.submit();form.remove();" +
                    "return false;}" +
                    "<\/script>";
                //文件相关属性整合
                var newContent=jsDownLoad+"<div class='utry-fileupload' data-options='"+ optionsNew+"'></div>";
                content=newContent;
            }else {
                content = content.temp(json);
            }
            var shellHtml = "";
            if (json.type == "placeholder") {
                shellHtml = "<div class='ut-widget-shell fenode form_placeholder'>";
            } else if (json.type == "line") {
                shellHtml = "<div class='ut-widget-shell fenode'>";
            } else if (json.type == "hiddenfields") {
                shellHtml = "<div class='ut-widget-shell fenode ut-feCanEdit form_hiddenfields'>";
            } else {
                //判断是否为隐藏
                if (typeof json.dataOption.hidden == "undefined") {
                    shellHtml = "<div class='ut-widget-shell ut-feCanEdit fenode'>";
                }
                else {
                    shellHtml = "<div class='hidden'>";
                }
            }

            var labelHtml = "";
            var reqHtml = "<span class='req'>*</span>";
            if (!isRequire(json)) {
                reqHtml = "";
            }
            if (json.type != "button" && json.type != "line" && json.type != "statictext") {
                labelHtml = "<label for='' class='ut-form-label ut-felabel'>" + json.label + reqHtml + "</label>";
            } else {
                labelHtml = "";
            }

            var shell = shellHtml +
                "<div class='ut-delete'></div>" +
                getExpandHtml(json) +
                labelHtml +
                "<div class='contentWrap'>" + content + "</div>" +
                "</div>";
            return shell;
        }
    }
    //获取试卷扩展html
    function getExpandHtml(widgetJson){
        if(!formMetadata.isPaper){
            return ""
        }

        var expandHtml = "";
        if(widgetJson.type == "radio" || widgetJson.type == "checkgroup" || widgetJson.type == "radiogroup"){
            expandHtml = "<div style='text-align:right;position:absolute;right:0;bottom:0;'><span style='margin-right:10px;'>答案："+ widgetJson.expand.answer +"</span><span>分值："+ widgetJson.expand.score +"</span></div>";
        }
        return expandHtml;
    }

    //容器渲染-json转html
    function renderLayoutHTML(json) {
        var layoutName = json.type;
        var content = layoutDict[layoutName + "_tmpl"];
        content = content.temp(json);
        var shellHtml;
        if (layoutName == "panel") {
            shellHtml = "<div class='ut-layout-shell ut-container ut-feCanEdit fenode'>";
        } else {
            shellHtml = "<div class='ut-layout-shell ut-container fenode'>";
        }
        var shell = shellHtml +
            "<div class='ut-delete'></div>" +
            content +
            "</div>";
        if (layoutName == "col" || layoutName == "row" || layoutName == "container") {
            shell = content;
        }
        return shell;
    }

    //表单容器的鼠标单击触发
    function downAndUpByForm() {
        $(".ut-formEngine-content-wrap").mousedown(function (event) {
            var tar = event.toElement.className;
            if (tar.indexOf("ut-layout-shell") != -1 || tar.indexOf("ut-col-1") != -1 || tar.indexOf("ui-sortable") != -1) {
                //当点击的是布局控件时不进行处理
            }
            else {
                var conData = $(".ut-formEngine-content").attr("datatree");
                var jsonData = JSON.parse(conData);
                if (jsonData.dataOption == "" || jsonData.dataOption == undefined || jsonData.dataOption == null) {
                    var tmpJson = JSONDict["json_container"];
                    $(event.currentTarget).attr("datatree", JSON.stringify(tmpJson));
                    $(".ut-formEngine-content").attr("datatree", JSON.stringify(tmpJson));
                } else {
                    $(event.currentTarget).attr("datatree", conData);
                    $(".ut-formEngine-content").attr("datatree", conData);
                }
            }
        });
        $(".ut-formEngine-content-wrap").mouseup(function (event) {
            var tar = event.toElement.className;
            if (tar.indexOf("ut-layout-shell") != -1 || tar.indexOf("ut-col-1") != -1 || tar.indexOf("ui-sortable") != -1) {
                //当点击的是布局控件时不进行处理
            }
            else {
                utry.parse($(".ut-formEngine-content-wrap"));
                utry.print(bigTree = updateJSON($(".ut-formEngine-content-wrap .ut-formEngine-content")));
            }
        });
    }

    //元素拖动和放置功能
    function dragAndSort() {
        $(".ut-widget-sample").draggable({
            connectToSortable: ".ut-formEngine-content, .ut-formEngine-content-wrap .ut-tabs-panel-body, .ut-panel .ut-body",
            cursor: "move",
            helper: "clone",
            start: function (event, ui) {
                ui.helper.addClass("ut-helper");
                var widgetType = ui.helper.attr("widgetType");
                $(event.target).find(".ut-view").html(realWidgetHTML(widgetType));
                var tmpJson = JSONDict["json_" + widgetType];
                $(event.target).find(".ut-view").children(".fenode").attr("datatree", JSON.stringify(tmpJson));
            },
            drag: function (event, ui) {

            },
            stop: function (event, ui) {
                var coreContent = $(".ut-formEngine-content .ut-view").html();
                $(".ut-formEngine-content .ut-widget-sample").replaceWith(coreContent);
                utry.parse($(".ut-formEngine-content"));
                utry.print(bigTree = updateJSON($(".ut-formEngine-content-wrap .ut-formEngine-content")));
            }
        });

        $(".ut-layout-sample").draggable({
            connectToSortable: ".ut-formEngine-content, .ut-formEngine-content-wrap .ut-tabs-panel-body, .ut-panel .ut-body",
            cursor: "move",
            helper: "clone",
            start: function (event, ui) {
                ui.helper.addClass("ut-helper");
                var layoutType = ui.helper.attr("layoutType");
                $(event.target).find(".ut-view").html(realLayoutHTML(layoutType));

                //栅格系统添加class
                var rowType = JSONDict["json_" + layoutType];
                if (!rowType) {
                    rowType = JSONDict["json_row"];
                }
                $(event.target).find(".ut-view").children(".fenode").attr("datatree", JSON.stringify(rowType));
                var arrayCol = $(event.target).find("div[class^='ut-col-']");
                $.each(arrayCol, function (index, val) {
                    var arrayClass = $(val).attr("class").split(" ");
                    var dataTree = JSONDict["json_col"];
                    dataTree.gridType = arrayClass[0];
                    $(val).attr("datatree", JSON.stringify(dataTree));
                });
            },
            drag: function (event, ui) {

            },
            stop: function (event, ui) {
                //渲染栅格
                renderLayout($(".ut-container"));
                //从拖动内容中剥离核心内容
                var coreContent = $(".ut-formEngine-content .ut-view").html();
                $(".ut-formEngine-content .ut-layout-sample").replaceWith(coreContent);
                //渲染utry控件
                utry.parse($(".ut-formEngine-content"));
                //新添加的栅格可排序
                $(".ut-formEngine-content div[class^='ut-col-'], .ut-formEngine-content-wrap .ut-tabs-panel-body, .ut-panel .ut-body").sortable({
                    opacity: .35,
                    delay: 300,
                    placeholder: "ut-sortable-placeholder",
                    connectWith: "div[class^='ut-col-'], .ut-formEngine-content, .ut-tabs-panel-body, .ut-panel .ut-body",
                    start: function (event, ui) {
                        ui.placeholder.height(ui.item.height());
                    },
                    stop: function (event, ui) {
                        utry.print(bigTree = updateJSON($(".ut-formEngine-content-wrap .ut-formEngine-content")));
                    }
                });
                //更新原始树
                utry.print(bigTree = updateJSON($(".ut-formEngine-content-wrap .ut-formEngine-content")));
            }
        });

        $(".ut-formEngine-content,  .ut-formEngine-content div[class^='ut-col-'], .ut-body").sortable({
            connectWith: "div[class^='ut-col-'], .ut-formEngine-content, .ut-formEngine-content-wrap .ut-tabs-panel-body, .ut-panel .ut-body",
            opacity: .35,
            delay: 300,
            placeholder: "ut-sortable-placeholder",
            start: function (event, ui) {
                ui.placeholder.height(ui.item.height());
            },
            stop: function (event, ui) {
                utry.print(bigTree = updateJSON($(".ut-formEngine-content-wrap .ut-formEngine-content")));
            }
        });
    }

    //自定义栅格系统渲染
    function renderLayout(containers) {
        $.each(containers, function (index, val) {
            var columns = $(val).children('div[class^="ut-col-"]');
            var unitNum = 0;
            $.each(columns, function (index, el) {
                var splitClass = $(el).attr("class").split("-");
                unitNum += parseInt(splitClass[splitClass.length - 1]);
            });
            var eachWidth = 100 / unitNum;
            $.each(columns, function (index, el) {
                var splitClass = $(el).attr("class").split("-");
                var eachNum = parseInt(splitClass[splitClass.length - 1]);
                $(el).css('width', eachWidth * eachNum + '%');
            });
        });
    }

    //属性变化触发
    function attrChange() {
        if (attrEditValidate() == true) {
            var json = attrToJson();
            if (json.type == "container") {
                formRefresh(json);
                isSaved = false;
            } else {
                if (json.type == "panel") {
                    nowObj.children(".ut-panel").children(".ut-title").children(".ut-panel-title").text(json.dataOption.title);
                } else {
                    widgetRefresh(json);
                    isSaved = false;
                }
            }
        } else {
            return;
        }
    }

    //删除、设置功能初始化
    function deleteInit() {
        $(document).on("mouseenter", ".ut-formEngine-content-wrap .ut-widget-shell, .ut-formEngine-content-wrap  .ut-layout-shell", function (e) {
            $(this).find(".ut-delete, .ut-setting").show();
        });
        $(document).on("mouseleave", ".ut-formEngine-content-wrap .ut-widget-shell, .ut-formEngine-content-wrap .ut-layout-shell", function (e) {
            $(this).find(".ut-delete, .ut-setting").hide();
        });
        $(document).on("click", ".ut-formEngine-content-wrap .ut-delete", function (e) {
            showDeleteConfirm($(e.currentTarget));
            return false;
        });
        $(document).on("click", ".ut-feCanEdit", function (event) {
            $(".ut-left-head").html("控件设置");
            event.stopPropagation();
            nowObj = $(this);
            $(".ut-feSelected").removeClass("ut-feSelected");
            nowObj.addClass("ut-feSelected");
            initAttr($(this));
        });
        //点击表单外部div事件
        $(document).on("click", ".ut-formEngine-content-wrap", function (event) {
            var tar = event.toElement.className;
            if (tar.indexOf("ut-layout-shell") != -1 || tar.indexOf("ut-col-1") != -1 || tar.indexOf("ui-sortable") != -1) {
                //当点击的是布局控件时不进行处理
            }
            else {
                $(".ut-left-head").html("表单设置");
                //需增加属性
                nowObj = $(this);
                $(".ut-feSelected").removeClass("ut-feSelected");
                nowObj.addClass("ut-feSelected");
                initAttr($(this));
            }
        });
        //属性值之checkbox，radio编辑事件处理属性值之checkbox，radio编辑事件处理
        $(document).on("change", ".ut-formEdit-container input[type=radio], .ut-formEdit-container input[type=checkbox]", function (event) {
            attrChange();
        });

        //属性值之输入框编辑事件处理
        $(document).on("input propertychange", ".ut-formEdit-container input[type=text], .ut-formEdit-container input[type=number]", function (event) {
            //jQuery1.8在IE下无法绑定propertychange
            replaceSpecialChar($(event.currentTarget));
            attrChange();
        });

        //属性值之多行输入框编辑事件处理
        $(document).on("input propertychange", ".ut-formEdit-jsUrl,.ut-formEdit-jsContent", function (event) {
            attrChange();
        });

        $(document).on("click", ".delOpt", function (e) {
            if ($(this).parent().parent().parent().find(".oneOpt").length < 2) {
                return;
            } else {
                $(this).parent().parent().remove();
                attrChange();
            }
        });

        $(document).on("click", ".addOpt", function (e) {
            var addType = $(".ut-formEdit-container").attr("eleType") + "_tmpl";
            $(this).parent().parent().after(optTmpl[addType].temp({"text": "新增项", "value": generateCode(3)}));
            attrChange();
        });

        $(document).on("click", ".delHidden", function (e) {
            if ($(this).parent().parent().parent().find("tr").length < 3) {
                return;
            } else {
                $(this).parent().parent().remove();
                attrChange();
            }
        });

        $(document).on("click", ".addHidden", function (e) {
            $(this).parent().parent().after(optTmpl["container_tmpl"].temp({"text": "新增项", "value": generateCode(3)}));
            attrChange();
        });
        $(document).on("input propertychange", ".hiddenFName input[text],.hiddenFVal input[text]", function (event) {
            attrChange();
        });
    }

    //预览功能
    function previewForm() {
        utry.print(bigTree = updateJSON($(".ut-formEngine-content-wrap .ut-formEngine-content")));
        var formPreview = traverseJSON(bigTree);
        formPreview = formPreview.prepend(setHeader(formMetadata.formTitle));
        formPreview.find(".ut-feCanEdit").removeClass("ut-feCanEdit");
        utry("Window", {
            html: formPreview,
            title: '预览',
            width: '1000px',
            // height: '550px',
            shadow: true,
            // maximizable: true,
            id: "formPrev",
            buttons: [
                {
                    text: '保存表单',
                    id: 'saveInPreview',
                    name: 'saveInPreview',
                    className: 'ut-primary',
                    click: function () {
                        saveForm();
                    }
                },
                {
                    text: '返回',
                    id: 'backToDesign',
                    name: 'backToDesign',
                    click: function () {
                        this.close();
                    }
                }
            ]
        });
        renderLayout($(".ut-window .ut-container"));
    }
    // 预览
    function preview() {
        utry.print(bigTree = updateJSON($(".ut-formEngine-content-wrap .ut-formEngine-content")));
        var formPreview = traverseJSON(bigTree);
        formPreview = formPreview.prepend(setHeader(formMetadata.formTitle));
        formPreview.find(".ut-feCanEdit").removeClass("ut-feCanEdit");
        utry("Window", {
            html: formPreview,
            width: '1000px',
            // height: '550px',
            shadow: true,
            closable: false,
            id: "formPrev"
        });
    }
    //删除确认
    function showDeleteConfirm(target) {
        utry.confirm("是否删除？",
            function () {
                /*确认提示框确定的回调函数*/
                var delObj = target.parent();
                if (nowObj != null && nowObj != undefined && nowObj.is(delObj)) {
                    $(".ut-formEngine-attr").html("");
                    nowObj = null;
                }
                target.parent().remove();
                utry.print(bigTree = updateJSON($(".ut-formEngine-content-wrap .ut-formEngine-content")));
            },
            "删除",
            function () {
                /*确认提示框取消的回调函数*/
            });
    }

    //utry容器替换单引号
    function replaceSingleQuote() {
        var arrayObj = $("[datatree]");
        $.each(arrayObj, function (index, val) {
            var tempTree = $(val).attr("datatree");
            tempTree = tempTree.replace(/'/g, '"');
            $(arrayObj[index]).attr("datatree", tempTree);
        });
    }

    //Json实时更新
    function updateJSON(interObj) {
        isSaved = false;
        var arrayObj;
        var layoutType = JSON.parse($(interObj).attr("datatree")).type;
        if (layoutType == "tabs") {
            arrayObj = interObj.children(".ut-tabs-container").children(".ut-tabs-main").children(".ut-tabs-panel").children(".ut-tabs-panel-body");
            arrayObj.attr("datatree", JSON.stringify(JSONDict.json_tabContainer));
        } else if (layoutType == "panel") {
            arrayObj = interObj.children(".ut-panel").children(".ut-main").children(".ut-body").children(".fenode");
        } else {
            arrayObj = interObj.children(".fenode");
        }
        if (arrayObj && arrayObj.length > 0) {
            var tempData = JSON.parse($(interObj).attr("datatree"));
            $.each(arrayObj, function (index, val) {
                var subData = updateJSON($(val));
                if (!tempData.children) {
                    tempData.children = [];
                }
                tempData.children.push(subData);
            });
            return tempData;
        } else {
            var tempData = JSON.parse($(interObj).attr("datatree"));
            return tempData;
        }
    }

    //控件、布局的渲染
    function jsonToHtml(json) {
        var originHtml;
        var eleType = json.eleType;
        if (eleType == "widget") {
            originHtml = renderWidgetHTML(json);
        } else {
            originHtml = renderLayoutHTML(json);
        }
        return originHtml;
    }

  //判断是否为数字类型
    function judgeIsNumber(val) {
        if (val === undefined) {
          return false;
        }
        var vExec = /^(-)?\d+(\.\d+)?$/;
        if (vExec.exec(val) == null || val == "") {
        	var v = val?val.substring(0,1):"";
        	vExecN = /^[0-9]*$/;
        	 if (vExecN.exec(v) == null || val == ""){
        		 return false;
        	 }
            return true;
        } else {
            return true;
        }
    }
    //判断表单控件名称输入类型
    function judgeNameInput(formJsonObj) {
        var formChildren=formJsonObj.children;
        var canSave=true;
        if(formChildren==undefined||formChildren==""||formChildren==null){
            canSave=true;
        }else{ //判断有问题 暂时注释
        	canSave = ss(formChildren);
         /*   $.each(formChildren,function (index,val) {
                var nameVal=val.dataOption.name;
                if (judgeIsNumber(nameVal) == true) {
                    canSave = false;
                }
                if(canSave==false){
                    return true;
                }
            })*/
        }
        if(canSave == 1){
        	canSave = true;
        }else{
        	canSave = false;
        }
        return canSave;

    }

    function ss(formChildren){
    	var c=1;
    	 if(utry.isArray(formChildren)){
    		 $.each(formChildren,function (index,val) {
    			 c = ss(val);

    			 if(c==2){
    				 return false;
                 }
             })
    	 }else{
    		 if(formChildren.type != "container" && formChildren.type != "col" && formChildren.type != "row"){
    			 var nameVal=formChildren.dataOption.name;
                 if (judgeIsNumber(nameVal) == true) {
                   utry.alert(nameVal+" 控件表单名称输入不合法，控件表单名称不能全为数字类型和数字开头！");
                     c = 2;
                 }
                 if(c==2){
                     return c;
                 }
    		 }else{
    			 var newChildren = formChildren.children;
    			  if(newChildren==undefined||newChildren==""||newChildren==null){
    				 return c;
    			  }else{
    				  c =  ss(newChildren);
    				  if(c==2){
    	                  return c;
    	               }
    			  }
    		 }
    	 }

    	 return c;
    }


    //json遍历，组装html
    function traverseJSON(json) {
        if (json.children && json.children.length > 0) {
            if (json.type == "tabContainer") {

            } else {
                var originHtml = jsonToHtml(json);
                var subJson = $.extend(true, {}, json);
                delete subJson.children;
                originHtml = $(originHtml).attr("datatree", JSON.stringify(subJson));
            }
            $.each(json.children, function (index, val) {
                var tempHtml = traverseJSON(val);
                if (json.type == "tabs") {

                } else if (json.type == "panel") {
                    if (subJson.dataOption.html == undefined) {
                        subJson.dataOption.html = "";
                    }
                    subJson.dataOption.html += tempHtml.prop("outerHTML").replace(/&quot;/g, "&#x27;");
                    originHtml = jsonToHtml(subJson);
                    var subJson2 = $.extend(true, {}, subJson);
                    delete subJson2.dataOption.html;
                    originHtml = $(originHtml).attr("datatree", JSON.stringify(subJson2));
                } else if (json.type == "tabContainer") {

                } else {
                    originHtml = $(originHtml).append(tempHtml);
                }
            });
            return originHtml;
        } else {
            var subJson = $.extend(true, {}, json);
            delete subJson.children;
            var originHtml = jsonToHtml(json);
            originHtml = $(originHtml).attr("datatree", JSON.stringify(subJson));
            return originHtml;
        }
    }

    /********************************属性编辑****************************************************/
    var optTmpl = {
        "select_tmpl": '<div class="oneOpt">' +
        '     <input type="radio" class="optRadio" name="select" $checked$>' +
        '     <input type="text" class="ut-input optName" value="$text$" required>' +
        '     <input type="text" class="ut-input optVal" value="$value$">' +
        '     <div class="Opt-container">' +
        '       <div class="delOpt"></div>' +
        '       <div class="addOpt"></div>' +
        '     </div>' +
        '</div>',

        "radiogroup_tmpl": '<div class="oneOpt">' +
        '     <input type="radio" class="optRadio" name="select" $checked$>' +
        '     <input type="text" class="ut-input optName" value="$text$" required>' +
        '     <input type="text" class="ut-input optVal" value="$value$">' +
        '     <div class="Opt-container">' +
        '       <div class="delOpt"></div>' +
        '       <div class="addOpt"></div>' +
        '     </div>' +
        '</div>',

        "checkgroup_tmpl": '<div class="oneOpt">' +
        '     <input type="checkbox" class="optRadio" name="select" $checked$>' +
        '     <input type="text" class="ut-input optName" value="$text$" required>' +
        '     <input type="text" class="ut-input optVal" value="$value$">' +
        '     <div class="Opt-container">' +
        '       <div class="delOpt"></div>' +
        '       <div class="addOpt"></div>' +
        '     </div>' +
        '</div>',

        "container_tmpl": '<tr>' +
        '<td><input type="text" class="ut-input hiddenFName" value="$text$" required></td>' +
        '<td><input type="text" class="ut-input hiddenFVal" value="$value$"></td>' +
        '<td><div class="delHidden"></div><div class="addHidden"></div></td>' +
        '</tr>',

        'checkgroupAnswer_tmpl': '<div class="oneAnswer">'+
        '  <label><input type="checkbox" class="optAnswer" name="answer" $checked$ value=$value$>$text$</label>' ,

        'radiogroupAnswer_tmpl': '<div class="oneAnswer">'+
        '  <label><input type="radio" class="optAnswer" name="answer" $checked$ value=$value$>$text$</label>'
    }

    //产生唯一的name
    function generateName(widgetType) {
        var name = widgetType + '_' + new Date().getTime();
        return name;
    }

    function getOptTmpl(type) {
        return optTmpl[type + "_tmpl"];
    }

    //打开属性面板
    function openEditWindow(content) {
        $(".ut-formEngine-attr").html(content);
    }

    /***********************所有类型控件属性设置函数集合*****************************/
    function replaceSpecialChar(target) {
        var regular = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5\@\.\_\-\——\:\：\,\，\。\?\？\;\；\(\)\%]/g;
        if (target.hasClass("ut-formEdit-minChar") || target.hasClass("ut-formEdit-maxChar")) {
            regular = /[^\d]/g;
        }
        var tmpVal = target.val();
        if (regular.test(tmpVal)) {
            target.val(tmpVal.replace(regular, ''));
        }
    }

    function attrEditValidate() {
        var result = true;
        var validArry = $(".ut-formEngine-attr").find("[required]");
        validArry.removeClass("ut-error");
        if (validArry != undefined && validArry != null && validArry.length > 0) {
            $.each(validArry, function (index, val) {
                var tmpVal = $(val).val().trim();
                if (tmpVal == "") {
                    $(val).addClass("ut-error");
                    result = false;
                }
            });
        }
        return result;
    }

    var editFun = {};

    //表单属性中的隐藏域操作
    function modifyHiddenFields(widgetJson){
        var optTmpl = getOptTmpl(widgetJson.type);
       var optContent='<tr><td style="width:42%; text-align: center;">控件名称</td>' +
           '<td  style="width:42%;text-align: center;">默认值</td>' +
           '<td style="width:15%;text-align: center;"></td></tr>'
        var objHidden=widgetJson.dataOption.hiddenfields;
        if(objHidden==undefined||objHidden==null || objHidden==""){
            optContent = $(optContent).append(optTmpl.temp(""));
        }else {
            $.each(widgetJson.dataOption.hiddenfields, function (index, val) {
                optContent = $(optContent).append(optTmpl.temp(val));
            });
        }
        return optContent;
    }

    //表单容器HTML
    editFun.edit_container = function (widgetJson) {
        var vUrlData="expand:true,title:'脚本格式——URL路径'";
        var vContentData="expand:false,title:'脚本格式——JS编辑'";
        var vHiddenData="expand:false,title:'隐藏域'";
        var optContent =modifyHiddenFields(widgetJson);
        optContent=optContent.prop("outerHTML");
        var container = '<div class="ut-formEdit-container" eleType="container">' +
            '<div class="ut-formEdit-line">' +
            '<p>表单名称</p>' +
            '<input type="text" class="ut-input ut-formEdit-name" value="'
            + widgetJson.dataOption.name + '" required>' +
            '</div>' +
            '<div class="ut-formEdit-line">' +
            '<div class="utry-panel" data-options="'+ vUrlData +'">' +
            ' <textarea class="ut-input ut-formEdit-jsUrl" placeholder="格式一：${子站编码}/根目录/xxx.js ' +
            '\n格式二：http://0.0.0.0/.../xxx.js\n其中格式一与格式二之间用竖线(|)进行分割' +
            '\n例：${100100}/js/formTest.js|http://10.0.2.135:9999/hrm/js/formTest.js">'+ _jsUrl +'</textarea>' +
            '</div></div>' +
            '<div class="ut-formEdit-line">' +
            '<div class="utry-panel" data-options="'+ vContentData +'">' +
            ' <textarea class="ut-input ut-formEdit-jsContent" placeholder="需输入正确的javascript脚本！' +
            '\n例：function alertMsg(this){\n alert(this.message);\n}">'+ _jsContent +'</textarea>' +
            '</div></div>' +
            '<div class="ut-formEdit-line">' +
            '<div class="utry-panel" data-options="'+ vHiddenData +'">' +
            '<table id="tbHiddenFields" border="0" style="width:100%">'
            + optContent + '</table>' +
            '</div></div>' +
            '</div>';
        openEditWindow(container);
        utry.parse($(".ut-formEdit-line"));
    };

    function getAnswerHtml(widgetJson){
        var optAnswerTmpl = getOptTmpl(widgetJson.type + "Answer");
        var optAnswer = '<div class="answer-option">' + '</div>';
        $.each(widgetJson.dataOption.data, function (index, val) {
            var checked;
            if(widgetJson.type == "checkgroup"){
                var target = val.value
                if (widgetJson.expand.answer && widgetJson.expand.answer.find(function(item){return item == target})) {
                    checked = "checked"
                } else {
                    checked = "";
                }
            }else{
                if (widgetJson.expand.answer == val.value) {
                    checked = "checked"
                } else {
                    checked = "";
                }
            }
            val.checked = checked;
            optAnswer = $(optAnswer).append(optAnswerTmpl.temp(val));
        });
        return optAnswer.html()
    }

    function getExpandEditHtml(widgetJson){
        if(!formMetadata.isPaper){
            return ""
        }

        //试卷扩展
        var expandHtml = '';
        if(widgetJson.type != "select"){
            expandHtml =
            '<div class="ut-formEdit-line">' +
            '<p>分值</p>' +
            '<input type="number" min=0 class="ut-input ut-formEdit-score" value="' + widgetJson.expand.score + '">' +
            '</div>' +
            '<div class="ut-formEdit-line">' +
            '<p>答案</p>' +
            //'<input type="text" class="ut-input ut-formEdit-answer" value="' + widgetJson.expand.answer + '">' +
            getAnswerHtml(widgetJson) +
            '</div>';
            return expandHtml;
        }
        return expandHtml;
    }

    //下拉处理
    editFun.edit_select = function (widgetJson) {
        var optContent = '<div class="edit-option">' +
            '    <p>选项</p>' +
            '    <span class="optNameLabel">选项名</span><span class="optValLabel">选项值<span>' +
            '</div>';
        var container = '<div class="ut-formEdit-container" eleType="select">' +
            '<div class="ut-formEdit-line">' +
            '<p>标题</p>' +
            '<input type="text" class="ut-input ut-formEdit-label" maxlength="100" value="' + widgetJson.label + '">' +
            '</div>' +
            '<div class="ut-formEdit-line">' +
            '<p>控件表单名称</p>' +
            '<input type="text" class="ut-input ut-formEdit-name" maxlength="30" value="' + widgetJson.dataOption.name + '" required>' +
            '</div>' +
            '<div class="ut-formEdit-line">' +
            '<label>必填<input type="checkbox" class="ut-formEdit-required"></label>' +
            // 远传众包不需要的远程数据源
            // '<p>远程数据源</p>' +
            // '<div id="fakeSelectSelect"></div>' +
            '</div>' +
            '</div>';

        if (widgetJson.dataOption.url) {
            widgetJson.dataOption.data = [
                {"text": "选项一", "value": generateCode(3)},
                {"text": "选项二", "value": generateCode(3)},
                {"text": "选项三", "value": generateCode(3)}
            ];
        }

        var optTmpl = getOptTmpl(widgetJson.type);
        $.each(widgetJson.dataOption.data, function (index, val) {
            var checked;
            if (widgetJson.dataOption.value == val.value) {
                checked = "checked"
            } else {
                checked = "";
            }
            val.checked = checked;
            optContent = $(optContent).append(optTmpl.temp(val));
        });
        container = $(container).append(optContent);
        //添加扩展编辑html
        container.append(getExpandEditHtml(widgetJson));

        openEditWindow(container);
        initRequireCheckbox(widgetJson);

        utry.create("Select", {
            el: "#fakeSelectSelect",
            id: "fe-selectSelect",
            width: '100%',
            url: window.api + "/form/getSelectList.do",
            data: [
                {text: '--请选择--', value: ''}
            ],
            value: widgetJson.dataOption.value,
            dataFilter: function (data) {
                if (data.data) {
                    return data.data;
                }
                return data;
            },
            // fields : [
            //     {field : 'text', map : 'value', type : 'string'},
            //     {field : 'value', map : 'key', type : 'string'}
            // ],
            onChange: function (params) {
                attrChange();
            },
            onAfterFetch: function (params) {
                if (widgetJson.dataOption.url) {
                    var urlArray = widgetJson.dataOption.url.split("/");
                    var value = urlArray[urlArray.length - 1].split(".")[0];
                    this.setValue(value);
                }
            }
        });
    };

    //多选处理
    editFun.edit_checkgroup = function (widgetJson) {
        var optContent = '<div class="edit-option">' +
            '    <p>选项</p>' +
            '    <span class="optNameLabel">选项名</span><span class="optValLabel">选项值<span>' +
            '</div>';
        var container = '<div class="ut-formEdit-container" eleType="checkgroup">' +
            '<div class="ut-formEdit-line">' +
            '<p>标题</p>' +
            '<input type="text" class="ut-input ut-formEdit-label" maxlength="100" value="' + widgetJson.label + '">' +
            '</div>' +
            '<div class="ut-formEdit-line">' +
            '<p>控件表单名称</p>' +
            '<input type="text" class="ut-input ut-formEdit-name" maxlength="30" value="' + widgetJson.dataOption.name + '" required>' +
            '</div>' +
            '<div class="ut-formEdit-line">' +
            '<label>必填<input type="checkbox" class="ut-formEdit-required"></label>' +
            // 远传众包不需要的远程数据源
            // '<p>远程数据源</p>' +
            // '<div id="fakeCheckGroupSelect"></div>' +
            '</div>' +
            '</div>';

        if (widgetJson.dataOption.url) {
            widgetJson.dataOption.data = [
                {"text": "选项一", "value": generateCode(3)},
                {"text": "选项二", "value": generateCode(3)},
                {"text": "选项三", "value": generateCode(3)}
            ];
        }
        var optTmpl = getOptTmpl(widgetJson.type);
        $.each(widgetJson.dataOption.data, function (index, val) {
            var checked;
            if ($.inArray(val.value, widgetJson.dataOption.value) > -1) {
                checked = "checked"
            } else {
                checked = "";
            }
            val.checked = checked;
            optContent = $(optContent).append(optTmpl.temp(val));
        });
        container = $(container).append(optContent);
        //添加扩展编辑html
        container.append(getExpandEditHtml(widgetJson));
        openEditWindow(container);
        initRequireCheckbox(widgetJson);

        utry.create("Select", {
            el: "#fakeCheckGroupSelect",
            id: "fe-checkGroupSelect",
            width: '100%',
            url: window.api + "/form/getSelectList.do",
            data: [
                {text: '--请选择--', value: ''}
            ],
            value: widgetJson.dataOption.value,
            dataFilter: function (data) {
                if (data.data) {
                    return data.data;
                }
                return data;
            },
            // fields : [
            //     {field : 'text', map : 'value', type : 'string'},
            //     {field : 'value', map : 'key', type : 'string'}
            // ],
            onChange: function (params) {
                attrChange();
            },
            onAfterFetch: function (params) {
                if (widgetJson.dataOption.url) {
                    var urlArray = widgetJson.dataOption.url.split("/");
                    var value = urlArray[urlArray.length - 1].split(".")[0];
                    this.setValue(value);
                }
            }
        });
    };

    //单选处理
    editFun.edit_radiogroup = editFun.edit_select;

    editFun.edit_text = function (widgetJson) {
        var container = '<div class="ut-formEdit-container" eleType="text">' +
            '<div class="ut-formEdit-line">' +
            '<p>标题</p>' +
            '<input type="text" class="ut-input ut-formEdit-label"  maxlength="100" value="' + widgetJson.label + '">' +
            '</div>' +
            '<div class="ut-formEdit-line">' +
            '<p>控件表单名称</p>' +
            '<input type="text" class="ut-input ut-formEdit-name" maxlength="30" value="' + widgetJson.dataOption.name + '" required>' +
            '</div>' +
            '<div class="ut-formEdit-line">' +
            '<p>输入控件提示值</p>' +
            '<input type="text" class="ut-input ut-formEdit-placeholder" value="' + widgetJson.dataOption.placeholder + '">' +
            '</div>' +
            '<div class="ut-formEdit-line">' +
            '<label>必填<input type="checkbox" class="ut-formEdit-required"></label>' +
            '</div>' +
            '<div class="ut-formEdit-line">' +
            '<label>格式<input type="radio" class="ut-formEdit-format" name="format" value="1">字符串</label>' +
            '<label><input type="radio" class="ut-formEdit-format" name="format" value="2">邮件</label>' +
            '<label><input type="radio" class="ut-formEdit-format" name="format" value="3">整数</label>' +
            '<label><input type="radio" class="ut-formEdit-format" name="format" value="4">数值</label>' +
            '</div>' +
            '<div class="ut-formEdit-line">' +
            '<p>最小字符数</p>' +
            '<input type="text" class="ut-input ut-formEdit-minChar" min="0" onkeyup="limitInput(this);">' +
            '<p>最大字符数</p>' +
            '<input type="text" class="ut-input ut-formEdit-maxChar" min="0" value="256" onkeyup="limitInput(this);">' +
            '</div>' +
            '</div>';
        openEditWindow(container);

        $(".ut-formEdit-line input[type=radio][name=format][value='1']").attr("checked", 'checked');
        var rules = widgetJson.dataOption.rules;
        if (rules != undefined && rules.length > 0) {
            $.each(rules, function (index, val) {
                if (val.name == "maxlength") {
                    $(".ut-formEdit-maxChar").val(val.value);
                }
                if (val.name == "minlength") {
                    $(".ut-formEdit-minChar").val(val.value);
                }
                if (val.name == "email") {
                    $(".ut-formEdit-line input[type=radio][name=format][value='2']").attr("checked", 'checked');
                }
                if (val.name == "int") {
                    $(".ut-formEdit-line input[type=radio][name=format][value='3']").attr("checked", 'checked');
                }
                if (val.name == "number") {
                    $(".ut-formEdit-line input[type=radio][name=format][value='4']").attr("checked", 'checked');
                }
            });
        }
        initRequireCheckbox(widgetJson);
    };

    //初始化控件设置中的必填checkbox
    function initRequireCheckbox(widgetJson) {
        var rules = widgetJson.dataOption.rules;
        if (rules != undefined && rules.length > 0) {
            $.each(rules, function (index, val) {
                if (val.name == "required") {
                    $(".ut-formEdit-required").prop("checked", true)
                }
            });
        }
    }

    editFun.edit_date = function (widgetJson) {
        var container = '<div class="ut-formEdit-container" eleType="date">' +
            '<div class="ut-formEdit-line">' +
            '<p>标题</p>' +
            '<input type="text" class="ut-input ut-formEdit-label" maxlength="100" value="' + widgetJson.label + '">' +
            '</div>' +
            '<div class="ut-formEdit-line">' +
            '<p>控件表单名称</p>' +
            '<input type="text" class="ut-input ut-formEdit-name"  maxlength="30" value="' + widgetJson.dataOption.name + '"required>' +
            '</div>' +
            '<div class="ut-formEdit-line">' +
            '<label>必填<input type="checkbox" class="ut-formEdit-required"></label>' +
            '</div>' +
            '</div>';
        openEditWindow(container);
        initRequireCheckbox(widgetJson);
    };

    editFun.edit_datetime = function (widgetJson) {
        var container = '<div class="ut-formEdit-container" eleType="datetime">' +
            '<div class="ut-formEdit-line">' +
            '<p>标题</p>' +
            '<input type="text" class="ut-input ut-formEdit-label" maxlength="100" value="' + widgetJson.label + '">' +
            '</div>' +
            '<div class="ut-formEdit-line">' +
            '<p>控件表单名称</p>' +
            '<input type="text" class="ut-input ut-formEdit-name" maxlength="30" value="' + widgetJson.dataOption.name + '"required>' +
            '</div>' +
            '<div class="ut-formEdit-line">' +
            '<label>必填<input type="checkbox" class="ut-formEdit-required"></label>' +
            '</div>' +
            '</div>';
        openEditWindow(container);
        initRequireCheckbox(widgetJson);
    };

    editFun.edit_textarea = function (widgetJson) {
        var container = '<div class="ut-formEdit-container" eleType="textarea">' +
            '<div class="ut-formEdit-line">' +
            '<p>标题</p>' +
            '<input type="text" class="ut-input ut-formEdit-label" maxlength="100" value="' + widgetJson.label + '">' +
            '</div>' +
            '<div class="ut-formEdit-line">' +
            '<p>控件表单名称</p>' +
            '<input type="text" class="ut-input ut-formEdit-name" maxlength="30" value="' + widgetJson.dataOption.name + '"required>' +
            '</div>' +
            '<div class="ut-formEdit-line">' +
            '<label>必填<input type="checkbox" class="ut-formEdit-required"></label>' +
            '</div>' +
            '<div class="ut-formEdit-line">' +
            '<p>最小字符数</p>' +
            '<input type="text" class="ut-input ut-formEdit-minChar" min="0"  onkeyup="limitInput(this);" >' +
            '<p>最大字符数</p>' +
            '<input type="text" class="ut-input ut-formEdit-maxChar" min="0" value="256" onkeyup="limitInput(this);">' +
            '</div>' +
            '</div>';
        openEditWindow(container);

        var rules = widgetJson.dataOption.rules;
        if (rules != undefined && rules.length > 0) {
            $.each(rules, function (index, val) {
                if (val.name == "maxlength") {
                    $(".ut-formEdit-maxChar").val(val.value);
                }
                if (val.name == "minlength") {
                    $(".ut-formEdit-minChar").val(val.value);
                }
            });
        }
        initRequireCheckbox(widgetJson);
    };

    editFun.edit_button = function (widgetJson) {
        var type = widgetJson.dataOption.type;
        var container = '<div class="ut-formEdit-container" eleType="button">' +
            '<div class="ut-formEdit-line">' +
            '<p>标题</p>' +
            '<input type="text" class="ut-input ut-formEdit-text" maxlength="100" value="' + widgetJson.dataOption.value + '">' +
            '</div>' +
            '<div class="ut-formEdit-line">' +
            '<p>控件表单名称</p>' +
            '<input type="text" class="ut-input ut-formEdit-name" maxlength="30" value="' + widgetJson.dataOption.name + '" required>' +
            '</div>' +
            '<div class="ut-formEdit-line">' +
            '<p>按钮类型</p>' +
            '<select id="ut-feBtnType" name="select" width="100%" class="utry-select" value="' + type + '" >' +
            '<option value="button">普通</option>' +
            '<option value="submit">提交</option>' +
            '<option value="reset">重置</option>' +
            '</select>' +
            '</div>' +
            '</div>';
        openEditWindow(container);
        utry.parse($(".ut-formEdit-line"));
        utry.Application.addLoadListener(function () {
            utry.get("ut-feBtnType").on("onChange", function (val) {
                attrChange();
            })
        });
    };

    editFun.edit_panel = function (widgetJson) {
        var container = '<div class="ut-formEdit-container" eleType="panel">' +
            '<div class="ut-formEdit-line">' +
            '<p>标题</p>' +
            '<input type="text" class="ut-input ut-formEdit-title" value="' + widgetJson.dataOption.title + '" required>' +
            '</div>' +
            '</div>';
        openEditWindow(container);
    };

    editFun.edit_fileupload = function (widgetJson) {
        var type = widgetJson.dataOption.type;
        var container = '<div class="ut-formEdit-container" eleType="fileupload">' +
            '<div class="ut-formEdit-line">' +
            '<p>标题</p>' +
            '<input type="text" class="ut-input ut-formEdit-label" maxlength="100" value="' + widgetJson.label + '">' +
            '</div>' +
            '<div class="ut-formEdit-line">' +
            '<p>控件表单名称</p>' +
            '<input type="text" class="ut-input ut-formEdit-name" maxlength="30" value="' + widgetJson.dataOption.name + '" required>' +
            '</div>' +
            '<div class="ut-formEdit-line">' +
            '<p>文件上传类型</p>' +
            '<input type="textarea" placeholder="文件类型以英文逗号分隔，如txt,doc" width="100%" id="fe-filetype" class="utry-input" value="' + widgetJson.dataOption.allow + '">' +
            '</div>' +
            '</div>';
        openEditWindow(container);
        utry.parse($(".ut-formEdit-line"));
        utry.Application.addLoadListener(function () {
            utry.get("fe-filetype").on("onChange", function () {
                attrChange();
            });
        });
    }

    editFun.edit_statictext = function (widgetJson) {
        var container = '<div class="ut-formEdit-container" eleType="statictext">' +
            '<div class="ut-formEdit-line">' +
            '<p>文字内容</p>' +
            '<input type="text" class="ut-input ut-formEdit-label" value="' + widgetJson.label + '">' +
            '</div>' +
            '</div>';
        openEditWindow(container);
    };

    editFun.edit_hiddenfields = function (widgetJson) {
        var container = '<div class="ut-formEdit-container" eleType="hiddenfields">' +
            '<div class="ut-formEdit-line">' +
            '<p>标题</p>' +
            '<input type="text" class="ut-input ut-formEdit-label" maxlength="100" value="' + widgetJson.label + '">' +
            '</div>' +
            '<div class="ut-formEdit-line">' +
            '<p>控件表单名称</p>' +
            '<input type="text" class="ut-input ut-formEdit-name" maxlength="30" value="' + widgetJson.dataOption.name + '" required>' +
            '<p>默认值</p>' +
            '<input type="text" class="ut-input ut-formEdit-value" value="' + widgetJson.dataOption.value + '">' +
            '</div>' +
            '</div>';
        openEditWindow(container);
    };

    editFun.edit_parameter = function (widgetJson) {
        var container = '<div class="ut-formEdit-container" eleType="parameter">' +
            '<div class="ut-formEdit-line">' +
            '<p>标题</p>' +
            '<input type="text" class="ut-input ut-formEdit-label" maxlength="100" value="' + widgetJson.label + '">' +
            '</div>' +
            '<div class="ut-formEdit-line">' +
            '<p>控件表单名称</p>' +
            '<input type="text" class="ut-input ut-formEdit-name" maxlength="30" value="' + widgetJson.dataOption.name + '" required disabled>' +
            '</div>' +
            '<div class="ut-formEdit-line">' +
            '<p>参数键值</p>' +
            '<div id="fakeParaSelect"></div>' +
            '</div>' +
            '</div>';
        openEditWindow(container);
        utry.create("Select", {
            el: "#fakeParaSelect",
            id: "fe-paraSelect",
            width: '100%',
            url: window.api + "/form/getParameter.do",
            data: [
                {text: '--请选择--', value: ''}
            ],
            value: widgetJson.dataOption.value,
            dataFilter: function (data) {
                if (data.data) {
                    return data.data;
                }
                return data;
            },
            // fields : [
            //     {field : 'text', map : 'key', type : 'string'},
            //     {field : 'value', map : 'value', type : 'string'}
            // ],
            onChange: function (params) {
                attrChange();
            },
            onAfterFetch: function (params) {
                this.setValue(widgetJson.dataOption.value);
            }
        });
    };
    /*********************************************************************************/
    //配置项转json
    var toJsonFun = {};

    //表单容器Json
    toJsonFun.toJson_container = function () {
        var obj = nowObj;
        var optArray = $("#tbHiddenFields").find("tr");
        var data = [];
        $.each(optArray, function (index, val) {
            var valHidden=$(val).find(".hiddenFName").attr("value");
            if(valHidden==undefined||valHidden==null||valHidden==""){

            }else{
                var subData = {
                    "text": $(val).find(".hiddenFName").attr("value"),
                    "value": $(val).find(".hiddenFVal").attr("value")
                };
                data.push(subData);
            }
        });
        var dataOption = {
            "name": $(".ut-formEdit-name").attr("value"),
            "hiddenfields":data
        };
        var datatree = obj.attr("datatree");
        datatree = JSON.parse(datatree);
        datatree["dataOption"] = dataOption;
        obj.attr("datatree", JSON.stringify(datatree));
        return datatree;
    };

    toJsonFun.toJson_select = function () {
        var obj = nowObj;
        var optArray = $(".oneOpt");
        var data = [];
        var val = optArray.find(":radio:checked").siblings(".optVal").attr("value");
        $.each(optArray, function (index, val) {
            var subData = {
                "text": $(val).find(".optName").attr("value"),
                "value": $(val).find(".optVal").attr("value")
            };
            data.push(subData);
        });

        var url = window.api + "/widget/getSelectData/" + utry.get("fe-selectSelect").getValue() + ".do";
        var dataOption = {
            "width": "100%",
            "name": $(".ut-formEdit-name").attr("value"),
            "value": val,
            "url": url,
            "data": data,
            "rules": []
        };

        if (utry.get("fe-selectSelect").getValue()) {
            dataOption["data"] = [];
            dataOption["url"] = url;
        } else {
            dataOption["data"] = data;
            dataOption["url"] = "";
        }

        var isRequired = $(".ut-formEdit-required").prop("checked");
        if (isRequired == true) {
            dataOption.rules.push({"name": "required"});
        }
        var datatree = obj.attr("datatree");
        datatree = JSON.parse(datatree);
        datatree["dataOption"] = dataOption;
        datatree["label"] = $(".ut-formEdit-label").attr("value");
        datatree = expandJsonSet(datatree);
        obj.attr("datatree", JSON.stringify(datatree));
        return datatree;
    };

    function getCheckVal(domList){
        var res = []
        domList.each(function(index, item){
            res.push(this.value)
        })
        return res
    }

    //扩展json设置
    function expandJsonSet(datatree){
        datatree.expand["score"] = $(".ut-formEdit-score").attr("value");
        if(datatree.type == "radiogroup"){
            datatree.expand["answer"] = $(":input:checked.optAnswer").val();
        }else{
            datatree.expand["answer"] = getCheckVal($(":input:checked.optAnswer"))
        }
        //$(":radio:checked.optAnswer + label").text();
        //datatree.expand["answer"] = $(".ut-formEdit-answer").attr("value");
        return datatree;
    }

    toJsonFun.toJson_radiogroup = function () {
        var obj = nowObj;
        var optArray = $(".oneOpt");
        var data = [];
        var val = optArray.find(":radio:checked").siblings(".optVal").attr("value");
        $.each(optArray, function (index, val) {
            var subData = {
                "text": $(val).find(".optName").attr("value"),
                "value": $(val).find(".optVal").attr("value")
            };
            data.push(subData);
        });
        var url = window.api + "/widget/getSelectData/" + utry.get("fe-selectSelect").getValue() + ".do";
        var dataOption = {
            "width": "100%",
            "name": $(".ut-formEdit-name").attr("value"),
            "value": val,
            "url": url,
            "data": data,
            "rules": []
        };

        if (utry.get("fe-selectSelect").getValue()) {
            dataOption["data"] = [];
            dataOption["url"] = url;
        } else {
            dataOption["data"] = data;
            dataOption["url"] = "";
        }

        var isRequired = $(".ut-formEdit-required").prop("checked");
        if (isRequired == true) {
            dataOption.rules.push({"name": "required"});
        }
        var datatree = obj.attr("datatree");
        datatree = JSON.parse(datatree);
        datatree["dataOption"] = dataOption;
        datatree["label"] = $(".ut-formEdit-label").attr("value");
        datatree = expandJsonSet(datatree);
        obj.attr("datatree", JSON.stringify(datatree));
        return datatree;
    };

    toJsonFun.toJson_checkgroup = function () {
        var obj = nowObj;
        var optArray = $(".oneOpt");
        var data = [];
        var value = [];
        $.each(optArray.find(":checkbox:checked"), function (index, val) {
            value.push($(val).siblings(".optVal").attr("value"));
        });
        $.each(optArray, function (index, val) {
            var subData = {
                "text": $(val).find(".optName").attr("value"),
                "value": $(val).find(".optVal").attr("value")
            };
            data.push(subData);
        });
        var url = window.api + "/widget/getSelectData/" + utry.get("fe-checkGroupSelect").getValue() + ".do";
        var dataOption = {
            "width": "100%",
            "name": $(".ut-formEdit-name").attr("value"),
            "value": value,
            "data": data,
            "url": url,
            "rules": []
        };

        if (utry.get("fe-checkGroupSelect").getValue()) {
            dataOption["data"] = [];
            dataOption["url"] = url;
        } else {
            dataOption["data"] = data;
            dataOption["url"] = "";
        }

        var isRequired = $(".ut-formEdit-required").prop("checked");
        if (isRequired == true) {
            dataOption.rules.push({"name": "required"});
        }
        var datatree = obj.attr("datatree");
        datatree = JSON.parse(datatree);
        datatree["dataOption"] = dataOption;
        datatree["label"] = $(".ut-formEdit-label").attr("value");
        datatree = expandJsonSet(datatree);
        obj.attr("datatree", JSON.stringify(datatree));
        return datatree;
    };

    utry.Validator.registerRule("int", function (value, attr, callback) {
        var regFloat = /(^$)|^-?\d+$/;
        if (regFloat.test(value)) {
            callback(true);
        } else {
            callback(false, "请输入整数");
        }
    });

    toJsonFun.toJson_text = function () {
        var obj = nowObj;
        var dataOption = {
            "width": "100%",
            "type": "text",
            "name": $(".ut-formEdit-name").attr("value"),
            "placeholder": $(".ut-formEdit-placeholder").attr("value"),
            "rules": []
        };

        var type = $(".ut-formEdit-line :radio:checked").val();
        if (type == "2") {
            //邮件
            dataOption.rules.push({"name": "email"});
        } else if (type == "3") {
            //整数
            dataOption.rules.push({
                "name": "int"
            });
        } else if (type == "4") {
            //数值
            dataOption.rules.push({"name": "number"});
        }

        var isRequired = $(".ut-formEdit-required").prop("checked");
        if (isRequired == true) {
            dataOption.rules.push({"name": "required"});
        }
        var minChar = $(".ut-formEdit-minChar").val();
        dataOption.rules.push({"name": "minlength", "value": minChar});
        var maxChar = $(".ut-formEdit-maxChar").val();
        dataOption.rules.push({"name": "maxlength", "value": maxChar});

        var datatree = obj.attr("datatree");
        datatree = JSON.parse(datatree);
        datatree["dataOption"] = dataOption;
        datatree["label"] = $(".ut-formEdit-label").attr("value");
        obj.attr("datatree", JSON.stringify(datatree));
        return datatree;
    };

    toJsonFun.toJson_date = function () {
        var obj = nowObj;
        var dataOption = {
            "width": "100%",
            "type": "date",
            "name": $(".ut-formEdit-name").attr("value"),
            "rules": []
        };
        var isRequired = $(".ut-formEdit-required").prop("checked");
        if (isRequired == true) {
            dataOption.rules.push({"name": "required"});
        }
        var datatree = obj.attr("datatree");
        datatree = JSON.parse(datatree);
        datatree["dataOption"] = dataOption;
        datatree["label"] = $(".ut-formEdit-label").attr("value");
        obj.attr("datatree", JSON.stringify(datatree));
        return datatree;
    };

    toJsonFun.toJson_datetime = function () {
        var obj = nowObj;
        var dataOption = {
            "width": "100%",
            "type": "datetime",
            "name": $(".ut-formEdit-name").attr("value"),
            "rules": []
        };
        var isRequired = $(".ut-formEdit-required").prop("checked");
        if (isRequired == true) {
            dataOption.rules.push({"name": "required"});
        }
        var datatree = obj.attr("datatree");
        datatree = JSON.parse(datatree);
        datatree["dataOption"] = dataOption;
        datatree["label"] = $(".ut-formEdit-label").attr("value");
        obj.attr("datatree", JSON.stringify(datatree));
        return datatree;
    };

    toJsonFun.toJson_textarea = function () {
        var obj = nowObj;
        var dataOption = {
            "width": "100%",
            "type": "textarea",
            "name": $(".ut-formEdit-name").attr("value"),
            "rules": []
        };

        var isRequired = $(".ut-formEdit-required").prop("checked");
        if (isRequired == true) {
            dataOption.rules.push({"name": "required"});
        }
        var minChar = $(".ut-formEdit-minChar").val();
        dataOption.rules.push({"name": "minlength", "value": minChar});
        var maxChar = $(".ut-formEdit-maxChar").val();
        dataOption.rules.push({"name": "maxlength", "value": maxChar});

        var datatree = obj.attr("datatree");
        datatree = JSON.parse(datatree);
        datatree["dataOption"] = dataOption;
        datatree["label"] = $(".ut-formEdit-label").attr("value");
        obj.attr("datatree", JSON.stringify(datatree));
        return datatree;
    };

    toJsonFun.toJson_button = function () {
        var obj = nowObj;
        var dataOption = {
            "type": utry.get("ut-feBtnType").getValue(),
            "name": $(".ut-formEdit-name").attr("value"),
            "value": $(".ut-formEdit-text").attr("value")
        };
        var datatree = obj.attr("datatree");
        datatree = JSON.parse(datatree);
        datatree["dataOption"] = dataOption;
        obj.attr("datatree", JSON.stringify(datatree));
        return datatree;
    };

    toJsonFun.toJson_panel = function () {
        var obj = nowObj;
        var dataOption = {
            "height": "200px",
            "name": "panel",
            "title": $(".ut-formEdit-title").attr("value")
        };
        var datatree = obj.attr("datatree");
        datatree = JSON.parse(datatree);
        datatree["dataOption"] = dataOption;
        obj.attr("datatree", JSON.stringify(datatree));
        return datatree;
    };

    toJsonFun.toJson_fileupload = function () {
        var obj = nowObj;
        var dataOption = {
            "action": window.api + "/fileForm/upload.do",
            "name": $(".ut-formEdit-name").attr("value"),
            "isCheck": false,
            "allow": utry.get("fe-filetype").getValue()
        };
        var datatree = obj.attr("datatree");
        datatree = JSON.parse(datatree);
        datatree["dataOption"] = dataOption;
        datatree["label"] = $(".ut-formEdit-label").attr("value");
        obj.attr("datatree", JSON.stringify(datatree));
        return datatree;
    };

    toJsonFun.toJson_statictext = function () {
        var obj = nowObj;
        var datatree = obj.attr("datatree");
        datatree = JSON.parse(datatree);
        datatree["label"] = $(".ut-formEdit-label").attr("value");
        obj.attr("datatree", JSON.stringify(datatree));
        return datatree;
    };

    toJsonFun.toJson_hiddenfields = function () {
        var obj = nowObj;
        var dataOption = {
            "type": "hidden",
            "name": $(".ut-formEdit-name").attr("value"),
            "value": $(".ut-formEdit-value").attr("value"),
            "width": "100%"
        };
        var datatree = obj.attr("datatree");
        datatree = JSON.parse(datatree);
        datatree["dataOption"] = dataOption;
        datatree["label"] = $(".ut-formEdit-label").attr("value");
        obj.attr("datatree", JSON.stringify(datatree));
        return datatree;
    };

    toJsonFun.toJson_parameter = function () {
        var obj = nowObj;
        var dataOption = {
            "width": "100%",
            "type": "text",
            "name": $(".ut-formEdit-name").attr("value"),
            "disabled": true,
            "rules": [],
            "value": utry.get("fe-paraSelect").getValue()
        };

        var datatree = obj.attr("datatree");
        datatree = JSON.parse(datatree);
        datatree["dataOption"] = dataOption;
        datatree["label"] = $(".ut-formEdit-label").attr("value");
        obj.attr("datatree", JSON.stringify(datatree));
        return datatree;
    };
    /**********************************************************************************/

    //初始化属性设置面板
    function initAttr(obj) {
        var widgetJson = obj.attr("datatree");
        widgetJson = JSON.parse(widgetJson);
        var editType = widgetJson.type;
        editFun["edit_" + editType](widgetJson);
    }

    //当前属性转JSON
    function attrToJson() {
        var type = "toJson_" + $(".ut-formEdit-container").attr("eleType");
        return toJsonFun[type]();
    }

    //控件随JSON更新
    function widgetRefresh(json) {
        var widgetHtml = renderWidgetHTML(json);
        nowObj.html($(widgetHtml).html());
        utry.parse($(".ut-widget-shell"));
    }

    //表单控件刷新
    function formRefresh(json) {
        var wrapData = $(".ut-formEngine-content-wrap").attr("datatree");
        if (wrapData == "" || wrapData == null || wrapData == undefined) {

        } else {
            var jsonData = JSON.parse(wrapData);
            jsonData.dataOption = json.dataOption;
            $(".ut-formEngine-content-wrap").attr("datatree", JSON.stringify(jsonData));
            $(".ut-formEngine-content").attr("datatree", JSON.stringify(jsonData));
            replaceSingleQuote();
            _jsUrl=$(".ut-formEdit-jsUrl").val();
            _jsContent=$(".ut-formEdit-jsContent").val();

        }
        utry.parse($(".ut-formEngine-content-wrap"));
    }

    //已保存的表单拖动行为初始化
    function dragInit() {
        $(".ut-formEngine-content,  .ut-formEngine-content div[class^='ut-col-'], .ut-body").sortable({
            connectWith: "div[class^='ut-col-'], .ut-formEngine-content, .ut-body",
            opacity: .35,
            delay: 300,
            placeholder: "ut-sortable-placeholder",
            start: function (event, ui) {
                ui.placeholder.height(ui.item.height());
            },
            stop: function (event, ui) {
                utry.print(bigTree = updateJSON($(".ut-formEngine-content-wrap .ut-formEngine-content")));
            }
        });
    }

    //获取form字符串-设计时使用
    function getFormHtmlStr() {
        utry.print(bigTree = updateJSON($(".ut-formEngine-content-wrap .ut-formEngine-content")));
        var formContent = traverseJSON(bigTree);
        var formWrap = "<form class='utry-form' id='xform_utry_dync_form' action='../data/submit.do', method='post'>" +
            "<div class='hidden'>" +
            "<input type='hidden' name='xformSiteCode' value='" + formMetadata.siteCode + "'>" +
            "<input type='hidden' name='xformFormCode' value='" + formMetadata.formCode + "'>" +
            "</div>" +
            setHeader(formMetadata.formTitle) +
            "</form>";
        formContent = $(formWrap).append(formContent);
        return formContent.prop("outerHTML");
    }

    //保存表单
    function saveForm() {
    	bigTree = updateJSON($(".ut-formEngine-content-wrap .ut-formEngine-content"));
        utry.print(bigTree = updateJSON($(".ut-formEngine-content-wrap .ut-formEngine-content")));
        var canSave=judgeNameInput(bigTree);
        if(canSave==false){
        	 //utry.errormsg("所设置的控件表单名称不能全为数字类型和数字开头！");
        }else {
            if ($(".ut-formEdit-jsUrl").val() == undefined) {
            } else {
                _jsUrl = $(".ut-formEdit-jsUrl").val();
            }
            if ($(".ut-formEdit-jsContent").val() == undefined) {
            } else {
                _jsContent = $(".ut-formEdit-jsContent").val();
            }

            //处理bigTree中的url

            let changeUrl = function (item) {
	        if (item.type === "fileupload") {
	          var url = item.dataOption.action.substr(window.api.length + "/zuul".length);
	          var pos = url.indexOf("?accessToken=");
	          var newUrl = url.substr(0, pos);
	          item.dataOption.action = newUrl;
	        } else if (item.dataOption && item.dataOption.url && item.dataOption.url != "") {
	          var url = item.dataOption.url.substr(window.api.length);
	          item.dataOption.url = url;
	        }

	        if (item.children) {
	          item.children.forEach(changeUrl)
	        }
	      };


	      //处理bigTree中的url
	      if (bigTree.children) {
	        bigTree.children.forEach(function (item) {
	          changeUrl(item)
	        });
	      }

            //formInfo.formHtmlStr = getFormHtmlStr();
            formInfo.jsUrl = _jsUrl;
            formInfo.jsContent = _jsContent;
            formInfo.formJsonStr = JSON.stringify(bigTree);
            formInfo.operate = operate;
            formInfo.metaDataId = formMetadata.metaDataId;

            $.ajax({
                url: window.api + '/form/save.do',
                type: 'POST',
                data: formInfo,
                // 调小超时时间会引起异常
                timeout: 300000,
            })
                .done(function (data) {
                    utry.print("success");
                    if (data.code == "0") {
                        console.log("123")
                        utry.infomsg("表单保存成功");
                        isSaved = true;
                    } else {
                        utry.errormsg("表单保存失败,"+data.msg);
                    }
                })
                .fail(function () {
                    utry.print("error");
                })
                .always(function () {
                    utry.print("complete");
                });
        }
    }

    //获取form源码
    function getCodeOfForm() {
        var formHtmlStr = getFormHtmlStr();
        formHtmlStr = $(formHtmlStr).find("[datatree]").removeAttr("datatree")[0].outerHTML.replace(/&quot;/g, "'");
        formHtmlStr = $.htmlClean(formHtmlStr, {
            format: true,
            allowedAttributes: [
                ["id"],
                ["class"],
                ["data-options"]
            ]
        });
        utry("Window", {
            html: $("#FormCodeWindow").html(),
            title: '源代码',
            width: '817px',
            height: '500px',
            shadow: true,
            maximizable: true,
            buttons: [
                {
                    text: '复制源码',
                    id: 'copyCode',
                    name: 'copyCode',
                    className: 'ut-primary'
                },
                {
                    text: '返回',
                    id: 'backToDesign',
                    name: 'backToDesign',
                    click: function () {
                        this.close();
                    }
                }
            ]
        });
        var clipboard = new Clipboard('#copyCode');
        clipboard.on('success', function (e) {
            utry.infomsg("复制成功！", 1);
        });
        $("#formHtml").html(formHtmlStr);
        $("#copyCode").attr("data-clipboard-text", formHtmlStr);
    }

    //生成指定位数的随机码
    function generateCode(count) {
        var randCode = "";
        for (var i = 0; i < count; i++) {
            randCode += parseInt(Math.random() * 10).toString();
        }
        return randCode;
    }

    //输出渲染后的html
    function printHTML() {
        var uglyHtml = engineGlobal.renderJSON(bigTree).find("[datatree]").removeAttr("datatree")[0].outerHTML.replace(/&quot;/g, "'");
        return uglyHtml;
    }

    //检测页面是否存活
    function isAlive() {
        utry.registerMessageListener("xformdesignIfAlive", function (callback) {
            return true;
        });
    }

    //是否保存的标记
    var isSaved = true;
    //关闭页面前检查是否保存
    function saveCheck() {
        utry.registerMessageListener("closexformdesign", function (callback) {
            if (isSaved == true) {
                callback(true);
            } else {
                utry.confirm("未保存，是否退出编辑？",
                    function () {
                        /*确认提示框确定的回调函数*/
                        callback(true);
                    },
                    "退出",
                    function () {
                        /*确认提示框取消的回调函数*/
                        callback(false);
                    });
            }
        });
    }

    //拼接项目地址
    /*  function getWebPath(){
     var strFullPath=window.document.location.href;
     var strPath=window.document.location.pathname;
     var pos=strFullPath.indexOf(strPath);
     var prePath=strFullPath.substring(0,pos);
     var postPath=strPath.substring(0,strPath.substr(1).indexOf('/')+1);
     return (prePath+postPath);
     }*/

    //拼接项目地址
    /*function getWebPath(){
     var pathName = window.location.pathname.substring(1);
     var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
     if (webName == "") {
     return window.location.protocol + '//' + window.location.host;
     }
     else {
     return window.location.protocol + '//' + window.location.host + '/' + webName;
     }
     }*/

})(window);
