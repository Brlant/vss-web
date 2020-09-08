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
        <th class="text-center" width="30">序号</th>
        <th width="400">货主疫苗</th>
        <th>规格</th>
        <th v-show="isShowbatch">批号</th>
        <th v-show="isShowbatch">有效期</th>
        <th>数量</th>
        <th>单价</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="product in orderItem.detailDtoList" v-if="product.orgGoodsDto">
        <td class="text-center" width="30">{{product.sort}}</td>
        <td style="width: 400px">
          <span>{{product.name}}</span>
        </td>
        <td v-if="product.orgGoodsDto.goodsDto" style="width: 100px">{{product.orgGoodsDto.goodsDto.specifications}}
        </td>
        <td v-show="isShowbatch" align="left" class="R">
          {{ product.batchNumber || '无' }}
          <!--<el-tag v-show="product.inEffectiveFlag" type="danger">近效期</el-tag>-->
        </td>
        <td v-show="isShowbatch" align="left">{{ product.expiryDate | date }}</td>
        <td align="left">
          {{product.amount}}
          <dict v-if="product.orgGoodsDto.goodsDto" :dict-group="'measurementUnit'"
                :dict-key="product.orgGoodsDto.goodsDto.measurementUnit"></dict>
        </td>
        <td align="left">
          <span v-if="product.unitPrice">￥{{product.unitPrice}}</span>
          <span v-else>-</span>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: 'OrderGoodsInfo',
  props: {
    orderItem: {},
    showBatch: Boolean
  },
  computed: {
    isShowbatch() {
      return this.orderItem.type === '1' || (this.orderItem.type === '0' && this.orderItem.bizType === '1-1') || this.showBatch;
    },
    isShowGoodsList() {
      return this.$store.state.isShowGoodsList;
    }
  }
};
</script>
