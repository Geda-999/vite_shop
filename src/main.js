/* eslint-disable no-multiple-empty-lines */

import Vue from 'vue'

// 导入ElementUI库
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App.vue'

// 导入路由
import router from './router'
// import './plugins/element.js'

// 导入全局样式
import './assets/css/global.css'
import './assets/css/Tailwind.css'

// 导入字体图标
import './assets/fonts/iconfont.css'

// 导入第三方插件
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入axios请求
import axios from 'axios'

// 全局注册axios，使用方法 this.$http
Vue.prototype.$http = axios

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须return config
  return config
})
Vue.config.productionTip = false

// 全局注册
Vue.component('tree-table', TreeTable)

// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)

// 全局注册ElementUI库
Vue.use(ElementUI)

// 商品列表-自定义格式化时间的全局过滤器
// 全局注入时间过滤器✨✨
// Vue.filter定义全局过滤器 第一个参数起名为【dateFormat】
// 提供一个function函数 咋们过滤器的处理函数 指定一个形参为【originVal】 这个originVal就咋们要处理的时间数据
Vue.filter('dateFormat', function (originVal) {
  // 哪咋们拿到这个时间之后呢
  // 可以new一个date出来 同时在date期间 将传过来originVal传进去
  // 紧接着 咋们通过const dt来接收new出来了时间
  const dt = new Date(originVal)

  // 紧接着分别得到年 月 日 时 分 秒
  // 并且把他return出去 就行了
  // 咋们可以通过 dt.getFullYear 从而拿到完整了 四位数的年份
  // const y来接收一下
  const y = dt.getFullYear() // 年
  // 他是从零开始的咋们要把他加1
  // 咋们希望这个月份 如果不足两位在前面补个零
  // 这时候可以调用一个 字符串的函数 那就是给他加一个空字符串
  // 在调用.padStart 其中
  // 第一个参数 代表咋们 总长度为多少位。
  // 第二个参数 是字符串 如果不足多少位的话 用每个字符串来填充 咋们希望以0进行填充
  const m = (dt.getMonth() + 1 + '').padStart(2, '0') // 月
  const d = (dt.getDate() + '').padStart(2, '0') // 日
  const hh = (dt.getHours() + '').padStart(2, '0') // 时
  const mm = (dt.getMinutes() + '').padStart(2, '0') // 分
  const ss = (dt.getSeconds() + '').padStart(2, '0') // 秒

  // 最后咋们希望拼接成完整的日期字符串
  // 咋们可以返回一个模板字符串

  //          年 月 日 时 分 秒
  // return `yyyy-mm-dd hh:mm:ss`
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
