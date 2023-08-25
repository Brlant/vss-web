<style lang="scss" scoped>

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

.oms-row {
  font-size: 14px;
  margin-bottom: 10px;
}

.content-body {
  margin: 20px 0;
}

.relation-no {
  cursor: pointer;
  color: #337ecc;

  &:hover {
    color: #409EFF;
  }
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
      <el-row v-else>
        <el-col :span="11">
          <oms-row label="要货申请编号">
            {{currentOrder.id }}
          </oms-row>
          <oms-row label="疫苗种类">
            <dict :dict-key="'' + currentOrder.goodsType" dict-group="orderGoodsType"></dict>
          </oms-row>
          <oms-row label="要货单位">
            {{currentOrder.povName }}
          </oms-row>
          <oms-row label="供货单位">
            {{currentOrder.cdcName}}
          </oms-row>
          <oms-row label="申请时间">
            {{currentOrder.applyTime | time}}
          </oms-row>
          <oms-row label="到货需求日期">
            {{currentOrder.demandTime | date }}
          </oms-row>
          <oms-row label="要货单位仓库">
            {{currentOrder.warehouseAddress}}
          </oms-row>
        </el-col>
        <el-col :span="13">
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
            <a v-for="(item,index) in currentOrder.orderNoList" :key="index" class="relation-no" href="#" @click.stop.prevent="goTo(item)">
              {{item.orderNo}}<br>
            </a>
          </oms-row>
        </el-col>
      </el-row>
      <oms-row v-show="currentOrder.remark" :span="3" label="备注">{{ currentOrder.remark }}</oms-row>
    </div>
    <span style="font-size: 14px">【要货明细】</span>
    <table class="table table-hover" style="margin-top: 10px">
      <thead>
      <tr>
        <th width="auto">疫苗名称</th>
        <th>规格</th>
        <th>单价</th>
        <th width="48">申请数量</th>
        <th width="48">申请金额</th>
        <th width="40">已分配数量</th>
        <th width="48">需求差额</th>
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
<!--        <td>-->
<!--          {{row.actualCount}}-->
<!--        </td>-->
        <td >{{ row.submittedCount }}</td>
        <td style="color: red">{{ row.demandGap }}</td>
      </tr>
      <tr>
        <th class="text-right" colspan="6">
          <total-count :list="currentOrder.detailDtoList" property="applyCount"></total-count>
          ;
          <total-count :list="currentOrder.detailDtoList" :showIcon="true" property="applyMoney"
                       title="合计金额"></total-count>
        </th>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import {pullSignal} from '@/resources';

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
    currentItem() {
      this.getDetail();
    }
  },
  methods: {
    goTo(val) {
      let url = this.currentOrder.goodsType === 0 ? '/sale/order/one/class/' : '/sale/order/two/class/';
      this.$router.push(url + val.orderId);
    },
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
