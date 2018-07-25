import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import i18n from './lang' // 国际化
import App from './App'
import router from './router'
import store from './store'
import * as filters from './filters' // 全局filter
import './icons' // icon
import './errorLog' // error log
import './permission' // 权限
import 'video.js/dist/video-js.css'
//import './mock' // 该项目所有请求使用mockjs模拟
//图片预览
import vuePicturePreview from 'vue-picture-preview'
Vue.use(vuePicturePreview)

// fundebug 监控
var fundebug = require("fundebug-javascript");
fundebug.apikey = "a068c6119daff3e0ce277c53758e3913be55bbfb4f1022c6436362d73863bb2d";

Vue.use(Element, {
    i18n: (key, value) => i18n.t(key, value),
    size: 'small'
})

function formatComponentName(vm) {
    if (vm.$root === vm) return 'root';

    var name = vm._isVue ? (vm.$options && vm.$options.name) || (vm.$options && vm.$options._componentTag) : vm.name;
    return (name ? 'component <' + name + '>' : 'anonymous component') + (vm._isVue && vm.$options && vm.$options.__file ? ' at ' + (vm.$options && vm.$options.__file) : '');

}

Vue.config.errorHandler = function(err, vm, info) {
    var componentName = formatComponentName(vm);
    var propsData = vm.$options && vm.$options.propsData;

    fundebug.notifyError(err, {
        metaData: {
            componentName: componentName,
            propsData: propsData,
            info: info
        }
    });
};
// register global utility filters.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    i18n,
    template: '<App/>',
    components: {
        App
    }
})
