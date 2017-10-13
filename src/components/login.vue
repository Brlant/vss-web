<style lang="less" scoped="">
  @import "../assets/mixins.less";

  /*body {*/
  /*background: #f5f5f5*/
  /*}*/

  .main-card-box {
    width: 550px;
  }

  .logo-part {
    text-align: center;
    line-height: 30px;
    font-size: 28px;
    position: absolute;
    left: 15%;
    top: 70px;
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
  .login-menu {
    cursor: pointer;
    display: flex;
    padding: 20px;
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

  #backgroundCanvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .bg-logo {
    width: 549px;
    height: 160px;
  }

  .box-card {
    margin-top: -5px;
  }
</style>
<template>
  <div>
    <div class="main-card-box">
      <img class="bg-logo" src="../assets/img/bg.png">
      <img class="img-logo" src="../assets/img/cerp-logo.png">
      <div class="logo-part clearfix">
        <div class="m-logo">疾病预防控制中心疫苗管理系统</div>
        <div class="e-logo">CDC Vaccine Management System</div>
      </div>
      <el-card class="box-card ">
        <div style="padding:0 20px">
          <el-form label-position="top" ref="loginForm" label-width="80px" :model="user" :rules="rules"
                   @submit.prevent="done" onsubmit="return false">
            <el-form-item label="组织编号" prop="orgCode">
              <oms-input v-model="user.orgCode"></oms-input>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
              <oms-input v-model="user.username"></oms-input>
            </el-form-item>
            <el-form-item label="密码" style="position:relative" prop="password">
              <oms-input v-model="user.password" type="password"></oms-input>
              <router-link style="position: absolute;top:-35px;right:0;" to="/forget">激活账号/忘记密码?</router-link>
            </el-form-item>
            <el-form-item label="验证码" v-show="showCode">
              <div style="display:flex">
                <div style="width:300px;margin-right:50px">
                  <oms-input v-model="user.validateCode"></oms-input>
                </div>
                <div><img :src="codeUrl" @click="getCode" style="cursor:pointer;height: 36px"></div>
              </div>

            </el-form-item>

            <el-form-item label-width="80px">
              <el-button type="primary" @click="done" style="display:block;width:100%;" native-type="submit">
                {{btnString}} <i class="el-icon-loading" v-show="loading"></i></el-button>

            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
    <canvas id="backgroundCanvas"></canvas>
    <app-footer></app-footer>
  </div>

</template>

<script>
  import {Auth} from '../resources';
  import AppFooter from './common/app.footer.vue';

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
        rules: {
          orgCode: [
            {required: true, message: '请输入组织编号', trigger: 'blur'}
          ],
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        }
      });
    },
    methods: {
      done() {
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            this.btnString = '登陆中..';
            this.loading = true;
            Auth.login(this.user).then(response => {
              let userId = window.localStorage.getItem('userId');
              this.$store.commit('initUser', response.data);
              this.$store.commit('initCode', this.user.orgCode);
              this.$nextTick(function () {
                if (userId === response.data.userId) {
                  let lastUrl = window.localStorage.getItem('lastUrl');
                  if (lastUrl && lastUrl.indexOf('/login') === -1 && lastUrl.indexOf('/logout') === -1) {
                    window.localStorage.removeItem('lastUrl');
                    window.location.href = lastUrl;
                    return lastUrl;
                  }
                } else {
                  this.$router.replace('/');
                }
                this.$router.replace('/');
              });
            }, error => {
              let data = error.response.data;
              this.$notify.error({
                message: data.msg
              });
              if (data.code === 101 || data.code === 100) {
                this.getCode();
              }
              this.btnString = '登陆';
              this.loading = false;
            });
          }
        });

      },
      getCode: function () {
        this.showCode = true;
        this.codeUrl = process.env.NODE_API + '/foundation/CAPTCHA?' + Math.random();
      }
    },
    mounted: function () {
      document.addEventListener('touchmove', function (e) {
        e.preventDefault();
      });
      var c, x, pr, w, h, f, q, m, r, u, v, z;
      c = document.getElementById('backgroundCanvas');
      x = c.getContext('2d');
      pr = 1;
      w = window.innerWidth;
      h = window.innerHeight;
      f = 90;
      m = Math;
      r = 0;
      u = m.PI * 2;
      v = m.cos;
      z = m.random;
      c.width = w * pr;
      c.height = h * pr;
      x.scale(pr, pr);
      x.globalAlpha = 0.6;

      function i() {
        x.clearRect(0, 0, w, h);
        q = [{x: 0, y: h * 0.7 + f}, {x: 0, y: h * 0.7 - f}];
        while (q[1].x < w + f) d(q[0], q[1]);
      }

      function d(i, j) {
        var k, n;
        x.beginPath();
        x.moveTo(i.x, i.y);
        x.lineTo(j.x, j.y);
        k = j.x + (z() * 2 - 0.25) * f;
        n = y(j.y);
        x.lineTo(k, n);
        x.closePath();
        r -= u / -50;
        x.fillStyle = '#' + (v(r) * 127 + 128 << 16 | v(r + u / 3) * 127 + 128 << 8 | v(r + u / 3 * 2) * 127 + 128).toString(16);
        x.fill();
        q[0] = q[1];
        q[1] = {x: k, y: n};
      }

      function y(p) {
        var t = p + (z() * 2 - 1.1) * f;
        return (t > h || t < 0) ? y(p) : t;
      }

//       document.onclick = i
      document.ontouchstart = i;
      i();
    }
  };
</script>
