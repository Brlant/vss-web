<style lang="scss" scoped>
  $leftWidth: 180px;
  .content-part {
    .content-left {
      width: $leftWidth;
    }
    .content-right {
      > h3 {
        left: $leftWidth;
      }
      left: $leftWidth;
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
        <h2 class="clearfix right-title">要货单位需求单</h2>
        <div class="btn-submit-save">
          <el-button @click="close">关闭</el-button>
        </div>
      </div>
      <div class="content-right content-padding">
        <basic-info :currentItem="currentItem" :index="index"></basic-info>
      </div>
    </div>
  </div>
</template>
<script>
  import basicInfo from './base-info.vue';

  export default {
    components: {
      basicInfo
    },
    props: {
      currentItem: Object
    },
    data() {
      return {
        currentOrder: {},
        index: 0,
        pageSets: [
          {name: '需求单详情', key: 0}
        ],
        title: '需求单详情'
      };
    },
    methods: {
      close() {
        this.$emit('close');
      }
    }
  };
</script>

