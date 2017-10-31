<style lang="less" scoped="">
  @import "../assets/login.less";
</style>
<template>
  <div class="main-box-rap">
    <div class="main-card-box">
      <img class="bg-logo" src="../assets/img/bg.png">
      <img class="img-logo" src="../assets/img/logo-login.png">
      <div class="logo-part clearfix">
        <div class="m-logo">激活账号/忘记密码</div>
      </div>
      <el-card class="box-card ">
        <div style="padding:0 20px">
          <div v-if="showInfo" class="text-center">
            已发送重置密码邮件至邮箱 {{user.email}}
            <el-button type="primary" @click="resend" style="display:block;width:100%;margin:40px 0">
              没有收到？点击重新发送验证邮件
            </el-button>
          </div>
          <div v-else>
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
                  <div><img :src="codeUrl" @click="getCode" style="cursor:pointer;height: 36px"></div>
                </div>

              </el-form-item>
              <el-button-group style="width:100%">

                <el-button type="primary" @click="done" style="display:block;width:50%;"
                           native-type="submit">
                  {{btnString}}
                </el-button>
                <el-button style="display: block;width:50%;" @click="$router.push('/login')">
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
        orgCode: [
          {required: true, message: '组织编号', trigger: 'blur'}
        ],
        account: [
          {required: true, message: '请输入账号', trigger: 'blur'}
        ],
        code: [
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
