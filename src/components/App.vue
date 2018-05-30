<style lang="scss">
  #app {
    height: 100%;
  }

  @-webkit-keyframes bouncedelay {
    0%, 80%, 100% {
      -webkit-transform: scale(0)
    }
    40% {
      -webkit-transform: scale(1)
    }
  }

  @keyframes bouncedelay {
    0%, 80%, 100% {
      transform: scale(0)
    }
    40% {
      transform: scale(1)
    }
  }

  .layer-loading {
    text-align: center;
    background: #f9f9f9;
    padding-top: 15rem;
    position: absolute;
    top: 65px;
    width: 100%;
    z-index: 2000;
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
</style>
<template>
  <div id="app">
    <div class="layer-loading" v-show="loading"><i></i><i></i><i></i></div>
    <router-view @login="queryPermissions"></router-view>
  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import { Auth } from '@/resources';
  import {route} from '@/route';
  import {deepCopy} from '@/tools/utils';
  export default {
    data: () => ({
      loading: false,
      menuData: [],
      routesCopy: []
    }),
    methods: {
      getCurrentMenu (data) {
        let menu = [];
        menu = this.routesCopy[0].children.filter(f => f.meta.moduleId && (f.meta.perm === 'show' || data.includes(f.meta.perm)));
        menu.forEach(i => {
          i.children = i.children.filter(c => c.meta.perm === 'show' || data.includes(c.meta.perm));
        });
        return menu;
      },
      queryPermissions (url) {
        this.routesCopy = deepCopy(route);
        this.loading = true;
        Auth.permission().then(res => {
          // 设置全局鉴权方法
          this.menuData = this.getCurrentMenu(res.data);
          this.routesCopy[0].children = this.menuData;
          // 动态添加路由
          this.$router.addRoutes(this.routesCopy);
          this.$store.commit('initPermissions', res.data);
          // 添加路由后，跳转相应地址
          this.$nextTick(this.$router.push(url ? url : '/'));
          this.loading = false;
        }).then(() => {
          utils.removeClass(document.getElementsByTagName('body')[0], 'overflow-hidden');
          this.loading = false;
        });
      }
    },
    mounted: function () {
      this.routesCopy = deepCopy(route);
      window.localStorage.removeItem('noticeError');
      if (!this.$store.state.user || !this.$store.state.user.userId) {
        Auth.checkLogin().then(() => {
          this.queryPermissions(this.$route.path);
          let data = window.localStorage.getItem('user');
          if (!data) {
            Auth.logout().then(() => {
              this.$router.replace('/login');
            });
          }
          data = JSON.parse(data);
          this.$store.commit('initUser', data);
        }).catch(() => {
          Auth.logout().then(() => {
            this.$router.replace('/login');
          });
        });
      }
    }
  };
</script>
