<style lang="scss" scoped>
  $leftWidth: 0;
  .content-part {
    .content-left {
      width: $leftWidth;
      text-align: center;
    }

    .content-right {
      > h3 {
        left: $leftWidth;
      }

      left: $leftWidth;
    }
  }

  .el-row {
    margin-bottom: 10px;
    font-size: 16px;
  }
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-right content-padding">
        <h3>接种任务详情</h3>
        <oms-row label="接种者登记编号" :span="span">2324243</oms-row>
        <oms-row label="姓名" :span="span">测试</oms-row>
        <oms-row label="疫苗名称" :span="span"></oms-row>
        <oms-row label="规格" :span="span"></oms-row>
        <oms-row label="批号" :span="span"></oms-row>
        <oms-row label="接种部位" :span="span"></oms-row>
        <oms-row label="接种途经" :span="span"></oms-row>
        <oms-row label="任务创建时间" :span="span"></oms-row>
        <oms-row label="登记完成时间" :span="span"></oms-row>
        <oms-row label="状态" :span="span"></oms-row>
      </div>
    </div>
  </div>
</template>
<script>
  import {inoculateTask} from '@/resources';

  export default {
    props: {
      id: String,
      defaultIndex: Number
    },
    data() {
      return {
        span: 6,
        detail: {}
      };
    },
    watch: {
      defaultIndex(val) {
        if (val !== 3) return;
        this.queryOrderDetail();
      }
    },
    methods: {
      queryOrderDetail() {
        if (!this.id) return false;
        this.detail = {};
        inoculateTask.queryOrderDetail(this.id).then(res => {
          this.detail = res.data;
        });
      }
    }
  };
</script>
