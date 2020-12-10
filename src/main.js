import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
import store from './store'
import less from 'less'
// import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
Vue.prototype.$axios = axios;
Vue.prototype.$store = store;

Vue.config.productionTip = false
Vue.use(less)
// Vue.use(VueAxios,axios)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// 添加请求拦截器，在请求头中加token
axios.interceptors.request.use(
    config => {
      if (window.sessionStorage.getItem('token')) {
        config.headers.token = window.sessionStorage.getItem('token')
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    });
