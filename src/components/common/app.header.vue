<style lang="less" scoped=''>
  @import "../../assets/mixins.less";

  .main-header {
    background: #fff;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: @topMenuHeight;
    z-index: 800;
    box-shadow: 0 5px 5px rgba(221, 221, 221, 0.22);
    ul, li {
      padding: 0;
      margin: 0;
      list-style: none
    }
    a {
      text-decoration: none
    }

    .top-logo {
      vertical-align: middle;
      line-height: @topMenuHeight;
      height: @topMenuHeight;
      margin-left: 15px;
      img {
        vertical-align: middle;
      }
    }

    .top-right {
      position: absolute;
      right: 15px;
      width: auto;
      z-index: 3;
      top: 50%;
      transform: translateY(-50%);
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

  .logo_pic {
    height: 26px;
    width: 32px;
    margin-right: 10px;
    margin-top: -8px;
  }

  .logo-span {
    font-size: 22px;
    font-weight: bold;
  }

  .top-menu {
    position: absolute;
    top: @topMenuHeight;
    background: rgb(238, 243, 246);
    bottom: 0;
    left: 0;
    z-index: 1;
    width: 180px;

    li {
      min-width: auto;
    }
    .change-collapse {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      padding: 5px;
    }
    &.el-menu--collapse {
      width: 64px;
    }
  }

  .position-nav {
    margin: 0;
    font-size: 16px;
    font-weight: normal;
    background: rgba(243, 243, 243, 1);
    padding: 5px 15px 5px 20px;
    line-height: 30px;
    border-bottom: 1px solid #eee;
    .position-nav-text {
      border-left: 5px solid #999;
      padding-left: 15px
    }
  }

</style>

<template>
  <div>
    <header class="main-header">
      <div>
        <div class="top-logo">
          <router-link to='/' class="a-link"><img :src="logo_pic" class="logo_pic" @click="activeId=''">
            <span class="logo-span">CERP 系统</span>
          </router-link>
        </div>
        <div class="top-right">
          <div class="top-user">
            <el-dropdown trigger="click">
              <div class="el-dropdown-link top-right-item">
                <img v-if="user.userIcon" :src="user.userIcon">
                <img v-else src="/static/img/userpic.png"> {{user.userName}}
                <i class="el-icon-caret-bottom"></i>
              </div>
              <el-dropdown-menu class="top-right-user-dropdown" slot="dropdown">
                <div class="menu-user">
                  <div class="menu-user-part">
                    <div>
                      <oms-upload-picture :photoUrl="user.userIcon" class="user-img"></oms-upload-picture>
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

    <el-menu default-active="$route.path" class="top-menu" :collapse="isCollapse" :router="true">
      <template v-for="item in menu">
        <el-submenu :index="item.path" :key="menu.path" v-if="item.children.length>0">
          <template slot="title">
            <a href="#" @click.stop.prevent="goTo(item)">
              <i :class="'iconfont icon-'+item.meta.icon"></i> <span
              slot="title">{{item.meta.title}}</span></a>
          </template>
          <el-menu-item :index="child.path" v-for="child in item.children" :key="child.path">
            &bull; {{child.meta.title}}
          </el-menu-item>
        </el-submenu>
        <el-menu-item :index="item.path" v-else>
          <i :class="'iconfont icon-'+item.meta.icon"></i>
          <span slot="title">{{item.meta.title}}</span>
        </el-menu-item>
      </template>
      <li class="change-collapse" @click="changeMenuCollapse"><i class="iconfont icon-affirm"></i></li>
    </el-menu>
    <h4 class="position-nav">
      <div class="container">
        <span class="position-nav-text">{{$route.meta.title}}</span>
      </div>
    </h4>
  </div>
</template>

<script>
  import {Auth} from '../../resources';
  import logo_pic from '../../assets/img/logo_pic.png';
  import omsUploadPicture from './upload.user.picture.vue';
  import route from '../../route.js';

  export default {
    components: {
      omsUploadPicture
    },
    props: ['toRoute'],
    data() {
      return {
        activeId: this.getGroupId(),
        logo_pic: logo_pic,
        isCollapse: false
      };
    },
    computed: {
      user: function () {
        return Object.assign({}, {userName: '', userAccount: '', userLastLoginTime: 0}, this.$store.state.user);
      },
      menu: function () {
        /*
        let menus = [];
        let menuShow = [];
        menus.forEach(item => {
          if (this.$store.state.permissions.indexOf(item.perm) !== -1) {
            menuShow.push(item);
          }
        });
        return menuShow;
        */
        let menuArr = route[0].children.filter(item => item.meta.moduleId && item.meta.perm === 'show');
        menuArr.forEach(item => {
            item.children = item.children.filter(child => child.meta.perm === 'show');
          }
        );
        return menuArr;

      },
      activePath: function () {
        return this.$route.path;
      }
    },
    watch: {
      toRoute: function () {
        this.activeId = this.getGroupId();
      },
      activeId: function () {
        this.getPaddingLeft();
      }
    },
    methods: {
      goTo: function (item) {
        this.$router.push({path: item.path});
      },
      getGroupId: function () {
        let activeMould = '';
        if (this.toRoute && this.toRoute.path !== undefined) {
          activeMould = this.toRoute.meta.topMould;
          if (!activeMould) {
            activeMould = this.toRoute.path.substr(1);
            let first = activeMould.indexOf('/');
            if (first !== -1) {
              activeMould = activeMould.substr(0, first);
            }
          }
        }
        return activeMould;
      },
      logout: function () {
        window.localStorage.setItem('lastUrl', window.location.href);
        Auth.logout().then(() => {
          window.localStorage.setItem('userId', this.$store.state.user.userId);
          window.localStorage.removeItem('user');
          return this.$router.replace('/login');
        });
      },
      checkSubMenu: function (item) {
        this.goTo(item);
      },
      getPaddingLeft: function () {
        /*
        let paddingLeft = '261px';// this.$store.bodySize.left;
        this.menu.forEach(item => {
          if (item.path === '/' + this.activeId && item.children.length === 0) {
            paddingLeft = '130px';
          }
        });
        this.$store.commit('setBodySize', {left: paddingLeft});
        */
      },
      changeMenuCollapse: function () {
        this.isCollapse = !this.isCollapse;
        this.$store.commit('changeBodyLeft', this.isCollapse);
      }
    },
    mounted: function () {
      this.getPaddingLeft();
    }
  };
</script>
