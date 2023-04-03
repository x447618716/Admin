import {
    isPhone,
    isPassword,
    isChinese,
    isVerify,
    isEmail,
    isCard,
    isCard_18,
    isPlate,
    isLicense,
    isBank,
    isInteger
} from './index'
import i18n from '../../i18n-setup'


//验证手机
export const validatePhone = (rule, value, callback) => {
    if (value) {
        if (isPhone(value)) {
            callback();
        } else {
            callback(new Error(i18n.t('validate.phone')));
        }
    } else {
        callback();
    }

};

//验证密码
export const validatePassword = (rule, value, callback) => {
    if (value) {
        if (isPassword(value)) {
            callback();
        } else {
            callback(new Error(i18n.t('validate.password')));
        }
    } else {
        callback();
    }
};

//验证中文字符
export const validateChinese = (rule, value, callback) => {
    if (value) {
        if (isChinese(value)) {
            callback();
        } else {
            callback(new Error(i18n.t('validate.chinese')));
        }
    } else {
        callback();
    }

};

//验证验证码
export const validateVerify = (rule, value, callback) => {
    if (value) {
        if (isVerify(value)) {
            callback();
        } else {
            callback(new Error(i18n.t('validate.verify')));
        }
    } else {
        callback();
    }

};

//验证邮箱
export const validateEmail = (rule, value, callback) => {
    if (value) {
        if (isEmail(value)) {
            callback();
        } else {
            callback(new Error(i18n.t('validate.email')));
        }
    } else {
        callback();
    }
};

//验证身份证
export const validateCard = (rule, value, callback) => {
    if (value) {
        if (isCard(value)) {
            callback();
        } else {
            callback(new Error(i18n.t('validate.idCard')));
        }
    } else {
        callback();
    }
};

//验证人员是否未满18周岁或大于60周岁
export const validateCard_18 = (rule, value, callback) => {
    if (value) {
        if (isCard_18(value)) {
            callback();
        } else {
            callback(new Error(i18n.t('validate.idCard_18_60')));
        }
    } else {
        callback();
    }
};

//验证车牌号
export const validatePlate = (rule, value, callback) => {
    if (value) {
        if (isPlate(value)) {
            callback();
        } else {
            callback(new Error(i18n.t('validate.plate')));
        }
    } else {
        callback();
    }
};

//验证营业执照号
export const validateLicense = (rule, value, callback) => {
    if (value) {
        if (isLicense(value)) {
            callback();
        } else {
            callback(new Error(i18n.t('validate.license')));
        }
    } else {
        callback();
    }
};

//验证银行卡
export const validateBank = (rule, value, callback) => {
    if (value) {
        if (isBank(value)) {
            callback();
        } else {
            callback(new Error(i18n.t('validate.bank')));
        }
    } else {
        callback();
    }
};

//验证是否非零正整数
export const validateInteger = (rule, value, callback) => {
    if (value) {
        if (isInteger(value)) {
            callback();
        } else {
            callback(new Error(i18n.t('validate.onlyInteger')));
        }
    } else {
        callback();
    }

};

//验证时间必须大于当前时间
export const validateNow = (rule, value, callback) => {
    if (value) {
        if (new Date().getTime() > new Date(value).getTime()) {
            callback(new Error(i18n.t('validate.nowTime')));
        } else {
            callback();
        }
    } else {
        callback();
    }

};
