/**
 * Created by brook on 2017/11/29.
 */
/****全局方法****/
let tools = {
  scrollTo(t, f) {
    let tmp_id = t;
    let tmp_target = '';
    let fmp_id = '#' + f;
    tmp_target = document.getElementById(tmp_id);
    let targetTop = tmp_target.offsetTop || 0;
    let findTop = document.querySelector(fmp_id).offsetTop;
    document.querySelector(fmp_id).scrollTo(0, targetTop - findTop);
  },
  dateFormate(date, fmt) {
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
};
export default tools;
