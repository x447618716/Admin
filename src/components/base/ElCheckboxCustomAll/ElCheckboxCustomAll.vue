<template>
    <div>
        <el-checkbox :disabled="disabled" :border="border" :size="size" style="margin: 5px 10px"
                     :indeterminate="isIndeterminate" v-model="checkAll" @change="handleSelectAll">
            {{$t('pages.common.allClasses')}}
        </el-checkbox>
        <el-checkbox-group :disabled="disabled" v-model="value" @change="handleCheckedChange">
            <el-checkbox style="margin: 5px 10px" :label="item.key" v-for="item in data" :key="item.key"
                         :border="border" :size="size">
                {{item.gradeNo}}{{$t('pages.common.grade')}}{{item.classNo}}{{$t('pages.common.class')}}
            </el-checkbox>
        </el-checkbox-group>
    </div>

</template>

<script>
    export default {
        name: "ElCheckboxCustomAll",
        data() {
            return {
                isIndeterminate: false,
                checkAll: false
            }
        },
        props: {
            data: Array,
            key: {
                type: String,
                default: "label"
            },
            value: {},
            disabled: Boolean,
            border: Boolean,
            size: String
        },
        methods: {
            //全选或全不选
            handleSelectAll(val) {
                if (val) {
                    let selectData = [];
                    this.data.forEach(item => {
                        selectData.push(item.key)
                    });
                    this.$emit('selectDate', selectData);
                } else {
                    this.$emit('selectDate', []);
                }
                this.isIndeterminate = false;
            },
            //自定义选择
            handleCheckedChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.data.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.data.length;
            }
        },
        created() {
        }
    }
</script>

<style scoped lang="less" type="text/less">

</style>
