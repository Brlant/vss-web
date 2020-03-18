<style lang="scss" scoped>

  .part {
    padding: 0 20px;
  }

  .plate-info {
    margin-bottom: 20px;
    border-bottom: 1px solid #d9d9d9;
    font-size: 14px;
  }

  .plate-list {
    .plate-item {
      float: left;
      padding: 0 20px;
      border: 1px solid #d9d9d9;
      margin-right: 10px;
      margin-bottom: 10px;
      line-height: 36px;

      .title {
        float: left;
      }

      .btn {
        margin-left: 10px;
        cursor: pointer;
        display: none;
        float: right;
      }

      &:hover {
        border-color: #33CCFF;

        .btn {
          display: inline;
          color: #33CCFF;
        }
      }
    }
  }

  .h-line {
    margin-top: 10px;
    border-bottom: 1px solid #d9d9d9;
  }

  .supplier-info {
    overflow: hidden;
    font-size: 14px;
  }
</style>
<template>
  <div class="part">
    <div class="supplier-info" v-if="supplierInfo.extDto">
      <oms-col label="来源单位物流商" :isShow="true" :value="supplierInfo.extDto.logisticsDealer"/>
      <oms-col label="来源单位运输时限" :isShow="true" :value="supplierInfo.extDto.transportTimeLimit"/>
      <oms-col label="来源单位车牌号" :isShow="true" :value="supplierInfo.extDto.licensePlateNumber"/>
    </div>
    <div class="h-line clearfix" v-if="supplierInfo.extDto"></div>
    <el-form ref="plateForm" label-width="200px">
      <el-form-item label="在途温度是否合格">
        <el-radio-group v-model="currentOrder.transportTemperatureFlag">
          <el-radio :label="true">合格</el-radio>
          <el-radio :label="false" class="no-pass">不合格</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="订单始发地">
        <oms-input v-model="currentOrder.sentAddress" :maxlength="50" placeholder="请输入订单始发地"
                   style="max-width: 300px"></oms-input>
        <!--<el-button type="primary" @click="submitSentAddress()" >提交订单始发地</el-button>-->
      </el-form-item>
      <el-form-item label="到货时间">
        <el-date-picker
          v-model="currentOrder.arrivalDate"
          type="datetime"
          placeholder="请选择到货时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="车牌号" v-if="currentOrder.plateNumbers && currentOrder.plateNumbers.length">
        <ul class="plate-list">
          <template v-for="item in currentOrder.plateNumbers">
            <li class="plate-item">
              <span class="title R">{{ item.plateNumber }}</span>
              <span class="btn" @click="removePlateNumber(item)"><i class="el-icon-t-delete"></i></span>
            </li>
          </template>
        </ul>
      </el-form-item>
      <el-form-item label="">
        <oms-input v-model="plateNumber" placeholder="请输入车牌号" style="max-width: 500px"></oms-input>
        <el-button type="primary" @click="submitForm()">新增车牌号</el-button>
      </el-form-item>
      <!--<el-form-item>-->
      <!--<el-button type="primary" @click="submitForm()" :disabled="doing">提交</el-button>-->
      <!--</el-form-item>-->
    </el-form>
  </div>
</template>
<script>
  import {BaseInfo} from '@/resources';

  export default {
    props: {
      orderId: String,
      currentOrder: {
        type: Object,
        default: () => {
        }
      },
      index: {
        type: Number,
        default: -1
      }
    },
    data() {
      return {
        plateNumber: '',
        supplierInfo: {}
      };
    },
    watch: {
      index(val) {
        this.plateNumber = '';
        this.querySupplierInfo();
      },
    },
    methods: {
      querySupplierInfo() {
        if (!this.currentOrder.supplierId) {
          this.supplierInfo = {};
          return;
        }
        BaseInfo.queryBaseInfo(this.currentOrder.supplierId).then(res => {
          this.supplierInfo = res.data.orgDto;
        });
      },
      removePlateNumber(item) {
        let index = this.currentOrder.plateNumbers.indexOf(item);
        if (index !== -1) {
          this.currentOrder.plateNumbers.splice(index, 1);
        }
      },
      submitForm() {
        if (!this.plateNumber) return;
        // 车牌号用 逗号, 顿号, 句号分隔
        let list = this.plateNumber.split(/,|，|、|\.|。/).map(m => {
          return {
            id: this.orderId,
            orderId: this.orderId,
            plateNumber: m
          };
        });
        this.plateNumber = '';
        this.currentOrder.plateNumbers.push(...list);
      }
    }
  };
</script>
