/**
 *
 * 需要鉴权的路由表
 * isMenu 用于标记节点路由是否属于菜单项 true代表是菜单项需要鉴权（没有isMenu关键字标记默认都是菜单路由需要鉴权） false代表非菜单项默认拥有权限
 * isLeaf 用于标记节点路由是否要脱离tabs标签菜单栏切换 true代表脱离tabs菜单栏 false(没有isLeaf关键字标记默认都是需tabs菜单切换)代表加入tabs菜单栏 (对于需复用的组件暂时需设定为true 因为在复用组件间切换时会直接调用缓存数据而不是重新拉取数据)
 * keepAlive 用于标记节点路由是否需要被缓存 true代表路由需要被缓存（没有keepalive关键字标记默认为需要被缓存） false代表路由不需要被缓存
 * */
let permissionRoutre = [
    {
        path: '/manageCenter',
        name: 'manageCenter',
        component: () => import(/* webpackChunkName: "manageCenter" */ '../views/ManageCenter.vue'),
        meta: {title: '管理中心'}
    },
    {
        path: '/password',
        name: 'password',
        component: () => import(/* webpackChunkName: "password" */ '../views/Password.vue'),
        meta: {title: '修改密码', isMenu: false}
    },
    /********************* 系统管理路由start ***********************/
    {
        path: '/userManage',
        name: 'userManage',
        component: () => import(/* webpackChunkName: "userManage" */ '../views/sysManage/UserManage.vue'),
        meta: {title: '管理员列表'}
    },
    {
        path: '/roleManage',
        name: 'roleManage',
        component: () => import(/* webpackChunkName: "roleManage" */ '../views/sysManage/RoleManage.vue'),
        meta: {title: '角色管理'}
    },
    {
        path: '/menuManage',
        name: 'menuManage',
        component: () => import(/* webpackChunkName: "menuManage" */ '../views/sysManage/MenuManage.vue'),
        meta: {title: '菜单管理'}
    },
    {
        path: '/syslog',
        name: 'syslog',
        component: () => import(/* webpackChunkName: "syslog" */ '../views/sysManage/SysLog.vue'),
        meta: {title: '系统日志'}
    },
    /********************* 系统管理路由end ***********************/
    /************************** 统计报表路由start ************************************/
    {
        path: '/userDataAnalysis',
        name: 'userDataAnalysis',
        component: () => import(/* webpackChunkName: "userDataAnalysis" */ '../views/statisticalReport/UserDataAnalysis.vue'),
        meta: {title: '用户数据分析'}
    },
    {
        path: '/activeUsegeAnalysis',
        name: 'activeUsegeAnalysis',
        component: () => import(/* webpackChunkName: "activeUsegeAnalysis" */ '../views/statisticalReport/ActiveUsegeAnalysis.vue'),
        meta: {title: '活动使用情况分析'}
    },
    {
        path: '/inviteUsegeAnalysis',
        name: 'inviteUsegeAnalysis',
        component: () => import(/* webpackChunkName: "inviteUsegeAnalysis" */ '../views/statisticalReport/InviteUsegeAnalysis.vue'),
        meta: {title: '邀请使用情况分析'}
    },
    {
        path: '/readAnalysis',
        name: 'readAnalysis',
        component: () => import(/* webpackChunkName: "readAnalysis" */ '../views/statisticalReport/ReadAnalysis.vue'),
        meta: {title: '阅读情况分析'}
    },
    {
        path: '/salesReport',
        name: 'salesReport',
        component: () => import(/* webpackChunkName: "salesReport" */ '../views/statisticalReport/SalesReport.vue'),
        meta: {title: '销售报表'}
    },
    /************************** 统计报表路由end ************************************/
    /*******************************  商城配置路由start ************************************************/
    {
        path: '/goodsType',
        name: 'goodsType',
        component: () => import(/* webpackChunkName: "goodsType" */ '../views/mallConfig/GoodsType.vue'),
        meta: {title: '商品类目'}
    },
    {
        path: '/productQA',
        name: 'productQA',
        component: () => import(/* webpackChunkName: "productQA" */ '../views/mallConfig/ProductQA.vue'),
        meta: {title: '商品问答'}
    },
    {
        path: '/productDetailsTemplate',
        name: 'productDetailsTemplate',
        component: () => import(/* webpackChunkName: "productDetailsTemplate" */ '../views/mallConfig/ProductDetailsTemplate.vue'),
        meta: {title: '商品详情模板'}
    },
    {
        path: '/mediaLibrary',
        name: 'mediaLibrary',
        component: () => import(/* webpackChunkName: "mediaLibrary" */ '../views/mallConfig/MediaLibrary.vue'),
        meta: {title: '媒体库'}
    },
    /*******************************  商城配置路由end ************************************************/
    /*******************************  会员中心路由Start ************************************************/
    {
        path: '/memberManage',
        name: 'memberManage',
        component: () => import(/* webpackChunkName: "memberManage" */ '../views/memberManage/MemberManage.vue'),
        meta: {title: '会员管理'}
    },
    {
        path: '/memberCouponManage',
        name: 'memberCouponManage',
        component: () => import(/* webpackChunkName: "memberCouponManage" */ '../views/memberManage/MemberCouponManage.vue'),
        meta: {title: '会员优惠券管理'}
    },
    {
        path: '/memberCollection',
        name: 'memberCollection',
        component: () => import(/* webpackChunkName: "memberCollection" */ '../views/memberManage/MemberCollection.vue'),
        meta: {title: '会员收藏'}
    },
    {
        path: '/membersFootprints',
        name: 'membersFootprints',
        component: () => import(/* webpackChunkName: "membersFootprints" */ '../views/memberManage/MembersFootprints.vue'),
        meta: {title: '会员足迹'}
    },
    {
        path: '/searchHistory',
        name: 'searchHistory',
        component: () => import(/* webpackChunkName: "searchHistory" */ '../views/memberManage/SearchHistory.vue'),
        meta: {title: '搜索历史'}
    },
    {
        path: '/shoppingCart',
        name: 'shoppingCart',
        component: () => import(/* webpackChunkName: "shoppingCart" */ '../views/memberManage/ShoppingCart.vue'),
        meta: {title: '购物车'}
    },
    {
        path: '/receivingAddressManage',
        name: 'receivingAddressManage',
        component: () => import(/* webpackChunkName: "receivingAddressManage" */ '../views/memberManage/ReceivingAddressManage.vue'),
        meta: {title: '收货地址管理'}
    },
    /*******************************  会员中心路由end ************************************************/
    /*******************************  分销中心路由Start ************************************************/
    {
        path: '/distributionManage',
        name: 'distributionManage',
        component: () => import(/* webpackChunkName: "distributionManage" */ '../views/distributionManage/DistributionManage.vue'),
        meta: {title: '分销员管理'}
    },
    {
        path: '/distributionSettings',
        name: 'distributionSettings',
        component: () => import(/* webpackChunkName: "distributionSettings" */ '../views/distributionManage/DistributionSettings.vue'),
        meta: {title: '分销设置'}
    },
    {
        path: '/distributorAudit',
        name: 'distributorAudit',
        component: () => import(/* webpackChunkName: "distributorAudit" */ '../views/distributionManage/DistributorAudit.vue'),
        meta: {title: '分销员审核'}
    },
    {
        path: '/withdrawalAudit',
        name: 'withdrawalAudit',
        component: () => import(/* webpackChunkName: "withdrawalAudit" */ '../views/distributionManage/WithdrawalAudit.vue'),
        meta: {title: '提现审核'}
    },
    /*******************************  分销中心路由end ************************************************/
    /*******************************  营销中心路由Start ************************************************/
    {
        path: '/couponManage',
        name: 'couponManage',
        component: () => import(/* webpackChunkName: "couponManage" */ '../views/marketManage/CouponManage.vue'),
        meta: {title: '优惠券管理'}
    },
    {
        path: '/homepageManage',
        name: 'homepageManage',
        component: () => import(/* webpackChunkName: "homepageManage" */ '../views/marketManage/HomePageManage.vue'),
        meta: {title: '首页轮播图管理'}
    },
    {
        path: '/homepageInterfaceManage',
        name: 'homepageInterfaceManage',
        component: () => import(/* webpackChunkName: "homepageInterfaceManage" */ '../views/marketManage/HomePageInterfaceManage.vue'),
        meta: {title: '首页界面管理'}
    },
    /*******************************  营销中心路由end ************************************************/
    /*******************************  商户中心路由Start ************************************************/
    {
        path: '/merchantManage',
        name: 'merchantManage',
        component: () => import(/* webpackChunkName: "merchantManage" */ '../views/mallManage/MerchantManage.vue'),
        meta: {title: '商户管理'}
    },
    {
        path: '/goodsManage',
        name: 'goodsManage',
        component: () => import(/* webpackChunkName: "goodsManage" */ '../views/mallManage/GoodsManage.vue'),
        meta: {title: '商品管理'}
    },
    {
        path: '/orderManage',
        name: "orderManage",
        component: () => import(/* webpackChunkName: "orderManage" */ '../views/mallManage/OrderManage.vue'),
        meta: {title: '订单管理'}
    },
    /*******************************  商户中心路由end ************************************************/
];

export default permissionRoutre;
