import Vue from 'vue'
import VueI18n from 'vue-i18n'
import VueCookies from 'vue-cookies'
// import axios from 'axios'

//英文包
import enLocale from 'element-ui/lib/locale/lang/en'
//中文包
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

import ElementLocale from 'element-ui/lib/locale'

Vue.use(VueCookies);
Vue.use(VueI18n);

//获取语言类型
function InitLanguage() {
    return Vue.$cookies.get('DefaultLanguage') == null ? 'zh-CN' : Vue.$cookies.get('DefaultLanguage');
}

//配置多语言
const i18n = new VueI18n({
    locale: InitLanguage(),
    messages: {
        'en': Object.assign(require("./lang/en"), enLocale),
        'zh-CN': Object.assign(require("./lang/zh-CN"), zhLocale)
    }
});

ElementLocale.i18n((key, value) => i18n.t(key, value));

export default i18n
//动态加载语言包
// export const i18n = new VueI18n({
//     locale: 'en', // 设置语言环境
//     fallbackLocale: 'en',
//     messages // 设置语言环境信息
// });
//
// const loadedLanguages = ['en']; // 我们的预装默认语言
//
// function setI18nLanguage (lang) {
//     i18n.locale = lang;
//     axios.defaults.headers.common['Accept-Language'] = lang;
//     document.querySelector('html').setAttribute('lang', lang);
//     return lang
// }
//
// export function loadLanguageAsync (lang) {
//     if (i18n.locale !== lang) {
//         if (!loadedLanguages.includes(lang)) {
//             return import(/* webpackChunkName: "lang-[request]" */ `@/lang/${lang}`).then(msgs => {
//                 i18n.setLocaleMessage(lang, msgs.default);
//                 loadedLanguages.push(lang);
//                 return setI18nLanguage(lang)
//             })
//         }
//         return Promise.resolve(setI18nLanguage(lang))
//     }
//     return Promise.resolve(lang)
// }
