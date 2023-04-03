import axios from "../../axios";

/*************************************** 日志管理 ***************************************/

/**
 * 分页获取日志列表
 * @param requireDate
 * @return {*}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2020/11/9 9:22
 * @inheritDoc
 */
export const getLogListPage = requireDate => axios.get('/sysLog/getLogListPage', {
    params: requireDate
});


export default {
    getLogListPage
}
