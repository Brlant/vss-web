<style lang="less" scoped>
  .table {
    padding-left: 5px;
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
      background: #f1f1f1*0.9;
    }
    > tbody {
      background: #f1f1f1;
    }
  }

  .table-product-list {
    > tbody > tr > td, > thead > tr > th {
      padding: 5px;
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
  <table class="table no-border table-product-list" v-show="orderItem.detailDtoList">
    <thead>
    <tr>
      <th>货主货品</th>
      <th v-show="isShowbatch">批号</th>
      <th v-show="isShowbatch">生产日期</th>
      <th v-show="isShowbatch">有效期</th>
      <th>数量</th>
      <th v-show="level !== 1">单价</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="product in orderItem.detailDtoList" v-if="product.orgGoodsDto">
      <td style="width: 400px">
        <span style="font-size: 14px;line-height: 20px">{{product.name}}</span>
      </td>
      <td align="left" class="R" v-show="isShowbatch">
        {{ product.batchNumber || '无' }}
        <!--<el-tag v-show="product.inEffectiveFlag" type="danger">近效期</el-tag>-->
      </td>
      <td align="left" v-show="isShowbatch">{{ product.productionDate | date }}</td>
      <td align="left" v-show="isShowbatch">{{ product.expiryDate | date }}</td>
      <td align="left">
        {{product.amount}}
        <dict :dict-group="'measurementUnit'" :dict-key="product.orgGoodsDto.goodsDto.measurementUnit"></dict>
      </td>
      <td align="left" v-show="level !== 1">
        <span v-if="product.unitPrice">￥{{product.unitPrice}}</span>
      </td>
    </tr>
    </tbody>
  </table>
</template>
<script>
  export default {
    name: 'OrderGoodsInfo',
    props: {
      orderItem: {}
    },
    computed: {
      isShowbatch () {
        return this.orderItem.type === '1' || (this.orderItem.type === '0' && this.orderItem.bizType === '1');
      },
      level () {
        return this.$store.state.orgLevel;
      }
    }
  };
</script>
