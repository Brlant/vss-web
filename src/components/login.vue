<style lang="scss" scoped>
@import "../assets/login.scss";

.el-icon-t-wx_icon {
  color: #fff;
}

.login-style {
  margin-bottom: 20px;

  .btn {
    color: deepskyblue;
    right: 40px;
    position: absolute;
    top: 10px;
    font-size: 16px;
  }
}

.flex {
  display: flex;

  .cursor {
    cursor: pointer;
  }
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}
</style>
<template>
  <div class="main-box-rap">
    <div class="main-card-box">
      <div class="bg-logo"></div>
      <img class="img-logo" src="../assets/img/logo-login.png">
      <div class="logo-part-s clearfix">
        <div class="m-logo">{{ $store.state.sysTitle }}</div>
      </div>
      <el-card class="box-card ">
        <!--        <div class="login-style">-->
        <!--          <el-button v-show="loginStyle === 0" class="btn" type="text" @click="changeLoginStyle(1)">用短信验证码登录</el-button>-->
        <!--          <el-button v-show="loginStyle === 1" class="btn" type="text" @click="changeLoginStyle(0)">用短信验证码登录</el-button>-->
        <!--        </div>-->

        <div style="padding:0 20px">
          <!--账号密码登录-->
          <el-form v-show="loginStyle===0" ref="loginForm" :model="user" :rules="rules" label-position="top"
                   label-width="80px"
                   onsubmit="return false" @submit.prevent="done">
            <el-form-item v-if="needCode" label="系统代码" prop="orgCode">
              <!--<oms-input v-model="user.orgCode" :showFocus="isFocus === 1"></oms-input>-->
              <tn-input-auto-complete v-model="user.orgCode" :list="orgCodeList" placeholder="请输入业务单位编号"/>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
              <oms-input v-model="user.username" :showFocus="isFocus === 2" placeholder="手机号/邮箱/用户名"
                         @blur="check()"></oms-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" style="position:relative">
              <!--              <oms-input v-model="user.password" :showFocus="isFocus === 3" placeholder="请输入密码"-->
              <!--                         type="password"></oms-input>-->
              <el-input placeholder="请输入密码" v-model="user.password" :autofocus="isFocus === 3" show-password></el-input>
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
                {{ btnString }}
              </el-button>
            </el-form-item>
            <!--<el-form-item label-width="80px">-->
            <!--<el-button type="success" @click="loginByWx" :disabled="wxLoading" style="display:block;width:100%;"-->
            <!--native-type="submit">-->
            <!--<i class="el-icon-t-wx_icon"></i><span>微信登录</span>-->
            <!--</el-button>-->
            <!--</el-form-item>-->
          </el-form>
          <!--手机验证码登录-->
          <!--          <el-form v-show="loginStyle===1" class="login-form" label-position="top" ref="phoneForm" label-width="80px"-->
          <!--                   :model="user1" :rules="rules1"-->
          <!--                   onsubmit="return false">-->
          <!--            <el-form-item label="手机号" prop="phone">-->
          <!--              <oms-input v-model="user1.phone" placeholder="请输入手机号"></oms-input>-->
          <!--            </el-form-item>-->
          <!--            <el-form-item label="短信验证码" prop="validateCode">-->
          <!--              <div style="display:flex">-->
          <!--                <div style="width:300px;margin-right:50px">-->
          <!--                  <el-input v-model="user1.validateCode" placeholder="请输入短信验证码"></el-input>-->
          <!--                </div>-->
          <!--                <div style="line-height:0;">-->
          <!--                  <el-button :disabled="smsBtnDisabled" @click="sendSMS">{{ smsBtnText }}</el-button>-->
          <!--                </div>-->
          <!--              </div>-->
          <!--            </el-form-item>-->

          <!--            <el-form-item label-width="80px">-->
          <!--              <el-button type="primary" @click="phoneFormSubmit" style="display:block;width:100%;" native-type="submit">-->
          <!--                {{ btnString }} <i class="el-icon-loading" v-show="loading"></i></el-button>-->
          <!--            </el-form-item>-->
          <!--          </el-form>-->

          <!--        二次认证登录-->
          <el-form v-show="loginStyle===1" class="login-form" label-position="top" ref="phoneForm" label-width="80px"
                   :model="user" :rules="rules1"
                   onsubmit="return false">
            <div class="flex">
              <i class="el-icon-arrow-left cursor" @click="goBack"></i>
              <h3 class="title">二次认证</h3>
            </div>
            <el-form-item label="短信验证码" prop="validateCode">
              <div style="display:flex">
                <div style="width:300px;margin-right:50px">
                  <el-input v-model="user.validateCode" placeholder="请输入短信验证码"></el-input>
                </div>
                <div style="line-height:0;">
                  <el-button :disabled="smsBtnDisabled" style="width: 110px" @click="sendSMS">{{
                      smsBtnText
                    }}
                  </el-button>
                </div>
              </div>
            </el-form-item>

            <drag-verify
              ref="dragVerify"
              :isPassing.sync="isPassing"
              style="margin-bottom: 20px;width: 460px;"
              :width="460"
              text="请按住滑块,拖动到最右边"
              handlerIcon="el-icon-d-arrow-right"
              successIcon="el-icon-circle-check"
              background="#ccc"
              successText="验证通过"
              progressBarBg="#67c23a"
              @passcallback="passHandler"
              @passfail="failHandler"
            >
            </drag-verify>

          </el-form>
        </div>
      </el-card>
    </div>
    <app-footer></app-footer>
  </div>

