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
</style>
<template>
  <div>
    <table class="product-detail-list">
      <tbody>
      <tr>
        <td colspan="2" width="120px" class="t-head">货品</td>
        <td colspan="2" width="120px" class="t-head">生产厂商</td>
        <td colspan="2" width="120px" class="t-head">批号</td>
        <td colspan="2" width="120px" class="t-head">生产日期</td>
        <td colspan="2" width="120px" class="t-head">有效期</td>
        <td colspan="2" width="120px" class="t-head">包装类型</td>
        <td colspan="2" width="120px" class="t-head">整件数</td>
        <td colspan="2" width="120px" class="t-head">散件数</td>
        <td colspan="2" width="120px" class="t-head">应收</td>
        <td colspan="2" width="120px" class="t-head">实收</td>
      </tr>
      <tr v-for="item in currentItem.detailDtoList" :key="item.id">
        <td colspan="2">
          <div>
            <el-tooltip class="item" effect="dark" content="货主货品名称" placement="right">
              <span style="font-size: 14px;line-height: 20px">{{item.name}}</span>
            </el-tooltip>
          </div>
          <div>
            <el-tooltip class="item" effect="dark" content="平台货品名称" placement="right">
              <span style="font-size: 12px;color:#999">{{ item.orgGoodsDto.goodsDto.name }}</span>
            </el-tooltip>
          </div>
        </td>
        <td colspan="2">
          {{item.orgGoodsDto.goodsDto.factoryName}}
        </td>
        <td colspan="2">{{ item.batchNumber || '无' }}</td>
        <td colspan="2">{{ item.productionDate | date }}</td>
        <td colspan="2">{{ item.expiryDate | date }}</td>
        <td colspan="2">
          <div v-show="item.receiptDetail.scheme">
            {{ packageType[item.receiptDetail.scheme] }}
          </div>
          <div v-show="item.receiptDetail.scheme">
            {{ getPackageUint(item) }}
            <dict :dict-group="'measurementUnit'" :dict-key="item.orgGoodsDto.goodsDto.measurementUnit"></dict>
          </div>
        </td>
        <td colspan="2">{{ item.receiptDetail.packageCount }}</td>
        <td colspan="2">
          <span v-show="item.receiptDetail.basicPackingCount">
             {{ item.receiptDetail.basicPackingCount }}
            <dict :dict-group="'measurementUnit'" :dict-key="item.orgGoodsDto.goodsDto.measurementUnit"></dict>
          </span>
        </td>
        <td colspan="2">
          <span v-show="item.amount">
             {{ item.amount }}
            <dict :dict-group="'measurementUnit'" :dict-key="item.orgGoodsDto.goodsDto.measurementUnit"></dict>
          </span>
        </td>
        <td colspan="2">
          <span v-show="item.receiptDetail.aggregateQuantity"
                :class="{'color-red': item.receiptDetail.aggregateQuantity !== item.amount}">
            {{ item.receiptDetail.aggregateQuantity }}
            <dict :dict-group="'measurementUnit'" :dict-key="item.orgGoodsDto.goodsDto.measurementUnit"></dict>
          </span>
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
      currentOrder: {
        required: true,
        type: Object,
        default: function () {
          return {};
        }
      },
      index: {
        type: Number,
        default: -1
      }
    },
    data () {
      return {
        currentItem: {},
        plateNumber: '',
        packageType: ['大包装', '中包装', '小包装']
      };
    },
    watch: {
      index (val) {
        if (val !== 1) return;
        this.goodsDetails = [];
        if (!this.currentOrder.detailDtoList) return;
        this.getGoodsDetails();
      }
    },
    methods: {
      getGoodsDetails () {
        http.get(`/erp-receipt/${this.currentOrder.id}`).then(res => {
          this.currentItem = JSON.parse(JSON.stringify(this.currentOrder));
          this.currentItem.detailDtoList.forEach(f1 => {
            f1.receiptDetail = {};
            res.data.forEach(f => {
              if (f1.id === f.orderDetailId) {
                f1.receiptDetail = f;
              }
            });
          });
        });
      },
      getPackageUint (item) {
        if (!item.receiptDetail.scheme) return 0;
        return item.receiptDetail.scheme === 0
          ? item.orgGoodsDto.goodsDto.largePacking : item.receiptDetail.scheme === 1
            ? item.orgGoodsDto.goodsDto.mediumPacking : item.receiptDetail.scheme === 2
              ? item.orgGoodsDto.goodsDto.smallPacking : '';
      }
    }
  };
</script>
