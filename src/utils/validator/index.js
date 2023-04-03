/**
 * 验证帐号是否合法(字母开头，允许5-16字节，允许字母数字下划线)
 * @param{ String } val   账号
 * @return{ Boolean } true 正确  false 错误
 * @version: 1.0
 * @author 谢荣生
 * */
export const isAccount = val => {
    return /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/.test(val);
};

/**
 * 验证是否带有中文字符
 * @param{ String } val  文本内容
 * @return{ Boolean } true 正确  false 错误
 * @version: 1.0
 * @author 谢荣生
 * */
export const isChinese = val => {
    return /[\u4E00-\u9FA5]/g.test(val);
}

/**
 * 验证是否是手机号
 * @param{ Number } val   手机号
 * @return{ Boolean } true 正确  false 错误
 * @version: 1.0
 * @author 谢荣生
 * */
export const isPhone = val => {
    return /^1[3|4|5|7|8][0-9]{9}$/.test(val);
};

/**
 * 验证密码是否合法(第一个字必须为字母且要6~12位）
 * @param{ String } val   密码
 * @return{ Boolean } true 正确  false 错误
 * @version: 1.0
 * @author 谢荣生
 * */
export const isPassword = val => {
    return /^[a-zA-Z\d]{6,12}$/.test(val);
};

/**
 * 验证验证码是否合规(6位数字)
 * @param{ Number } val   验证码
 * @return{ Boolean } true 正确  false 错误
 * @version: 1.0
 * @author 谢荣生
 * */
export const isVerify = val => {
    return /^\d{6}$/.test(val);
};

/**
 * 验证身份证是否正确
 * @param{ String } val   身份证号
 * @return{ Boolean } true 正确  false 错误
 * @version: 1.0
 * @author 谢荣生
 * */
export const isCard = val => {
    let length = val.length;
    if (length <= 15) {
        return /\d{14}[[0-9],0-9xX]/.test(val);
    } else {
        if (/\d{17}(\d|X|x)/.test(val)) {
            if (validateCheckNumber(val)) {
                return true
            }
        }
        return false;
    }
};

/**
 * 根据身份证验证是否年满18周岁并小于60周岁
 * @param{ String } val   身份证号
 * @return{ Boolean } true 正确  false 错误
 * @version: 1.0
 * @author 谢荣生
 * */
export const isCard_18 = val => {
    let length = val.length;
    if (length <= 15) {
        if (/\d{14}[[0-9],0-9xX]/.test(val)) {
            let year = "19" + val.substr(6, 2);
            year = new Date().getFullYear() - parseInt(year);
            if (18 <= year && year <= 60) {
                return true;
            }
        }
        return true;
    } else {
        if (/\d{17}(\d|X|x)/.test(val)) {
            if (validateCheckNumber(val)) {
                let year = val.substr(6, 4);
                year = new Date().getFullYear() - year;
                if (18 <= year && year <= 60) {
                    return true;
                }
            }
        }
        return false;
    }
};


/**
 * 验证身份证最后一位校验码
 * @param{ String } val   身份证号
 * @return{ Boolean } true 正确  false 错误
 * @version: 1.0
 * @author 谢荣生
 * */
const validateCheckNumber = val => {
    // 加权因子
    let W = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    let sum = 0;
    for (let i = 0; i < W.length; i++) {
        sum += parseInt(val[i]) * W[i];
    }
    // 校验位是X，则表示10
    if (val[17] == 'X' || val[17] == 'x') {
        sum += 10;
    } else {
        sum += parseInt(val[17]);
    }
    // 如果除11模1，则校验通过
    return sum % 11 == 1;
};

/**
 * 验证邮箱是否合法
 * @param{ String } val   邮箱
 * @return{ Boolean } true 正确  false 错误
 * @version: 1.0
 * @author 谢荣生
 * */
export const isEmail = val => {
    return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(val);
};

/**
 * 验证车牌是否合法
 * @param{ String } val   车牌
 * @return{ Boolean } true 正确  false 错误
 * @version: 1.0
 * @author 谢荣生
 * */
export const isPlate = val => {
    return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/.test(val);
};

/**
 * 验证营业执照号是否合法
 * @param{ String } val   营业执照号
 * @return{ Boolean } true 正确  false 错误
 * @version: 1.0
 * @author 谢荣生
 * */
export const isLicense = val => {
    return /(^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10}$)|(^\d{15}$)/.test(val);
};

/**
 * 验证银行卡号是否合法
 * @param{ String } val   银行卡号
 * @return{ Boolean } true 正确  false 错误
 * @version: 1.0
 * @author 谢荣生
 * */
export const isBank = val => {
    if (/^([1-9]{1})(\d{14,18})$/.test(val)) {
        if (checkBankCard(val)) {
            return true;
        }
    }
    return false;
};

/**
 * 匹配Luhn算法：检测银行卡卡号
 * @param{ String } val   银行卡号
 * @return{ Boolean } true 正确  false 错误
 * @version: 1.0
 * @author 谢荣生
 * */
const checkBankCard = val => {
    if (isNaN(val))
        return false;
    if (val.length < 12) {
        return false;
    }
    let nums = val.split("");
    let sum = 0;
    let index = 1;
    for (let i = 0; i < nums.length; i++) {
        if ((i + 1) % 2 == 0) {
            let tmp = Number(nums[nums.length - index]) * 2;
            if (tmp >= 10) {
                let t = tmp + "".split("");
                tmp = Number(t[0]) + Number(t[1]);
            }
            sum += tmp;
        } else {
            sum += Number(nums[nums.length - index]);
        }
        index++;
    }
    if (sum % 10 != 0) {
        return false;
    }
    return true;
};

/**
 * 验证输入是否非零正整数
 * @param{String,Number} val 输入的数据
 * @return{ Boolean } true 正确  false 错误
 * @version: 1.0
 * @author 谢荣生
 * */
export const isInteger = val => {
    return /^\+?[1-9][0-9]*$/.test(val);
};


/**
 * 判断环境是否移动设备
 * @return 是返回true-否返回false
 * @version 1.0
 * @datetime  2021/6/3 9:22
 * @inheritDoc
 * */
export const isMobile = () => {
    return navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    );
}
