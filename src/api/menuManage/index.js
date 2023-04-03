import axios from "../../axios";

/*********************************** 菜单管理**********************************************/

/**
 * 获取资源列表
 * @param requireData
 * @return {*}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2020/11/3 11:01
 * @inheritDoc
 */
export const getResourceAllPage = requireData => axios.get('/resource/getResourceAllPage', {
    params: requireData
});

/**
 * 获取资源总列表
 * @param requireData
 * @return {*}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2020/11/4 15:39
 * @inheritDoc
 */
export const getResourceAll = requireData => axios.get('/resource/getResourceAll', {
    params: requireData
});


/**
 * 新增资源
 * @param requireData
 * @return {*}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2020/11/3 11:03
 * @inheritDoc
 */
export const addResource = requireData => axios.post('/resource/addResource', requireData);

/**
 * 更新资源
 * @param requireDtae
 * @return {*}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2020/11/3 11:05
 * @inheritDoc
 */
export const updateResource = requireDtae => axios.post('/resource/updateResource', requireDtae);

/**
 * 根据资源id获取资源详情
 * @param id
 * @return {*}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2020/11/3 11:09
 * @inheritDoc
 */
export const getResourceInfoById = id => axios.get('/resource/getResourceInfoById', {
    params: {
        id
    }
});


/**
 * 根据资源id批量更新资源状态
 * @param id     资源id集合 以逗号隔开
 * @param status  状态值 0 禁用 1 启用
 * @return {*}
 */
export const updateResourceStatusByIds = (id, status) => axios.post('/resource/updateResourceStatusByIds', {
    id,
    status
});

/**
 * 根据菜单级别获取菜单列表
 * @param level  菜单级别
 * @return {*}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2020/11/3 14:01
 * @inheritDoc
 */
export const getResourceByLevel = level => axios.get("/resource/getResourceByLevel", {
    params: {
        level
    }
});


export default {
    getResourceAllPage,
    addResource,
    updateResource,
    getResourceInfoById,
    updateResourceStatusByIds,
    getResourceByLevel,
    getResourceAll
}
