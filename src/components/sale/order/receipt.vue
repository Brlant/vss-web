<style lang="less" scoped>
  @leftWidth: 200px;
  .content-part {
    .content-left {
      width: @leftWidth;
    }
    .content-right {
      > h3 {
        left: @leftWidth;
      }
      left: @leftWidth;
    }
  }

  .btn-submit-save {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    z-index: 1;
    text-align: center;
    padding: 15px;
  }
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">添加收货信息</h2>
        <div class="btn-submit-save">
          <el-button type="primary" @click="close">保存</el-button>
        </div>
      </div>
      <div class="content-right content-padding">
        <h3></h3>
        添加收货信息
      </div>
    </div>
  </div>
</template>
<script>
  export default {

    props: {
      currentItem: Object
    },
    data () {
      return {
        currentOrder: {},
        index: 0,
        pageSets: [
          {name: '收货信息', key: 0}
        ]
      };
    },
    methods: {
      close () {
        this.$emit('close');
      }
    }
  };
</script>

