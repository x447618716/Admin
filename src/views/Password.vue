<template>
    <el-container direction="vertical" style="align-items: center">
        <div style="flex: 1; display: flex; align-items: center">
            <el-form ref="password" :model="password" :rules="passwordRules" label-width="120px" hide-required-asterisk
                     style="width: 500px; height: 250px; background-color: #fff; padding: 35px;">
                <el-form-item prop="oldPassword" :label="$t('pages.password.oldPasswordText')">
                    <el-input ref="oldPassword" :type="oldTtpe" v-model="password.oldPassword"
                              :placeholder="$t('pages.password.oldPassword')"
                              style="width: 250px"></el-input>
                    <i class="el-icon-view" style="padding-left: 20px"
                       @click="oldTtpe=='password'?oldTtpe='text':oldTtpe='password'"></i>
                </el-form-item>
                <el-form-item prop="newPassword" :label="$t('pages.password.newPasswordText')">
                    <el-input ref="newPassword" :type="newTtpe" v-model="password.newPassword"
                              :placeholder="$t('pages.password.newPassword')"
                              style="width: 250px"></el-input>
                    <i class="el-icon-view" style="padding-left: 20px"
                       @click="newTtpe=='password'?newTtpe='text':newTtpe='password'"></i>
                </el-form-item>
                <el-form-item prop="confirmPassword" :label="$t('pages.password.confirmPasswordText')">
                    <el-input ref="confirmPassword" :type="confirmTtpe" v-model="password.confirmPassword"
                              :placeholder="$t('pages.password.confirmPassword')" style="width: 250px"></el-input>
                    <i class="el-icon-view" style="padding-left: 20px"
                       @click="confirmTtpe=='password'?confirmTtpe='text':confirmTtpe='password'"></i>
                </el-form-item>
                <el-form-item style="margin-top: 30px; text-align: center" label-width="0px">
                    <el-button type="primary" @click="onSubmit">{{$t("pages.password.submit")}}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-container>

</template>

<script>
    export default {
        name: "Password",
        data() {
            return {
                password: {
                    oldPassword: null,
                    newPassword: null,
                    confirmPassword: null
                },
                oldTtpe: 'password',
                newTtpe: 'password',
                confirmTtpe: 'password'
            }
        },
        computed: {
            passwordRules() {
                return {
                    oldPassword: [
                        {required: true, message: this.$t('pages.password.oldPassword'), trigger: 'blur'},
                        {validator: this.passwordLength, trigger: 'blur'},
                        {validator: this.$validate.validateChinese, trigger: 'blur'}
                    ],
                    newPassword: [
                        {required: true, message: this.$t('pages.password.newPassword'), trigger: 'blur'},
                        {validator: this.passwordLength, trigger: 'blur'},
                        {validator: this.$validate.validateChinese, trigger: 'blur'}
                    ],
                    confirmPassword: [
                        {required: true, message: this.$t('pages.password.confirmPassword'), trigger: 'blur'},
                        {validator: this.passwordLength, trigger: 'blur'},
                        {validator: this.$validate.validateChinese, trigger: 'blur'},
                        {validator: this.confirmPassword, trigger: 'blur'}
                    ]
                }
            },
        },
        methods: {
            //提交密码修改
            onSubmit() {
                this.$refs['password'].validate((valid) => {
                    if (valid) {
                        this.$confirm(this.$t('pages.password.confirmText'), this.$t('pages.common.confirmTips'), {
                            type: 'info'
                        }).then(() => {
                            this.$api.updatePassword(
                                this.$utils.getEnString(this.password.oldPassword),
                                this.$utils.getEnString(this.password.newPassword),
                                this.$utils.getEnString(this.password.confirmPassword)).then(res => {
                                if (!res.code) {
                                    this.$message.success(this.$t('pages.common.editSuccess'));
                                    this.$refs['password'].resetFields();
                                } else {
                                    this.$message.error(res.message);
                                }
                            });

                        })
                    }
                });
            },
            //验证密码是否输入一致
            confirmPassword(rule, value, callback) {
                if (value != this.password.newPassword) {
                    callback(new Error(this.$t("validate.confirmPassword")));
                } else {
                    callback();
                }
            },
            //验证密码长度
            passwordLength(rule, value, callback) {
                if (value.toString().length > 32) {
                    callback(new Error(this.$t("validate.passwordLength")));
                } else {
                    callback();
                }
            },
        }
    }
</script>

<style scoped>

</style>
