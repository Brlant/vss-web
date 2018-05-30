<style lang="scss">

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
    z-index: 1100;
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
  <div class="app-body full-width" :style="'padding-left:'+bodyLeft">
    <app-header :to-route="toRoute" v-if="userType" :level="level"></app-header>
    <div class="main-body">
      <transition name="scale" mode="out-in" appear>
        <router-view class="app-content-view"></router-view>
      </transition>
    </div>
    <!--<app-footer></app-footer>-->
    <attachmentDialog></attachmentDialog>
    <print-dialog></print-dialog>

    <div class="cdc-shade" v-if="isPermission">
      <!--<el-button class="btn" type="primary" @click="queryRoles">我是市疾控</el-button>-->
    </div>
  </div>

</template>

<script>
  import AppHeader from './common/app.header.vue';
  import AppFooter from './common/app.footer.vue';
  import {Auth, DictGroup, cerpAccess, cerpAction, Access, BaseInfo} from '../resources';
  import utils from '../tools/utils';
  import attachmentDialog from './common/attachment.dialog.vue';
  import printDialog from './common/print.loading.vue';

  export default {
    components: {
      AppHeader,
      AppFooter,
      attachmentDialog,
      printDialog
    },
    data: () => ({
      transitionName: 'slide-left',
      toRoute: {},
      loading: true,
      isPermission: false,
      level: ''
    }),
    computed: {
      userType: function () {
        return this.$store.state.user['userType'];
      },
      bodyLeft: function () {
        return this.$store.state.bodySize['left'];
      }
    },
    beforeRouteEnter(to, form, next) {
      next(vm => {
        vm.toRoute = to;
      });
    },
    beforeRouteUpdate(to, from, next) {
      utils.removeClass(document.getElementsByTagName('body')[0], 'overflow-hidden');
      this.toRoute = to;
      next();
    },
    watch: {
      $route() {
        this.$store.commit('initBottomLoading', false);
      }
    },
    mounted: function () {
      utils.removeClass(document.getElementsByTagName('body')[0], 'overflow-hidden');
      let user = this.$store.state.user;
      this.queryWeChat();
      this.queryBaseInfo(user);
      this.queryLevel();
      window.addEventListener('resize', (e) => {
        this.setBodyHeight();
      });
      this.setBodyHeight();
    },
    methods: {
      queryRoles() {
        cerpAccess.bindMunicipal().then(() => {
          this.loading = false;
          this.queryLevel();
          this.$emit('login');
        }).catch((error) => {
          this.loading = true;
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '绑定市疾控出错'
          });
        });
      },
      queryLevel() {
        cerpAction.queryLevel().then(res => {
          this.level = res.data;
          window.localStorage.setItem('logLevel', res.data);
          this.$store.commit('initOrgLevel', res.data);
          this.isPermission = res.data === 0;
        });
      },
      queryWeChat() {
        cerpAction.queryWeChatInfo().then(res => {
          this.$store.commit('initWeChatInfo', res.data);
        }).catch(() => {
          this.$store.commit('initWeChatInfo', {});
        });
      },
      queryBaseInfo(data) {
        BaseInfo.queryBaseInfo(data.userCompanyAddress).then(res => {
          this.$store.commit('initOrgName', res.data.orgDto.name);
          window.localStorage.setItem('logisticsCentreId', res.data.orgDto.defaultCentreId || '');
        });
      },
      setBodyHeight: function () {
        this.$store.commit('setBodyHeight', {
          height: window.innerHeight - 200 + 'px',
          window: {width: window.innerWidth, height: window.innerHeight}
        });
      }
    }
  };
</script>
