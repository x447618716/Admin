import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAxios from 'vue-axios'
import axios from './axios';
import ElementUI from 'element-ui'
import {searchRouter} from "./utils";
import baseComponents from "./components/base"
import plugins from './plugins'
import i18n from './i18n-setup'
import htmlToPdf from './utils/htmlToPdf'
import VueCropper from 'vue-cropper'
import pluginImport from '@d2-projects/vue-table-import'
import vueXlsxTable from 'vue-xlsx-table'
import tinymce from 'tinymce'
import VueTinymce from '@packy-tang/vue-tinymce'
import JsonViewer from 'vue-json-viewer'

//全局引入ElementUI样式
import 'element-ui/lib/theme-chalk/index.css'
//用于判断是否是空对象
import isEmpty from 'lodash/isEmpty'

//关闭生产提示
Vue.config.productionTip = process.env.NODE_ENV !== 'production';

//全局配置ElementUI组件
Vue.use(ElementUI, {size: 'medium', zIndex: 2000});
Vue.use(VueAxios, axios);
//安装自定义基础组件
Vue.use(baseComponents);
//安装自定义插件
Vue.use(plugins);
//安装html转pdf插件
Vue.use(htmlToPdf);
//安装图片裁剪插件
Vue.use(VueCropper);
//安装表格导入插件
Vue.use(pluginImport);
//安装表格插件
Vue.use(vueXlsxTable, {rABS: false});
//富文本
Vue.prototype.$tinymce = tinymce;
Vue.use(VueTinymce);
//json可视化
Vue.use(JsonViewer);


//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    //通过是否存在用户id判断是否已登录
    if (store.state.userInfo.id) {
        //已登录状态下判断路由是否已存在
        if (store.state.permissionRoutre.permissionList) {
            //判断将要进入的页面是否需要登录权限 to.meta.requiresAuth to.matched.every(record => record.meta.requiresAuth)
            if (to.matched.every(record => record.meta.requiresAuth)) {
                switch (to.name) {
                    case "login":
                        next(from.fullPath);
                        break;
                    case "404":
                        next();
                        break;
                    case "403":
                        next();
                        break;
                    default:
                        //始终把当前跳转路由当作最后一次访问地址
                        Vue.$cookies.set("redirectUrl", isEmpty(to.query) ? to.path : to.path + '?' + Object.keys(to.query).map(key => key + '=' + to.query[key]).join('&'));
                        next();
                }
            } else {
                //如果当前是从登录页跳转到上一次访问页面且没有权限访问时进入到管理中心页面
                if (to.fullPath == Vue.cookies.get('redirectUrl') && from.name == "login") {
                    next({path: '/manageCenter', query: {}});
                } else {
                    next({path: '/403', query: {}});
                }
            }
        } else {
            store.dispatch('permissionRoutre/GET_PERMISSION').then(routes => {
                //页面刷新后权限判断
                if (routes.length) {
                    switch (to.name) {
                        case "login":
                            next(from.fullPath);
                            break;
                        case "404":
                            next();
                            break;
                        case "403":
                            next();
                            break;
                        default:
                            if (searchRouter(routes, to.path, false)[0].meta.requiresAuth) {
                                next();
                            } else {
                                next({path: '/403', query: {}});
                            }
                    }
                } else {
                    next();
                }
            })
        }
    } else {
        //未登录状态下只能前往登录页
        switch (to.name) {
            case "login":
                next();
                break;
            default:
                next({path: '/login', query: {redirect: to.fullPath}})
        }
    }
});

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')
