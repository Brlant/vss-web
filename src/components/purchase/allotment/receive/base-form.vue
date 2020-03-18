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
    <el-form ref="plateForm" :model="form" label-width="200px">
      <el-form-item label="在途温度是否合格">
        <el-radio-group v-model="transportTemperatureFlag" @change="submit">
          <el-radio :label="true">合格</el-radio>
          <el-radio :label="false" class="no-pass">不合格</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="订单始发地">
        <oms-input v-model="sentAddress" :maxlength="50" placeholder="请输入订单始发地" style="max-width: 300px"
                   @blur="submitSentAddress"></oms-input>
        <!--<el-button type="primary" @click="submitSentAddress()" >提交订单始发地</el-button>-->
      </el-form-item>
      <el-form-item label="到货时间">
        <el-date-picker
          v-model="arrivalDate"
          type="datetime"
          placeholder="请选择到货时间"
          @change="changeTime"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="车牌号" v-show="plateNumbers.length">
        <ul class="plate-list">
          <template v-for="item in plateNumbers">
            <li class="plate-item">
              <span class="title R">{{ item.plateNumber }}</span>
              <span class="btn" @click="removePlateDB(item)"><i class="el-icon-t-delete"></i></span>
            </li>
          </template>
        </ul>
      </el-form-item>
      <template v-for="(item, key) in form.plateNumberList">
        <el-form-item label="">
          <oms-input v-model="item.plateNumber" placeholder="请输入车牌号" style="max-width: 500px"></oms-input>
          <el-button type="primary" @click="submitForm()" :disabled="doing">新增车牌号</el-button>
        </el-form-item>
      </template>
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
      currentOrder: {},
      index: {
        type: Number,
        default: -1
      }
    },
    data() {
      return {
        form: {
          plateNumberList: []
        },
        transportTemperatureFlag: '',
        plateNumbers: [],
        arrivalDate: '',
        sentAddress: '',
        doing: false,
        tempDoing: false,
        supplierInfo: {}
      };
    },
    watch: {
      index(val) {
        this.plateNumbers = [];
        this.form.plateNumberList = [];
        this.arrivalDate = '';
        if (val !== 0) return;
        this.addPlateNumber();
        this.getPlateNumber();
        this.transportTemperatureFlag = this.currentOrder.transportTemperatureFlag;
        this.setArrivalDate();
        this.sentAddress = this.currentOrder.sentAddress;
      },
      'currentOrder.transportTemperatureFlag'() {
        this.transportTemperatureFlag = this.currentOrder.transportTemperatureFlag;
      },
      'currentOrder.arrivalDate'() {
        this.setArrivalDate();
      },
      'currentOrder.sentAddress'() {
        this.sentAddress = this.currentOrder.sentAddress;
      },
      'currentOrder.supplierId'() {
        this.querySupplierInfo();
      }
    },
    methods: {
      setArrivalDate() {
        this.arrivalDate = this.currentOrder.arrivalDate ? new Date(this.currentOrder.arrivalDate) : '';
      },
      getPlateNumber() {
        let params = {
          orderId: this.orderId
        };
        this.$http.get('/order-plate', {params}).then(res => {
          this.plateNumbers = res.data;
        });
      },
      querySupplierInfo() {
        if (!this.currentOrder.supplierId) {
          this.supplierInfo = {};
          return;
        }
        BaseInfo.queryBaseInfo(this.currentOrder.supplierId).then(res => {
          this.supplierInfo = res.data.orgDto;
        });
      },
      addPlateNumber() {
        this.form.plateNumberList.push({
          orderId: this.orderId,
          plateNumber: ''
        });
      },
      removePlateNumber(item) {
        let index = this.form.plateNumberList.indexOf(item);
        if (index !== -1) {
          this.form.plateNumberList.splice(index, 1);
        }
      },
      removePlateDB(item) {
        this.$http.delete(`/order-plate/${item.id}`).then(res => {
          this.$notify.success({
            message: '删除车牌号成功'
          });
          let index = this.plateNumbers.indexOf(item);
          if (index !== -1) {
            this.plateNumbers.splice(index, 1);
          }
        }).catch(error => {
          this.$notify.error({
            message: '删除车牌号失败'
          });
        });
      },
      submitForm() {
        this.$refs['plateForm'].validate(valid => {
          if (!valid || this.doing) return;
          let form = JSON.parse(JSON.stringify(this.form));
          form.plateNumberList = form.plateNumberList.filter(f => f.plateNumber);
          if (!form.plateNumberList.length) return;
          // 车牌号用 逗号, 顿号, 句号分隔
          form.plateNumberList = form.plateNumberList[0].plateNumber.split(/,|，|、|\.|。/).map(m => {
            return {
              orderId: this.orderId,
              plateNumber: m
            };
          });
          this.doing = true;
          this.$http.put(`/order-receipt/${this.orderId}`, form).then(res => {
            this.doing = false;
            this.getPlateNumber();
            this.form.plateNumberList = [];
            this.addPlateNumber();
            this.$notify.success({
              message: '新增车牌号成功'
            });
          }).catch(error => {
            this.doing = false;
            this.$notify.error({
              message: error.response.data && error.response.data.msg || '新增车牌号失败'
            });
          });
        });
      },
      submit() {
        let obj = {
          transportTemperatureFlag: this.transportTemperatureFlag
        };
        this.$http.put(`/order-receipt/${this.orderId}`, obj).then(res => {
          this.doing = false;
          this.currentOrder.transportTemperatureFlag = this.transportTemperatureFlag;
          this.$notify.success({
            message: '修改成功'
          });
        }).catch(error => {
          this.doing = false;
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '修改失败'
          });
        });
      },
      changeTime() {
        if (!this.arrivalDate) {
          this.$notify.info({
            message: '请选择到货时间'
          });
          return;
        }
        let form = {
          arrivalDateTime: this.arrivalDate ? this.$moment(this.arrivalDate).format('YYYY-MM-DD HH:mm:ss') : ''
        };
        this.$http.put(`/order-receipt/${this.orderId}`, form).then(res => {
          this.currentOrder.arrivalDate = this.arrivalDate.getTime();
          this.$notify.success({
            message: '修改到货时间成功'
          });
        }).catch(error => {
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '修改到货时间失败'
          });
        });
      },
      submitSentAddress() {
        let obj = {
          sentAddress: this.sentAddress
        };
        this.$http.put(`/order-receipt/${this.orderId}`, obj).then(res => {
          this.doing = false;
          this.currentOrder.sentAddress = this.sentAddress;
          this.$notify.success({
            message: '修改订单始发地成功'
          });
        }).catch(error => {
          this.doing = false;
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '修改订单始发地失败'
          });
        });
      }
    }
  };
</script>
