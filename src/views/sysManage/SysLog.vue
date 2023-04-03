<template>
    <el-container direction="vertical">
        <!--搜索栏-->
        <div class="search-box">
            <label>{{$t("system.search")}}</label>
            <el-select v-model="searchObj.categoryObj.value" class="search-select">
                <el-option label="全部类型" :value="0"></el-option>
                <el-option label="web" :value="1"></el-option>
                <el-option label="api" :value="2"></el-option>
            </el-select>
            <el-date-picker type="datetime" v-model="searchObj.startDate" placeholder="选择开始时间"
                            value-format="timestamp" class="search-select"></el-date-picker>
            <el-date-picker type="datetime" v-model="searchObj.endDate" placeholder="选择结束时间"
                            value-format="timestamp" class="search-select"></el-date-picker>
            <el-select v-model="searchObj.actionObj.value" class="search-select">
                <el-option label="全部状态" :value="null"></el-option>
                <el-option v-for="obj in searchObj.actionObj.list" :key="obj.id" :label="obj.name"
                           :value="obj.id"></el-option>
            </el-select>
            <el-input v-model="searchObj.userName" placeholder="操作用户名称" class="search-input"></el-input>
            <el-input v-model="searchObj.keyWord" placeholder="关键字" class="search-input"></el-input>
            <el-button-custom type="primary" icon="el-icon-search" :is-permission="false" @click="search"></el-button-custom>
        </div>
        <!--内容主体-->
        <div class="main">
            <!--内容主体标题栏-->
            <el-row type="flex" justify="space-between" style="padding: 20px 0">
                <div>
                    <span class="page-title">系统日志</span>
                </div>
            </el-row>
            <!--主体内容列表-->
            <el-table v-loading="loading" :data="tableData" border header-cell-class-name="page-table"
                      @sort-change="handleSortChange">
                <el-table-column prop="id" label="ID" align="center"></el-table-column>
                <el-table-column prop="type" label="日志类型" align="center"></el-table-column>
                <el-table-column prop="operationDescribe" label="行为" align="center" width="120px"></el-table-column>
                <el-table-column prop="requestIp" label="操作IP" align="center"></el-table-column>
                <el-table-column prop="requestUrl" label="请求url" align="center"></el-table-column>
                <el-table-column prop="requestMethod" label="请求方式" align="center"></el-table-column>
                <el-table-column prop="requestData" label="请求数据" align="center"></el-table-column>
                <el-table-column prop="operationModule" label="操作模块" align="center"></el-table-column>
                <el-table-column prop="operationTakeUpTime" label="操作耗时" align="center"></el-table-column>
                <el-table-column prop="operationId" label="操作用户" align="center"></el-table-column>
                <el-table-column prop="operationTime" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="result" label="报文" align="center"
                                 width="120px">
                    <template slot-scope="scope">
                        <el-row type="flex" justify="space-around">
                            <el-link-custom type="primary" :is-permission="false" @click="handleLook(scope.row.result)">查看报文</el-link-custom>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页器-->
            <el-pagination-custom ref="pagination" background
                                  @current-size-change="handleCurrentSizeChange"></el-pagination-custom>
        </div>
        <el-dialog :visible.sync="visible" title="报文">
            <json-viewer :value="html" :expand-depth=5 copyable boxed sort expanded></json-viewer>
        </el-dialog>
    </el-container>
</template>

<script>
    export default {
        name: "syslog",
        data() {
            return {
                searchObj: {
                    categoryObj: {value: 0, list: []},
                    actionObj: {
                        value: null,
                        list: [{id: 0, name: '新增'}, {id: 1, name: '下发'}, {id: 2, name: '禁用'}, {id: 3, name: '删除'}, {
                            id: 4,
                            name: '修改'
                        }]
                    },
                    userName: null,
                    startDate: null,
                    endDate: null,
                    isOrder: null,
                    inOrder: null,
                    keyWord: null
                },
                visible: false,
                html: null,
                loading: false,
                tableData: [],
                jsonEditor: false
            }
        },
        methods: {
            //搜索
            search() {
                this.$refs['pagination'].localPageNo = 1;
                this.$refs['pagination'].localPageSize = 10;
                this.getTableData()
            },
            //获取分类列表
            getTableData() {
                this.loading = true;
                this.$api.getLogListPage({
                    modularId: this.searchObj.categoryObj.value,
                    tag: this.searchObj.keyWord,
                    startDate: this.searchObj.startDate,
                    endDate: this.searchObj.endDate,
                    action: this.searchObj.actionObj.value,
                    userName: this.searchObj.userName,
                    inOrder: this.searchObj.inOrder,
                    isOrder: this.searchObj.isOrder,
                    pageNo: this.$refs['pagination'].localPageNo,
                    pageSize: this.$refs['pagination'].localPageSize
                }).then(res => {
                    if (!res.code) {
                        if (res.data) {
                            this.tableData = res.data.list;
                            this.$refs['pagination'].localTotal = res.data.total;
                        } else {
                            this.tableData = [];
                            this.$refs['pagination'].localTotal = 0;
                        }
                    } else {
                        this.$message.error(res.message)
                    }
                    this.loading = false;
                })
            },
            //分页查询与分页条数切换
            handleCurrentSizeChange(pageNo, pageSize) {
                this.$refs['pagination'].localPageNo = pageNo;
                this.$refs['pagination'].localPageSize = pageSize;
                this.getTableData();
            },
            //列表自定义排序
            // eslint-disable-next-line no-unused-vars
            handleSortChange({column, prop, order}) {
                this.searchObj.inOrder = order ? prop : null;
                this.searchObj.isOrder = order ? order == 'descending' ? 2 : 1 : null;
                this.getTableData();
            },
            //查看报文
            handleLook(val) {
                this.visible = true;
                this.html = JSON.parse(val)
            },
        },
        created() {
            this.$nextTick(function () {
                this.search();
            })
        }
    }
</script>

<style scoped>

</style>
