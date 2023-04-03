<template>
    <el-dropdown @command="handleCommand" trigger="click">
        <div class="el-dropdown-link">
            {{lable}}<i class="el-icon-arrow-down el-icon--right"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="item" v-for="item in language" :key="item.value">{{item.label}}
            </el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>

<script>
    /**
     * 语言选择组件
     * @author 谢荣生
     * @version 1.0
     * @datetime 2021/2/22 15:42
     * @inheritDoc
     * */
    export default {
        name: "Language",
        data() {
            return {
                language: [
                    {
                        value: "en",
                        label: "English"
                    },
                    {
                        value: "zh-CN",
                        label: "中文简体"
                    }
                ],
            }
        },
        props: {
            isSelect: Boolean
        },
        computed: {
            lable() {
                return this.language.find(item => item.value == this.$i18n.locale).label
            }
        },
        methods: {
            handleCommand(command) {
                this.$i18n.locale = command.value;
                //在选择了显示的语言后，将配置保存到Cookie中
                this.$cookies.set("DefaultLanguage", command.value, {expires: "30m"}//默认cookie有效时间为30分钟
                );
            }
        },
        created() {
        }
    }
</script>

<style scoped lang="less">
.el-dropdown-link{
  cursor: pointer;
}

</style>
