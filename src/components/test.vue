<style lang="less" scoped="">
  .gpy-dialog .el-dialog__body {
    padding: 5px;
  }
</style>
<template>
  <div>
    <el-button @click.stop="dialogVisible=true"> 打开高拍仪</el-button>

    <el-dialog
      title="高拍仪"
      :visible.sync="dialogVisible"
      top="5%" class="gpy-dialog">
      <gpy @close="closeDialog"></gpy>

    </el-dialog>
  </div>
</template>

<script>
  import gpy from './common/gpy.vue';

  export default {
    components: {
      gpy
    },
    data: function () {
      return {
        dialogVisible: false
      };
    },
    computed: {
      dictA() {
        return 'ajian';
      }
    },
    methods: {
      handleClose: function (e) {
        console.log(e);

      },
      closeDialog: function () {
        this.dialogVisible = false;
      }
    }
  };
</script>
