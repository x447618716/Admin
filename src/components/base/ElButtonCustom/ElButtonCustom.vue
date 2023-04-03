<template>
    <el-tooltip effect="dark" :content="$t('components.ElButtonCustom.permissionTips')" placement="top"
                :disabled="!(isPermission?disableMark:false)">
        <el-button :type="type" :size="size" :icon="icon" :native-type="nativeType" :loading="loading"
                   :disabled="isPermission?disableMark:disabled"
                   :plain="plain" :autofocus="autofocus" :round="round" :circle="circle" @click="handleClick">
            <slot></slot>
        </el-button>
    </el-tooltip>
</template>

<script>
    /**
     * 权限按钮组件
     * @author 谢荣生
     * @version 1.0
     * @datetime 2021/2/22 14:06
     * @inheritDoc
     * */

    export default {
        name: "ElButtonCustom",
        data() {
            return {}
        },
        props: {
            type: {
                type: String,
                default: 'default'
            },
            size: String,
            icon: {
                type: String,
                default: ''
            },
            nativeType: {
                type: String,
                default: 'button'
            },
            loading: Boolean,
            disabled: Boolean,
            plain: Boolean,
            autofocus: Boolean,
            round: Boolean,
            circle: Boolean,
            // 是否需要鉴权(无需鉴权时匹配默认禁用属性disabled)
            isPermission: {
                type: Boolean,
                default: true
            },
            //权限标记
            permissionMark: String
        },
        computed: {
            disableMark() {
                //判断权限
                if (Object.keys(this.$route.meta).includes(this.permissionMark)) {
                    return false
                } else {
                    return true;
                }
            }
        },
        methods: {
            handleClick(evt) {
                this.$emit('click', evt);
            }
        },
        created() {
        }
    }
</script>

<style scoped lang="less" type="text/less">

</style>
