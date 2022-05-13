/* eslint-disable no-multiple-empty-lines */

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
import './assets/css/Tailwind.css'

// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入第三方插件
import TreeTable from 'vue-table-with-tree-grid'

// 引入axios请求

import axios from 'axios'

// 全局注册axios，使用方法 this.$http

Vue.prototype.$http = axios
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use((config) => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须return config
  return config
})


Vue.config.productionTip = false

// 全局注册
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
