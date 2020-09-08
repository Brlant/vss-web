<style lang="scss" scoped="">
@import "../assets/login.scss";
</style>
<template>
  <div class="main-box-rap">
    <div class="main-card-box">
      <div class="bg-logo"></div>
      <img class="img-logo" src="../assets/img/logo-login.png">
      <div class="logo-part-s clearfix">
        <div class="m-logo">{{$store.state.sysTitle}}</div>
      </div>
      <el-card class="box-card ">
        <div style="padding:0 20px">
          <el-form ref="loginForm" :model="user" :rules="rules" label-position="top" label-width="80px"
                   onsubmit="return false" @submit.prevent="done">
            <el-form-item v-if="needCode" label="系统代码" prop="orgCode">
              <oms-input v-model="user.orgCode" :showFocus="isFocus === 1"></oms-input>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
              <oms-input v-model="user.username" :showFocus="isFocus === 2" placeholder="手机号/邮箱/用户名"
                         @blur="check()"></oms-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" style="position:relative">
              <oms-input v-model="user.password" :showFocus="isFocus === 3" placeholder="请输入密码"
                         type="password"></oms-input>
              <router-link style="position: absolute;top:-35px;right:0;" to="/forget">激活账号/忘记密码?</router-link>
            </el-form-item>
            <el-form-item v-show="showCode" label="验证码">
              <div style="display:flex">
                <div style="width:300px;margin-right:50px">
                  <oms-input v-model="user.validateCode"></oms-input>
                </div>
                <div><img :src="codeUrl" style="cursor:pointer;height: 36px" @click="getCode"></div>
              </div>

            </el-form-item>

            <el-form-item label-width="80px">
              <el-button :loading="loading" native-type="submit" style="display:block;width:100%;" type="primary"
                         @click="done">
                {{btnString}}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
    <app-footer></app-footer>
  </div>
</template>

<script>
import {Auth, cerpAction} from '../resources';
import AppFooter from './common/app.footer.vue';
import {base64} from '@dtop/dtop-web-common';

export default {
  components: {
    AppFooter
  },
  name: 'login',
  data: () => {
    return ({
      user: {
        username: window.localStorage.getItem('user') ? JSON.parse(window.localStorage.getItem('user')).userAccount : '',
        password: '',
        validateCode: '',
        type: 1,
        orgCode: window.localStorage.getItem('orgCode') ? JSON.parse(window.localStorage.getItem('orgCode')) : ''
      },
      loading: false,
      codeUrl: '',
      showCode: false,
      btnString: '登录',
      isFocus: -1,
      rules: {
        orgCode: [
          {required: true, message: '请输入系统代码', trigger: 'blur'}
        ],
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      },
      needCode: false
    });
  },
  methods: {
    done() {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          this.btnString = '登录中..';
          this.loading = true;
          let userCopy = JSON.parse(JSON.stringify(this.user));
          userCopy.orgCode = this.needCode ? this.trim(this.user.orgCode) : '';
          userCopy.username = this.trim(this.user.username);
          userCopy.encryptionPsw = base64(userCopy.password);
          delete userCopy.password;
          Auth.wxLogin(userCopy).then(response => {
            if (!response.data) return;
            let userId = window.localStorage.getItem('userId');
            this.$store.commit('initUser', response.data);
            this.$store.commit('initCode', this.user.orgCode);
            // this.$nextTick(function () {
            //   if (userId === response.data.userId) {
            //     let lastUrl = window.localStorage.getItem('lastUrl');
            //     if (lastUrl && lastUrl.indexOf('/login') === -1 && lastUrl.indexOf('/logout') === -1) {
            //       window.localStorage.removeItem('lastUrl');
            //       window.location.href = lastUrl;
            //       return lastUrl;
            //     }
            //   } else {
            //     this.$router.replace('/');
            //   }
            //   this.$router.replace('/');
            // });
            this.$emit('login');
            this.queryWeChat();
          }, error => {
            let data = error.response.data;
            this.$notify.error({
              message: data.msg
            });
            if (data.code === 101 || data.code === 100) {
              this.getCode();
            }
            if (data.code === 405) {
              this.needCode = true;
            }
            this.btnString = '登录';
            this.loading = false;
          });
        }
      });
    },
    check() {
      // 为空时, 不用做判断
      if (!this.user.username) return;
      this.$http.post('/login/check', {username: this.trim(this.user.username)}).catch(error => {
        let data = error.response.data;
        if (data.code === 405) {
          this.needCode = true;
        }
      });
    },
    getCode: function () {
      this.showCode = true;
      this.codeUrl = process.env.VUE_APP_API + '/foundation/CAPTCHA?' + Math.random();
    },
    isFocusIndex() {
      this.isFocus = 2;
    },
    trim: function (str) {
      return (str + '').replace(/(^\s*)|(\s*$)/g, '');
    },
    queryWeChat() {
      cerpAction.queryWeChatInfo().then(res => {
        this.$store.commit('initWeChatInfo', res.data);
      }).catch(() => {
        this.$store.commit('initWeChatInfo', {});
      });
    }
  },
  mounted: function () {
    // 清空权限列表
    this.$store.commit('initPermissions', []);
    this.isFocusIndex();
  }
};
</script>
