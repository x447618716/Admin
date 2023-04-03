<template>
    <el-container direction="vertical">
        <!-- 搜索栏 -->
        <div class="search-box">
            <label>{{$t("system.search")}}</label>
            <el-input v-model="searchObj.keyWord" placeholder="根据角色名称模糊搜索" class="search-input"></el-input>
            <el-button-custom type="primary" icon="el-icon-search" permission-mark="searchRole"
                       @click="search"></el-button-custom>
        </div>
        <!--主体内容-->
        <div class="main">
            <!--内容主体标题栏-->
            <el-row type="flex" justify="space-between" style="padding: 20px 0">
                <div>
                    <span class="page-title">角色管理</span>
                </div>
                <div>
                    <el-button-custom type="success" size="medium" permission-mark="editRoleStatus"
                               @click="handleBatchDisable">批量禁用
                    </el-button-custom>
                    <el-button-custom type="success" size="medium" permission-mark="editRoleStatus"
                               @click="handleBatchEnable">批量启用
                    </el-button-custom>
                    <el-button-custom type="success" size="medium" permission-mark="addRole" icon="el-icon-plus"
                               @click="addOrUpdateVisible = true">
                        {{$t('pages.common.newlyAdded')}}
                    </el-button-custom>
                </div>
            </el-row>
            <!-- 数据列表-->
            <el-table ref="table"
                      v-loading="loading" :data="tableData" header-cell-class-name="page-table"
                      @selection-change="handleSelectionChange" border row-key="id">
                <el-table-column align="center" type="selection"
                                 reserve-selection :selectable="handleSelectable"></el-table-column>
                <el-table-column align="center" prop="id" label="ID"></el-table-column>
                <el-table-column align="center" label="状态">
                    <template slot-scope="scope">
                        <p>{{scope.row.status == 1 ? '启用' : '禁用'}}</p>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="name" label="角色名称"></el-table-column>
                <el-table-column align="center" prop="roleName" label="角色英文名称"></el-table-column>
                <el-table-column align="center" prop="description" label="角色说明"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                <el-table-column align="center" prop="updateTime" label="更新时间"></el-table-column>
                <el-table-column align="center" fixed="right" width="150" label="操作">
                    <template slot-scope="scope">
                        <el-row type="flex" justify="space-around" style="flex-direction: column">
                            <el-link-custom type="primary" permission-mark="editRoleStatus" :creator-mark="scope.row.creatorId"
                                            @click="handleDisableAndEnable(scope.row.id,scope.row.status==1?2:1)">
                                {{scope.row.status == 1 ? '禁用' : '启用'}}
                            </el-link-custom>
                            <el-link-custom type="primary" permission-mark="editRole" :creator-mark="scope.row.creatorId"
                                            @click="handleEdit(scope.row.id)">编辑
                            </el-link-custom>
                            <el-link-custom type="primary" permission-mark="rolePermissions" :creator-mark="scope.row.creatorId"
                                            @click="getResourceAll(scope.row.id)">分配权限
                            </el-link-custom>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页器-->
            <el-pagination-custom ref="pagination" background
                                  @current-size-change="handleCurrentSizeChange"></el-pagination-custom>
        </div>
        <el-dialog :visible.sync="addOrUpdateVisible"
                   :title="(formData.id == '' ? '新增' : '修改') + '角色'"
                   :before-close="handleCancel" :close-on-click-modal="false">
            <el-form ref="addOrUpdateForm" :rules="rules" :model="formData"
                     label-width="120px">
                <el-form-item label="角色名称" prop="name">
                    <el-input placeholder="请输入" class="form-input__small"
                              v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="角色英文" prop="roleName">
                    <el-input placeholder="请输入" class="form-input__small"
                              v-model="formData.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色说明" prop="description">
                    <el-input placeholder="多行输入" type="textarea" rows="4" v-model="formData.description"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" style="text-align: center;">
                <el-button type="info" size="medium" @click="handleCancel">取消</el-button>
                <el-button type="primary" size="medium" @click="handleSubmit">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="assignPermissionsVisible" title="分配权限" :close-on-click-modal="false"
                   @close="()=>{authorityList =[],authorityObj =[]}">
            <el-tree-transfer ref="treeTransfer" :title="['所有权限','拥有权限']" :button_text="['到右边', '到左边']"
                              :from_data='authorityList'
                              :to_data='authorityObj'
                              pid="parentId" :defaultProps="{label: 'name', children: 'children'}" arrayToTree defaultTransfer openAll
                              filter @removeBtn="handleCheckData" @addBtn="handleCheckData"
            ></el-tree-transfer>
            <div slot="footer" style="text-align: center;">
                <el-button type="primary" size="medium" @click="handleSave">保存</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
    import {mapState} from 'vuex'
    import uniqWith from 'lodash/uniqWith'
    import cloneDeep from 'lodash/cloneDeep'

    export default {
        data() {
            return {
                searchObj: {
                    keyWord: ''
                },
                roleId: null,
                loading: false,
                tableData: [],
                selectData: [],
                formData: {
                    id: null,
                    name: null,
                    roleName: null,
                    description: null
                },
                rules: {
                    name: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'}
                    ],
                    roleName: [
                        {required: true, message: '请输入角色英文名称', trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: '请输入角色说明', trigger: 'blur'}
                    ]
                },
                authorityList: [],
                authorityObj: [],
                authorityObjMy: [],
                addOrUpdateVisible: false,
                assignPermissionsVisible: false,
                viewPermissionsVisible: false,
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
                this.$api.getRoleAllPage({
                    pageNo: this.$refs['pagination'].localPageNo,
                    pageSize: this.$refs['pagination'].localPageSize,
                    name: this.searchObj.keyWord
                }).then(res => {
                    if (!res.code) {
                        this.tableData = res.data.list;
                        this.$refs['pagination'].localTotal = res.data.total;
                    } else {
                        this.$message.error(res.message);
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
            //取消
            handleCancel() {
                if (this.$refs['addOrUpdateForm']) this.$refs['addOrUpdateForm'].clearValidate();
                this.formData = {
                    id: null,
                    name: null,
                    roleName: null,
                    description: null
                };
                this.addOrUpdateVisible = false;
            },
            //编辑
            handleEdit(id) {
                this.$api.getRoleInfoById(id).then(res => {
                    if (!res.code) {
                        this.formData.id = res.data.id;
                        this.formData.name = res.data.name;
                        this.formData.roleName = res.data.roleName;
                        this.formData.description = res.data.description;
                        this.addOrUpdateVisible = true;
                    } else {
                        this.$message.error(res.message);
                    }
                });
            },
            //提交
            handleSubmit() {
                this.$refs['addOrUpdateForm'].validate((valid) => {
                    if (valid) {
                        if (this.formData.id) {
                            this.$api.updateRole({
                                id: this.formData.id,
                                name: this.formData.name,
                                roleName: this.formData.roleName,
                                description: this.formData.description
                            }).then(res => {
                                if (!res.code) {
                                    this.$message.success("角色更新成功");
                                    this.getTableData();
                                    this.handleCancel();
                                } else {
                                    this.$message.error(res.message);
                                }
                            })
                        } else {
                            this.$api.addRole({
                                name: this.formData.name,
                                roleName: this.formData.roleName,
                                description: this.formData.description
                            }).then(res => {
                                if (!res.code) {
                                    this.$message.success("角色新增成功");
                                    this.search();
                                    this.handleCancel();
                                } else {
                                    this.$message.error(res.message);
                                }
                            })

                        }
                    }
                })
            },
            //批量禁用
            handleBatchDisable() {
                if (!this.selectData.length) {
                    this.$message.error('请选择需要禁用的角色');
                    return false;
                }
                let ids = this.selectData.map(obj => obj.id).join(',');
                this.handleDisableAndEnable(ids, 2)

            },
            //批量启用
            handleBatchEnable() {
                if (!this.selectData.length) {
                    this.$message.error('请选择需要启用的角色');
                    return false;
                }
                let ids = this.selectData.map(obj => obj.id).join(',');
                this.handleDisableAndEnable(ids, 1)
            },
            //禁用与启用func
            handleDisableAndEnable(ids, status) {
                this.$confirm('是否确定' + (status == 1 ? '启用' : "禁用") + '角色？', '提示', {
                    type: 'info'
                }).then(() => {
                    this.$api.updateRoleStatusByIds(ids, status).then(res => {
                        if (!res.code) {
                            this.$message.success((status == 1 ? '启用' : "禁用") + '成功');
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
                    })
                }).catch(() => {
                });
            },
            //菜单树显示
            getResourceAll(id) {
                this.roleId = id;
                //获取所有权限     //根据角色id获取角色资源
                this.$http.all([this.$api.getResourceAll({
                    name: "",
                    type: ""
                }), this.$api.getRoleResourceById(id)]).then(this.$http.spread((res, res2) => {
                    if (!res.code) {
                        res.data.forEach(item => {
                            if (item.parentId == "0") {
                                item.parentId = "1"
                            }
                        });
                        res.data.unshift({id: "1", name: "系统", parentId: "0"});
                        this.authorityList = res.data;
                    } else {
                        this.$message.error(res.message)
                    }
                    if (!res2.code) {
                        if (res2.data.length) {
                            res2.data.forEach(item => {
                                if (item.parentId == "0") {
                                    item.parentId = "1"
                                }
                            });
                            res2.data.unshift({id: "1", name: "系统", parentId: "0"});
                            this.authorityObj = res2.data || {};
                            this.$nextTick(function () {
                                this.authorityObjMy = cloneDeep(this.authorityObj);
                            });
                        }
                    } else {
                        this.$message.error(res2.message)
                    }

                    this.assignPermissionsVisible = true;
                }))
            },
            //得到权限ids
            getPermissionIds(PermissionList) {
                let permissionIds = [];
                if (PermissionList.length) {
                    PermissionList[0].children.forEach(item => {
                        if (item.children && item.children.length) {
                            item.children.forEach(obj => {
                                if (obj.children && obj.children.length) {
                                    obj.children.forEach(data => {
                                        permissionIds.push(data.id);
                                    })
                                }
                                permissionIds.push(obj.id);
                            })
                        }
                        permissionIds.push(item.id);
                    })
                }
                return permissionIds;
            },
            //检测右侧数据变化
            handleCheckData(fromData, toData) {
                this.authorityObj = toData
            },
            //保存权限选择
            handleSave() {
                //过去权限id数组
                let beforeList = this.getPermissionIds(this.authorityObjMy);
                //当前选中权限id数组
                let currentList = this.getPermissionIds(this.authorityObj);
                let addResourceId = [];
                let delResourceId = [];
                //权限组是否有变动
                if (currentList.length) {
                    if (beforeList.length) {
                        uniqWith(currentList.concat(beforeList)).forEach(item => {
                            if (currentList.includes(item) && !beforeList.includes(item)) {
                                addResourceId.push(item)
                            }
                            if (!currentList.includes(item) && beforeList.includes(item)) {
                                delResourceId.push(item)
                            }
                        })
                    } else {
                        addResourceId = currentList;
                    }
                    if (addResourceId.length || delResourceId.length) {
                        this.$api.assignPermissions(this.roleId, addResourceId.join(","), delResourceId.join(",")).then(res => {
                            if (!res.code) {
                                this.$message.success("权限分配成功");
                                this.authorityList = [];
                                this.authorityObj = [];
                                this.assignPermissionsVisible = false;
                            } else {
                                this.$message.error(res.message)
                            }
                        })
                    } else {
                        this.assignPermissionsVisible = false;
                    }
                } else {
                    this.assignPermissionsVisible = false;
                }
            }
        },
        created() {
            this.$nextTick(function () {
                this.search();
            });
        }
    }
</script>


<style scoped>

</style>