</template>

<script>
import {Auth, cerpAction, http} from '@/resources';
import AppFooter from './common/app.footer.vue';
import {base64} from '@dtop/dtop-web-common';
import dragVerify from "vue-drag-verify2";

export default {
  components: {
    AppFooter,
    dragVerify
  },
  name: 'login',
  data() {
    let orgCodeList = JSON.parse(window.localStorage.getItem('orgCodeList')) || [];
    let needCode = !!orgCodeList.length;
    return {
      // 登录方式：0-账号密码登录，1-手机验证码登录
      loginStyle: 0,
      user: {
        enableSecondaryCertificateConfig: 1,
        username: window.localStorage.getItem('user') ? JSON.parse(window.localStorage.getItem('user')).userAccount : '',
        password: '',
        validateCode: '',
        type: 1,
        orgCode: window.localStorage.getItem('orgCode') ? JSON.parse(window.localStorage.getItem('orgCode')) : ''
      },
      loading: false,
      wxLoading: false,
      codeUrl: '',
      showCode: false,
      btnString: '登录',
      isFocus: -1,
      rules: {
        orgCode: [
          {required: true, message: '请输入系统代码', trigger: ['blur', 'change']}
        ],
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      },
      needCode,
      orgCodeList,
      user1: {
        phone: '',
        validateCode: '',
        type: 0
      },
      rules1: {
        phone: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请输入手机号'));
              } else {
                if (!/^1[0-9]{10}$/.test(value)) {
                  callback(new Error('请输入正确的手机号'));
                } else {
                  callback();
                }
              }
            }, trigger: 'blur'
          }
        ],
        validateCode: [
          {required: true, message: '请输入验证码', trigger: 'blur'}
        ],
        // password: [
        //   {required: true, message: '请输入密码', trigger: 'blur'}
        // ]
      },
      maxTimes: 60,
      leftTime: 0,
      smsBtnText: '获取验证码',
      isPassing: false,
    };
  },
  computed: {
    // smsBtnDisabled() {
    //   return !/^1[0-9]{10}$/.test(this.user1.phone) || this.leftTime > 0;
    // }
    smsBtnDisabled() {
      return this.leftTime > 0;
    }
  },
  methods: {
    phoneFormSubmit() {
      this.$refs['phoneForm'].validate((valid) => {
        if (valid) {
          this.btnString = '登录中..';
          this.loading = true;
          Auth.loginByPhone(this.user1).then(response => {
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
              message: data.msg || '无法登录'
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
    changeLoginStyle(loginStyle) {
      this.loginStyle = loginStyle;
    },
    sendSMS() {
      this.leftTime = this.maxTimes;
      this.setTimer();
      http.post('/sendSms', {phone: this.user.username}).then(response => {// 验证
        this.$notify.info({
          message: '发送成功'
        });
      }, () => {
        this.$notify.error({
          message: '发送失败,请联系管理员'
        });
      });
    },
    setTimer() {
      if (this.leftTime > 0) {
        this.leftTime = this.leftTime - 1;
        this.smsBtnText = this.leftTime + 's';
        setTimeout(() => {
          this.setTimer();
        }, 1000);
      } else {
        this.smsBtnText = '重新发送';
      }
    },
    // 二次验证登录
    passHandler() {
      // console.log('滑动验证成功')
      if (!this.user.validateCode) {
        this.resetDragVerify();
        this.$message({
          message: '请输入短信验证码',
          type: 'warning'
        });

        return;
      }

      this.loading = true;
      let user = {
        orgCode: this.user.orgCode,
        phone: this.user.username,
        validateCode: this.user.validateCode,
        type: this.user.type
      };

      Auth.secondaryCertificateLogin(user).then(response => {
        let userId = window.localStorage.getItem('userId');
        this.$store.commit('initUser', response.data);
        this.$store.commit('initCode', this.user.orgCode);
        this.$emit('login');
        this.queryWeChat();
      }).catch(error => {
        this.resetDragVerify();
        let data = error.response.data;
        this.$notify.error({
          message: data.msg || '无法登录'
        });

        this.loading = false;

        let code = data.code;
        if (code === 602) {
          this.loginStyle = 0;
          this.user.validateCode = ''
        }
      })
    },
    // 验证失败
    failHandler() {
      this.resetDragVerify();
    },
    // 还原至未验证通过状态
    resetDragVerify() {
      this.isPassing = false;
      this.$refs.dragVerify.reset();
    },
    goBack() {
      this.loginStyle = 0;

      this.user.validateCode = '';
      this.btnString = '登录';
      this.leftTime = 0;
      this.smsBtnText = '获取验证码';
      this.loading = false;

      this.$refs.phoneForm.resetFields();
      this.resetDragVerify();
    },
    onSubmit() {
      this.loginStyle = 1;
    },
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
          Auth.login(userCopy).then(response => {
            if (!response.data) return;

            let data = response.data;
            if (data.secondaryCertificateFlag) {
              this.loginStyle = 1;

              this.loading = false;
              this.btnString = '登录';
              this.smsBtnText = '获取验证码';

              return;
            }

            let userId = window.localStorage.getItem('userId');
            this.$store.commit('initUser', response.data);
            this.$store.commit('initCode', this.user.orgCode);
            this.$emit('login');
            this.queryWeChat();
          }, error => {
            let data = error.response.data;
            this.$notify.error({
              message: data.msg || '无法登录'
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
        if (error.response.status === 405) {
          this.needCode = true;
          let list = error.response.data && error.response.data.map(m => ({value: m}));
          window.localStorage.setItem('orgCodeList', JSON.stringify(list || ''));
        }
      });
    },
    getCode() {
      this.showCode = true;
      this.codeUrl = process.env.VUE_APP_API + '/foundation/CAPTCHA?' + Math.random();
    },
    isFocusIndex() {
      this.isFocus = 2;
    },
    trim(str) {
      return (str + '').replace(/(^\s*)|(\s*$)/g, '');
    },
    queryWeChat() {
      cerpAction.queryWeChatInfo().then(res => {
        this.$store.commit('initWeChatInfo', res.data);
      }).catch(() => {
        this.$store.commit('initWeChatInfo', {});
      });
    },
    loginByWx() {
      if (this.wxLoading) return;
      this.wxLoading = true;
      let a = document.createElement('a');
      a.href = '/api/wechat/link';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => {
        this.wxLoading = false;
      }, 100);
    }
  },
  mounted() {
    // 清空权限列表
    this.$store.commit('initPermissions', []);
    this.isFocusIndex();
  }
};
</script>
