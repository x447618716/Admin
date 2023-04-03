/**
 * 定义Mutation 事件
 * @version 1.0
 * @author 谢荣生
 * */

import {
    OUT_LOGIN,
    UPDATE_USERINFO,
    RECORD_USERINFO,
    RECORD_THEME_COLOR,
    RETSET_AVATAR,
    SET_COLLAPSE,
    SET_TABS_LIST,
    CLOSE_OTHER_TABS,
    REMOVE_TABS
} from './mutation-types.js'

export default {
    //记录用户信息存入vuex
    [RECORD_USERINFO](state, info) {
        state.userInfo = Object.assign({}, state.userInfo, info.userInfo);
        state.roleInfo = Object.assign({}, state.roleInfo, info.roleInfo);
    }
    ,
    //记录主题颜色
    [RECORD_THEME_COLOR](state, themeColor) {
        state.themeColor = themeColor;
    },
    //更新用户信息
    [UPDATE_USERINFO](state, info) {
        if (state.userInfo && (state.userInfo.account !== info.account)) {
            return false;
        }
        if (!state.userInfo.id) {
            return false;
        }
        if (!info.success) {
            state.userInfo = {...info.data.info}; //以新对象替换老对象,利用 stage-3 的对象展开运算符
        } else {
            state.userInfo = {};
        }
    },
    //修改头像
    [RETSET_AVATAR](state, avatar) {
        state.avatar = avatar;
    },
    //设置左侧栏折叠状态
    [SET_COLLAPSE](state) {
        state.collapse = !state.collapse
    },
    //设置标签栏数据
    [SET_TABS_LIST](state, route) {
        state.tagsList.push({
            title: route.meta.title,
            path: route.fullPath,
            name: route.name,
            components: route.matched[1].components.default,
            key: route.matched[1].instances.default.$vnode.key,
            route
        });
    },
    //关闭其他标签
    [CLOSE_OTHER_TABS](state, activeName) {
        state.tagsList = state.tagsList.filter(item => item.path === activeName);
    },
    //移除标签
    [REMOVE_TABS](state, tabName) {
        if (tabName == 'ALL') {
            state.tagsList = [];
        } else {
            state.tagsList = state.tagsList.filter(tab => tab.path !== tabName);
        }
    },
    //退出登录
    [OUT_LOGIN](state) {
        state.userInfo = {};
        state.roleInfo = {};
        state.tagsList = [];
    },
}
