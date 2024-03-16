import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as echarts from 'echarts'
import './assets/css/global.css'
import './plugins/element'
import 'element-ui/lib/theme-chalk/index.css'

if (process.env.NODE_ENV !== 'development') {
  // 判断当前环境是本地还是线上环境
  console.log = function () {}
  console.error = function () {}
  console.warn = function () {}
}

Vue.use(echarts)
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')