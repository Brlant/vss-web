<style lang="scss" scoped>
@import "../../../assets/mixins";

.table {
  table-layout: fixed;
  margin-top: 10px;
  font-size: 12px;
  /*padding-left: 5px;*/
  font-weight: 400;

  .order-list-item {
    color: #999;
    line-height: 20px;
  }

  border-collapse: separate;
  border-spacing: 0;

  > tbody > tr > td, > thead > tr > th {
    border: 0;
  }

  > thead {
    background: #eff4fb;
  }

  > tbody {
    background: #f6faff;
  }
}

.table-product-list {
  > thead > tr > th {
    padding: 5px;
  }

  > tbody > tr > td {
    padding: 2px 0 2px 5px;
  }
}

.table-product-list {
  margin-bottom: 0;
}

.product-title {
  text-align: center;
  border: 1px solid #eee;
  background: #eee;
}
</style>
<template>
  <div v-if="isShowGoodsList">
    <table v-show="orderItem.detailDtoList" class="table no-border table-product-list">
      <thead>
      <tr>
        <th class="text-center" width="50">序号</th>
        <th width="400">疫苗名称</th>
        <th>规格</th>
        <th>单价</th>
        <th>申请数量</th>
        <th>申请金额</th>
        <th v-show="status == 2">库存数量</th>
        <th v-show="status == 2">已分配数量</th>
        <th v-show="status != 2">分配数量</th>
        <th v-show="status == 2">未分配数量</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row,index) in orderItem.detailDtoList">
        <td class="text-center" width="30">{{ index + 1 }}</td>
        <td style="width: 400px">
          <span>{{ row.goodsName }}</span>
        </td>
        <td v-if="row.specification" style="width: 100px">{{ row.specification }}
        </td>
        <td align="left">
          <span v-if="row.price">￥{{ row.price | formatMoney }}</span>
          <span v-if="!row.price">-</span>
        </td>
        <td align="left">
          {{ row.applyCount }}
        </td>
        <td align="left">
          <span v-if="row.applyMoney">￥{{ row.applyMoney | formatMoney }}</span>
          <span v-if="!row.applyMoney">-</span>
        </td>
        <td v-show="status == 2">{{ row.currentStock }}</td>
        <td v-show="status == 2">{{ row.submittedCount }}</td>
        <td v-show="status != 2">{{row.actualCount}}</td>
        <td v-show="status == 2" style="color: red">{{ row.demandGap }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: 'SaleGoodsInfo',
  props: {
    orderItem: {},
    status:String,
    showBatch: Boolean
  },
  computed: {
    isShowGoodsList() {
      return this.$store.state.isShowGoodsList;
    }
  }
};
</script>
