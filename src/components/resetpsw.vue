<style lang="less" scoped="">
  @import "../assets/login.less";
</style>
<template>
  <div class="main-box-rap">
    <div class="main-card-box">
      <img class="bg-logo" src="../assets/img/bg.png">
      <img class="img-logo" src="../assets/img/logo-login.png">
      <div class="logo-part clearfix">
        <div class="m-logo">重置密码</div>
      </div>
      <el-card class="box-card ">
        <div style="padding:0 20px">
          <el-form label-position="top" ref="loginForm" label-width="80px" :model="user" :rules="rules"
                   @submit.prevent="done" onsubmit="return false">

            <el-form-item label="原密码" style="position:relative" prop="oldPassword">
              <oms-input v-model="user.oldPassword" type="password"></oms-input>

            </el-form-item>
            <el-form-item label="新密码" style="position:relative" prop="password">
              <oms-input v-model="user.password" type="password"></oms-input>

            </el-form-item>
            <el-form-item label="确认密码" style="position:relative" prop="password2">
              <oms-input v-model="user.password2" type="password"></oms-input>
            </el-form-item>

            <el-form-item label-width="80px">
              <el-button type="primary" @click="done" style="display:block;width:100%;" native-type="submit">
                {{btnString}}
              </el-button>

            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
  import {User} from '../resources';

  export default {
    name: 'resetpsw',
    data: function () {
      let checkPsw = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.user.password !== this.user.password2) {
            callback(new Error('两次输入的密码不一致'));
          } else {
            callback();
          }
        }
      };
      let checkPasswd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          let rl = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
          if (!rl.test(this.user.password)) {
            callback('新密码必须包含数字、大写字母,小写字母,至少8-16个字符');
          } else {
            callback();
          }
        }
      };
      return {
        user: {oldPassword: '', password: '', password2: ''},
        loading: false,
        btnString: '提交',
        rules: {
          oldPassword: [
            {required: true, message: '请输入原密码', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入新密码', trigger: 'blur'},
            {validator: checkPasswd, trigger: 'blur'}
          ],
          password2: [
            {required: true, message: '请输入确认密码', trigger: 'blur'},
            {validator: checkPsw, trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      done() {
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            this.loading = true;
            User.resetPsw(this.user).then(() => {
              this.$notify.info({
                message: '修改成功'
              });
              this.$router.go(-1);
            }).catch(e => {
              let error = e.response;
              if (error.status === 400) {
                this.$notify.info({
                  message: error.data.meta.message
                });
              }
            });
          }
        });
      }
    }
  };
</script>
