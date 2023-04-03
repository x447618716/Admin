import {isCard} from './validator'
import Regexp from 'path-to-regexp';

/**
 * 文本加密
 * @param  {String} srcString 要加密的文本
 * @return {String} retrunString 加密后的文本
 */
export const getEnString = srcString => {
    let basestr = "K6IDSZ4TEJQY2GXV3ANH5PCRMWU7BFLO";
    let i = 0;
    let index = 0;
    let digit = 0;
    let currByte;
    let nextByte;
    let retrunString = '';
    for (; i < srcString.length;) {
        currByte = (srcString.charCodeAt(i) >= 0) ? srcString.charCodeAt(i) : (srcString.charCodeAt(i) + 256);
        if (index > 3) {
            if ((i + 1) < srcString.length) {
                nextByte = (srcString.charCodeAt(i + 1) >= 0) ? srcString.charCodeAt(i + 1) : (srcString.charCodeAt(i + 1) + 256);
            } else {
                nextByte = 0;
            }
            digit = currByte & (0xFF >> index);
            index = (index + 5) % 8;
            digit <<= index;
            digit |= nextByte >> (8 - index);
            i++;
        } else {
            digit = (currByte >> (8 - (index + 5))) & 0x1F;
            index = (index + 5) % 8;
            if (index == 0) {
                i++;
            }
        }
        retrunString = retrunString + basestr.charAt(digit);
    }
    return retrunString;
};

/**
 * 递归路由
 * @param  {Array} userRouter 后台返回的用户权限json
 * @param  {Number,String} pid  节点树父id
 * @return {Array} menuList   格式化后的路由
 * @version: 1.0
 * @author 谢荣生
 */

export const recursionRouter = (userRouter = [], pid) => {
    let nodeTree = [];
    let temp = [];
    userRouter.forEach(item => {
        if (item.parentId === pid) {
            temp = recursionRouter(userRouter, item.id);
            if (temp.length > 0) {
                let type = temp.some(obj => obj.type == 2);
                let obj = {
                    icon: item.icon,
                    type: item.type,
                    permission: item.permission,
                    index: !item.url ? item.id : item.url,
                    title: item.name
                };
                if (type) {
                    //功能块
                    obj.func = temp;
                } else {
                    //子菜单
                    obj.subs = temp;
                }
                nodeTree.push(obj);
            } else {
                nodeTree.push({
                    icon: item.icon,
                    type: item.type,
                    permission: item.permission,
                    index: !item.url ? item.id : item.url,
                    title: item.name
                });
            }
        }
    });
    return nodeTree;
};

/**
 * 给路由添加功能权限（加入到路由meta中）
 * @param typeList
 */
export const addRouterPermission = (menuRouter, dynamicRoutes) => {
    dynamicRoutes.forEach((item) => {
        if (item.children && item.children.length > 0) {
            item.children.forEach(v => {
                for (let i = 0; i < menuRouter.length; i++) {
                    if (menuRouter[i].title === v.meta.title || menuRouter[i].index === v.path) {
                        if ('func' in menuRouter[i]) {
                            menuRouter[i].func.forEach(m => {
                                v.meta[m.permission] = true;
                            })
                        }
                        break;
                    } else {
                        if ('subs' in menuRouter[i]) {
                            menuRouter[i].subs.forEach(m => {
                                if (m.title === item.meta.title || m.index === item.path) {
                                    if ('func' in m) {
                                        v.func.forEach(k => {
                                            item.meta[k.permission] = true;
                                        })
                                    }
                                }
                            })
                        }
                    }
                }
            })
        } else {
            if (menuRouter.length) {
                for (let i = 0; i < menuRouter.length; i++) {
                    if (menuRouter[i].title === item.meta.title || menuRouter[i].index === item.path) {
                        if ('func' in menuRouter[i]) {
                            menuRouter[i].func.forEach(v => {
                                item.meta[v.permission] = true;
                            })
                        }
                        break;
                    } else {
                        if ('subs' in menuRouter[i]) {
                            menuRouter[i].subs.forEach(v => {
                                if (v.title === item.meta.title || v.index === item.path) {
                                    if ('func' in v) {
                                        v.func.forEach(m => {
                                            item.meta[m.permission] = true;
                                        })
                                    }
                                }
                            })
                        }
                    }
                }
            }
        }
    });
    return dynamicRoutes;
}


/**
 * 递归资源
 * @param menuList
 * @param pid
 * @return {Array} 菜单树数据结构
 * @constructor
 * @author 谢荣生
 * @version 1.0
 * @datetime 2020/11/4 15:32
 * @inheritDoc
 */
