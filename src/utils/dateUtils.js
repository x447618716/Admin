/**
 * 将时间戳转化为指定格式输出
 * @param{ Number } timeStamp   时间戳(秒级)
 * @param{ String } format 需要转化的格式  默认格式 YYYY-MM-dd hh:mm:ss => 2019-01-01 00:00:00
 * @return{ String }  返回指定格式的日期时间
 * @version 1.0
 * @author 谢荣生
 * */
export const dateFormat = (timeStamp, format = 'YYYY-MM-dd hh:mm:ss') => {
    let time = new Date(timeStamp);
    let type = {
        "M+": time.getMonth() + 1,                                               //月
        "d+": time.getDate(),                                                    //日
        "h+": time.getHours(),                                                   //时 24小时制
        "H+": time.getHours() > 12 ? time.getHours() - 12 : time.getHours(),           //时 12小时制
        "m+": time.getMinutes(),                                                 //分
        "s+": time.getSeconds(),                                                 //秒
        "q+": Math.floor((time.getMonth() + 3) / 3),                          //季度
        "S": time.getMilliseconds(),                                             //毫秒
        "t+": time.getHours() + 1 > 12 ? "A" : "P"                               //上午/下午
    };
    if (/(y+|Y+)/.test(format)) {
        format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in type) {
        if (new RegExp("(" + k + ")").test(format)) {
            if (k == "t+") {
                format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (type[k]) : ((type[k] + "M").substr(0, ("" + k).length)));
            } else {
                format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (type[k]) : (("00" + type[k]).substr(("" + type[k]).length)));
            }
        }
    }
    return format;
};

/**
 * 将经过的时间(秒)转化为指定格式输出
 * @param{ Number } time   时间(秒数)
 * @param{ String } format 需要转化的格式  默认格式 d hh:mm:ss => 1 00:00:00
 * @return{ String }  返回指定格式的日期时间
 * @version 1.0
 * @author 谢荣生
 * */
export const timeFormat = (time, format = 'd hh:mm:ss') => {
    if (typeof time == 'number') {
        let type = {
            "d+": parseInt(time / (60 * 60 * 24)),                                 //日
            "h+": parseInt(time % (60 * 60 * 24) / (60 * 60)),                         //时
            "m+": parseInt(time % (60 * 60 * 24) % (60 * 60) / 60),                      //分
            "s+": parseInt(time % (60 * 60 * 24) % (60 * 60) % 60),                      //秒
        };
        for (let k in type) {
            if (new RegExp("(" + k + ")").test(format)) {
                if (k == "d+") {
                    format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (type[k]) : ((type[k] + "M").substr(0, ("" + k).length)));
                } else {
                    format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (type[k]) : (("00" + type[k]).substr(("" + type[k]).length)));
                }
            }
        }
        return format;
    } else {
        return ''
    }
}

/**
 * 获取时间经过的长度
 * @param{ Number }  timeStamp   某个事件执行的时间戳(秒)
 * @param{ Number }  serverTime  服务器或本地当前时间戳  默认本地当前时间戳
 * @return 经过的时间长度 如：  几秒前 几分钟前 几小时前 几天前  几周前 超过一个月返回日期
 * @version 1.0
 * @author 谢荣生
 * */
export const dateDuration = (timeStamp, serverTime = new Date().getTime()) => {
    //得到间隔秒数
    let second = parseInt((serverTime - timeStamp) / 1000);
    //得到间隔天数
    let day = Math.floor(second / 86400);
    //  如果时间小于1个月并且大于1天
    if (day > 0 && day <= 30) {
        //  如果大于1周
        if (day > 7) {
            return Math.floor(day / 7) + '周前';
        } else {
            return day + '天前';
        }
    } else if (day > 30) { //  如果时间大于1个月则返回日期
        return dateFormat(timeStamp, "YYYY-MM-dd");
    } else { 	//  如果时间小于1天
        //  如果时间正常
        if (second > 0) {
            //  获取间隔小时
            let hour = Math.floor(second / 3600);
            second = second % 3600;
            //  如果时间大于1小时
            if (hour > 0) {
                return hour + '小时前';
            } else {
                if (second > 0) {
                    //  如果时间大于1分钟
                    let min = Math.floor(second / 60);
                    second = second % 60;
                    if (min > 0) {
                        return min + '分钟前';
                    } else {
                        //  如果时间大于1秒钟
                        if (second > 0) {
                            return second + '秒前';
                        } else {
                            return '刚刚';
                        }
                    }
                } else {
                    return '刚刚';
                }
            }
        } else {
            return '刚刚';
        }
    }
};

/**
 * 获取传入时间当前所在周数（星期数）
 * @param{ Number } timeStamp 时间戳
 * @param{ String } format 需要转化的格式  默认格式 '周' => 周一
 * @return 当前时间所处周数或星期数 如：周一或星期一
 * @version 1.0
 * @author 谢荣生
 * */
export const weekDate = (timeStamp, format = '周') => {
    let number = new Date(timeStamp).getDay();
    let strArray = ['日', '一', '二', '三', '四', '五', '六'];
    return ('' + strArray[number]).replace('', format);
};
/****************************************************************分割线**************************************************************************************/
export default {
    dateFormat,
    timeFormat,
    dateDuration,
    weekDate
}
