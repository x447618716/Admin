<template>
    <!--分页器-->
    <div style="margin-top: 20px; margin-bottom: 20px; padding-bottom: 20px">
        <el-pagination :small="small" @current-change="handleCurrentChange" @size-change="handleSizeChange"
                       :page-size.sync="customPageSize" :page-count="pageCount" :page-sizes="pageSizes"
                       :pager-count="pagerCount"
                       :current-page.sync="customCurrentPage" :layout="layout"
                       :total="customTotal" :popper-class="popperClass" :prev-text="prevText" :next-text="nextText"
                       :background="background" :disabled="disabled" :hide-on-single-page="hideOnSinglePage"
                       style="text-align: right"></el-pagination>
    </div>
</template>

<script>
    /**
     * 自定义分页 - element-ui分页再封装
     * @author 谢荣生
     * @version 1.0
     * @datetime 2021/2/22 14:34
     * @inheritDoc
     * */
    export default {
        name: "ElPaginationCustom",
        data() {
            return {
                localPageNo: 1,
                localPageSize: 10,
                localTotal: 0
            }
        },
        props: {
            pageSize: {
                type: Number,
                default: 10
            },
            small: Boolean,
            total: {
                type: Number,
                default: 0
            },
            pageCount: Number,
            pagerCount: {
                type: Number,
                validator(value) {
                    return (value | 0) === value && value > 4 && value < 22 && (value % 2) === 1;
                },
                default: 7
            },
            currentPage: {
                type: Number,
                default: 1
            },
            layout: {
                default: 'total, sizes, prev, pager, next, jumper'
            },
            pageSizes: {
                type: Array,
                default() {
                    return [10, 50, 100, 200];
                }
            },
            popperClass: String,
            prevText: String,
            nextText: String,
            background: Boolean,
            disabled: Boolean,
            hideOnSinglePage: Boolean
        },
        computed: {
            customPageSize: {
                get: function () {
                    return this.localPageSize;
                },
                set: function (val) {
                    this.localPageSize = val;
                    this.$emit('update:pageSize', val);
                }
            },
            customCurrentPage: {
                get: function () {
                    return this.localPageNo;
                },
                set: function (val) {
                    this.localPageNo = val;
                    this.$emit('update:currentPage', val);
                }
            },
            customTotal: {
                get: function () {
                    return this.localTotal;
                }
            }
        },
        watch: {
            pageSize: {
                handler: function (val) {
                    this.localPageSize = val;
                },
                immediate: true,
                deep: true
            },
            currentPage: {
                handler: function (val) {
                    this.localPageNo = val;
                },
                immediate: true,
                deep: true
            },
            total: {
                handler: function (val) {
                    this.localTotal = val;
                },
                immediate: true,
                deep: true
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.$emit('current-change', val);
                this.handleAll(val, this.customPageSize)
            },
            handleSizeChange(val) {
                this.$emit('size-change', val);
                this.handleAll(this.customCurrentPage, val)
            },
            handleAll(pageNo, pageSize) {
                this.$emit('current-size-change', pageNo, pageSize)
            }
        }
    }
</script>

<style scoped>

</style>