export const treeRouter = (menuList = [], pid, isOrder = false) => {
    let nodeTree = [];
    let temp = [];
    menuList.forEach(item => {
        if (item.parentId === pid) {
            temp = treeRouter(menuList, item.id, isOrder);
            if (temp.length > 0) {
                nodeTree.push({
                    id: item.id,
                    creatorId: item.creatorId,
                    label: item.name + (isOrder ? ' No：' + item.priority : ''),
                    disabled: item.status == 0 ? true : false,
                    children: temp
                });
            } else {
                nodeTree.push({
                    id: item.id,
                    creatorId: item.creatorId,
                    label: item.name + (isOrder ? ' No：' + item.priority : ''),
                    disabled: item.status == 0 ? true : false
                });
            }
        }
    });
    return nodeTree;
}


/**
 * 授权路由
 * @param  {Array} userRouter 后台返回的用户权限json
 * @param  {Array} dynamicRoutes  前端配置好的所有动态路由的集合
 * @return {Array} realRoutes   授权后的路由
 * @version: 1.0
 * @author 谢荣生
 */
export const authorizeRouter = (userRouter, dynamicRoutes) => {
    dynamicRoutes.forEach((item) => {
        if (item.children && item.children.length > 0) {
            item.children.forEach(v => {
                for (let i = 0; i < userRouter.length; i++) {
                    //判断当前子项是否是菜单项
                    if (v.meta.isMenu == undefined || v.meta.isMenu == true) {
                        //userRouter[i].name === v.meta.title &&
                        if (userRouter[i].name === v.meta.title || userRouter[i].url === v.path) {
                            item.meta.requiresAuth = true;
                            v.meta.requiresAuth = true;
                            break;
                        } else {
                            if (v.children && v.children.length > 0) {
                                authorizeRouter([userRouter[i]], v)
                            } else {
                                if (!item.meta.requiresAuth) {
                                    item.meta.requiresAuth = false;
                                }
                                v.meta.requiresAuth = false;
                            }
                        }
                    } else {
                        item.meta.requiresAuth = true;
                        v.meta.requiresAuth = true;
                        if (v.children && v.children.length > 0) {
                            authorizeRouter([userRouter[i]], v)
                        }
                    }
                }
            })
        } else {
            //判断用户是否拥有权限路由（没有只能使用默认路由）
            if (userRouter.length) {
                for (let i = 0; i < userRouter.length; i++) {
                    if (item.meta.isMenu == undefined || item.meta.isMenu == true) {
                        //userRouter[i].name === item.meta.title &&
                        if (userRouter[i].name === item.meta.title || userRouter[i].url === item.path) {
                            item.meta.requiresAuth = true;
                            break;
                        } else {
                            item.meta.requiresAuth = false;
                        }
                    } else {
                        item.meta.requiresAuth = true;
                    }
                }
            } else {
                if (item.meta.isMenu == undefined || item.meta.isMenu == true) {
                    item.meta.requiresAuth = false;
                } else {
                    item.meta.requiresAuth = true;
                }
            }
        }

    });
    return dynamicRoutes
};


/**
 *  递归反查路由表
 * @param  {Array} router 菜单路由表
 * @param  {Number,String} path  要反查的路由地址
 * @param  {Boolean} parent   是否返回父级
 * @return {Array} routeObj   子父级路由对象
 * @version: 1.0
 * @author 谢荣生
 */
export const searchRouter = (router, path, parent = true, parentPath = null) => {
    let routeObj = [];
    let temp = [];
    router.forEach(item => {
        //匹配路由 path.replace(/\/\//g, '/')
        let reg = Regexp(parentPath ? parentPath + '/' + (item.index || item.path) : item.index || item.path, [], {});
        let reg2 = Regexp(item.index || item.path, [], {});
        if (reg.exec(path) || reg2.exec(path)) {
            routeObj = [item];
        } else {
            if ('subs' in item || 'children' in item) {
                temp = searchRouter(item.subs || item.children, path, parent, parentPath = (item.path || item.index) ? (item.path || item.index) : null);
                if (temp.length > 0) {
                    if (parent) {
                        routeObj = [...[item], ...temp];
                    } else {
                        routeObj = temp;
                    }
                } else {
                    parentPath = null;
                }
            }
        }
    });
    return routeObj;
};


