<style lang="scss" scoped>
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

    <el-row v-loading="loading" class="page-main-body padding" style="margin-bottom:0">
      <el-col :span="12">
        <oms-row label="车牌号">
          {{ plateNumber }}
        </oms-row>
      </el-col>
      <el-col :span="12">
        <oms-row label="在途温度">
          <el-tag v-show="currentOrder.transportTemperatureFlag !== false" type="success">合格</el-tag>
          <el-tag v-show="currentOrder.transportTemperatureFlag === false" type="warning">不合格</el-tag>
        </oms-row>
      </el-col>
    </el-row>
    <hr class="hr"/>
    <table v-for="item in goodsDetails" :key="item.id" class="product-detail-list">
      <tbody>
      <tr>
        <td class="t-head" colspan="2" style="width: 120px">名称</td>
        <td colspan="6" style="width: 360px">
          <div>
            <el-tooltip class="item" content="货主疫苗名称" effect="dark" placement="right">
              <span style="font-size: 14px;line-height: 20px">{{item.name}}</span>
            </el-tooltip>
          </div>
          <div>
            <el-tooltip class="item" content="平台疫苗名称" effect="dark" placement="right">
              <span style="font-size: 12px;color:#999">{{ item.orgGoodsDto.goodsDto.name }}</span>
            </el-tooltip>
          </div>
        </td>
        <td class="t-head" colspan="3" style="width: 180px">生产单位</td>
        <td colspan="3" style="width: 280px">
          {{item.orgGoodsDto.goodsDto.factoryName}}
        </td>
      </tr>
      <tr>
        <td class="t-head" colspan="2">批号</td>
        <td class="t-head" colspan="3">生产日期</td>
        <td class="t-head" colspan="3">有效期</td>
        <td class="t-head" colspan="6">散件数量</td>
      </tr>
      <tr v-for="batchNumber in item.batchNumbers" v-if="item.batchNumbers && item.batchNumbers.length > 0"
          :key="batchNumber.id">
        <td colspan="2">{{ batchNumber.no }}</td>
        <td colspan="3">{{ batchNumber.productionDate | date }}</td>
        <td colspan="3">{{ batchNumber.expiryDate | date }}</td>
        <td colspan="6">
          <div v-show="batchNumber.smallPackageCount || batchNumber.smallNonconformityCount">
            <div v-show="batchNumber.smallPackageCount">
              <el-tag type="success">合格</el-tag>
              {{ batchNumber.smallPackageCount}}
              <dict :dict-group="'shipmentPackingUnit'" :dict-key="batchNumber.smallUnit"></dict>
            </div>
            <div v-show="batchNumber.smallNonconformityCount" style="padding: 5px 0">
              <el-tag type="warning">不合格</el-tag>
              {{ batchNumber.smallNonconformityCount}}
              <dict :dict-group="'shipmentPackingUnit'" :dict-key="batchNumber.smallUnit"></dict>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td class="t-head" colspan="2">应收</td>
        <td colspan="6">
          {{item.amount}}
          <dict :dict-group="'measurementUnit'" :dict-key="item.orgGoodsDto.goodsDto.measurementUnit"></dict>
        </td>
        <td class="t-head" colspan="3">实收</td>
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
import {http} from '@/resources';

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
  data() {
    return {
      goodsDetails: [],
      plateNumber: '',
      loading: false
    };
  },
  watch: {
    index(val) {
      if (val !== 1) return;
      this.goodsDetails = [];
      if (!this.currentOrder.detailDtoList) return;
      this.getGoodsDetails();
      this.getPlateNumber();
    }
  },
  methods: {
    getGoodsDetails() {
      this.loading = true;
      http.get(`/receipt/order/${this.currentOrder.id}`).then(res => {
        this.goodsDetails = this.currentOrder.detailDtoList.slice();
        let amout = 0;
        this.goodsDetails.forEach(i => {
          i.batchNumbers = res.data.filter(f => f.orderDetailId === i.id);
          if (i.batchNumbers) {
            i.batchNumbers.forEach(i => {
              amout += i.aggregateQuantity;
            })
            i.amount = amout;
          }
        });
        this.loading = false;
      });
    },
    getTotalNumber(item) {
      if (!item.batchNumbers) return 0;
      let num = 0;
      item.batchNumbers.forEach(b => {
        num += b.aggregateQuantity;
      });
      return num;
    },
    getPlateNumber() {
      let params = {
        orderId: this.currentOrder.id
      };
      http.get('/order-plate', {params}).then(res => {
        this.plateNumber = res.data.length ? res.data[0].plateNumber : '';
      });
    },
    getPackageUint(batchNumber, item) {
      return batchNumber.packageScheme === 0 ? item.orgGoodsDto.goodsDto.largePackageUnit : batchNumber.packageScheme === 1 ? item.orgGoodsDto.goodsDto.mediumPackageUnit : batchNumber.packageScheme === 2 ? item.orgGoodsDto.goodsDto.smallPackageUnit : '';
    },
    getPackageType(batchNumber) {
      let type = batchNumber.packageScheme;
      if (typeof type === 'number') {
        return type.toString();
      }
      return '-1';
    }
  }
};
</script>
