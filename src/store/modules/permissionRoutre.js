import axios from '@/axios';
import router from '@/router';
import ElementUI from 'element-ui'
import {recursionRouter, authorizeRouter, addRouterPermission} from "@/utils";
import dynamicRoutes from "@/router/dynamicRoutes"
import permissionRoutre from "@/router/permissionRoutre"

export default {
    namespaced: true,
    state: {
        permissionList: null,
        sidebarMenu: null
    },
    getters: {},
    mutations: {
        SET_MENU(state, menu) {
            state.sidebarMenu = menu
        },
        SET_PERMISSION(state, route) {
            state.permissionList = route
        }
    },
    actions: {
        async GET_PERMISSION({commit}) {
            return await axios.get('/system/getUserPermissionMenu').then(res => {
                if (res.code == 0) {
                    //后台返回的权限路由
                    let reqData = res.data;
                    //合并初始路由与动态路由
                    let initialRoutes = router.options.routes.concat(dynamicRoutes);
                    //动态路由挂载点
                    let MainContainer = initialRoutes.find(v => v.path === '/');
                    let children = MainContainer.children;
                    //递归获取路由表
                    let menu = recursionRouter(reqData, "0");
                    //路由添加功能权限
                    addRouterPermission(menu, permissionRoutre);
                    //获取授权后的路由
                    let routes = authorizeRouter(reqData, permissionRoutre);
                    children.push(...routes);
                    //动态添加路由
                    router.onReady(() => {
                        router.addRoutes(initialRoutes);
                    });
                    commit('SET_PERMISSION', initialRoutes);
                    commit('SET_MENU', menu);
                    return routes;
                } else {
                    ElementUI.Message.error(res.message);
                    return [];
                }
            })
        }
    }
}
