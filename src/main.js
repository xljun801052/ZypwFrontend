import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";


//引入element-ui和对应样式库 并使用  此处是全局引入，后续项目包体积太大可以考虑按需引入
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'

// 本项目使用iview样式库
import ViewUI from "view-design";
import "view-design/dist/styles/iview.css";

// 导入svg,获取全部图标，这样其他页面就不需要单独引入svg图标了
const requireAll = requireContext => requireContext.keys().map(requireContext)    
const req = require.context('./assets/svgs', false, /.svg$/) 
requireAll(req)

// Vue.use(ElementUI);
//此处使用的是基本的组件，没有对iview进行全局的配置，如果需要的话可以在这里修改进行全局配置
Vue.use(ViewUI);
Vue.config.productionTip = false;
// Vue.component() // 注册全局组件使用

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
