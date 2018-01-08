<style lang="less" scoped>
  .table {
    margin-bottom: 20px;
    .order-list-item {
      color: #999;
      line-height: 20px;
    }
    border-collapse: separate;
    border-spacing: 0;
    > tbody > tr > td {
      border-top: 1px solid #eee;
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
  <!--<table style="width: 100%;">-->
  <!--<tbody>-->
  <!--<tr>-->
  <!--<td width="100px" class="product-title">货品详情</td>-->
  <!--<td>-->
  <!---->
  <!--</td>-->
  <!--</tr>-->
  <!--</tbody>-->
  <!--</table>-->
  <table class="table no-border table-product-list" v-show="orderItem.detailDtoList">
    <tbody>
    <tr v-for="product in orderItem.detailDtoList" v-if="product.orgGoodsDto">
      <td style="width: 320px">
        <span style="font-size: 14px;line-height: 20px">{{product.name}}</span>
      </td>
      <td align="left" class="R" v-show="isShowbatch">
        批号:{{ product.batchNumber || '无' }}
        <el-tag v-show="product.inEffectiveFlag" type="danger">近效期</el-tag>
      </td>
      <td align="left" v-show="isShowbatch">生产日期:{{ product.productionDate | date }}</td>
      <td align="left" v-show="isShowbatch">有效期:{{ product.expiryDate | date }}</td>
      <td align="left">
        数量:{{product.amount}}
        <dict :dict-group="'measurementUnit'" :dict-key="product.orgGoodsDto.goodsDto.measurementUnit"></dict>
      </td>
      <td align="left">
        <span v-if="product.unitPrice">单件:￥{{product.unitPrice}}</span>
      </td>
      <td align="left">
          <span v-if="product.unitPrice">
            金额:<span>¥</span>{{ product.amount * product.unitPrice | formatMoney }}
          </span>
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
      }
    }
  };
</script>
