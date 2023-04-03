<template>
    <el-container direction="vertical">
        <!-- 搜索栏 -->
        <div class="search-box">
            <label>{{$t("system.search")}}</label>
            <el-select v-model="searchObj.statusObj.value" class="search-select">
                <el-option label="全部状态" value=""></el-option>
                <el-option v-for="obj in searchObj.statusObj.list" :key="obj.id" :label="obj.name"
                           :value="obj.id"></el-option>
            </el-select>
            <el-input v-model="searchObj.keyWord" placeholder="商品类目名称"
                      class="search-input"></el-input>
            <el-button-custom type="primary" icon="el-icon-search" permission-mark="searchGoodsType"
                              @click="search"></el-button-custom>
        </div>
        <!--内容主体-->
        <div class="main">
            <!--内容主体标题栏-->
            <el-row type="flex" justify="space-between" style="padding: 20px 0">
                <div>
                    <span class="page-title">商品类目管理</span>
                </div>
                <div>
                    <el-button-custom type="success" size="medium" permission-mark="updateGoodsTypeStatus"
                                      @click="handleBatchEnable">批量启用
                    </el-button-custom>
                    <el-button-custom type="success" size="medium" permission-mark="updateGoodsTypeStatus"
                                      @click="handleBatchDisable">批量禁用
                    </el-button-custom>
                    <el-button-custom type="success" size="medium" permission-mark="addGoodsType"
                                      icon="el-icon-plus"
                                      @click="addOrUpdateVisible = true">
                        {{$t('pages.common.newlyAdded')}}
                    </el-button-custom>
                </div>
            </el-row>
            <!--主体内容列表-->
            <el-table ref="table" row-key="id" v-loading="loading" :data="tableData" border
                      header-cell-class-name="page-table" @selection-change="handleSelectionChange">
                <el-table-column align="center" type="selection" reserve-selection
                                 :selectable="handleSelectable"></el-table-column>
                <el-table-column prop="id" label="ID" align="center"></el-table-column>
                <el-table-column prop="name" label="名称" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                    <template slot-scope="scope">
                        <p>{{scope.row.status ==0?"删除":scope.row.status==1?"启用":scope.row.status==2?"禁用":"未知状态"}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="description" label="说明" align="center"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间">
                    <template slot-scope="scope">
                        <p>{{scope.row.creatorName}}</p>
                        <p>{{scope.row.createTime}}</p>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="updateTime" label="更新时间">
                    <template slot-scope="scope">
                        <p>{{scope.row.updateName}}</p>
                        <p>{{scope.row.updateTime}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="result" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-row type="flex" justify="space-around" style="flex-direction: column">
                            <el-link-custom type="primary" permission-mark="updateGoodsTypeStatus" :creator-mark="scope.row.creatorId"
                                            @click="handleUpdateStatus(scope.row.id,(scope.row.status==0||scope.row.status==2)?1:2)">
                                {{(scope.row.status==0||scope.row.status==2)?"上架":"下架"}}
                            </el-link-custom>
                            <el-link-custom type="primary" permission-mark="updateGoodsTypeStatus" :creator-mark="scope.row.creatorId" @click="handleUpdateStatus(scope.row.id,0)">删除
                            </el-link-custom>
                            <el-link-custom type="primary" permission-mark="updateGoodsType" :creator-mark="scope.row.creatorId"
                                            @click="handleEdit(scope.row.id)">编辑
                            </el-link-custom>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页器-->
            <el-pagination-custom ref="pagination" background
                                  @current-size-change="handleCurrentSizeChange"></el-pagination-custom>
        </div>
        <el-dialog :title="goodsType.id?'编辑商品类目':'新增商品类目'" :visible.sync="addOrUpdateVisible"
                   :before-close="handleCancel"
                   :close-on-click-modal="false">
            <el-form ref="addOrUpdateForm" :rules="goodsTypeRules" :model="goodsType" label-width="120px">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="goodsType.name" class="form-input__small" placeholder="请输入商品类目名称"></el-input>
                </el-form-item>
                <el-form-item label="说明" prop="description">
                    <el-input type="textarea" v-model="goodsType.description" :rows="5" class="form-input__medium"
                              placeholder="请输入类目说明"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" style="text-align: center">
                <el-button type="info" size="medium" @click="handleCancel">取 消</el-button>
                <el-button type="primary" size="medium" @click="handleSubmit">确定</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>

    import {mapState} from 'vuex'

    export default {
        name: "goodsType",
        data() {
            return {
                searchObj: {
                    statusObj: {value: "", list: [{id: 0, name: "删除"}, {id: 1, name: "启用"}, {id: 2, name: "禁用"}]},
                    keyWord: ""
                },
                loading: false,
                tableData: [],
                selectData: [],
                addOrUpdateVisible: false,
                goodsType: {
                    id: null,
                    name: null,
                    description: null
                },
                goodsTypeRules: {}
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.userInfo
            })
        },
        methods: {
            //搜索
            search() {
                this.$refs['pagination'].localPageNo = 1;
                this.$refs['pagination'].localPageSize = 10;
                this.getTableData();
            },
            //获取分类列表
            getTableData() {
                this.loading = true;
                this.$api.getGoodsTypeListPage({
                    key: this.searchObj.keyWord,
                    status: this.searchObj.statusObj.value,
                    pageNo: this.$refs['pagination'].localPageNo,
                    pageSize: this.$refs['pagination'].localPageSize
                }).then(res => {
                    if (!res.code) {
                        this.tableData = res.data.list;
                        this.$refs['pagination'].localTotal = res.data.total;
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
            //单元格选中事件
            handleSelectionChange(val) {
                this.selectData = val;
            },
            //表格是否可被勾选
            handleSelectable(row) {
                return row.creatorId == this.userInfo.id
            },
            //批量启用
            handleBatchEnable() {
                if (!this.selectData.length) {
                    this.$message.error('请选择需要启用的商品类目');
                    return false;
                }
                let ids = this.selectData.map(obj => obj.id).join(',');
                this.handleUpdateStatus(ids, 1)
            },
            //批量禁用
            handleBatchDisable() {
                if (!this.selectData.length) {
                    this.$message.error('请选择需要禁用的商品类目');
                    return false;
                }
                let ids = this.selectData.map(obj => obj.id).join(',');
                this.handleUpdateStatus(ids, 2)
            },
            //更新状态
            handleUpdateStatus(id, status) {
                this.$confirm('是否' + (status == 0 ? '删除' : status == 1 ? '启用' : '禁用') + '商品类目？', "提示", {
                    type: "info",
                    center: false
                }).then(() => {
                    this.$api.updateGoodsTypeStatus(id, status).then(res => {
                        if (!res.code) {
                            this.$message.success(res.message);
                            this.selectData = [];
                            this.$refs.table.clearSelection();
                            this.getTableData()
                        } else {
                            this.$message.error(res.message);
                        }
                    })
                }).catch(() => {
                })

            },
            //取消
            handleCancel() {
                if (this.$refs['addOrUpdateForm']) this.$refs['addOrUpdateForm'].clearValidate();
                this.goodsType.id = null;
                this.goodsType.name = null;
                this.goodsType.description = null;
                this.addOrUpdateVisible = false;
            },
            //提交
            handleSubmit() {
                this.$refs['addOrUpdateForm'].validate((valid) => {
                    if (valid) {
                        if (this.goodsType.id) {
                            this.$api.updateGoodsType({
                                id: this.goodsType.id,
                                name: this.goodsType.name,
                                description: this.goodsType.description
                            }).then(res => {
                                if (!res.code) {
                                    this.$message.success(res.message);
                                    this.handleCancel();
                                    this.search();
                                } else {
                                    this.$message.error(res.message)
                                }
                            })
                        } else {
                            this.$api.addGoodsType({
                                name: this.goodsType.name,
                                description: this.goodsType.description
                            }).then(res => {
                                if (!res.code) {
                                    this.$message.success(res.message);
                                    this.handleCancel();
                                    this.getTableData();
                                } else {
                                    this.$message.error(res.message)
                                }
                            })
                        }
                    }
                })
            },
            //编辑
            handleEdit(id) {
                this.$api.getGoodsTypeInfoById(id).then(res => {
                    if (!res.code) {
                        this.goodsType.id = res.data.id;
                        this.goodsType.name = res.data.name;
                        this.goodsType.description = res.data.description;
                        this.addOrUpdateVisible = true;
                    } else {
                        this.$message.error(res.message)
                    }
                })
            }
        },
        created() {
            this.$nextTick(function () {
                this.search();
            })
        }
    }
</script>

<style scoped lang="less" type="text/less">

</style>
