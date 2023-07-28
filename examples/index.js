/**
 * Created by zane on 2023/7/21 21:47
 * @description .
 */
import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI, {
  size: 'medium'
})
new Vue({
  render: h => h(App)
}).$mount('#app')
