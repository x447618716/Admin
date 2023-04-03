import axios from '../axios';

/**
 * 后台登录
 * @param {String} userAccount  账号
 * @param {String} password     密码
 * @return 用户认证id和用户信息
 * @author 谢荣生
 * @version 1.0
 * @datetime  2020/1/7 12:07
 * @inheritDoc  http://192.168.3.252:3000/project/28/interface/api/987
 * */
export const login = (userAccount, password) => axios.post('/system/login', {
    account: userAccount,
    password: password
});

/**
 * 后台登出
 * @author 谢荣生
 * @version 1.0
 * @datetime 2021/2/26 10:21
 * @inheritDoc
 * @return {Promise<AxiosResponse<T>>}
 */
export const signOut = () => axios.post('/system/signOut');

/**
 * 修改登录密码
 * @param{String} oldPassword 旧密码
 * @param{String} newPassword 新密码
 * @param{String} confirmPassword 确认密码
 * @return
 * @author 谢荣生
 * @version 1.0
 * @datetime  2020/3/10 15:12
 * @inheritDoc 后端接口api地址
 * */

export const updatePassword = (oldPassword, newPassword, confirmPassword) => axios.post('/SXBS-USER/teacher/updatePwdManage', {
    orginPwd: oldPassword,
    newPwd: newPassword,
    retPwd: confirmPassword
});

export default {
    login,
    signOut,
    updatePassword
}


