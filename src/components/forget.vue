<style lang="less" scoped="">
  @import "../assets/mixins.less";

  body {
    background: #f5f5f5
  }

  .main-card-box {
    width: 550px;
  }

  .logo-part {
    text-align: center;
    line-height: 80px;
    font-size: 40px;
    img {
      margin-right: 10px;
      vertical-align: middle;
      margin-top: -20px;
    }
    color: #189aca
  }

  .login-menu {
    cursor: pointer;
    display: flex;
    padding: 20px 0;
    > div {
      text-align: center;
      line-height: 40px;
      width: 50%;
      border-bottom: 3px solid #eee;
      color: #999;
      font-weight: bold;
      font-size: 14px;
      &.active {
        border-color: @activeColor;
        color: @activeColor;
      }
    }
  }
</style>
<template>
  <el-card class="box-card main-card-box">
    <div class="logo-part clearfix">CERP</div>


    <div style="padding:0 20px">

      <div v-if="showInfo" class="text-center">
        已发送重置密码邮件至邮箱 {{user.email}}
        <el-button type="primary" @click="resend" style="display:block;width:100%;margin:30px 0">
          没有收到？点击重新发送验证邮件
        </el-button>
      </div>
      <div v-else>
        <h3 class="text-center">忘记密码</h3>
        <el-form label-position="top" ref="loginForm" label-width="80px" :model="user" :rules="rules"
                 @submit.prevent="done" onsubmit="return false">
          <el-form-item label="组织编号" prop="orgCode">
            <oms-input v-model="user.orgCode"></oms-input>
          </el-form-item>
          <el-form-item label="账号" prop="account">
            <oms-input v-model="user.account"></oms-input>
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <div style="display:flex">
              <div style="width:300px;margin-right:50px">
                <oms-input v-model="user.code"></oms-input>
              </div>
              <div style="margin-top:-20px"><img :src="codeUrl" @click="getCode" style="cursor:pointer"></div>
            </div>

          </el-form-item>

          <el-form-item label-width="80px">
            <el-button style="display:block;width:40%;float:left;">
              <router-link to="/login" style="display: block;width:100%;">返回登录</router-link>
            </el-button>
            <el-button type="warning" @click="done" style="display:block;width:40%;float:left;" native-type="submit">
              {{btnString}}
            </el-button>

          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-card>
</template>

<script>
  import {User, http} from '../resources';

  export default {
    name: 'forget',
    data: () => ({
      user: {account: '', code: '', type: 1, orgCode: '', email: ''},
      loading: false,
      showInfo: false,
      codeUrl: '',
      showCode: false,
      btnString: '提交',
      rules: {
        account: [
          {required: true, message: '请输入账号', trigger: 'blur'}
        ],
        validateCode: [
          {required: true, message: '请输入验证码', trigger: 'blur'}
        ]
      }
    }),
    methods: {
      done() {
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            this.loading = true;
            User.forget(this.user).then(response => {// 验证
              this.showInfo = true;
              this.userId = response.data.userId;
              this.user.email = response.data.email;
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
        this.codeUrl = process.env.NODE_API + '/foundation/CAPTCHA?' + Math.random();
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
      }
    },
    mounted: function () {
      this.getCode();
    }
  };
</script>
