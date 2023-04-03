<template>
    <el-tooltip effect="dark" :content="$t('system.theme')" placement="bottom">
        <el-color-picker v-model="theme" class="theme-picker" popper-class="theme-picker-dropdown"/>
    </el-tooltip>
</template>

<script>
    /**
     * 主题选择组件
     * @author 谢荣生
     * @version 1.0
     * @datetime 2021/2/22 15:44
     * @inheritDoc
     * */

    import {mapState, mapMutations} from 'vuex'

    const version = require('element-ui/package.json').version;
    const ORIGINAL_THEME = '#409EFF'; //409EFF 283446
    /*主题选择*/
    export default {
        name: "ThemeChoice",
        data() {
            return {
                chalk: '', // content of theme-chalk css
                theme: ORIGINAL_THEME
            }
        },
        watch: {
            theme(val, oldVal) {
               // less.modifyVars({@common-bg：'＃000'});
                if (typeof val !== 'string') return
                const themeCluster = this.getThemeCluster(val.replace('#', ''))
                const originalCluster = this.getThemeCluster(oldVal.replace('#', ''))
                const getHandler = (variable, id) => {
                    return () => {
                        const originalCluster = this.getThemeCluster(ORIGINAL_THEME.replace('#', ''))
                        const newStyle = this.updateStyle(this[variable], originalCluster, themeCluster)

                        let styleTag = document.getElementById(id)
                        if (!styleTag) {
                            styleTag = document.createElement('style')
                            styleTag.setAttribute('id', id)
                            document.head.appendChild(styleTag)
                        }
                        styleTag.innerText = newStyle
                    }
                }

                const chalkHandler = getHandler('chalk', 'chalk-style')

                if (!this.chalk) {
                    const url = `https://unpkg.com/element-ui@${version}/lib/theme-chalk/index.css`
                    this.getCSSString(url, chalkHandler, 'chalk')
                } else {
                    chalkHandler()
                }

                const styles = [].slice.call(document.querySelectorAll('style'))
                    .filter(style => {
                        const text = style.innerText
                        return new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text)
                    })
                styles.forEach(style => {
                    const {innerText} = style
                    if (typeof innerText !== 'string') return
                    style.innerText = this.updateStyle(innerText, originalCluster, themeCluster)
                })

                this.RECORD_THEME_COLOR(themeCluster);

                //在选择了显示的语言后，将配置保存到Cookie中
                this.$cookies.set("DefaultTheme", val.replace('#', ''), {expires: "30m"}//默认cookie有效时间为30分钟
                )
            }
        },
        computed: {
            ...mapState({
                themeColor: state => state.themeColor
            })
        },
        methods: {
            ...mapMutations([
                'RECORD_THEME_COLOR'
            ]),
            updateStyle(style, oldCluster, newCluster) {
                let newStyle = style
                oldCluster.forEach((color, index) => {
                    newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index])
                })
                return newStyle
            },
            getCSSString(url, callback, variable) {
                const xhr = new XMLHttpRequest()
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        this[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, '')
                        callback()
                    }
                }
                xhr.open('GET', url)
                xhr.send()
            },
            getThemeCluster(theme) {
                const tintColor = (color, tint) => {
                    let red = parseInt(color.slice(0, 2), 16)
                    let green = parseInt(color.slice(2, 4), 16)
                    let blue = parseInt(color.slice(4, 6), 16)

                    if (tint === 0) { // when primary color is in its rgb space
                        return [red, green, blue].join(',')
                    } else {
                        red += Math.round(tint * (255 - red))
                        green += Math.round(tint * (255 - green))
                        blue += Math.round(tint * (255 - blue))

                        red = red.toString(16)
                        green = green.toString(16)
                        blue = blue.toString(16)

                        return `#${red}${green}${blue}`
                    }
                }

                const shadeColor = (color, shade) => {
                    let red = parseInt(color.slice(0, 2), 16)
                    let green = parseInt(color.slice(2, 4), 16)
                    let blue = parseInt(color.slice(4, 6), 16)

                    red = Math.round((1 - shade) * red)
                    green = Math.round((1 - shade) * green)
                    blue = Math.round((1 - shade) * blue)

                    red = red.toString(16)
                    green = green.toString(16)
                    blue = blue.toString(16)

                    return `#${red}${green}${blue}`
                }

                const clusters = [theme]
                for (let i = 0; i <= 9; i++) {
                    clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
                }
                clusters.push(shadeColor(theme, 0.1))
                return clusters
            }
        },
        mounted() {
            this.theme = this.$cookies.get('DefaultTheme') == null ? '#' + this.themeColor[0] : '#' + this.$cookies.get('DefaultTheme');
        }
    }
</script>

<style scoped lang="less" type="text/less">

</style>
