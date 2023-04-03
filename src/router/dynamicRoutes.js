/**
 *
 * 动态路由表
 *
 * */
let dynamicRoutes = [
    {
        path: '*',
        name: '404',
        component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue'),
        meta: {requiresAuth: true, title: '未找到相关页'}
    }
];

export default dynamicRoutes;
