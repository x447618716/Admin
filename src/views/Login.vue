<template>
  <div class="login-wrap">
    <language style="float: right; margin-right: 15px; margin-top: 15px;z-index: 3"></language>
    <div class="ms-title">{{ $t("system.name") }}</div>
    <div class="ms-login">
      <el-form ref="login" :model="user" :rules="userRules" label-width="0px" validate-on-rule-change>
        <el-form-item prop="username">
          <el-input v-model="user.username" :placeholder="$t('pages.login.userTip')"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" :placeholder="$t('pages.login.passwordTips')" v-model="user.password"
                    @keyup.enter.native="login"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="success" @click="login">{{ $t("pages.login.loginBtn") }}</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'

export default {
  data() {
    return {
      user: {
        username: null,
        password: null,
      }
    }
  },
  computed: {
    ...mapState('permissionRoutre', [
      'permissionList'
    ]),
    userRules() {
      return {
        username: [
          {required: true, message: this.$t('pages.login.userTip'), trigger: 'blur'}
        ],
        password: [
          {required: true, message: this.$t('pages.login.passwordTips'), trigger: 'blur'}
        ]
      }
    }
  },
  watch: {
    //监听权限列表是否已存在
    permissionList(val) {
      if (val) {
        //检查是否第一次登陆非首次跳转到最后一次浏览页面否则进入大厅
        if (this.$cookies.get('redirectUrl')) {
          this.$router.push(this.$cookies.get('redirectUrl'));
        } else {
          this.$router.push('/manageCenter');
        }
      }
    }
  },
  methods: {
    ...mapMutations([
      'RECORD_USERINFO'
    ]),
    ...mapActions('permissionRoutre', [
      'GET_PERMISSION'
    ]),
    //登录
    login() {
      this.$refs['login'].validate((valid) => {
        if (valid) {
          this.$api.login(this.user.username, this.$utils.getEnString(this.user.password)).then(res => {
            if (!res.code) {
              //记录用户信息
              this.RECORD_USERINFO(res.data);
              //获取权限菜单
              this.GET_PERMISSION();
            } else {
              this.$message.error(res.message);
            }
          });
        }
      });
    }
  },
  mounted() {}
}
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: #2f3742;
}

.ms-title {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -230px;
  transform: translateX(-50%);
  text-align: center;
  font-size: 30px;
  z-index: 3;
  color: #4a5562;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 380px;
  height: 250px;
  margin: -125px 0 0 -190px;
  padding: 40px;
  border-radius: 5px;
  background: #4a5562;
  z-index: 3;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
}
</style>
