import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

//初始路由表
const routes = [
    {
        path: '/',
        name: 'layout',
        component: () => import(/* webpackChunkName: "layout" */ '@/components/layout/Layout.vue'),
        meta: {requiresAuth: true, title: '布局'},
        redirect: '/manageCenter',
        children: []
    },
    {
        path: '/403',
        name: '403',
        component: () => import(/* webpackChunkName: "403" */ '@/views/403.vue'),
        meta: {requiresAuth: true, title: '未授权相关页'}
    },
    {
        path: '/login',
        name: 'login',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
        meta: {requiresAuth: true, title: '登录'}
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return {x: 0, y: 0}
        }
    },
    routes
})

export default router
