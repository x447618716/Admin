import axios from '../axios';

/**
 * 根据地区父级id获取地区列表
 * @param areaId  第一层传0
 * @return {*}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2020/11/9 9:22
 * @inheritDoc
 */
export const getAreaListByAreaId = areaId => axios.get('/area/getAreaListByAreaId', {
    params: {
        areaId
    }
});

/**
 * 获取所有角色
 * @return {*}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2020/11/9 10:16
 * @inheritDoc
 */
export const getRoleListAll = () => axios.get('/role/getRoleListAll');


/**
 * 获取所有商品类目
 * @return {*}
 * @author 谢荣生
 * @version 1.0
 * @datetime 2021/1/6 9:27
 * @inheritDoc
 */
export const getGoodsTypeListAll = () =>axios.get('/goodsType/getGoodsTypeListAll');


export default {
    getAreaListByAreaId,
    getRoleListAll
}
