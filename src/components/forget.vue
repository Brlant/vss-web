<style lang="scss" scoped>
@import "../assets/login.scss";
</style>
<template>
  <div class="main-box-rap">
    <div class="main-card-box">
      <div class="bg-logo"></div>
      <img class="img-logo" src="../assets/img/logo-login.png">
      <div class="logo-part clearfix">
        <div class="m-logo">激活账号/忘记密码</div>
      </div>
      <el-card class="box-card">
        <div style="padding:0 20px">
          <div v-if="showInfo" class="text-center">
            已发送重置密码邮件至邮箱 {{user.email}}
            <el-button style="display:block;width:100%;margin:30px 0" type="primary" @click="resend">
              没有收到？点击重新发送验证邮件
            </el-button>
          </div>
          <div v-else-if="showPhoneCode">
            <h3 class="text-center">短信激活账号/重置密码</h3>
            <el-form key="el-form--reset" ref="resetForm" :model="resetUser" :rules="resetUserRules" label-position="top"
                     label-width="80px"
                     onsubmit="return false" @submit.prevent="resetPass">

              <el-form-item label="密码" prop="password">
                <el-input v-model="resetUser.password" type="password"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="password2">
                <el-input v-model="resetUser.password2" type="password"></el-input>
              </el-form-item>
              <el-form-item v-show="showPhoneCode" label="短信验证码" prop="code">
                <div style="display:flex">
                  <div style="width:300px;margin-right:50px">
                    <el-input v-model="resetUser.code"></el-input>
                  </div>
                  <div style="line-height:0;">
                    <el-button :disabled="leftTime>0" @click="resendSMS">重新发送<span
                      v-show="leftTime>0">({{leftTime}})</span></el-button>
                  </div>
                </div>
              </el-form-item>

              <el-button-group style="width: 100%;margin-top:20px">

                <el-button :disabled="loading" native-type="submit" style="width:50%;" type="primary"
                           @click="resetPass">
                  重置密码
                </el-button>
                <el-button style="width:50%;">
                  <router-link style="display: block" to="/login">返回登录</router-link>
                </el-button>
              </el-button-group>
            </el-form>
          </div>
          <div v-else>
            <el-form key="el-form--login" ref="loginForm" :model="user" :rules="rules" label-position="top"
                     label-width="80px"
                     onsubmit="return false" @submit.prevent="done">
              <el-form-item label="系统代码" prop="orgCode">
                <el-input v-model="user.orgCode"></el-input>
              </el-form-item>
              <el-form-item label="账号" prop="account">
                <el-input v-model="user.account" placeholder="手机号/邮箱/用户名"></el-input>
              </el-form-item>
              <el-form-item label="验证码" prop="code">
                <div style="display:flex">
                  <div style="width:300px;margin-right:50px">
                    <el-input v-model="user.code"></el-input>
                  </div>
                  <div style="line-height:1px;"><img :src="codeUrl" height="42" style="cursor:pointer" @click="getCode">
                  </div>
                </div>

              </el-form-item>

              <el-button-group style="width: 100%;margin-top:20px">

                <el-button :disabled="loading" native-type="submit" style="width:50%;" type="primary" @click="done">
                  {{btnString}}
                </el-button>
                <el-button style="width:50%;" @click="$router.push('/login')">
                  返回登录
                </el-button>
              </el-button-group>
            </el-form>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {http, User} from '@/resources';

const timeInterval = 60;
let phoneReg = /^1[0-9]{10}$/;
export default {
  name: 'forget',
  data: function () {
    let self = this;
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (self.resetUser.password2 !== '') {
          this.$refs.resetForm.validateField('password2');
        }
        callback();
      }
    };

    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== self.resetUser.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      user: {account: '', code: '', type: 1, orgCode: '', email: '', phoneCode: '', phone: ''},
      resetUser: {userId: '', code: '', password: '', password2: ''},
      resetUserRules: {
        code: [
          {required: true, message: '请输入短信验证码', trigger: 'blur'}
        ],
        password: [
          {validator: validatePass, required: true, trigger: 'blur'}
        ],
        password2: [
          {validator: validatePass2, required: true, trigger: 'blur'}
        ]
      },
      loading: false,
      showInfo: false,
      codeUrl: '',
      showCode: false,
      btnString: '提交',
      rules: {
        orgCode: [
          {required: true, message: '请输入系统代码', trigger: 'blur'}
        ],
        account: [
          {required: true, message: '请输入账号'}
        ],
        validateCode: [
          {required: true, message: '请输入验证码'}
        ]
      },
      showPhoneCode: false,
      leftTime: timeInterval,
      userId: ''
    };
  },
  methods: {
    done() {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          this.loading = true;
          User.forget(this.user).then(response => {// 验证
            if (response.data.phone) {
              this.user.phone = response.data.phone;
              this.showPhoneCode = true;
              this.loading = false;
              this.setTimer();
            } else {
              this.showInfo = true;
              this.user.email = response.data.email;
            }
            this.userId = response.data.userId;
          }, error => {
            let data = error.response.data;
            this.$notify.error({
              message: data.msg
            });
            this.getCode();
            this.loading = false;
          });
        }
      });
    },
    getCode: function () {
      this.user.code = '';
      this.showCode = true;
      this.codeUrl = process.env.VUE_APP_API + '/foundation/CAPTCHA?' + Math.random();
    },
    resend: function () {
      http.get('/oms/user/' + this.userId + '/password/verifyMail/resend').then(response => {// 验证
        this.user.email = response.data.email;
        this.$notify.info({
          message: '发送成功'
        });
      }, () => {
        this.$notify.error({
          message: '发送失败,请联系管理员'
        });
      });
    },
    resendSMS: function () {
      this.leftTime = timeInterval;
      this.setTimer();
      http.get('/oms/user/' + this.userId + '/password/verifySMS/resend').then(response => {// 验证
        this.$notify.info({
          message: '发送成功'
        });
      }, () => {
        this.$notify.error({
          message: '发送失败,请联系管理员'
        });
      });
    },
    setTimer: function () {
      if (this.leftTime > 0) {
        this.leftTime = this.leftTime - 1;
        setTimeout(() => {
          this.setTimer();
        }, 1000);
      }
    },
    resetPass: function () {
      this.$refs['resetForm'].validate((valid) => {
        if (valid) {
          this.loading = true;
          let data = Object.assign({}, this.resetUser, {userId: this.userId});
          http.put('/oms/user/phone/reset-psw', data).then(response => {// 验证
            this.$notify.info({
              message: '重置成功'
            });
            this.$router.push('/login');
          }, error => {
            let data = error.response.data;
            this.$notify.error({
              message: data.msg
            });
            this.getCode();
            this.loading = false;
          });
        }
      });
    }
  },
  mounted: function () {
    this.getCode();
  }
};
</script>
