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

.app-content-view {
  padding-right: 15px;
}

.main-body__el-scrollbar {
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>
<template>
  <div :style="'padding-left:'+bodyLeft" class="app-body full-width">
    <app-header v-if="userType" :to-route="toRoute"></app-header>
    <div class="main-body">
      <el-scrollbar :style="{height: '100%'}" class="main-body__el-scrollbar">
        <transition appear mode="out-in" name="scale">
          <router-view class="app-content-view"></router-view>
        </transition>
      </el-scrollbar>
    </div>
    <!--<app-footer></app-footer>-->
    <attachmentDialog></attachmentDialog>
    <print-dialog></print-dialog>

    <div v-if="isPermission" class="cdc-shade">
      <!--<el-button class="btn" type="primary" @click="queryRoles">我是市疾控</el-button>-->
    </div>
  </div>

</template>

<script>
import AppHeader from './common/app.header.vue';
import AppFooter from './common/app.footer.vue';
import {BaseInfo, cerpAccess, cerpAction} from '../resources';
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
    needCheck: false,
    isPermission: false
  }),
  computed: {
    userType: function () {
      return this.$store.state.user['userType'];
    },
    bodyLeft: function () {
      return this.$store.state.bodySize['left'];
    },
    updatePassFlag() {
      return this.$store.state.user['updatePassFlag'];
    },
    days() {
      return this.$store.state.user['passwordRule'];
    },
    checkPwd: function () {
      return this.needCheck && this.updatePassFlag;
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
    },
    checkPwd(val) {
      if (val) {
        setTimeout(this.showTip, 200);
      }
    }
  },
  mounted: function () {
    utils.removeClass(document.getElementsByTagName('body')[0], 'overflow-hidden');
    let user = this.$store.state.user;
    this.queryWeChat();
    this.queryBaseInfo(user);
    window.addEventListener('resize', (e) => {
      this.setBodyHeight();
    });
    this.setBodyHeight();

    this.needCheck = true;
    // 监听后退和地址栏变化
    window.addEventListener('popstate', (e) => {
      // 当用户手动后退或者修改地址栏的时候，重新触法一次密码校验
      let hash = e.currentTarget.location.hash;
      // 定义那些页面不需要安全提示
      let ext = hash.indexOf('login') !== -1 || hash.indexOf('resetpsw') !== -1 || hash.indexOf('forget') !== -1;
      if (ext) {
        console.log("popstate.location.hash", hash);
        return;
      }

      this.needCheck = true;
    });
  },
  methods: {
    // 显示安全提示
    showTip() {
      // 当用户手动后退或者修改地址栏的时候，重新触法一次密码校验
      let path = this.$route.path;
      let ext = path.indexOf('login') !== -1 || path.indexOf('resetpsw') !== -1 || path.indexOf('forget') !== -1;
      if (ext) {
        // 以上几种情况都直接返回，不需要安全提示
        return;
      }


      // 如果需要修改密码，给出提示：您当前登录密码使用已超过xx天，为保证您的账号安全，请立即修改。
      this.$alert('您当前登录密码使用已超过' + this.days + '天，为保证您的账号安全，请立即修改。', '安全提示', {
        confirmButtonText: '去修改', center: true, showClose: false
      }).then(() => {
        this.$router.replace("/resetpsw")
      }).catch(err => {
        console.log("加载alert异常", err)
      });

      this.needCheck = false;
    },
    queryRoles() {
      cerpAccess.bindMunicipal().then(() => {
        this.loading = false;
        this.$emit('login');
      }).catch((error) => {
        this.loading = true;
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '绑定市疾控出错'
        });
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
        this.$store.commit('initOrg', res.data.orgDto);
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
