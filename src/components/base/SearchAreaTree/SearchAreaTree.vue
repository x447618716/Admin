<template>
    <el-cascader v-model="name" :options="options" :props="props" :placeholder="placeholder" :disabled="disabled"
                 :clearable="clearable"
                 :showAllLevels="showAllLevels" :separator="separator" :filterable="filterable">
    </el-cascader>
</template>

<script>
    /**
     * 省市区三联组件 树形
     * @author 谢荣生
     * @version 1.0
     * @datetime 2021/2/22 15:43
     * @inheritDoc
     * */
    import {t} from 'element-ui/src/locale';

    export default {
        name: "SearchAreaTree",
        data() {
            return {
                props: {
                    lazy: true,
                    checkStrictly: true,
                    lazyLoad(node, resolve) {
                        let areaId = node.root ? 0 : node.value;
                        if (node.level < 3) {
                            this.$api.getAreaListByAreaId(areaId).then(res => {
                                if (!res.code) {
                                    res.data.forEach(item => {
                                        item.leaf = item.areaLevel == 3 ? true : false
                                    })
                                    resolve(res.data);
                                } else {
                                    this.$message.error(res.message);
                                }
                            })
                        } else {
                            resolve()
                        }
                    },
                    value: 'areaId',
                    label: 'areaName'
                }
            }
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        props: {
            value: {},
            options: Array,
            placeholder: {
                type: String,
                default: () => t('el.cascader.placeholder')
            },
            disabled: Boolean,
            clearable: Boolean,
            showAllLevels: {
                type: Boolean,
                default: true
            },
            separator: {
                type: String,
                default: ' / '
            },
            filterable: Boolean,
        },
        computed: {
            name: {
                get() {
                    return this.value;
                },
                set(val) {
                    this.$emit('update:value', val)
                    this.$emit('change', val)
                }
            }
        },
        methods: {
            // filterMethod(node, keyword) {
            //     // console.log(node)
            //     // console.log(keyword)
            //     // if (node.text.includes(keyword)) {
            //     //     node.lazyLoad()
            //     //         this.$http.get('SXBS-USER/area/getAreaListByAreaId?areaId=' + node.value).then((res) => {
            //     //             if (res.code == 0) {
            //     //                 node.children = res.data;
            //     //
            //     //                 node.initStore();
            //     //             } else {
            //     //                 this.$message.error(res.message);
            //     //             }
            //     //         })
            //     //     }
            //     // return node.text.includes(keyword);
            // },
        },
        created() {
        }
    }
</script>

<style scoped lang="less" type="text/less">

</style>
