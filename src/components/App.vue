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
  top: 0;
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
    <div v-show="loading" class="layer-loading"><i></i><i></i><i></i></div>
    <router-view @login="queryPermissions"></router-view>
  </div>
</template>
<script>
import utils, {deepCopy} from '@/tools/utils';
import {Auth} from '@/resources';
import {basicRoutes, ErrorPage, route} from '@/route';

export default {
  data: () => ({
    loading: false,
    menuData: [],
    routesCopy: []
  }),
  methods: {
    getCurrentMenu(data) {
      let menu = [];
      menu = this.routesCopy[0].children.filter(f => f.meta.moduleId && (f.meta.perm === 'show' || data.includes(f.meta.perm)));
      menu.forEach(i => {
        i.children = i.children.filter(c => c.meta.perm === 'show' || data.includes(c.meta.perm));
      });
      return menu;
    },
    queryPermissions(url) {
      this.routesCopy = deepCopy(route);
      this.loading = true;
      Auth.permission().then(res => {
        // 设置全局鉴权方法
        this.menuData = this.getCurrentMenu(res.data);
        this.routesCopy[0].children = this.menuData;
        // 动态添加路由
        this.$router.addRoutes(this.routesCopy);
        this.$router.addRoutes(ErrorPage);
        this.$store.commit('initPermissions', res.data);
        // 添加路由后，跳转相应地址
        this.$nextTick(() => {
          this.$router.push(this.getCurrentUrl(url), () => {
            this.loading = false;
          }, () => {
            this.loading = false;
          });
        });
      }).catch(() => {
        utils.removeClass(document.getElementsByTagName('body')[0], 'overflow-hidden');
        this.loading = false;
      });
    },
    getCurrentUrl(url) {
      if (!url) return '/';
      if (typeof url === 'string') return url;
      return {path: url.path, query: url.query};
    }
  },
  mounted: function () {
    this.$http.get('/vss/querySystemTitle')
      .then(res => {
        let title = res.data || '疫苗供应链管理系统';
        document.title = title;
        this.$store.commit('initSysTitle', title);
      })
      .catch(err => {
        //
      });
    // 不鉴权的路径, 直接显示返回路径对应的页面
    let path = window.location.hash.slice(1);
    let valid = basicRoutes.some(i => path === i.path || /code\/(\w+)?$/.test(path));
    if (valid) {
      this.$router.addRoutes(ErrorPage);
      return;
    }
    this.routesCopy = deepCopy(route);
    window.localStorage.removeItem('noticeError');
    if (!this.$store.state.user || !this.$store.state.user.userId) {
      this.loading = true;
      Auth.checkLogin().then((res) => {
        this.queryPermissions(this.$route);
        window.localStorage.setItem('user', JSON.stringify(res.data));
        this.$store.commit('initUser', res.data);
      }).catch(() => {
        this.loading = false;
        this.$router.addRoutes(ErrorPage);
        this.$router.replace('/login');
        Auth.logout();
      });
    }
  }
};
</script>
