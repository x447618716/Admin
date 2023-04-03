import axios from "../../axios";

/*************************************** 权限管理(角色管理)***************************************/


/**
 * 新增角色
 * @param name              角色名称
 * @param roleName          角色英文名称
 * @param description       说明
 * @return {*}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2020/11/4 16:46
 * @inheritDoc
 */
export const addRole = requireDate => axios.post('/role/addRole', requireDate);


/**
 * 根据角色id更新角色信息
 * @param requireDate
 * @return {*}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2020/11/4 16:48
 * @inheritDoc
 */
export const updateRole = requireDate => axios.post("/role/updateRole", requireDate);


/**
 * 根据角色id批量更新角色状态
 * @param id
 * @param status
 * @return {*}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2020/11/4 16:51
 * @inheritDoc
 */
export const updateRoleStatusByIds = (id, status) => axios.post("role/disableAndEnableByIds", {
    id,
    status
});

/**
 * 分页获取角色列表
 * @param requireData
 * @return {*}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2020/11/4 16:53
 * @inheritDoc
 */
export const getRoleAllPage = requireData => axios.get("/role/getRoleAllPage", {
    params: requireData
});

/**
 * 根据角色id获取角色信息
 * @param id
 * @return {*}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2020/11/4 16:55
 * @inheritDoc
 */
export const getRoleInfoById = id => axios.get("/role/getRoleInfoById", {
    params: {
        id
    }
});

/**
 * 根据角色id获取角色资源
 * @param id 角色id
 * @return {*}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2020/11/5 16:09
 * @inheritDoc
 */
export const getRoleResourceById = id => axios.get('/roleResource/getRoleResourceById', {
    params: {
        id
    }
});

/**
 * 权限分配
 * @param roleId  角色id
 * @param addResourceId  要添加的权限id  多个以逗号隔开
 * @param delResourceId 要删除的权限id 多个以逗号隔开
 * @return {*}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2020/11/5 17:09
 * @inheritDoc
 */
export const assignPermissions = (roleId, addResourceId, delResourceId) => axios.post('/roleResource/assignPermissions', {
    roleId,
    addResourceId,
    delResourceId
});


export default {
    addRole,
    updateRole,
    updateRoleStatusByIds,
    getRoleAllPage,
    getRoleInfoById,
    getRoleResourceById,
    assignPermissions
}
