<style lang="less" scoped="">
  .product-detail-list {
    margin-top: 20px;
    text-align: center;
    border-collapse: collapse;
    font-size: 12px;
    width: 100%;
    > tbody > tr > td {
      padding: 5px;
      border: 1px solid #dfe6ec;
    }
    .t-head {
      background: #eef1f6;
      color: #1f2d3d;
      font-weight: bold;
    }
  }

  .bg-white {
    background: #fff;
  }

  .bg-red {
    background: #f70f0f;
  }

  .color-red {
    color: red;
  }

  .content-right {
    > h3 {
      text-align: center;
    }
    padding: 0 10px;
  }
</style>
<template>
  <div>
    <table class="product-detail-list" v-loading="loading">
      <tbody>
      <tr>
        <td colspan="3" width="180px" class="t-head">货品</td>
        <td colspan="3" width="180px" class="t-head">生产厂商</td>
        <td colspan="2" width="120px" class="t-head">批号</td>
        <td colspan="2" width="120px" class="t-head">生产日期</td>
        <td colspan="2" width="120px" class="t-head">有效期</td>
        <!--<td colspan="2" width="120px" class="t-head">包装数量</td>-->
        <td colspan="2" width="120px" class="t-head">数量</td>
      </tr>
      <tr v-for="item in details">
        <td colspan="3">
          <div>
            <el-tooltip class="item" effect="dark" content="货主货品名称" placement="right">
              <span style="font-size: 14px;line-height: 20px">{{item.goodsName}}</span>
            </el-tooltip>
          </div>
          <div>
            <el-tooltip class="item" effect="dark" content="规格" placement="right">
              <span style="font-size: 12px;color:#999">{{ item.specification }}</span>
            </el-tooltip>
          </div>
        </td>
        <td colspan="3">
          {{item.productFactory}}
        </td>
        <td colspan="2">{{ item.batchNumber || '无' }}</td>
        <td colspan="2">{{ item.productionDate | date }}</td>
        <td colspan="2">{{ item.expiryDate | date }}</td>
        <td colspan="2">
          {{ item.aggregateQuantity }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
  import { http } from '@/resources';

  export default {
    props: {
      currentOrder: Object,
      index: {
        type: Number,
        default: -1
      }
    },
    data () {
      return {
        details: [],
        plateNumber: '',
        loading: false
      };
    },
    watch: {
      index (val) {
        if (val !== 1) return;
        this.details = [];
        this.getGoodsDetails();
      }
    },
    methods: {
      getGoodsDetails () {
        this.loading = true;
        http.get(`/erp-receipt/order/${this.currentOrder.id}/detail`).then(res => {
          this.details = res.data;
          this.loading = false;
        });
      }
    }
  };
</script>
