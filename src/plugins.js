/**
 * 插件化管理
 * */

/******************************** 额外功能性插件start**********************************************/

//百度图形
import echarts from "echarts";
//xml转换
import x2js from 'x2js'

/******************************** 额外功能性插件end**********************************************/

/**************************************工具start******************************************/
import {
    getEnString,
    recursionRouter,
    authorizeRouter,
    searchRouter,
    numberCapitalization,
    arraySort,
    clearKeepAlive,
    treeRouter,
    addRouterPermission,
} from './utils'

import {
    dateFormat,
    timeFormat,
    dateDuration,
    weekDate
} from './utils/dateUtils'


/**
 * 工具Method集合
 * */
const utils = {
    getEnString,
    recursionRouter,
    authorizeRouter,
    searchRouter,
    dateFormat,
    timeFormat,
    dateDuration,
    weekDate,
    numberCapitalization,
    arraySort,
    clearKeepAlive,
    treeRouter,
    addRouterPermission
};

/********************************************工具end*********************************************/

/*****************************************验证器start**********************************************/
import {
    validatePhone,
    validatePassword,
    validateVerify,
    validateEmail,
    validateCard,
    validateCard_18,
    validatePlate,
    validateLicense,
    validateBank,
    validateChinese,
    validateInteger,
    validateNow,
} from './utils/validator/validator'

const validate = {
    validatePhone,
    validatePassword,
    validateVerify,
    validateEmail,
    validateCard,
    validateCard_18,
    validatePlate,
    validateLicense,
    validateBank,
    validateChinese,
    validateInteger,
    validateNow,
};

/*****************************************验证器end**********************************************/


/**********************************接口start******************************************************/
import {
    login,
    signOut,
    updatePassword,
} from './api'

import {
    getAreaListByAreaId, getGoodsTypeListAll, getRoleListAll
} from './api/common'

import {
    addUser,
    delAndDisableAndEnableByIds, getUserInfoById,
    getUserListPage, resetPwd,
    updateUser
} from './api/userManage'

import {
    getResourceAllPage,
    addResource,
    updateResource,
    getResourceInfoById,
    updateResourceStatusByIds,
    getResourceByLevel,
    getResourceAll
} from './api/menuManage'

import {
    addRole,
    getRoleAllPage,
    getRoleInfoById,
    updateRole,
    updateRoleStatusByIds,
    getRoleResourceById,
    assignPermissions
} from "./api/authorityManage";

import {getLogListPage} from "./api/logManage";

import {addGoods, getGoodsInfoById, getGoodsListPage, updateGoods, updateGoodsStatus} from "./api/goodsManage";

import {
    addGoodsType,
    getGoodsTypeInfoById,
    getGoodsTypeListPage,
    updateGoodsType,
    updateGoodsTypeStatus
} from "./api/goodsType";

/**
 * 接口集合
 * */
const api = {
    login,
    signOut,
    updatePassword,
    getResourceAllPage,
    addResource,
    updateResource,
    getResourceInfoById,
    updateResourceStatusByIds,
    getResourceByLevel,
    getResourceAll,
    addRole,
    updateRole,
    updateRoleStatusByIds,
    getRoleAllPage,
    getRoleInfoById,
    getRoleResourceById,
    assignPermissions,
    getAreaListByAreaId,
    getUserListPage,
    getRoleListAll,
    addUser,
    updateUser,
    delAndDisableAndEnableByIds,
    getUserInfoById,
    resetPwd,
    getLogListPage,
    addGoods,
    updateGoods,
    updateGoodsStatus,
    getGoodsListPage,
    getGoodsInfoById,
    addGoodsType,
    updateGoodsType,
    updateGoodsTypeStatus,
    getGoodsTypeListPage,
    getGoodsTypeInfoById,
    getGoodsTypeListAll
};
/**********************************接口end******************************************************/

const install = function (Vue) {
    Vue.prototype.$utils = utils;
    Vue.prototype.$api = api;
    Vue.prototype.$validate = validate;
    Vue.prototype.$echarts = echarts;
    Vue.prototype.$x2js = new x2js();
};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default install
