<style lang="less" scoped>

  .el-form .el-select {
    display: block;
  }

  .d-table-right {
    .org-name-h2 {
      font-size: 16px;
      font-weight: bold;
    }
  }

  .d-table-col-wrap {
    overflow: auto;
  }

  .pov-info {
    margin-bottom: 20px;
    .font-bold {
      font-size: 14px;
    }
  }

  .search-input {
    .el-select {
      display: block;
      position: relative;
    }
    .el-date-editor.el-input {
      width: 100%;
    }
  }

  .oms-row {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .content-body {
    margin: 20px 0;
  }
</style>
<template>
  <div class="d-table-col-wrap">
    <div class="content-body clearfix">
      <el-row v-if="loading">
        <el-col :span="24">
          <oms-loading :loading="loading"></oms-loading>
        </el-col>
      </el-row>
      <el-row v-else="">
        <el-col :span="8">
          <oms-row label="要货申请编号">
            {{currentOrder.id }}
          </oms-row>
          <oms-row label="申请时间">
            {{currentOrder.applyTime | time}}
          </oms-row>
          <oms-row label="到货需求日期">
            {{currentOrder.demandTime | date }}
          </oms-row>
          <oms-row label="接种点仓库">
            {{currentOrder.warehouseAddress}}
          </oms-row>
        </el-col>
        <el-col :span="16">
          <oms-row label="申请人">
            {{currentOrder.applyManName}}
          </oms-row>
          <oms-row label="审批人">
            {{currentOrder.auditManName}}
          </oms-row>
          <oms-row label="审批时间">
            {{currentOrder.auditTime | time}}
          </oms-row>
          <oms-row label="关联疾控销售订单">
            {{currentOrder.orderNo}}
          </oms-row>
        </el-col>
      </el-row>
    </div>
    <span style="font-size: 14px">【要货明细】</span>
    <table class="table table-hover" style="margin-top: 10px">
      <thead>
      <tr>
        <th>货品名称</th>
        <th>规格</th>
        <th>单价</th>
        <th>申请数量</th>
        <th>申请金额</th>
        <th>分配数量</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="row in currentOrder.detailDtoList">

        <td>
          {{row.goodsName}}
        </td>
        <td>
          <span>{{ row.specification }}</span>
        </td>
        <td>
          <span v-if="row.price">￥{{row.price | formatMoney}}</span>
          <span v-if="!row.price">-</span>
        </td>
        <td>
          {{row.applyCount}}
        </td>
        <td>
          <span v-if="row.applyMoney">￥{{row.applyMoney | formatMoney}}</span>
          <span v-if="!row.applyMoney">-</span>
        </td>
        <td>
          {{row.actualCount}}
        </td>
      </tr>
      <tr>
        <th style="width: 300px"></th>
        <th></th>
        <th></th>
        <th>
          <total-count property="applyCount" :list="currentOrder.detailDtoList"></total-count>
        </th>
        <th>
          <total-count property="applyMoney" :showIcon="true" title="合计金额"
                       :list="currentOrder.detailDtoList"></total-count>
        </th>
        <th></th>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
  import { pullSignal } from '@/resources';

  export default {
    props: {
      currentItem: Object
    },
    data: function () {
      return {
        loading: false,
        currentOrder: {}
      };
    },
    watch: {
      currentItem () {
        this.getDetail();
      }
    },
    methods: {
      getDetail: function () {
        this.currentOrder = {};
        if (!this.currentItem.id) return;
        this.loading = true;
        pullSignal.get(this.currentItem.id).then(res => {
          this.currentOrder = res.data;
          this.loading = false;
        });
      }
    }
  };
</script>
