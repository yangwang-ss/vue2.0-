export default (function formengine() {

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

  /*********************************表单元素json字典*******************************/
  var JSONDict = {
    "json_container": {
      "type": "container",
      "eleType": "layout",
      "dataOption": {
        "name": "container",
        "hiddenfields": [{ "text": "", "value": "" }]
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
        "rules": [{ "name": "minlength", "value": "" }, { "name": "maxlength", "value": "256" }]
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
          { "text": "--请选择--", "value": "" },
          { "text": "选项一", "value": generateCode(3) },
          { "text": "选项二", "value": generateCode(3) },
          { "text": "选项三", "value": generateCode(3) }
        ],
        "width": "100%"
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
        "rules": [{ "name": "minlength", "value": "" }, { "name": "maxlength", "value": "256" }]
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
          { "text": "选项一", "value": generateCode(3) },
          { "text": "选项二", "value": generateCode(3) },
          { "text": "选项三", "value": generateCode(3) }
        ],
        "width": "100%"
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
          { "text": "选项一", "value": generateCode(3) },
          { "text": "选项二", "value": generateCode(3) },
          { "text": "选项三", "value": generateCode(3) }
        ],
        "width": "100%"
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
          { "title": "选项一" },
          { "title": "选项二" },
          { "title": "选项三" }
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
        "action": "",
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

  function resolveToList(list, jsonList, i) {
    var temp = 0;
    $.each(list, function (index, val) {
      if (utry.isArray(list[index])) {
        resolveToList(list[index], jsonList, i);
      } else {
        var newChildren = list[index].children
        if (newChildren == undefined || newChildren == "" || newChildren == null) {
          //jsonList[i]=list[index];
          //i++;
          jsonList[temp] = list[index];
          temp++;
        } else {
          resolveToList(newChildren, jsonList, i);
        }
      }
    });
  }

  //通过所传值(json)对控件的值、是否只读、是否隐藏进行设置
  function setHtmlByParameter(formJson, formValue, formReadOnly, formHidden, formParameter, formUrl) {
    var jsonList = [];
    var i = 0;
    var temp = 0;
    if (utry.isArray(formJson)) {
      resolveToList(formJson, jsonList, i);
    } else {
      var newChildren = formJson.children
      if (newChildren == undefined || newChildren == "" || newChildren == null) {
        jsonList[i] = formJson;
        i++;
      } else {
        resolveToList(newChildren, jsonList, i);
      }
    }

    jQuery.each(jsonList, function (k, valJson) {
      var nameJson = jsonList[k].dataOption.name;

      if (formValue) {
        jQuery.each(formValue, function (i, val) {
          if (nameJson == i) {
            if (val.indexOf("fileName") > 0 && val.indexOf("fileUrl") > 0) {
              if (jsonList[k].type == "fileupload") {
                jsonList[k].dataOption.isDownload = true;
                jsonList[k].dataOption.fileName = JSON.parse(val).fileName;
                jsonList[k].dataOption.fileUrl = JSON.parse(val).fileUrl;
                return true;
              }
            }
            else {
              jsonList[k].dataOption.value = val;
              return true;
            }
          }
        });
      }
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
      if (jsonList[k].type == "parameter") {
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
      var urlJson = jsonList[k].dataOption.url;
      if (urlJson == undefined || urlJson == "" || urlJson == null) {
      } else {
        jsonList[k].dataOption.url = formUrl + urlJson.replace("..", "");
      }
    });
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

  //控件渲染-json转html
  function renderWidgetHTML(json) {
    if (json.type == "container") {
    }
    else {
      var content = widgetDict[json.type + "_tmpl"];
      //回显上传文件时
      if (json.type == "fileupload" && json.dataOption.isDownload == true) {
        var jsonContent = json;
        jsonContent.dataOption.showSelectBtn = false;
        jsonContent.dataOption.showUploadBtn = false;
        jsonContent.dataOption.showName = false;
        jsonContent.dataOption.isDelete = false;
        var tempContent = content.temp(jsonContent);
        var contentOptions = $(tempContent).attr("data-options");
        var optionsNew = "{" + contentOptions.replace('{', ' ').replace('}', ' ') +
          ",\"onDownload\": downloadFileFun " + "}";
        //下载文件方法
        var jsDownLoad = "<script type=\"text/javascript\">" +
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
        var newContent = jsDownLoad + "<div class='utry-fileupload' data-options='" + optionsNew + "'></div>";
        content = newContent;
      } else {
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
        labelHtml +
        "<div class='contentWrap'>" + content + "</div>" +
        "</div>";
      return shell;
    }
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

  //获取form字符串-设计时使用
  function showHtmlStr(bigTree, siteCode, formCode, formHiddenFields, formheader, formJsAttribute) {
    var formJs = "";

    /* if (formJsAttribute == undefined || formJsAttribute == null || formJsAttribute == "") {
      formJs = "";
    } else {
      if (formJsAttribute.jsContent == undefined || formJsAttribute.jsContent == "" || formJsAttribute.jsContent == null) {
      } else {
        formJs = formJs + "<script type='text/javascript' src=\'" + formJsAttribute.jsContent + "\'><\/script>"
      }

      if (formJsAttribute.jsUrl == undefined || formJsAttribute.jsUrl == "" || formJsAttribute.jsUrl == null) {
      } else {
        var jsUrl = formJsAttribute.jsUrl.split("|");
        for (var i = 0; i < jsUrl.length; i++) {
          if (jsUrl[i] == undefined || jsUrl[i] == null || jsUrl[i] == "") {

          } else {
            formJs = formJs + "<script type='text/javascript' src=\'" + jsUrl[i] + "\'><\/script>"
          }
        }
      }
    } */

    var hiddenFields = "";
    if (formHiddenFields == undefined || formHiddenFields == "" || formHiddenFields == null) {
      hiddenFields = "";
    } else {
      $.each(formHiddenFields, function (index, val) {
        hiddenFields += "<input type='hidden' " +
          "name='" + formHiddenFields[index]["text"] + "' " +
          "value='" + formHiddenFields[index]["value"] + "'/>";
      });
    }
    var formWrap = "<form class='utry-form' id='xform_utry_dync_form' action='../data/submit.do' method='post'>" +
      /* "<div class='hidden'>" +
      "<input type='hidden' name='xformSiteCode' value='" + siteCode + "'/>" +
      "<input type='hidden' name='xformFormCode' value='" + formCode + "'/>" +
      hiddenFields +
      "</div>" +  */formheader +
      "</form>";
    try {
      var formContent = $(formWrap).append(bigTree);
      /* var formFormJs = $(formContent).append(formJs); */
      return formFormJs.prop("outerHTML");
    } catch (e) {
      var msg = "<p><span style='font-size: 14px; font-weight: bold; color: red;'>" +
        "相关JavaScript引用出现错误，请确认文件是否存在或脚本是否正确！</span></p>"
      //formWrap=$(formWrap).append(msg);
      var formContent = $(formWrap).append(bigTree);
      return formContent.prop("outerHTML");
    }

  }

  //生成指定位数的随机码
  function generateCode(count) {
    var randCode = "";
    for (var i = 0; i < count; i++) {
      randCode += parseInt(Math.random() * 10).toString();
    }
    return randCode;
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

  //设置表单标题
  function setHeader(headerContent) {
    var header = "<p class='ut-formEngine-header'>" + headerContent + "</p>"
    return header;
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

  return {
    setHtmlByParameter: setHtmlByParameter,
    traverseJSON: traverseJSON,
    showHtmlStr: showHtmlStr,
    setHeader: setHeader,
    renderLayout: renderLayout
  }
})()
