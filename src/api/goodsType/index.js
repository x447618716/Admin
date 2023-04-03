import axios from "../../axios";

/*********************************** 商品类型管理**********************************************/


/**
 * 新增商品类型
 * @param requireData
 * @return {Promise<AxiosResponse<T>>}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2021/1/4 16:13
 * @inheritDoc
 */
export const addGoodsType = requireData => axios.post('/goodsType/addGoodsType',requireData);

/**
 * 更新商品类型
 * @param requireData
 * @return {Promise<AxiosResponse<T>>}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2021/1/4 16:15
 * @inheritDoc
 */
export const updateGoodsType = requireData => axios.post('/goodsType/updateGoodsType',requireData);


/**
 * 更新商品类型状态
 * @param id    商品类型id
 * @param status  0 删除 1 启用 2 禁用
 * @return {Promise<AxiosResponse<T>>}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2021/1/4 16:17
 * @inheritDoc
 */
export const updateGoodsTypeStatus = (id,status) => axios.post('/goodsType/updateGoodsTypeStatus',{
    id,
    status
});

/**
 * 分页获取商品类型列表
 * @param requireData
 * @return {Promise<AxiosResponse<T>>}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2021/1/4 16:20
 * @inheritDoc
 */
export const getGoodsTypeListPage = requireData => axios.get('/goodsType/getGoodsTypeListPage',{
    params: requireData
});


/**
 * 根据商品类型id获取商品类型信息
 * @param id
 * @return {Promise<AxiosResponse<T>>}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2021/1/4 16:22
 * @inheritDoc
 */
export const getGoodsTypeInfoById = id =>axios.get('/goodsType/getGoodsTypeInfoById',{
    params:{
        id
    }
});



export default {
    addGoodsType,
    updateGoodsType,
    updateGoodsTypeStatus,
    getGoodsTypeListPage,
    getGoodsTypeInfoById
}

