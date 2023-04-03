<template>
    <el-container direction="vertical">
        <!-- 搜索栏 -->
        <div class="search-box">
            <label>{{$t("system.search")}}</label>
            <el-input v-model="searchObj.keyWord" placeholder="请输入要查找的菜单名称" class="search-input"></el-input>
            <el-button-custom type="primary" icon="el-icon-search" permission-mark="searchMenu"
                       @click="search"></el-button-custom>
        </div>
        <!--主体内容-->
        <div class="main">
            <!--内容主体标题栏-->
            <el-row type="flex" justify="space-between" style="padding: 20px 0">
                <div>
                    <span class="page-title">菜单管理</span>
                </div>
                <div>
                    <el-button-custom type="success" size="medium" permission-mark="menuUpdateStatus"
                               @click="handleBatchEnable">批量启用
                    </el-button-custom>
                    <el-button-custom type="success" size="medium" permission-mark="menuUpdateStatus"
                               @click="handleBatchDisable">批量禁用
                    </el-button-custom>
                    <el-button-custom type="success" size="medium" permission-mark="menuAdd" icon="el-icon-plus"
                               @click="addOrUpdateVisible = true">
                        {{$t('pages.common.newlyAdded')}}
                    </el-button-custom>
                </div>
            </el-row>
            <!--内容主体状态切换栏-->
            <el-row type="flex" style="padding: 10px 0">
                <el-button :disabled="!$route.meta.searchMenu" :type="searchObj.typeObj.value == '' ?'success':''"
                           @click="searchObj.typeObj.value = '',search()">
                    全部
                </el-button>
                <el-button :disabled="!$route.meta.searchMenu" :type="searchObj.typeObj.value == item.id ?'success':''"
                           v-for="item in searchObj.typeObj.list" :key="item.id"
                           @click="searchObj.typeObj.value = item.id,search()">
                    {{item.name}}
                </el-button>
            </el-row>
            <el-container>
                <el-aside width="250px">
                    <el-tree :data="tableDataList" node-key="id" accordion :expand-on-click-node="false"
                             @node-click="handleTree"></el-tree>
                </el-aside>
                <el-main style="padding: 0px">
                    <!-- 数据列表-->
                    <el-table ref="table" row-key="id" v-loading="loading" :data="tableData"
                              @selection-change="handleSelectionChange" header-cell-class-name="page-table"
                              border>
                        <el-table-column align="center" type="selection" reserve-selection
                                         :selectable="handleSelectable"></el-table-column>
                        <el-table-column align="center" prop="id" label="ID"></el-table-column>
                        <el-table-column align="center" prop="name" label="菜单名称"></el-table-column>
                        <el-table-column align="center" prop="type" label="类型">
                            <template slot-scope="scope">
                                <span>{{scope.row.type ==1?'菜单':'功能'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="级别">
                            <template slot-scope="scope">
                                <span>{{scope.row.type == 2?'':scope.row.level ==1?'一级菜单':'二级菜单'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="status" label="状态">
                            <template slot-scope="scope">
                                <span>{{scope.row.status == 1?'启用':'禁用'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="permission" label="权限标识"></el-table-column>
                        <el-table-column align="center" prop="url" label="URL"></el-table-column>
                        <el-table-column align="center" prop="parentName" label="父菜单"></el-table-column>
                        <el-table-column align="center" prop="priority" label="排序"></el-table-column>
                        <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                        <el-table-column align="center" prop="updateTime" label="最近更新时间"></el-table-column>
                        <el-table-column align="center" fixed="right" width="120px" label="操作">
                            <template slot-scope="scope">
                                <el-row type="flex" justify="space-around">
                                    <el-link-custom type="primary" permission-mark="menuEdit" :creator-mark="scope.row.creatorId"
                                                    @click="getMenuById(scope.row.id)">编辑
                                    </el-link-custom>
                                    <el-link-custom type="primary" permission-mark="menuUpdateStatus" :creator-mark="scope.row.creatorId"
                                                    @click="disableAndEnabled(scope.row.id,scope.row.status == 1?0:1)">
                                        {{scope.row.status == 1?'禁用':'启用'}}
                                    </el-link-custom>
                                </el-row>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页器-->
                    <el-pagination-custom ref="pagination" background
                                          @current-size-change="handleCurrentSizeChange"></el-pagination-custom>
                </el-main>
            </el-container>
        </div>
        <el-dialog :title="form.id?'编辑菜单':'新增菜单'" :visible.sync="addOrUpdateVisible" :before-close="handleCancel"
                   :close-on-click-modal="false">
            <el-form ref="addOrUpdateForm" :rules="rules" :model="form" label-width="120px">
                <el-form-item label="菜单名称" prop="menuName">
                    <el-input v-model="form.menuName" class="form-input__small" placeholder="请输入菜单名称"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-radio-group v-model="form.type" :disabled="form.id?true:false" @change="handleChangeType">
                        <el-radio :label="1">菜单</el-radio>
                        <el-radio :label="2">功能</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="菜单级别" prop="level" v-if="form.type == 1">
                    <el-select v-model="form.level" class="form-select__small" :disabled="form.id?true:false">
                        <el-option label="一级菜单" :value="1"></el-option>
                        <el-option label="二级菜单" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="菜单URL" prop="url" v-if="form.type == 1">
                    <el-input v-model="form.url" class="form-input__medium"
                              placeholder="请输入菜单URL，若有下属菜单，则不填"></el-input>
                </el-form-item>
                <el-form-item v-if="form.level == 1 && form.type == 1" label="图标" prop="icon">
                    <icon-picker v-model="form.icon"></icon-picker>
                </el-form-item>
                <el-form-item label="权限代码" prop="permission">
                    <el-input v-model="form.permission" class="form-input__small" placeholder="如：userManage"></el-input>
                </el-form-item>
                <el-form-item label="归属菜单级别" prop="level" v-if="form.type == 2">
                    <el-select v-model="form.level" class="form-select__small" @change="getResourceByLevel"
                               :disabled="form.id?true:false">
                        <el-option label="一级菜单" :value="1"></el-option>
                        <el-option label="二级菜单" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="form.level == 2 || form.type == 2" label="父菜单" prop="parentId">
                    <el-select v-model="form.parentId" class="form-select__small">
                        <el-option v-for="menu in parentMenu" :label="menu.name" :key="menu.id"
                                   :value="menu.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排列顺序" prop="orderId">
                    <el-input v-model="form.orderId" class="form-input__small" placeholder="请输入排列顺序（例如:1）"></el-input>
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

    import {mapState} from "vuex"

    export default {
        name: "menuManage",
        data() {
            let checkUrl = (rule, value, callback) => {
                if (this.form.level == 2 && (this.form.url == '' || this.form.url == null || this.form.url == undefined)) {
                    callback(new Error('请输入URL'));
                } else {
                    callback()
                }
            };
            return {
                searchObj: {
                    typeObj: {value: '', list: [{id: 1, name: "菜单"}, {id: 2, name: "功能"}]},
                    keyWord: ''
                },
                loading: false,
                addOrUpdateVisible: false,
                form: {
                    id: null,
                    menuName: null,
                    level: 1,
                    type: 1,
                    url: null,
                    icon: null,
                    parentId: null,
                    orderId: null,
                    permission: null
                },
                rules: {
                    menuName: [
                        {required: true, message: '请输入菜单名称', trigger: 'blur'}
                    ],
                    url: [
                        {validator: checkUrl, message: '请输入URL', trigger: 'blur'}
                    ],
                    icon: [
                        {required: true, message: '请选择图标', trigger: 'blur'}
                    ],
                    parentId: [
                        {required: true, message: '请选择父菜单', trigger: 'blur'}
                    ],
                    permission: [
                        {required: true, message: '请输入权限代码', trigger: 'blur'}
                    ],
                    orderId: [
                        {required: true, message: '请输入排序', trigger: 'blur'}
                    ]
                },
                tableData: [],
                selectData: [],
                tableDataList: [], //树形组件数据源
                parentMenu: [], //父菜单列表
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
            //获取数据列表
            getTableData() {
                this.loading = true;
                this.$api.getResourceAllPage({
                    name: this.searchObj.keyWord,
                    type: this.searchObj.typeObj.value,
                    pageNo: this.$refs['pagination'].localPageNo,
                    pageSize: this.$refs['pagination'].localPageSize
                }).then(res => {
                    if (!res.code) {
                        this.tableData = res.data.list;
                        this.$refs['pagination'].localTotal = res.data.total;
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
                    this.$message.error('请选择需要启用的资源');
                    return false;
                }
                let ids = this.selectData.map(obj => obj.id).join(',');
                this.disableAndEnabled(ids, 1)
            },
            //批量禁用
            handleBatchDisable() {
                if (!this.selectData.length) {
                    this.$message.error('请选择需要禁用的资源');
                    return false;
                }
                let ids = this.selectData.map(obj => obj.id).join(',');
                this.disableAndEnabled(ids, 0)
            },
            //禁用启用Func
            disableAndEnabled(ids, type) {
                this.$confirm('是否' + (type == 0 ? '禁用' : '启用') + '资源？', "提示", {
                    type: "info",
                    center: true
                }).then(() => {
                    this.$api.updateResourceStatusByIds(ids, type).then(res => {
                        if (!res.code) {
                            this.$message.success((type == 0 ? '禁用' : "启用") + '资源成功');
                            this.selectData = [];
                            this.$refs.table.clearSelection();
                            this.getTableData();
                        } else {
                            if (res.data.length) {
                                res.data.forEach(item => {
                                    setTimeout(() => {
                                        this.$message.error(item)
                                    }, 1000)
                                })
                            } else {
                                this.$message.error(res.message);
                            }
                        }
                    });
                }).catch(() => {
                })
            },
            //根据菜单id获取菜单信息
            getMenuById(id) {
                this.$api.getResourceInfoById(id).then(res => {
                    if (!res.code) {
                        this.form.id = id;
                        this.form.menuName = res.data.name;
                        this.form.type = res.data.type;
                        this.form.level = res.data.level;
                        this.form.url = res.data.url;
                        this.form.icon = res.data.icon;
                        this.form.permission = res.data.permission;
                        this.form.parentId = res.data.parentId == '0' ? '' : res.data.parentId;
                        this.form.orderId = res.data.priority;
                        if (this.form.type == 2) {
                            this.getResourceByLevel(res.data.level);
                        }
                        this.addOrUpdateVisible = true;
                    } else {
                        this.$message.error(res.message);
                    }
                })
            },
            //改变新增资源类型
            handleChangeType(value) {
                if (value == 1) {
                    //新增菜单 拉取一级菜单数据
                    this.getResourceByLevel(1)
                } else {
                    //新增功能 根据已选菜单级别拉取菜单数据
                    this.getResourceByLevel(this.form.level)
                }
            },
            //获取级别菜单列表
            getResourceByLevel(level) {
                this.$api.getResourceByLevel(level).then(res => {
                    if (!res.code) {
                        this.parentMenu = res.data;
                        if (this.parentMenu.length && !this.form.id) {
                            this.form.parentId = this.parentMenu[0].id;
                        }
                    }
                })
            },
            //获取菜单树数据
            getMenuAll() {
                this.$api.getResourceAll({
                    name: this.searchObj.keyWord,
                    type: ""
                }).then(res => {
                    if (!res.code) {
                        this.tableDataList = this.$utils.treeRouter(res.data, "0", true);
                    }
                })
            },
            //节点树点击事件
            handleTree(data) {
                if (this.$route.meta.menuEdit) {
                    if (this.userInfo.id == data.creatorId) {
                        this.getMenuById(data.id);
                    }
                }
            },
            //取消
            handleCancel() {
                if (this.$refs['addOrUpdateForm']) this.$refs['addOrUpdateForm'].clearValidate();
                this.form = {
                    id: null,
                    menuName: null,
                    level: 1,
                    type: 1,
                    url: null,
                    icon: null,
                    parentId: null,
                    orderId: null,
                    permission: null
                };
                this.getResourceByLevel(1);
                this.addOrUpdateVisible = false;
            },
            //提交
            handleSubmit() {
                this.$refs['addOrUpdateForm'].validate((valid) => {
                    if (valid) {
                        if (this.form.level == 1 && this.form.type == 1) {
                            this.form.parentId = '0';
                        }
                        if (this.form.id) {
                            this.$api.updateResource({
                                id: this.form.id,
                                name: this.form.menuName,
                                type: this.form.type,
                                icon: this.form.icon,
                                parentId: this.form.parentId,
                                level: this.form.level,
                                url: this.form.url,
                                priority: this.form.orderId,
                                permission: this.form.permission
                            }).then(res => {
                                if (!res.code) {
                                    this.$message.success('修改成功');
                                    this.handleCancel();
                                    this.getTableData();
                                    //更新展示树形数据
                                    this.getMenuAll();
                                } else {
                                    this.$message.error(res.message);
                                }
                            })
                        } else {
                            this.$api.addResource({
                                name: this.form.menuName,
                                type: this.form.type,
                                icon: this.form.icon,
                                parentId: this.form.parentId,
                                level: this.form.level,
                                url: this.form.url,
                                priority: this.form.orderId,
                                permission: this.form.permission
                            }).then(res => {
                                if (!res.code) {
                                    this.$message.success('新增成功');
                                    this.handleCancel();
                                    this.search();
                                    //更新展示树形数据
                                    this.getMenuAll();
                                } else {
                                    this.$message.error(res.message);
                                }
                            })
                        }

                    }
                })
            }
        },
        created() {
            this.$nextTick(function () {
                this.search();
            });
            //获取菜单树数据
            this.getMenuAll();
            //获取一级菜单
            this.getResourceByLevel(1);
        }
    }
</script>

<style scoped>

</style>
