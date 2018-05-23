// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import utvue from 'utvue'
import 'utvue/dist/styles/utvue.css'
import router from './router'
import '../static/css/common.scss'
import '../static/css/colorFont.scss'
//引入下拉选择树
import '../static/css/index.css'
//搜索查询样式
//import '../static/css/select-vue-component.css'
//左边菜单栏图标库
import '../static/iconfont/iconfont.css'
Vue.config.productionTip = false
import axios from 'axios'
//全局引入数据请求
import http from './getData/http'
//图片预览
import VuePreview from 'vue-preview'
Vue.use(VuePreview);
Vue.prototype.axios = axios;
Vue.prototype.$http = http;
Vue.use(utvue);
//Vue.use(require('vue-moment'));
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})


