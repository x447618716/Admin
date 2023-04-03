<template>
    <div style="display: inline-block">
        <template v-if="to">
            <router-link :tag="tag" :to="to" :exact="exact" :append="append" :replace="replace"
                         :active-class="activeClass" :exact-active-class="exactActiveClass" :event="event">
                <el-link :style="{color:textColor}" :type="type" :underline="underline"
                         :icon="markerIcon">
                    <slot>{{markerLabel}}</slot>
                </el-link>
            </router-link>
        </template>
        <template v-else>
            <el-tooltip effect="dark" :content="$t('components.ElLinkCustom.permissionTips')" placement="top"
                        :disabled="!(isPermission?disableMark:false)">
                <el-link :style="{color:textColor}" :type="type" :underline="underline"
                         :disabled="isPermission?disableMark:disabled" :href="href"
                         :icon="markerIcon" @click="handleClick">
                    <slot>{{markerLabel}}</slot>
                </el-link>
            </el-tooltip>
        </template>
    </div>
</template>

<script>

    /**
     * 权限链接按钮组件
     * @author 谢荣生
     * @version 1.0
     * @datetime 2021/2/22 14:05
     * @inheritDoc
     * */

    import {mapState} from "vuex"

    export default {
        name: "ElLinkCustom",
        data() {
            return {
                iconList: {
                    edit: "el-icon-edit",
                    del: "el-icon-delete",
                    see: "el-icon-view",
                    details: "el-icon-document",
                    issue: "el-icon-data-line",
                    shield: "el-icon-data-board",
                    examine: "el-icon-s-check"
                }
            }
        },
        props: {
            type: {
                type: String,
                default: 'default'
            },
            underline: {
                type: Boolean,
                default: true
            },
            disabled: Boolean,
            href: String,
            icon: String,
            to: {
                type: [String, Object],
                default: ''
            },
            tag: {
                type: String,
                default: 'a'
            },
            exact: Boolean,
            append: Boolean,
            replace: Boolean,
            activeClass: String,
            exactActiveClass: String,
            event: {
                type: [String, Array],
                default: 'click'
            },
            //颜色值
            textColor: String,
            //是否显示图标
            isIcon: {
                type: Boolean,
                default: true
            },
            //图标类型
            iconType: {
                type: String,
                validator: function (value) {
                    // 这个值必须匹配下列字符串中的一个
                    return ['edit', 'del', 'see', 'details', 'issue', 'shield', 'examine'].indexOf(value) !== -1
                }
            },
            // 是否需要鉴权(无需鉴权时匹配默认禁用属性disabled)
            isPermission: {
                type: Boolean,
                default: true
            },
            //权限标记
            permissionMark: String,
            //创建者标记
            creatorMark: [String, Number]
        },
        computed: {
            ...mapState({
                userInfo: state => state.userInfo
            }),
            markerIcon() {
                return this.isIcon ? this.icon ? this.icon : this.iconList[this.iconType] : '';
            },
            markerLabel() {
                switch (this.iconType) {
                    case 'edit':
                        return this.$t('components.ElLinkCustom.edit');
                    case 'del':
                        return this.$t('components.ElLinkCustom.del');
                    case 'see':
                        return this.$t('components.ElLinkCustom.see');
                    case 'details':
                        return this.$t('components.ElLinkCustom.details');
                    case 'issue':
                        return this.$t('components.ElLinkCustom.enabled');
                    case 'shield':
                        return this.$t('components.ElLinkCustom.disable');
                    case 'examine':
                        return this.$t('components.ElLinkCustom.audit');
                    default:
                        return ''
                }
            },
            disableMark() {
                //判断权限
                if (this.userInfo.id != this.creatorMark) {
                    return true;
                } else if (Object.keys(this.$route.meta).includes(this.permissionMark)) {
                    return false
                } else {
                    return true;
                }
            }
        },
        methods: {
            handleClick(event) {
                if (!this.disabled) {
                    if (!this.href && !this.to) {
                        this.$emit('click', event);
                    } else if (this.to) {
                        if (this.replace) {
                            this.$router.replace(this.to)
                        } else {
                            this.$router.push(this.to)
                        }
                    }
                }
            }
        },
        created() {
        }
    }
</script>

<style scoped lang="less" type="text/less">

</style>
