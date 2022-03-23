<style lang="scss" scoped>
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

      <el-card class="box-card ">
        <div style="padding:0 20px">
          <el-form ref="loginForm" :model="user" :rules="rules" label-position="top" label-width="80px"
                   onsubmit="return false" @submit.prevent="done">

            <el-form-item label="原密码" prop="oldPassword" style="position:relative">
              <oms-input v-model="user.oldPassword" type="password"></oms-input>

            </el-form-item>
            <el-form-item label="新密码" prop="password" style="position:relative">
              <oms-input v-model="user.password" type="password"></oms-input>

            </el-form-item>
            <el-form-item label="确认密码" prop="password2" style="position:relative">
              <oms-input v-model="user.password2" type="password"></oms-input>
            </el-form-item>

            <el-form-item label-width="80px">
              <el-button native-type="submit" style="display:block;width:100%;" type="primary" @click="done">
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
import {User} from '@/resources';

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
            this.$notify.info('修改成功');
            setTimeout(()=>this.$router.push('/login'),500);
          }).catch(e => {
            let error = e.response;
            if (error.status === 400) {
              this.$notify.error(error.data.msg);
            }
          });
        }
      });
    }
  }
};
</script>
