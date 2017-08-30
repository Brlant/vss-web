<style lang="less" scoped="">
  @import "../../assets/mixins.less";

  .app-body-org-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;

    a {
      text-decoration: none
    }
    .container {
      position: relative;
    }

    .top-right {
      position: absolute;
      right: 0;
      width: auto;
      z-index: 3;
      top: 25px;
      .top-right-item {
        border-radius: 18px;
        background: #ebebeb;
        line-height: 26px;
        display: inline-block;
        padding: 3px 10px;
        cursor: pointer;
        img {
          vertical-align: middle;
          height: 23px;
          width: 23px;
          border: 1px solid #eee;
          border-radius: 50%;
        }
      }

    }
  }

  .top-right-user-dropdown {
    margin-top: 1px;
    padding: 10px;
    box-shadow: 1px 1px 1px #eee;
    border-color: #eee
  }

  .menu-user-part {
    display: flex;
    align-items: center;
    > div > img {
      margin-right: 10px;
      border-radius: 50%;
      height: 40px;
      width: 40px;
      border: 1px solid #eee
    }
    .menu-usr-part-phone {
      color: #666;
      font-size: 12px;
    }
  }

  .menu-user {
    padding: 8px 10px;
    .last-login {
      color: #999;
      font-size: 12px;
      margin: 10px 0;
    }
    a {
      color: @activeColor;
      font-size: 12px;
    }
  }
</style>

<template>
  <header class="app-body-org-header">
    <div class="container">
      <div class="top-right">
        <div class="top-user">
          <el-dropdown trigger="click">
            <div class="el-dropdown-link top-right-item">
              <img src="/static/img/userpic.png"> {{user.userName}}
              <i class="el-icon-caret-bottom"></i>
            </div>
            <el-dropdown-menu class="top-right-user-dropdown" slot="dropdown">
              <div class="menu-user">
                <div class="menu-user-part">
                  <div>
                    <img src="/static/img/userpic.png">
                  </div>
                  <div>
                    <div class="menu-usr-part-user">{{user.userName}}</div>
                    <div class="menu-usr-part-phone">{{user.userAccount}}</div>
                  </div>
                </div>
                <div class="last-login">上次登录时间:{{user.userLastLoginTime | date}}</div>
                <div class="text-right">
                  <router-link to="/resetpsw">重置密码</router-link>
                  <a href="#" @click.stop.pre="logout">退出</a>
                </div>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
  import {Auth} from '../../resources';
  export default {
    data() {
      return {};
    },
    computed: {
      user: function () {
        return Object.assign({}, {userName: '', userAccount: '', userLastLoginTime: 0}, this.$store.state.user);
      }
    },
    methods: {
      logout: function () {
        window.localStorage.setItem('lastUrl', window.location.href);
        Auth.logout().then(() => {
          window.localStorage.setItem('userId', this.$store.state.user.userId);
          window.localStorage.removeItem('user');
          return this.$router.replace('/login');
        });
      }
    },
    mounted: function () {

    }
  };
</script>
