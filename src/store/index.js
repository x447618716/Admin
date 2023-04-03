import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutation'
import actions from './action'
import getters from './getters'
import permissionRoutre from './modules/permissionRoutre'
import createPersistedState from 'vuex-persistedstate'  //该插件实现vuex状态持久化存储
//加密存储  localStorage
import SecureLS from "secure-ls";

let ls = new SecureLS({isCompression: false});

Vue.use(Vuex);

//vuex配置
const store = new Vuex.Store({
    // strict: process.env.NODE_ENV !== 'production',//开发环境开启严格模式
    state: {
        userInfo: {},         //用户信息
        roleInfo: {},          //用户归属角色
        tagsList: [],          //标签栏数据数组对象
        collapse: false,      //左侧菜单折叠状态
        isSchoolUser: true,    //是否学校用户
        avatar: 'static/img/img.jpg',  //用户头像
        themeColor: [
            "283446",
            "40,52,70",
            "#3e4859",
            "#535d6b",
            "#69717e",
            "#7e8590",
            "#949aa3",
            "#a9aeb5",
            "#bfc2c8",
            "#d4d6da",
            "#eaebed",
            "#242f3f"
        ],
        imgPrefixUrl: 'https://sxlm-regular.oss-cn-shenzhen.aliyuncs.com/',
        picUrl: "http://sxlm-regular.oss-cn-shenzhen.aliyuncs.com/bookdata/",
    },
    getters,
    mutations,
    actions,
    modules: {
        permissionRoutre
    },
    plugins: [createPersistedState({
        key: "vuex",
        storage: {
            getItem: (key) => ls.get(key),
            setItem: (key, value) => ls.set(key, value),
            removeItem: (key) => ls.remove(key),
        },
        paths: [
            'userInfo',
            'roleInfo',
            'avatar'
        ]
    })]
})


//热重载
if (module.hot) {
    module.hot.accept([
        './getters',
        './action',
        './mutation'
    ], () => {
        store.hotUpdate({
            getters: require('./getters'),
            actions: require('./action'),
            mutations: require('./mutation')
        })
    })
}
export default store
