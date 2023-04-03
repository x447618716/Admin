<template>
    <el-container direction="vertical">
        <!-- 搜索栏 -->
        <div class="search-box">
            <label>{{$t("system.search")}}</label>
            <search-area class="search-area" @setSearchObjData="setSearchObjData"></search-area>
            <el-select v-model="searchObj.roleObj.value" class="search-select">
                <el-option :label="$t('pages.common.AllRoles')" value=""></el-option>
                <el-option v-for="obj in searchObj.roleObj.list" :key="obj.id" :label="obj.name"
                           :value="obj.id"></el-option>
            </el-select>
            <el-select v-model="searchObj.userSexObj.value" class="search-select">
                <el-option :label="$t('pages.common.AllGenders')" value=""></el-option>
                <el-option v-for="obj in sexList" :key="obj.id" :label="obj.name"
                           :value="obj.id"></el-option>
            </el-select>
            <el-select v-model="searchObj.statusObj.value" class="search-select">
                <el-option :label="$t('pages.common.allStatus')" value=""></el-option>
                <el-option v-for="obj in statusList" :key="obj.id" :label="obj.name"
                           :value="obj.id"></el-option>
            </el-select>
            <el-input v-model="searchObj.keyWord" :placeholder="$t('pages.BackstageUserManage.keyWord')"
                      class="search-input"></el-input>
            <el-button-custom type="primary" icon="el-icon-search" permission-mark="searchUser"
                       @click="search"></el-button-custom>
        </div>
        <!--主体内容-->
        <div class="main">
            <!--内容主体标题栏-->
            <el-row type="flex" justify="space-between" style="padding: 20px 0">
                <div>
                    <span class="page-title">{{$t('pages.BackstageUserManage.title')}}</span>
                </div>
                <div>
                    <el-button-custom type="success" size="medium" permission-mark="resetPwd"
                               @click="handleBatchResetPwd">{{$t('pages.BackstageUserManage.batchReset')}}
                    </el-button-custom>
                    <el-button-custom type="success" size="medium" permission-mark="editUserStatus"
                               @click="handleBatchDisable">{{$t('pages.common.batchDisable')}}
                    </el-button-custom>
                    <el-button-custom type="success" size="medium" permission-mark="editUserStatus"
                               @click="handleBatchEnabled">{{$t('pages.common.batchEnabled')}}
                    </el-button-custom>
                    <el-button-custom type="success" size="medium" permission-mark="delUser" @click="handleBatchDel">
                        {{$t('pages.common.batchDel')}}
                    </el-button-custom>
                    <el-button-custom type="success" size="medium" permission-mark="addUser" icon="el-icon-plus"
                               @click="addOrUpdateVisible = true">
                        {{$t('pages.common.newlyAdded')}}
                    </el-button-custom>
                </div>
            </el-row>
            <!--内容主体状态切换栏-->
            <el-row type="flex" style="padding: 10px 0">
                <el-button-custom :disabled="!$route.meta.searchUser"
                           :type="searchObj.statusObj.value == item.id ?'success':''"
                           v-for="item in  searchObj.statusObj.list" :key="item.id"
                           @click="searchObj.statusObj.value = item.id,search()">
                    {{item.name}}
                </el-button-custom>
            </el-row>
            <!-- 后台用户列表-->
            <el-table ref="table" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange"
                      header-cell-class-name="page-table" border row-key="id">
                <el-table-column align="center" type="selection" reserve-selection
                                 :selectable="handleSelectable"></el-table-column>
                <el-table-column align="center" prop="id" label="ID"></el-table-column>
                <el-table-column align="center" prop="account" label="登录名"></el-table-column>
                <el-table-column align="center" prop="nickname" label="昵称"></el-table-column>
                <el-table-column align="center" prop="name" label="真实姓名"></el-table-column>
                <el-table-column align="center" prop="phone" label="电话"></el-table-column>
                <el-table-column align="center" prop="idCard" label="身份证号"></el-table-column>
                <el-table-column align="center" label="状态">
                    <template slot-scope="scope">
                        <span :style="{color:scope.row.status==2?'red':''}">{{scope.row.status==2?"禁用": scope.row.status==0?"已删除":"正常"}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="归属角色">
                    <template slot-scope="scope">
                        <span v-if="searchObj.roleObj.list.find(item=>item.id==scope.row.roleId)">{{searchObj.roleObj.list.find(item=>item.id==scope.row.roleId).name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="sex" label="性别">
                    <template slot-scope="scope">
                        <span>{{scope.row.sex==1?'女':'男'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="areaName" label="省市区"></el-table-column>
                <el-table-column align="center" prop="areaDesc" label="地区详细"></el-table-column>
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
                <el-table-column align="center" fixed="right" width="150" :label="$t('pages.common.operation')">
                    <template slot-scope="scope">
                        <el-row type="flex" justify="space-around" style="flex-direction: column">
                            <el-link-custom type="primary" permission-mark="resetPwd" :creator-mark="scope.row.creatorId"
                                            @click="handleResetPwd(scope.row.id)">
                                {{$t('pages.BackstageUserManage.reset')}}
                            </el-link-custom>
                            <el-link-custom type="primary" permission-mark="editUserStatus" :creator-mark="scope.row.creatorId"
                                            @click="disableAndEnabled(scope.row.id,scope.row.status==1?2:1)">
                                {{scope.row.status==1?$t('pages.common.disable'):$t('pages.common.enabled')}}
                            </el-link-custom>
                            <el-link-custom type="primary" permission-mark="editUser" :creator-mark="scope.row.creatorId"
                                            @click="getUserInfoById(scope.row.id)">{{$t('pages.common.edit')}}
                            </el-link-custom>
                            <el-link-custom type="primary" permission-mark="delUser" :creator-mark="scope.row.creatorId"
                                            @click="disableAndEnabled(scope.row.id,0)">{{$t('pages.common.del')}}
                            </el-link-custom>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页器-->
            <el-pagination-custom ref="pagination" background
                                  @current-size-change="handleCurrentSizeChange"></el-pagination-custom>
        </div>
        <el-dialog
                :title="(formData.id ? $t('pages.common.edit') : $t('pages.common.newlyAdded')) + $t('pages.BackstageUserManage.user')"
                :visible.sync="addOrUpdateVisible"
                :before-close="handleCancel" :close-on-click-modal="false">
            <el-form ref="addOrUpdateForm" :rules="rules" :model="formData" label-width="120px">
                <el-form-item :label="$t('pages.BackstageUserManage.fullNameText')" prop="name">
                    <el-input :placeholder="$t('pages.BackstageUserManage.fullNameTips')" class="form-input__small"
                              v-model="formData.name"></el-input>
                    <el-radio-group v-model="formData.sex" style="margin-left: 10px">
                        <el-radio v-for="obj in sexList" :key="obj.id" :label="obj.id">{{obj.name}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('pages.BackstageUserManage.nicknameText')" prop="nickname">
                    <el-input :placeholder="$t('pages.BackstageUserManage.nicknameTips')" class="form-input__small"
                              v-model="formData.nickname"></el-input>
                </el-form-item>
                <el-form-item :label="$t('pages.BackstageUserManage.phoneText')" prop="phone">
                    <el-input :placeholder="$t('pages.BackstageUserManage.phoneTips')" v-model="formData.phone"
                              class="form-input__small"></el-input>
                </el-form-item>
                <el-form-item :label="$t('pages.BackstageUserManage.idCardText')" prop="idCard">
                    <el-input :placeholder="$t('pages.BackstageUserManage.idCardTips')" v-model="formData.idCard"
                              class="form-input__small"></el-input>
                </el-form-item>
                <el-form-item :label="$t('pages.BackstageUserManage.accountText')" prop="account">
                    <el-input :placeholder="$t('pages.BackstageUserManage.accountTips')" v-model="formData.account"
                              class="form-input__small"
                              :disabled="formData.id ? true : false"></el-input>
                </el-form-item>
                <el-form-item :label="$t('pages.BackstageUserManage.passwordText')" prop="password">
                    <el-input :placeholder="$t('pages.BackstageUserManage.passwordTips')" type="password"
                              v-model="formData.password"
                              class="form-input__small"></el-input>
                </el-form-item>
                <el-form-item :label="$t('pages.BackstageUserManage.roleText')" prop="roleId">
                    <el-select v-model="formData.roleId" class="search-select">
                        <el-option v-for="obj in searchObj.roleObj.list" :key="obj.id" :label="obj.name"
                                   :value="obj.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('pages.BackstageUserManage.areaText')" prop="areaId">
                    <search-area class="search-area" :area-id="formData.areaId"
                                 @setSearchObjData="setSearchObjData2"></search-area>
                </el-form-item>
                <el-form-item :label="$t('pages.BackstageUserManage.areaDescText')" prop="areaDesc">
                    <el-input type="textarea" :placeholder="$t('pages.BackstageUserManage.areaDescTips')" :rows="4"
                              v-model="formData.areaDesc"
                              class="form-input__medium"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" style="text-align: center;">
                <el-button type="info" size="medium" @click="handleCancel">{{$t('pages.common.cancel')}}</el-button>
                <el-button type="primary" size="medium" @click="handleSubmit">{{$t('pages.common.submit')}}</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>

    import {mapState} from 'vuex'

    export default {
        name: "UserManage",
        data() {
            return {
                searchObj: {
                    areaId: '',
                    roleObj: {value: "", list: []},
                    statusObj: {value: '', list: []},
                    userSexObj: {value: '', list: []},
                    keyWord: '',
                },
                loading: false,
                tableData: [],
                selectData: [],
                formData: {
                    id: null,
                    name: null,
                    nickname: null,
                    areaId: '',
                    sex: 1,
                    account: null,
                    password: null,
                    phone: null,
                    idCard: null,
                    roleId: null,
                    areaDesc: null
                },
                addOrUpdateVisible: false
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.userInfo
            }),
            statusList() {
                return [
                    {id: 1, name: this.$t('pages.common.enabled')},
                    {id: 2, name: this.$t('pages.common.disable')}
                ]
            },
            sexList() {
                return [
                    {name: this.$t('pages.common.woman'), id: 1},
                    {name: this.$t('pages.common.man'), id: 2}
                ]
            },
            rules() {
                return {
                    name: [
                        {required: true, message: this.$t('pages.BackstageUserManage.fullNameTips'), trigger: 'blur'}
                    ],
                    nickname: [
                        {required: true, message: this.$t('pages.BackstageUserManage.nicknameTips'), trigger: 'blur'},
                    ],
                    areaId: [
                        {required: true, message: this.$t('pages.BackstageUserManage.areaTips'), trigger: 'blur'}
                    ],
                    roleId: [
                        {required: true, message: this.$t('pages.BackstageUserManage.roleTips'), trigger: 'blur'}
                    ],
                    areaDesc: [
                        {required: true, message: this.$t('pages.BackstageUserManage.areaDescTips'), trigger: 'blur'},
                    ],
                    phone: [
                        {required: true, message: this.$t('pages.BackstageUserManage.phoneTips'), trigger: 'blur'},
                        {validator: this.$validate.validatePhone, trigger: 'blur'}
                    ],
                    idCard: [
                        {required: true, message: this.$t('pages.BackstageUserManage.idCardTips'), trigger: 'blur'},
                        {validator: this.$validate.validateCard, trigger: 'blur'}
                    ],
                    account: [
                        {required: true, message: this.$t('pages.BackstageUserManage.accountTips'), trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: this.$t('pages.BackstageUserManage.passwordTips'), trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            //搜索栏地区选择
            setSearchObjData(val) {
                if (val.areaObj.value) {
                    this.searchObj.areaId = val.areaObj.value;
                } else if (val.cityObj.value) {
                    this.searchObj.areaId = val.cityObj.value;
                } else if (val.provinceObj.value) {
                    this.searchObj.areaId = val.provinceObj.value;
                } else {
                    this.searchObj.areaId = '';
                }
            },
            //新增与编辑弹层地区选择
            setSearchObjData2(val) {
                if (val.areaObj.value) {
                    this.formData.areaId = val.areaObj.value;
                } else if (val.cityObj.value) {
                    this.formData.areaId = val.cityObj.value;
                } else if (val.provinceObj.value) {
                    this.formData.areaId = val.provinceObj.value;
                } else {
                    this.formData.areaId = '';
                }
            },
            //搜索
            search() {
                this.$refs['pagination'].localPageNo = 1;
                this.$refs['pagination'].localPageSize = 10;
                this.getTableData();
            },
            //获取数据列表
            getTableData() {
                this.loading = true;
                this.$api.getUserListPage({
                    pageNo: this.$refs['pagination'].localPageNo,
                    pageSize: this.$refs['pagination'].localPageSize,
                    areaId: this.searchObj.areaId,
                    status: this.searchObj.statusObj.value,
                    roleId: this.searchObj.roleObj.value,
                    sex: this.searchObj.userSexObj.value,
                    key: this.searchObj.keyWord
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
            //获取角色列表
            getRoleListAll() {
                this.$api.getRoleListAll().then(res => {
                    if (!res.code) {
                        this.searchObj.roleObj.list = res.data;
                    } else {
                        this.$message.error(res.message)
                    }
                })
            },
            //根据用户id获取用户信息
            getUserInfoById(id) {
                this.$api.getUserInfoById(id).then(res => {
                    if (!res.code) {
                        this.formData.id = res.data.id;
                        this.formData.name = res.data.name;
                        this.formData.nickname = res.data.nickname;
                        this.formData.areaId = res.data.areaId;
                        this.formData.sex = res.data.sex;
                        this.formData.account = res.data.account;
                        this.formData.password = '';
                        this.formData.phone = res.data.phone;
                        this.formData.idCard = res.data.idCard;
                        this.formData.roleId = res.data.roleId;
                        this.formData.areaDesc = res.data.areaDesc;
                        this.addOrUpdateVisible = true;
                    } else {
                        this.$message.error(res.message);
                    }
                })
            },
            //取消
            handleCancel() {
                if (this.$refs['addOrUpdateForm']) {
                    this.$refs['addOrUpdateForm'].clearValidate();
                }

                this.formData.id = null;
                this.formData.name = null;
                this.formData.nickname = null;
                this.formData.areaId = '';
                this.formData.sex = 1;
                this.formData.account = null;
                this.formData.password = null;
                this.formData.phone = null;
                this.formData.idCard = null;
                this.formData.roleId = null;
                this.formData.areaDesc = null;

                this.addOrUpdateVisible = false;

            },
            //批量重置密码
            handleBatchResetPwd() {
                if (!this.selectData.length) {
                    this.$message.error('请选择需要重置密码的用户');
                    return false;
                }
                let ids = this.selectData.map(obj => obj.id).join(',');
                this.$api.resetPwd(ids).then(res => {
                    if (!res.code) {
                        this.$message.success("批量重置密码成功");
                        this.selection = [];
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
            },
            //重置密码
            handleResetPwd(id) {
                this.$confirm('是否重置用户密码？', '提示', {
                    type: 'info',
                    center: true
                }).then(() => {
                    this.$api.resetPwd(id).then(res => {
                        if (!res.code) {
                            this.$message.success("重置密码成功");
                            this.selection = [];
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
            //禁用与启用-删除Fun
            disableAndEnabled(ids, type) {
                this.$confirm('是否' + (type == 2 ? '禁用' : type == 1 ? '启用' : '删除') + '用户账号？', "提示", {
                    type: "info",
                    center: true
                }).then(() => {
                    this.$api.delAndDisableAndEnableByIds(ids, type).then(res => {
                        if (!res.code) {
                            if (type == 2) {
                                this.$message.success("禁用账号成功");
                                this.selection = [];
                                this.$refs.table.clearSelection();
                            } else if (type == 1) {
                                this.$message.success("启用账号成功");
                                this.selection = [];
                                this.$refs.table.clearSelection();
                            } else {
                                this.$message.success("删除账号成功");
                                this.selection = [];
                                this.$refs.table.clearSelection();
                            }
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
                })
            },
            //批量禁用
            handleBatchDisable() {
                if (!this.selectData.length) {
                    this.$message.error('请选择需要禁用的用户');
                    return false;
                }
                let ids = this.selectData.map(obj => obj.id).join(',');
                this.disableAndEnabled(ids, 2)
            },
            //批量启用
            handleBatchEnabled() {
                if (!this.selectData.length) {
                    this.$message.error('请选择需要启用的用户');
                    return false;
                }
                let ids = this.selectData.map(obj => obj.id).join(',');
                this.disableAndEnabled(ids, 1)
            },
            //批量删除
            handleBatchDel() {
                if (!this.selectData.length) {
                    this.$message.error('请选择需要删除的用户');
                    return false;
                }
                let ids = this.selectData.map(obj => obj.id).join(',');
                this.disableAndEnabled(ids, 0)
            },
            //提交
            handleSubmit() {
                this.$refs['addOrUpdateForm'].validate((valid) => {
                    if (valid) {
                        if (this.formData.id) {
                            this.$api.updateUser({
                                id: this.formData.id,
                                name: this.formData.name,
                                nickname: this.formData.nickname,
                                areaId: this.formData.areaId,
                                sex: this.formData.sex,
                                account: this.formData.account,
                                password: this.$utils.getEnString(this.formData.password),
                                phone: this.formData.phone,
                                idCard: this.formData.idCard,
                                roleId: this.formData.roleId,
                                areaDesc: this.formData.areaDesc
                            }).then(res => {
                                if (!res.code) {
                                    this.$message.success("用户更新成功");
                                    this.getTableData();
                                    this.handleCancel();
                                } else {
                                    this.$message.error(res.message)
                                }
                            })
                        } else {
                            this.$api.addUser({
                                name: this.formData.name,
                                nickname: this.formData.nickname,
                                areaId: this.formData.areaId,
                                sex: this.formData.sex,
                                account: this.formData.account,
                                password: this.$utils.getEnString(this.formData.password),
                                phone: this.formData.phone,
                                idCard: this.formData.idCard,
                                roleId: this.formData.roleId,
                                areaDesc: this.formData.areaDesc
                            }).then(res => {
                                if (!res.code) {
                                    this.$message.success("用户新增成功");
                                    this.search();
                                    this.handleCancel();
                                } else {
                                    this.$message.error(res.message);
                                }
                            })
                        }
                    }
                })
            }
        },
        mounted() {
            //获取用户列表
            this.search();
            //获取角色列表
            this.getRoleListAll();
        }
    }
</script>


<style scoped>

</style>
