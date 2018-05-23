
import axios from 'axios';
//服务端
axios.defaults.baseURL = 'http://bmtest.voicegu.com/ucscmanager';
//axios.defaults.baseURL = 'http://106.12.21.231:8070/ucscmanage';
// 生产环境
//axios.defaults.baseURL = 'http://bm.voicegu.com/ucscmanage';
//本地服务
//axios.defaults.baseURL = 'http://192.168.15.33:80/ucscmanager/';
//STR本地服务2
//axios.defaults.baseURL = 'http://192.168.15.43:8080/ucsc-manager';
axios.defaults.headers['Content-Type'] = 'application/json';
if(sessionStorage.getItem('token')!=(null||undefined)){
  axios.defaults.headers['token']= sessionStorage.getItem('token');
}
else {
   //window.location.href = "http://bmtest.voicegu.com";
   //window.location.href = "http://bm.voicegu.com";
}

export default {
  
}


