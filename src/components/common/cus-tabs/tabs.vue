<template>
  <div class="tn-tab-list">
    <el-tabs v-model="active" :closable="list.length > 1" type="card" @tab-remove="deleteItem" @tab-click="showItem">
      <el-tab-pane
        v-for="item in list" :key="item.path" :label="item.meta.title" :name="item.path">
      </el-tab-pane>
    </el-tabs>
    <el-dropdown @command="handleTab">
        <span class="el-dropdown-link">
          <i class="el-icon-more"></i>
        </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="0">关闭当前标签页</el-dropdown-item>
        <el-dropdown-item command="1">关闭其他标签页</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: '',
      list: []
    };
  },
  watch: {
    $route: {
      handler(val) {
        if (!val.meta || !val.meta.title) return;
        let index = this.list.findIndex(f => f.meta.perm === val.meta.perm);
        if (index === -1) {
          this.list.push(val);
          this.$nextTick(() => {
            this.active = val.path;
          });
          return;
        }
        // 覆盖旧的路由信息
        this.list.splice(index, 1, val);
        this.active = this.list[index].path;
      },
      immediate: true
    }
  },
  methods: {
    deleteItem(item) {
      this.list = this.list.filter(f => f.path !== item);
      let newItem = this.list[this.list.length - 1];
      let {path, query} = newItem;
      this.$router.push({path, query});
    },
    showItem(vm) {
      let item = this.list.find(f => f.path === vm.name);
      let {path, query} = item;
      this.$router.push({path, query});
    },
    handleTab(item) {
      if (item === '0') {
        if (this.list.length === 1) return;
        this.deleteItem(this.active);
      } else {
        this.list = this.list.filter(f => f.path === this.active);
      }
    }
  }
};
</script>
