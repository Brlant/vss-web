<style lang="scss" scoped="">
  @import "../assets/login.scss";
</style>
<template>
  <div class="main-box-rap">
    <div class="main-card-box">
      <div class="bg-logo"></div>
      <img class="img-logo" src="../assets/img/logo-login.png">
      <div class="logo-part clearfix">
        <div class="m-logo">重置密码</div>
      </div>
      <el-card class="box-card">
        <div style="padding:0 20px">
          <div>
            <el-form label-position="top" ref="loginForm" :model="user" :rules="rules"
                     @submit.prevent="done" onsubmit="return false">
              <el-form-item label="新密码" prop="password">
                <oms-input v-model="user.password" type="password"></oms-input>
              </el-form-item>

              <el-form-item label-width="80px">
                <el-button type="primary" @click="done" style="display:block;width:100%;" native-type="submit">
                  重置密码
                </el-button>

              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
  import {http} from '../resources';

  export default {
    name: 'resetpwd',
    data: function () {
      let checkPasswd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          let rl = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
          if (!rl.test(this.user.password)) {
            callback('密码必须为8~16个字符，且包含数字、大写字母、小写字母');
          } else {
            callback();
          }
        }
      };
      return {
        user: {password: '', code: ''},
        loading: false,
        showInfo: false,
        codeUrl: '',
        showCode: false,
        btnString: '提交',
        rules: {
          password: [
            {required: true, message: '请输入新密码', trigger: 'blur'},
            {validator: checkPasswd, trigger: 'blur'}
          ]
        }
      };
    },
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
