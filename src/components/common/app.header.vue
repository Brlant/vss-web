<style lang="scss" scoped=''>
@import "../../assets/mixins.scss";

.main-header {
  background: #607D8B;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: $topMenuHeight;
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
    line-height: $topMenuHeight;
    height: $topMenuHeight;
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
    color: $activeColor;
    font-size: 12px;
  }
}

.logo_pic {
  height: 40px;
  width: 40px;
  margin-right: 10px;
  margin-top: -8px;
}

.logo-span {
  font-size: 22px;
  font-weight: bold;
  color: #fff
}

.main-nav {
  position: absolute;
  top: $topMenuHeight;
  background: rgb(238, 243, 246);
  border-right: 1px solid #f1f1f1;
  bottom: 0;
  left: 0;
  z-index: 1;
  width: 200px;

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

  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
  }

  .main-nav-scrollbar {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 30px;
    left: 0;
  }

  .main-nav-scrollbar ::v-deep .el-scrollbar__wrap {
    overflow: hidden;
    overflow-y: auto;
  }

  .change-collapse {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    text-align: center;
    padding: 5px;
    cursor: pointer;
    background: rgba(238, 243, 246, 0.5);

    &:hover {
      background: #cbdce6;
    }
  }
}

.position-nav {
  margin: 0 0 8px;
  /*padding: 5px;*/
  /*border-bottom: 1px solid #eee;*/
  font-size: 16px;
  font-weight: normal;
  line-height: 30px;
  background: #eee;

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

.org-title {
  color: #ffffff;
  margin-right: 10px;
}

.wechat-info {
  font-size: 12px;

  .weChat-img {
    width: 20px;
    height: 20px;
    vertical-align: middle;
    float: left;
  }

  .wechat-nick {
    float: left;
    margin-left: 10px;
  }

  .btn-wechat {
    float: left;
  }

  margin-bottom: 5px;
}

a:focus {
  outline: none;
}
</style>

<style>

</style>
<template>
  <div>
    <header :style="'background:'+skin.background" class="main-header">
      <div>
        <div class="top-logo">
          <router-link class="a-link" to='/'><img :src="logo_pic" class="logo_pic" @click="activeId=''">
            <span :style="'color:'+skin.color" class="logo-span">{{ $store.state.sysTitle }}</span>
          </router-link>
        </div>
        <div class="top-right">
          <div class="top-user">
            <!--<el-dropdown trigger="click" @command="changeSkin">
              <div class="el-dropdown-link top-right-item">
                <i class="el-icon-setting"></i>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="skin in skinList" :key="skin.name" :command="skin">
                  <span class="skin-item" :style="'background:'+skin.background+';'"></span>
                  {{skin.name}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>-->
            <span>
              <span class="org-title">{{ orgName }}</span>
            </span>
            <el-dropdown trigger="click">
              <div class="el-dropdown-link top-right-item">
                <compressed-img v-if="user.userIcon" :src="user.userIcon+'?image&action=resize:w_50,h_50,m_2'"/>
                <img v-else src="/static/img/logo_user_default.png">{{ user.userName }}
                <i class="el-icon-caret-bottom"></i>
              </div>
              <el-dropdown-menu slot="dropdown" class="top-right-user-dropdown">
                <div class="menu-user">
                  <div class="menu-user-part">
                    <div>
                      <oms-upload-picture :photoUrl="user.userIcon" class="user-img"></oms-upload-picture>
                    </div>
                    <div>
                      <div class="menu-usr-part-user">{{ user.userName }}</div>
                      <div class="menu-usr-part-phone">{{ user.userAccount }}</div>
                    </div>
                  </div>
                  <div class="last-login">上次登录时间:{{ user.userLastLoginTime | time }}</div>
                  <div v-if="weChatInfo.nickname" class="wechat-info">
                    <img v-if="weChatInfo.avatarUrl" :src="weChatInfo.avatarUrl" class="weChat-img">
                    <img v-else class="weChat-img" src="/static/img/logo_user_default.png"/>
                    <span v-if="weChatInfo.nickname"
                          class="wechat-nick">微信：{{
                        weChatInfo.nickname ? weChatInfo.nickname.substr(0, 3) : ''
                      }}<span v-if="weChatInfo.nickname && weChatInfo.nickname.length > 3">...</span></span>
                    <a v-if="weChatInfo.nickname" class="btn-wechat" href="#" @click.stop.prevent="unbind">(解绑)</a>
                  </div>
                  <div class="text-right clearfix">
                    <router-link style="float: left; margin-top: 2px" to="/resetpsw">重置密码</router-link>
                    <a href="#" @click.stop.prevent="logout">退出</a>
                  </div>
                </div>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </header>
    <div :style="'width:'+menuWidth" class="main-nav">
      <el-scrollbar
        v-show="menu.length > 0"
        ref="scrollbar"
        class="main-nav-scrollbar"
        tag="div">
        <el-menu :collapse="isCollapse" :default-active="$route.path" :default-openeds="defaultOpenMenus" :router="true"
                 :unique-opened="false" style="margin-bottom: 27px">
          <template v-for="item in menu">
            <el-submenu v-if="item.children.length>0" :index="item.path">
              <template slot="title">
                <i :class="'el-icon-t-'+item.meta.icon"></i>
                <span slot="title">{{ item.meta.title }}</span>
              </template>
              <el-menu-item v-for="child in item.children" :key="child.path" :index="child.path">
                {{ child.meta.title }}
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-else-if="item.path" :index="item.path">
              <i :class="'el-icon-t-'+item.meta.icon"></i>
              <span slot="title">{{ item.meta.title }}</span>
            </el-menu-item>
            <el-menu-item v-else :index="item.path" @click="$router.push('/')">
              <i :class="'el-icon-t-'+item.meta.icon"></i>
              <span slot="title">{{ item.meta.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-scrollbar>
      <div class="change-collapse" @click="changeMenuCollapse">
        <f-a :name="isCollapse?'spread':'collapse'"></f-a>
      </div>
    </div>
    <h4 class="position-nav">
      <div class="container">
        <!--<span class="position-nav-text">{{$route.meta.title}}</span>-->
        <cus-tabs/>
      </div>
    </h4>
  </div>
</template>

<script>
import {Auth, cerpAction} from '../../resources';
import logo_pic from '../../assets/img/epi-logo-header.png';
import omsUploadPicture from './upload.user.picture.vue';
import CusTabs from '@/components/common/cus-tabs/tabs.vue';

export default {
  components: {
    omsUploadPicture, CusTabs
  },
  props: ['toRoute'],
  data() {
    return {
      activeId: this.getGroupId(),
      logo_pic: logo_pic,
      isCollapse: false,
      skinList: [
        {color: '#fff', background: '#409EFF', name: '天空灰'},
        {color: '#333', background: '#fff', name: '透明白'},
        {color: '#fff', background: '#9c27b0', name: '贵族紫'},
        {color: '#fff', background: '#3f51b5', name: '工业蓝'},
        {color: '#fff', background: '#ff5722', name: '活跃橙'}
      ],
      skin: {},
      defaultOpenMenus: []
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
      let menu = this.$parent.$parent.menuData;
      menu.forEach(i => {
        i.children.forEach(i => {
          i.path = i.path.replace(/:id/, 'list');
        });
      });
      return menu;
    },
    activePath: function () {
      return this.$route.path;
    },
    orgName() {
      return this.$store.state.org && this.$store.state.org.name;
    },
    weChatInfo() {
      return this.$store.state.weChatInfo;
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
        location.reload();
        // window.localStorage.setItem('userId', this.$store.state.user.userId);
        // //          window.localStorage.removeItem('user');
        // return this.$router.replace('/login');
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
    },
    unbind() {
      this.$confirm('是否解除绑定的微信？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cerpAction.unBindWeChat().then(() => {
          this.$notify.success({
            message: '解绑微信成功'
          });
          this.$store.commit('initWeChatInfo', {});
          window.localStorage.removeItem('weChatInfo');
        }).catch(error => {
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || '解绑微信失败'
          });
        });
      });
    }
  },
  mounted: function () {
    this.skin = this.skinList[0];
    // let skin = window.localStorage.getItem('skin');
    let isCollapse = window.localStorage.getItem('collapse');
    if (isCollapse) {
      isCollapse = parseInt(isCollapse, 10);
    }
    this.isCollapse = !!isCollapse;
    this.$store.commit('changeBodyLeft', this.isCollapse);
    /*
     if (skin) {
     this.skin = JSON.parse(skin);
     } else {
     this.skin = this.skinList[0];
     }
     */
    let defaultOpenMenus = [];
    this.$route.matched.forEach(item => {
      if (item.path) {
        defaultOpenMenus.push(item.path);
      }
    });
    this.defaultOpenMenus = defaultOpenMenus;

  }
};
</script>
