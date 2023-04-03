import axios from "../../axios";

/*********************************** 商品管理**********************************************/


/**
 * 新增商品
 * @param requireData
 * @return {Promise<AxiosResponse<T>>}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2021/1/4 16:13
 * @inheritDoc
 */
export const addGoods = requireData => axios.post('/goods/addGoods',requireData);

/**
 * 更新商品
 * @param requireData
 * @return {Promise<AxiosResponse<T>>}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2021/1/4 16:15
 * @inheritDoc
 */
export const updateGoods = requireData => axios.post('/goods/updateGoods',requireData);


/**
 * 更新商品状态
 * @param id    商品id
 * @param status  0 删除 1 上架 2 下架
 * @return {Promise<AxiosResponse<T>>}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2021/1/4 16:17
 * @inheritDoc
 */
export const updateGoodsStatus = (id,status) => axios.post('/goods/updateGoodsStatus',{
    id,
    status
});

/**
 * 分页获取商品列表
 * @param requireData
 * @return {Promise<AxiosResponse<T>>}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2021/1/4 16:20
 * @inheritDoc
 */
export const getGoodsListPage = requireData => axios.get('/goods/getGoodsListPage',{
    params:requireData
});


/**
 * 根据商品id获取商品信息
 * @param id
 * @return {Promise<AxiosResponse<T>>}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2021/1/4 16:22
 * @inheritDoc
 */
export const getGoodsInfoById = id =>axios.get('/goods/getGoodsInfoById',{
    params:{
        id
    }
})

export default {
    addGoods,
    updateGoods,
    updateGoodsStatus,
    getGoodsListPage,
    getGoodsInfoById
}

