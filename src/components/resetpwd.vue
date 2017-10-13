<style lang="less" scoped="">
  @import "../assets/mixins.less";

  body {
    background: #f5f5f5
  }

  .main-card-box {
    width: 549px;
    .logo-part {
      text-align: center;
      line-height: 30px;
      font-size: 28px;
      position: absolute;
      left: 50%;
      top: 70px;
      transform: translateX(-50%);
      color: #ffffff;
      .e-logo {
        font-size: 16px;
      }
    }
    .img-logo {
      width: 120px;
      height: 120px;
      position: absolute;
      left: 50%;
      top: 0;
      transform: translate(-50%, -50%);
    }

    .bg-logo {
      width: 549px;
      height: 160px;
    }

    .box-card {
      margin-top: -5px;
    }
    .login-menu {
      cursor: pointer;

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
  }
</style>
<template>
  <div class="main-card-box">
    <img class="bg-logo" src="../assets/img/bg.png">
    <img class="img-logo" src="../assets/img/cerp-logo.png">
    <div class="logo-part clearfix">
      <div class="m-logo">重置密码</div>
    </div>
    <el-card class="box-card">
      <div style="padding:0 20px">
        <div class="login-menu">
          <el-form label-position="top" ref="loginForm" label-width="80px" :model="user" :rules="rules"
                   @submit.prevent="done" onsubmit="return false">
            <el-form-item label="新密码" prop="password">
              <oms-input v-model="user.password" type="password"></oms-input>
            </el-form-item>

            <el-form-item label-width="80px">
              <el-button type="warning" @click="done" style="display:block;width:100%;" native-type="submit">
                {{btnString}}
              </el-button>

            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {http} from '../resources';

  export default {
    name: 'resetpwd',
    data: () => ({
      user: {password: '', code: ''},
      loading: false,
      showInfo: false,
      codeUrl: '',
      showCode: false,
      btnString: '提交',
      rules: {
        password: [
          {required: true, message: '请输入新密码', trigger: 'blur'}
        ]
      }
    }),
    methods: {
      done() {
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            this.loading = true;
            http.put('/oms/user/reset/password', this.user).then(() => {// 验证
              this.showInfo = true;
              this.$notify.info({
                message: '重置成功'
              });
              setTimeout(() => {
                this.$router.push('/login');
              }, 1000);
            }, error => {
              let data = error.response.data;
              this.$notify.error({
                message: data.msg
              });
              this.loading = false;
            });
          }
        });

      }
    },
    mounted: function () {
      this.user.code = this.$route.params.id;
    }
  };
</script>