/**
 * 清除keepalive缓存
 * @param {Object} vnode 节点对象
 * @author 谢荣生
 * @version 1.0
 * @datetime 2020/7/30 15:23
 * @inheritDoc
 * */
export const clearKeepAlive = (vnode, key) => {
    if (vnode.$vnode && vnode.$vnode.data.keepAlive) {
        if (vnode.$vnode.parent && vnode.$vnode.parent.componentInstance && vnode.$vnode.parent.componentInstance.cache) {
            if (vnode.$vnode.componentOptions) {
                key = key || (vnode.$vnode.key == null
                    ? vnode.$vnode.componentOptions.Ctor.cid + (vnode.$vnode.componentOptions.tag ? `::${vnode.$vnode.componentOptions.tag}` : '')
                    : vnode.$vnode.key);
                let cache = vnode.$vnode.parent.componentInstance.cache;
                let keys = vnode.$vnode.parent.componentInstance.keys;
                if (cache[key]) {
                    if (keys.length) {
                        let index = keys.indexOf(key);
                        if (index > -1) {
                            keys.splice(index, 1);
                        }
                    }
                    //指定销毁节点
                    if (cache[key].componentInstance.$destroy) cache[key].componentInstance.$destroy();
                    delete cache[key];
                }
            }
        }
    }
    //在使用嵌套路由且非按打开顺序关闭时如 路由进入a->b->c  关闭b->c->a 在关闭b之后关闭c此时会报错节点不存在了就是因为被下面代码给销毁了
    // if (vnode.$destroy) vnode.$destroy();
};

/**
 *  将数字转化为大写
 * @param {Number} number 需要转化的数据
 * @param {String} type 转化类型{ money capitals} 默认 capitals
 * @return {String} strOutput   转化后的字符串 如 1. number = 100 type = capitals strOutput = 一百  2. number = 100 type = money strOutput = 壹佰元整
 * @author 谢荣生
 * @datetime 2020/1/8 16:02
 * */
export const numberCapitalization = (number, type = "capitals") => {
    let num = parseFloat(number);
    let strUnit = {
        capitals: "千百十亿千百十万千百十点  ",
        money: '仟佰拾亿仟佰拾万仟佰拾元角分'
    };
    let strNumber = {
        capitals: "零一二三四五六七八九",
        money: '零壹贰叁肆伍陆柒捌玖'
    };
    let strOutput = "";
    if (strUnit[type]) {
        num += "00";
        let intPos = num.indexOf('.');
        if (intPos >= 0) {
            num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
        }
        strUnit[type] = strUnit[type].substr(strUnit[type].length - num.length);
        for (let i = 0; i < num.length; i++) {
            if (strUnit[type].substr(i, 1) != ' ') {
                strOutput += strNumber[type].substr(num.substr(i, 1), 1) + strUnit[type].substr(i, 1);
            } else {
                strOutput += strNumber[type].substr(num.substr(i, 1), 1);
            }
        }

        if (type == 'capitals') {
            return strOutput.replace(/零[千百十]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/亿零{0,3}万/, '亿').replace(/零点零/, '').replace(/点零/, '')
        } else if (type == "money") {
            return strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元")
        }
    } else {
        console.error('当前类型：' + type + ' 不被支持，请确认类型。支持类型有 money | capitals')
    }
};

/**
 *  数组多重排序(此处多重排序只为年级班级排序使用-自定义多重排序此方法存在缺陷)
 * @param{Array} data 需要排序的数组对象
 * @param{Array} options 参数选项
 * @param{String}  order 排序规则 默认： desc 降序  参数选项： asce 升序   desc 降序
 * @return data 已排序数组对象
 * @author 谢荣生
 * @version 1.0
 * @datetime  2020/3/8 11:12
 * */
export const arraySort = (data, options, order = 'desc',) => {
    if (options === 'desc' || options === 'asce') {
        order = options;
        options = undefined;
    }

    if (typeof options === 'undefined') {
        data.sort(function (a, b) {
            if (order === 'desc') {
                return b - a
            } else {
                return a - b
            }
        });
    } else if (options instanceof Array) {
        options.forEach(item => {
            if (!Object.values(item)[0]) {
                data.sort(function (a, b) {
                    if (order === 'desc') {
                        return b[Object.keys(item)[0]] - a[Object.keys(item)[0]]
                    } else {
                        return a[Object.keys(item)[0]] - b[Object.keys(item)[0]]
                    }
                });
            } else {
                data.forEach(obj => {
                    obj[Object.values(item)[0]].sort(function (a, b) {
                        if (order === 'desc') {
                            return b[Object.keys(item)[0]] - a[Object.keys(item)[0]]
                        } else {
                            return a[Object.keys(item)[0]] - b[Object.keys(item)[0]]
                        }
                    });
                })
            }
        })
    }
    return data;
};

