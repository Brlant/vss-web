<template>
  <div class="sub-body">
    <div class="sub-menu">
      <div class="container">
        <perm v-for="item in subMenu" :label="item.perm" :key="item.title">
          <a :href="item.path" @click.stop.prevent="go(item)" class="btn btn-sub-menu"
             :class="{'active':item.path==activePath}">{{item.title}}</a>
        </perm>
      </div>
    </div>
    <transition name="scale" mode="out-in" appear>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    data: () => ({
      activePath: '/'
    }),
    computed: {
      subMenu: function () {
        let menus = [
          {'path': '/notice', 'title': '公告管理', 'perm': 'show'}
        ];
        let menuShow = [];
        menus.forEach(item => {
          if (this.$store.state.permissions.indexOf(item.perm) !== -1) {
            menuShow.push(item);
          }
        });
        return menuShow;
      }
    },
    beforeRouteEnter(to, form, next) {
      next(vm => {
        vm.activePath = to.path;
        if (!vm.subMenu.length) return false;
        if (to.path === '/information') {
          vm.go(vm.subMenu[0]);
          return false;
        }
      });
    },
    beforeRouteUpdate(to, from, next) {
      if (to.path === '/information') {
        this.go(this.subMenu[0]);
        return false;
      }
      this.activePath = to.path;
      next();
    },
    methods: {
      go: function (item) {
        if (!item) return false;
        this.$router.push({path: item.path});
      }
    },
    mounted: function () {
    }
  };
</script>
