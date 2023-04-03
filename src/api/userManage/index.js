import axios from "../../axios";

/************************************* 后台用户管理***************************************************/


/**
 * 分页获取用户列表
 * @param requestDate
 * @return {*}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2020/11/9 9:36
 * @inheritDoc
 */
export const getUserListPage = requestDate => axios.get('/user/getUserListPage', {
    params: requestDate
});

/**
 * 新增用户
 * @param requestDate
 * @return {*}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2020/11/12 15:06
 * @inheritDoc
 */
export const addUser = requestDate => axios.post('/user/addUser', requestDate);


/**
 * 更新用户
 * @param requestDate
 * @return {*}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2020/11/12 15:09
 * @inheritDoc
 */
export const updateUser = requestDate => axios.post('/user/updateUser', requestDate);

/**
 * 根据用户Id 获取用户信息
 * @param id 用户id
 * @return {*}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2020/11/12 15:52
 * @inheritDoc
 */
export const getUserInfoById = id => axios.get('/user/getUserInfoById', {
    params: {
        id
    }
});

/**
 * 批量更新用户状态
 * @param id      用户id 多个以逗号隔开
 * @param status  0 删除 1 启用 2 禁用
 * @return {*}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2020/11/12 15:24
 * @inheritDoc
 */
export const delAndDisableAndEnableByIds = (id, status) => axios.post('/user/delAndDisableAndEnableByIds', {
    id,
    status
});

/**
 * 批量重置密码
 * @param id     用户id 多个以逗号隔开
 * @return {*}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2020/11/12 16:14
 * @inheritDoc
 */
export const resetPwd = id => axios.post('/user/resetPwd', {
    id
});


export default {
    getUserListPage,
    addUser,
    updateUser,
    delAndDisableAndEnableByIds,
    getUserInfoById,
    resetPwd
}
