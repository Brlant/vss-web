<style lang="less" scoped="">
  .product-detail-list {
    margin-top: 20px;
    text-align: center;
    border-collapse: collapse;
    font-size: 12px;
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

  .page-main-body {
    .oms-row {
      margin-bottom: 5px;
    }
  }
</style>
<template>
  <div>

    <el-row style="margin-bottom:0" class="page-main-body padding" v-loading="loading">
      <el-col :span="12">
        <oms-row label="车牌号">
          {{ plateNumber }}
        </oms-row>
      </el-col>
      <el-col :span="12">
        <oms-row label="在途温度">
          <el-tag type="success" v-show="currentOrder.transportTemperatureFlag !== false">合格</el-tag>
          <el-tag type="warning" v-show="currentOrder.transportTemperatureFlag === false">不合格</el-tag>
        </oms-row>
      </el-col>
    </el-row>
    <hr class="hr"/>
    <table class="product-detail-list" v-for="item in goodsDetails" :key="item.id">
      <tbody>
      <tr>
        <td colspan="2" style="width: 120px" class="t-head">名称</td>
        <td colspan="6" style="width: 360px">
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
        <td colspan="3" style="width: 180px" class="t-head">生产厂商</td>
        <td colspan="3" style="width: 280px">
          {{item.orgGoodsDto.goodsDto.factoryName}}
        </td>
      </tr>
      <tr>
        <td colspan="2" class="t-head">批号</td>
        <td colspan="3" class="t-head">生产日期</td>
        <td colspan="3" class="t-head">有效期</td>
        <td colspan="3" class="t-head">大包装数量</td>
        <td colspan="3" class="t-head">小包装数量</td>
      </tr>
      <tr v-for="batchNumber in item.batchNumbers" :key="batchNumber.id"
          v-if="item.batchNumbers && item.batchNumbers.length > 0">
        <td colspan="2">{{ batchNumber.no }}</td>
        <td colspan="3">{{ batchNumber.productionDate | date }}</td>
        <td colspan="3">{{ batchNumber.expiryDate | date }}</td>
        <td colspan="3">
          <div v-show="batchNumber.largePackageCount || batchNumber.largeNonconformityCount">
            <div v-show="batchNumber.largePackageCount">
              <el-tag type="success">合格</el-tag>
              {{ batchNumber.largePackageCount}}
              <dict :dict-group="'shipmentPackingUnit'" :dict-key="batchNumber.largeUnit"></dict>
            </div>
            <div style="padding: 5px 0" v-show="batchNumber.largeNonconformityCount">
              <el-tag type="warning">不合格</el-tag>
              {{ batchNumber.largeNonconformityCount}}
              <dict :dict-group="'shipmentPackingUnit'" :dict-key="batchNumber.largeUnit"></dict>
            </div>
          </div>
        </td>
        <td colspan="3">
          <div v-show="batchNumber.smallPackageCount || batchNumber.smallNonconformityCount">
            <div v-show="batchNumber.smallPackageCount">
              <el-tag type="success">合格</el-tag>
              {{ batchNumber.smallPackageCount}}
              <dict :dict-group="'shipmentPackingUnit'" :dict-key="batchNumber.smallUnit"></dict>
            </div>
            <div style="padding: 5px 0" v-show="batchNumber.smallNonconformityCount">
              <el-tag type="warning">不合格</el-tag>
              {{ batchNumber.smallNonconformityCount}}
              <dict :dict-group="'shipmentPackingUnit'" :dict-key="batchNumber.smallUnit"></dict>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="2" class="t-head">应收</td>
        <td colspan="6">
          {{item.amount}}
          <dict :dict-group="'measurementUnit'" :dict-key="item.orgGoodsDto.goodsDto.measurementUnit"></dict>
        </td>
        <td colspan="3" class="t-head">实收</td>
        <td colspan="3">
          <span :class="{'color-red':getTotalNumber(item) !== item.amount}">{{ getTotalNumber(item) }}
          <dict :dict-group="'measurementUnit'" :dict-key="item.orgGoodsDto.goodsDto.measurementUnit"></dict></span>
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
        goodsDetails: [],
        plateNumber: '',
        loading: false
      };
    },
    watch: {
      index (val) {
        if (val !== 1) return;
        this.goodsDetails = [];
        if (!this.currentOrder.detailDtoList) return;
        this.getGoodsDetails();
        this.getPlateNumber();
      }
    },
    methods: {
      getGoodsDetails () {
        this.loading = true;
        http.get(`/receipt/order/${this.currentOrder.id}`).then(res => {
          this.goodsDetails = this.currentOrder.detailDtoList.slice();
          this.goodsDetails.forEach(i => {
            i.batchNumbers = res.data.filter(f => f.orderDetailId === i.id);
          });
          this.loading = false;
        });
      },
      getTotalNumber (item) {
        if (!item.batchNumbers) return 0;
        let num = 0;
        item.batchNumbers.forEach(b => {
          num += b.aggregateQuantity;
        });
        return num;
      },
      getPlateNumber () {
        let params = {
          orderId: this.currentOrder.id
        };
        http.get('/order-plate', {params}).then(res => {
          this.plateNumber = res.data.length ? res.data[0].plateNumber : '';
        });
      },
      getPackageUint (batchNumber, item) {
        return batchNumber.packageScheme === 0 ? item.orgGoodsDto.goodsDto.largePackageUnit : batchNumber.packageScheme === 1 ? item.orgGoodsDto.goodsDto.mediumPackageUnit : batchNumber.packageScheme === 2 ? item.orgGoodsDto.goodsDto.smallPackageUnit : '';
      },
      getPackageType (batchNumber) {
        let type = batchNumber.packageScheme;
        if (typeof type === 'number') {
          return type.toString();
        }
        return '-1';
      }
    }
  };
</script>
