/**
 * Created by UTRY_PC on 2017/9/13.
 */

/* 预览本地图片 */
export function localImagePreview(id, file) {
  /* 以下是预览操作 */
  var pic = document.getElementById(id);

  var ext = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
  // gif在IE浏览器暂时无法显示
  if (ext != 'png' && ext != 'jpg' && ext != 'jpeg') {
    alert("图片的格式必须为png或者jpg或者jpeg格式！");
    return;
  }
  var isIE = navigator.userAgent.match(/MSIE/) != null;
  var isIE6 = navigator.userAgent.match(/MSIE 6.0/) != null;

  if (isIE) {
    file.select();
    var reallocalpath = document.selection.createRange().text;
    // IE6浏览器设置img的src为本地路径可以直接显示图片
    if (isIE6) {
      pic.src = reallocalpath;
    } else {
      // 非IE6版本的IE由于安全问题直接设置img的src无法显示本地图片，但是可以通过滤镜来实现
      pic.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='image',src=\"" + reallocalpath + "\")";
      // 设置img的src为base64编码的透明图片 取消显示浏览器默认图片
      pic.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
    }
  } else {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      pic.src = this.result;
    }
  }
};

export function validateImageFile(file) {
  if (!file) {
    _this.$Message.success('文件出错');
    return false;
  }

  // if (file.size > 500 * 1024) {
  //   _this.$Message.success('图片大小不能超过500k');
  //   return false;
  // }

  let types = file.type.split('/');

  if (types[0] != 'image') {
    _this.$Message.success('只能是jpg、jpeg、png图片');
    return false;
  }

  if (['jpg', 'jpeg', 'png'].indexOf(types[1]) < 0) {
    _this.$Message.success('只能是jpg、jpeg、png图片');
    return false;
  }
  return true;
}

/* 将秒转换成时分秒 */
export function formatSeconds(seconds) {

  let result = '';
  seconds = parseInt(seconds);
  var hour = parseInt(seconds / (60 * 60));
  var minite = parseInt((seconds / 60) % 60);
  var second = parseInt(seconds % 60);

  if (hour !== 0) {
    result += (fix(hour, 2) + ':');
  }

  result += (fix(minite, 2) + ':');
  result += fix(second, 2);

  function fix(num, length) {
    return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
  }

  return result;
};

/* 去除空数组 */
Array.prototype.noEmpty = function () {
  return this.filter(t => {
    return t != undefined && t !== null && t.trim() !== ""
  });
}

export function clone(obj) {
  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    var copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    var copy = [];
    var len = obj.length;
    for (var i = 0; i < len; ++i) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    var copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
};
