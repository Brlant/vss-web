<style lang="less">
  @import "../../static/css/oms.css";
  @import "../assets/mixins.less";
  @import "../assets/oms.less";

  .d-table {
    min-height: 500px;
  }

  .layer-loading {
    text-align: center;
    background: #f9f9f9;
    padding-top: 15rem;
    position: fixed;
    top: 50px;
    left: 0;
    right: 0;
    z-index: 1000;
    bottom: 0
  }

  .layer-loading > i {
    -webkit-animation: bouncedelay 1.4s infinite ease-in-out;
    animation: bouncedelay 1.4s infinite ease-in-out;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    background-color: #A6A6A6;
    display: inline-block;
    border-radius: 100%;
    margin: 0 2px;
    height: 18px;
    width: 18px
  }

  .layer-loading > i:nth-child(2) {
    -webkit-animation-delay: .2s;
    animation-delay: .2s
  }

  .layer-loading > i:nth-child(3) {
    -webkit-animation-delay: .4s;
    animation-delay: .4s
  }

  .btn-left-list-more {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 5;
    background: rgba(255, 255, 255, 0.9);
    text-align: center;
    .el-button {
      border: none;
      color: #666;
      background: 0 0;
      padding-left: 0;
      padding-right: 0;
      &:hover {
        color: #333
      }
    }
  }

  .min-div {
    height: 0;
    width: 0;
    display: inline;
    overflow: hidden;
    line-height: 0;
  }

  .app-body-org {
    padding-top: 0;
    .layer-loading {
      top: 0
    }
  }

  .cdc-shade {
    position: fixed;
    z-index: 900;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;

  }
</style>
<template>
  <div class="app-body" :style="'padding-left:'+bodyLeft">
    <app-header :to-route="toRoute"></app-header>
    <div class="main-body" style="padding:0 8px;">
      <div class="layer-loading" v-show="loading"><i></i><i></i><i></i></div>
      <transition name="scale" mode="out-in" appear>
        <router-view class="app-content-view"></router-view>
      </transition>
    </div>
    <!--<app-footer></app-footer>-->
    <attachmentDialog></attachmentDialog>
    <a href="#" target="_blank" class="min-div"><span id="fileDownLoadRap"></span></a>

    <div class="cdc-shade" v-if="isPermission">
      <el-button class="btn" type="primary" @click="queryRoles">我是市级CDC</el-button>
    </div>
  </div>

</template>

<script>
  import AppHeader from './common/app.header.vue';
  import AppFooter from './common/app.footer.vue';
  import { Auth, DictGroup, cerpAccess, cerpAction, Access, BaseInfo } from '../resources';
  import utils from '../tools/utils';
  import attachmentDialog from './common/attachment.dialog.vue';

  export default {
    components: {
      AppHeader,
      AppFooter,
      attachmentDialog
    },
    data: () => ({
      transitionName: 'slide-left',
      toRoute: {},
      loading: true,
      isPermission: true
    }),
    computed: {
      userType: function () {
        return this.$store.state.user['userType'];
      },
      bodyLeft: function () {
        return this.$store.state.bodySize['left'];
      }
    },
    beforeRouteEnter (to, form, next) {
      next(vm => {
        vm.toRoute = to;
      });
    },
    beforeRouteUpdate (to, from, next) {
      utils.removeClass(document.getElementsByTagName('body')[0], 'overflow-hidden');
      this.toRoute = to;
      next();
    },
    mounted: function () {
      window.localStorage.removeItem('noticeError');
      if (!this.$store.state.user || !this.$store.state.user.userId) {
        Auth.checkLogin().then(() => {
          let data = window.localStorage.getItem('user');
          if (!data) {
            Auth.logout().then(() => {
              this.$router.replace('/login');
            });
          }
          data = JSON.parse(data);
          this.$store.commit('initUser', data);
          this.queryBaseInfo(data);
          this.getRoleMenus(data);
        }).catch(() => {
          Auth.logout().then(() => {
            this.$router.replace('/login');
          });
        });
      } else {
        let data = window.localStorage.getItem('user');
        data = JSON.parse(data);
        this.getRoleMenus(data);
      }
      this.queryPerms();
      this.queryLevel();
    },
    methods: {
      queryRoles () {
        cerpAccess.bindMunicipal().then(() => {
          this.loading = false;
          this.queryPerms();
          this.queryLevel();
        }).catch((error) => {
          this.loading = true;
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '绑定市级CDC出错'
          });
        });
      },
      queryLevel () {
        cerpAction.queryLevel().then(res => {
          window.localStorage.setItem('logLevel', res.data);
          this.isPermission = res.data === 0;
        });
      },
      queryPerms () {
        Auth.permission().then(res => {
          this.$store.commit('initPermissions', res.data);
        }).then(() => {
          DictGroup.getAll().then(data => {
            this.$store.commit('initDict', data);
            setTimeout(() => {
              utils.removeClass(document.getElementsByTagName('body')[0], 'overflow-hidden');
              this.loading = false;
            }, 1000);
          });
        });
      },
      getRoleMenus (data) {
        Access.getRoleMenus(data.userCompanyAddress).then(res => {
          let menuData = res.data;
          let menuList = {};
          res.data.menuList.forEach(item => {
            menuList[item.id] = item.name;
          });
          menuData.menuList = menuList;
          this.$store.commit('initPermList', menuData);
        });
      },
      queryBaseInfo (data) {
        BaseInfo.queryBaseInfo(data.userCompanyAddress).then(res => {
          window.localStorage.setItem('logisticsCentreId', res.data.orgDto.defaultCentreId || '');
        });
      }
    }
  };
</script>
