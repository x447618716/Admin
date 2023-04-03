<template>
    <el-container direction="vertical">
        <!-- 搜索栏 -->
        <div class="search-box">
            <label>{{$t("system.search")}}</label>
            <el-select v-model="searchObj.typeObj.value" class="search-select">
                <el-option label="全部类目" value=""></el-option>
                <el-option v-for="obj in searchObj.typeObj.list" :key="obj.id" :label="obj.name"
                           :value="obj.id"></el-option>
            </el-select>
            <el-select v-model="searchObj.statusObj.value" class="search-select">
                <el-option label="全部状态" value=""></el-option>
                <el-option v-for="obj in searchObj.statusObj.list" :key="obj.id" :label="obj.name"
                           :value="obj.id"></el-option>
            </el-select>
            <el-date-picker type="datetime" v-model="searchObj.startDate" placeholder="选择开始时间"
                            value-format="timestamp" class="search-select"></el-date-picker>
            <el-date-picker type="datetime" v-model="searchObj.endDate" placeholder="选择结束时间"
                            value-format="timestamp" class="search-select"></el-date-picker>
            <el-input v-model="searchObj.keyWord" placeholder="商品名称"
                      class="search-input"></el-input>
            <el-button-custom type="primary" icon="el-icon-search" permission-mark="searchGoods"
                              @click="search"></el-button-custom>
        </div>
        <!--内容主体-->
        <div class="main">
            <!--内容主体标题栏-->
            <el-row type="flex" justify="space-between" style="padding: 20px 0">
                <div>
                    <span class="page-title">商品管理</span>
                </div>
                <div>
                    <el-button-custom type="success" size="medium" permission-mark="updateGoodsStatus"
                                      @click="handleBatchEnable">批量启用
                    </el-button-custom>
                    <el-button-custom type="success" size="medium" permission-mark="updateGoodsStatus"
                                      @click="handleBatchDisable">批量禁用
                    </el-button-custom>
                    <el-button-custom type="success" size="medium" permission-mark="addGoods" icon="el-icon-plus"
                                      @click="addOrUpdateVisible = true">
                        {{$t('pages.common.newlyAdded')}}
                    </el-button-custom>
                </div>
            </el-row>
            <!--主体内容列表-->
            <el-table v-loading="loading" :data="tableData" border header-cell-class-name="page-table">
                <el-table-column prop="id" label="ID" align="center"></el-table-column>
                <el-table-column prop="typeName" label="商品类型" align="center"></el-table-column>
                <el-table-column prop="name" label="商品名称" align="center" width="120px"></el-table-column>
                <el-table-column prop="status" label="状态" align="center" width="120px">
                    <template slot-scope="scope">
                        {{scope.row.status == 1?'上架':scope.row.status == 2?'下架':"已删除"}}
                    </template>
                </el-table-column>
                <el-table-column prop="startTime" label="活动开始时间" align="center"></el-table-column>
                <el-table-column prop="endTime" label="活动结束时间" align="center"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间" width="150">
                    <template slot-scope="scope">
                        <p>{{scope.row.creatorName}}</p>
                        <p>{{scope.row.createTime}}</p>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="updateTime" label="更新时间" width="150">
                    <template slot-scope="scope">
                        <p>{{scope.row.updateName}}</p>
                        <p>{{scope.row.updateTime}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="result" label="操作" align="center"
                                 width="120px">
                    <template slot-scope="scope">
                        <el-row type="flex" justify="space-around" style="flex-direction: column">
                            <el-link-custom type="primary" @click="handleSeeSetMeal(scope.row.id)">查看套餐</el-link-custom>
                            <el-link-custom type="primary" @click="handleUpdateStatus">上架</el-link-custom>
                            <el-link-custom type="primary" @click="handleUpdateStatus">下架</el-link-custom>
                            <el-link-custom type="primary" @click="handleUpdateStatus">删除</el-link-custom>
                            <el-link-custom type="primary" :is-permission="false" @click="handleEdit(scope.row.id)">编辑
                            </el-link-custom>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页器-->
            <el-pagination-custom ref="pagination" background
                                  @current-size-change="handleCurrentSizeChange"></el-pagination-custom>
        </div>
        <el-dialog :title="goods.id?'编辑商品':'新增商品'" :visible.sync="addOrUpdateVisible"
                   :before-close="handleCancel"
                   :close-on-click-modal="false">
            <el-form ref="addOrUpdateForm" :rules="goodsRules" :model="goods" label-width="120px">
                <el-form-item label="ID" v-if="goods.id">{{goods.id}}</el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="goods.name" class="form-input__small" placeholder="请输入商品名称"></el-input>
                </el-form-item>
                <el-form-item label="商品类目" prop="type">
                    <el-select v-model="goods.type" class="search-select" placeholder="请选择商品类目">
                        <el-option v-for="obj in searchObj.typeObj.list" :key="obj.id" :label="obj.name"
                                   :value="obj.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="活动开始时间" prop="startDate">
                    <el-date-picker type="datetime" v-model="goods.startDate" placeholder="选择开始时间"
                                    value-format="yyyy-MM-dd HH:mm:ss" class="search-select"></el-date-picker>
                </el-form-item>
                <el-form-item label="活动结束时间" prop="endDate">
                    <el-date-picker type="datetime" v-model="goods.endDate" placeholder="选择结束时间"
                                    value-format="yyyy-MM-dd HH:mm:ss" class="search-select"></el-date-picker>
                </el-form-item>
                <el-form-item prop="picture" label="展示图">
                    <p>最多上传6张，且大小不得超过500kb</p>
                    <el-upload-custom list-type="picture-card" :file-list="goods.picture"
                                      action="/system/uploadFile"

                                      :file-size="5000" :limit="6"
                                      @getData="file=>goods.picture=file">
                    </el-upload-custom>
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
    export default {
        name: "goodsManage",
        data() {
            return {
                searchObj: {
                    typeObj: {value: "", list: []},
                    statusObj: {value: "", list: [{id: 0, name: "删除"}, {id: 1, name: "启用"}, {id: 2, name: "禁用"}]},
                    startDate: "",
                    endDate: "",
                    keyWord: ""
                },
                addOrUpdateVisible: false,
                loading: false,
                tableData: [],
                goods: {
                    id: null,
                    name: null,
                    type: null,
                    startDate: null,
                    endDate: null,
                    picture: []
                },
                goodsRules: {
                    name: [
                        {required: true, message: "请输入商品名称", trigger: "blur"}
                    ],
                    type: [
                        {required: true, message: " 请选择商品类目", trigger: "blur"}
                    ],
                    startDate: [
                        {required: true, message: "请选择活动开始时间", trigger: "blur"}
                    ],
                    endDate: [
                        {required: true, message: "请选择活动结束时间", trigger: "blur"}
                    ],
                    picture: [
                        {required: true, message: "请上传展示图", trigger: 'blur'}
                    ]
                }
            }
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
                this.$api.getGoodsListPage({
                    key: this.searchObj.keyWord,
                    startDate: this.searchObj.startDate,
                    endDate: this.searchObj.endDate,
                    type: this.searchObj.typeObj.value,
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
            //批量启用
            handleBatchEnable() {

            },
            //批量禁用
            handleBatchDisable() {

            },
            //查看套餐
            handleSeeSetMeal() {

            },
            //更新状态
            handleUpdateStatus() {

            },
            //编辑
            handleEdit(id) {
                this.$api.getGoodsInfoById(id).then(res => {
                    if (!res.code) {
                        this.goods.id = res.data.id;
                        this.goods.name = res.data.name;
                        this.goods.type = res.data.type;
                        this.goods.startDate = res.data.startTime;
                        this.goods.endDate = res.data.endTime;
                        this.goods.picture = res.data.picture.split(",").reduce((one, two) => {
                            one.push({url: two});
                            return one
                        }, []);
                        this.addOrUpdateVisible = true;
                    } else {
                        this.$message.error(res.message)
                    }
                })
            },
            //取消
            handleCancel() {
                if (this.$refs['addOrUpdateForm']) this.$refs['addOrUpdateForm'].clearValidate();
                this.goods.id = null;
                this.goods.name = null;
                this.goods.type = null;
                this.goods.startDate = null;
                this.goods.endDate = null;
                this.goods.picture = [];
                this.addOrUpdateVisible = false;
            },
            //提交
            handleSubmit() {
                this.$refs['addOrUpdateForm'].validate((valid) => {
                    if (valid) {
                        if (this.goods.id) {
                            this.$api.updateGoods({
                                id: this.goods.id,
                                name: this.goods.name,
                                type: this.goods.type,
                                startTime: this.goods.startDate,
                                endTime: this.goods.endDate,
                                picture: this.goods.picture.reduce((one, two) => {
                                    one.push(two.url);
                                    return one;
                                }, []).join(',')
                            }).then(res => {
                                if (!res.code) {
                                    this.$message.success(res.message);
                                    this.handleCancel();
                                    this.getTableData();
                                } else {
                                    this.$message.error(res.message)
                                }
                            })
                        } else {
                            this.$api.addGoods({
                                name: this.goods.name,
                                type: this.goods.type,
                                startTime: this.goods.startDate,
                                endTime: this.goods.endDate,
                                picture: this.goods.picture.reduce((one, two) => {
                                    one.push(two.url);
                                    return one;
                                }, []).join(',')
                            }).then(res => {
                                if (!res.code) {
                                    this.$message.success(res.message);
                                    this.handleCancel();
                                    this.search();
                                } else {
                                    this.$message.error(res.message)
                                }
                            })
                        }
                    }
                })
            },
            //获取商品类目
            handleGetGoodsType() {
                this.$api.getGoodsTypeListAll().then(res => {
                    if (!res.code) {
                        this.searchObj.typeObj.list = res.data;
                    } else {
                        this.$message.error(res.message)
                    }
                })
            }
        },
        created() {
            this.$nextTick(function () {
                this.search();
            });
            this.handleGetGoodsType();
        }
    }
</script>

<style scoped lang="less" type="text/less">

</style>