/**
 *  采集身份证信息
 * @param {Number} idCard 身份证号码
 * @param {Object} option 返回对象参数设置
 * @author 谢荣生
 * @datetime 2020/1/10 14:34
 * */

export const getIdCardInfo = (idCard, option) => {
    if (isCard(idCard)) {
        console.error('当前传入身份证号码：' + idCard + ' 不符合规范')
    } else {
        console.log(option)
        return '';
    }
};

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result

    const later = function() {
        // 据上一次触发时间间隔
        const last = +new Date() - timestamp

        // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last)
        } else {
            timeout = null
            // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.apply(context, args)
                if (!timeout) context = args = null
            }
        }
    }

    return function(...args) {
        context = this
        timestamp = +new Date()
        const callNow = immediate && !timeout
        // 如果延时不存在，重新设定延时
        if (!timeout) timeout = setTimeout(later, wait)
        if (callNow) {
            result = func.apply(context, args)
            context = args = null
        }

        return result
    }
}


/**
 *  实现jsonp请求
 * @return
 * @author 谢荣生
 * @version 1.0
 * @datetime  2021/6/3 10:44
 * @inheritDoc
 * */
export const jsonp = options => {
    return new Promise((resolve, reject) => {
        options = options || {};
        if (!options.url) {
            throw new Error("参数不合法");
        }

        let formatParams = data => {
            let arr = [];
            for (let name in data) {
                arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
            }
            return arr.join('&');
        }

        //创建 script 标签并加入到页面中
        let callbackName = ('jsonp_' + Math.random()).replace(".", "");
        let oHead = document.getElementsByTagName('head')[0];
        let params = formatParams(options.data);
        let oS = document.createElement('script');
        oHead.appendChild(oS);
        oS.onerror = reject;

        //创建jsonp回调函数
        window[callbackName] = function (json) {
            oHead.removeChild(oS);
            clearTimeout(oS.timer);
            window[callbackName] = null;
            options.success && options.success(json);
            resolve(json)
        };

        //发送请求
        if (options.url.search(/\?/g) != -1) {
            oS.src = options.url + `&jsonp=${callbackName}` + params;
        } else {
            oS.src = options.url + `?jsonp=${callbackName}` + params;
        }

        //超时处理
        if (options.time) {
            oS.timer = setTimeout(function () {
                window[callbackName] = null;
                oHead.removeChild(oS);
                options.fail && options.fail({message: "Time out"});
                reject({message: "Time out"})
            }, options.time);
        }
    })
}

/**
 * 获取用户位置
 * @return
 * @author 谢荣生
 * @version 1.0
 * @datetime  2021/6/3 10:44
 * @inheritDoc
 * */
export const getPosition = (timeout = 5000, maximumAge = 60000, enableHighAccuracy = false) => {
    return new Promise((resolve, reject) => {
        if (!navigator && !navigator.geolocation) {
            return reject(new Error('geolocation api not supported'))
        }

        const success = (loc) => {
            const location = {
                latitude: loc.coords.latitude,  // 纬度
                longitude: loc.coords.longitude,  // 经度
                accuracy: loc.coords.accuracy // 精确度
            }
            resolve(location)
        }

        const error = res => reject(res)

        navigator.geolocation.getCurrentPosition(success, error, {
            enableHighAccuracy,  // 指示浏览器获取高精度的位置，默认为false
            timeout,  // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
            maximumAge // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
        })
    })

}

/**
 * 取浮点数四则运算-精确值
 * @param {Number} value 需要转化的数据
 * @param {Number} ascii 进制
 * @return {Number}  精确后的值
 * @author 谢荣生
 * @datetime 2020/1/8 16:02
 */
export const float = (value, ascii) => {
    ascii = ascii ? ascii : 10;
    let base = Math.pow(10, ascii);
    return Math.round(value * base, 10) / base;
}

/****************************************************************分割线**************************************************************************************/
import dateUtils from './dateUtils'
import merge from 'webpack-merge'

export default merge({
    getEnString,
    recursionRouter,
    authorizeRouter,
    searchRouter,
    numberCapitalization,
    getIdCardInfo,
    arraySort,
    clearKeepAlive,
    treeRouter,
    addRouterPermission,
    debounce,
    jsonp,
    getPosition,
    float
}, dateUtils);
