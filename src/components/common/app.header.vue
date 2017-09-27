<style lang="less" scoped=''>
  @import "../../assets/mixins.less";

  .main-header {
    background: #607D8B;
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
    color: #fff
  }

  .main-nav {
    position: fixed;
    top: @topMenuHeight;
    background: rgb(238, 243, 246);
    border-right: 1px solid #f1f1f1;
    bottom: 0;
    left: 0;
    z-index: 1;
    width: 180px;
    .menu-wrap {
      max-height: 100%;
      > .el-menu > li {

      }
    }
    .el-menu {
      li {
        min-width: 40px;
      }
    }
    .change-collapse {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      text-align: center;
      padding: 5px;
      cursor: pointer;
      background: rgb(238, 243, 246, 0.5);
      &:hover {
        background: #cbdce6;
      }
    }
  }

  .position-nav {
    margin: 0 0 8px;
    padding: 5px 15px 5px 20px;
    border-bottom: 1px solid #eee;
    font-size: 16px;
    font-weight: normal;
    line-height: 30px;
    background: rgba(243, 243, 243, 1);
    .position-nav-text {
      position: relative;
      left: -20px;
      padding-left: 13px;
      border-left: 4px solid #999;
    }
  }

  .skin-item {
    position: relative;
    top: 4px;
    width: 15px;
    height: 15px;
    display: inline-block;
    border: 1px solid #eee;
    margin-right: 5px;
  }

  .el-submenu .el-menu-item {
    line-height: 35px;
    height: 35px;
    font-size: 13px;
  }

</style>

<style>
  .el-menu-item, .el-submenu__title {
    height: 46px;
    line-height: 46px;
  }
</style>
<template>
  <div>
    <header class="main-header" :style="'background:'+skin.background">
      <div>
        <div class="top-logo">
          <router-link to='/' class="a-link">
            <span class="logo-span" :style="'color:'+skin.color">CERP 系统</span>
          </router-link>
        </div>
        <div class="top-right">
          <div class="top-user">
            <el-dropdown trigger="click" @command="changeSkin">
              <div class="el-dropdown-link top-right-item">
                <i class="el-icon-setting"></i>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="skin in skinList" :key="skin.name" :command="skin">
                  <span class="skin-item" :style="'background:'+skin.background+';'"></span>
                  {{skin.name}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown trigger="click">
              <div class="el-dropdown-link top-right-item">
                <img v-if="user.userIcon" :src="user.userIcon">
                <img v-else src="/static/img/logo_user_default.png"> {{user.userName}}
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
    <div class="main-nav" :style="'width:'+menuWidth">
      <div class="menu-wrap" :style="isCollapse?'':'overflow-y:auto;'">
        <el-menu :default-active="$route.path" :collapse="isCollapse" :router="true" :unique-opened="true">
          <template v-for="item in menu">
            <el-submenu :index="item.path" :key="menu.path" v-if="item.subMenu.length>0">
              <template slot="title">
                <i :class="'iconfont icon-'+item.meta.icon"></i> <span
                slot="title">{{item.meta.title}}</span>
              </template>
              <el-menu-item :index="child.path" v-for="child in item.subMenu" :key="child.path">
                {{child.meta.title}}
              </el-menu-item>
            </el-submenu>
            <el-menu-item :index="item.path" v-else>
              <i :class="'iconfont icon-'+item.meta.icon"></i>
              <span slot="title">{{item.meta.title}}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
      <div class="change-collapse" @click="changeMenuCollapse">
        <i class="iconfont" :class="{'icon-collapse':!isCollapse,'icon-spread':isCollapse}"></i>
      </div>
    </div>
    <h4 class="position-nav">
      <div class="container">
        <span class="position-nav-text">{{$route.meta.title}}</span>
      </div>
    </h4>
  </div>
</template>

<script>
  import { Auth } from '../../resources';
  import logo_pic from '../../assets/img/logo_pic.png';
  import omsUploadPicture from './upload.user.picture.vue';
  import route from '../../route.js';

  export default {
    components: {
      omsUploadPicture
    },
    props: ['toRoute'],
    data () {
      return {
        activeId: this.getGroupId(),
        logo_pic: logo_pic,
        isCollapse: false,
        skinList: [
          {color: '#fff', background: '#607D8B', name: '天空灰'},
          {color: '#333', background: '#fff', name: '透明白'},
          {color: '#fff', background: '#9c27b0', name: '贵族紫'},
          {color: '#fff', background: '#3f51b5', name: '工业蓝'},
          {color: '#fff', background: '#ff5722', name: '活跃橙'}
        ],
        skin: {}
      };
    },
    computed: {
      menuWidth: function () {
        return this.$store.state.bodySize.left;
      },
      user: function () {
        return Object.assign({}, {userName: '', userAccount: '', userLastLoginTime: 0}, this.$store.state.user);
      },
      menu: function () {
        let menuArr = route[0].children.filter(item => item.meta.moduleId && (item.meta.perm === 'show' ||
          this.$store.state.permissions.includes(item.meta.perm)));
        menuArr.forEach(item => {
          item.subMenu = item.children.filter(child => this.$store.state.permissions.includes(child.meta.perm));
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
      changeMenuCollapse: function () {
        this.isCollapse = !this.isCollapse;
        this.$store.commit('changeBodyLeft', this.isCollapse);
        window.localStorage.setItem('collapse', this.isCollapse ? 1 : 0);
      },
      changeSkin: function (skin) {
        this.skin = skin;
        window.localStorage.setItem('skin', JSON.stringify(skin));
      }
    },
    mounted: function () {
      let skin = window.localStorage.getItem('skin');
      let isCollapse = window.localStorage.getItem('collapse');
      if (isCollapse) {
        isCollapse = parseInt(isCollapse, 10);
      }
      this.isCollapse = !!isCollapse;
      this.$store.commit('changeBodyLeft', this.isCollapse);
      if (skin) {
        this.skin = JSON.parse(skin);
      } else {
        this.skin = this.skinList[0];
      }

    }
  };
</script>
