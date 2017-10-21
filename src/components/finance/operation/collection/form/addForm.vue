<style lang="less" scoped>
  @import "../../../../../assets/mixins.less";

  @leftWidth: 200px;

  .el-form .el-checkbox__label {
    font-size: 12px;
    padding-left: 5px;
  }

  .el-form .el-checkbox__inner {
    width: 14px;
    height: 14px;
  }

  .content-part {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    .content-left {
      width: @leftWidth;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      text-align: center;
      background-color: #eef2f3;
      > ul {
        margin: 0;
      }
      > h2 {
        padding: 0 45px;
        margin: 0;
        font-size: 18px;
        font-weight: bold;
        line-height: 55px;
        border-bottom: 1px solid #ddd;
        background-color: #eef2f3;
      }
      .list-style {
        cursor: pointer;
        padding: 10px;
        text-align: center;
        span {
          display: inline-block;
          padding: 8px 35px;
        }
        &.active {
          span {
            background-color: @activeColor;
            border-radius: 20px;
            color: @activeColorFont
          }
        }
        &:hover {
          background: #dee9eb
        }

      }

    }
    .content-right {
      > h3 {
        padding: 0;
        margin: 0 0 20px;
        font-size: 18px;
        font-weight: normal;
        line-height: 55px;
        border-bottom: 1px solid #ddd;
        text-align: center;
        position: fixed;
        top: 0;
        right: 0;
        left: @leftWidth;
        background: #fff;
        z-index: 2;
      }
      position: absolute;
      top: 0;
      left: @leftWidth;
      right: 0;
      bottom: 0;
      overflow: auto;
      padding-top: 75px;
      .hide-content {
        display: none;
      }
      .show-content {
        padding: 0 20px;
        display: block;
      }
    }

    .min-gutter {
      .el-form-item {
        margin-bottom: 20px;
      }
      .el-form-item__label {
        font-size: 12px
      }
    }
  }

  .el-form .el-select {
    display: block;
  }

  .table-product-list {
    font-size: 12px;
    > tbody > tr > td, > thead > tr > th {
      padding: 5px;
    }
  }

  .order-product-box {
    position: relative;
    border-radius: 10px;
    font-size: 12px;
    line-height: 26px;
    .product-info-fix {
      background: #f6f6f6;
      margin-top: 10px;
      padding: 5px;
      margin-bottom: 20px;
    }
    &:hover {
      border-color: #aaa
    }
    .product-remove {
      position: absolute;
      right: 0;
      top: 0;
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      cursor: pointer;
      color: #666;
      &:hover {
        color: #333
      }
    }
    .order-goods-info {
      .col-label {
        padding-top: 4px;
      }
    }

  }

  .product-list-detail {
    margin-top: 20px;
    font-size: 12px;
    h3 {
      background: #eee;
      padding: 10px 15px;
      font-size: 14px;
      font-weight: normal;
    }
  }

  .select-other-info {
    color: #999;
    margin-left: 10px
  }

  .selected {
    .select-other-info {
      color: #ddd
    }
  }

  .ml15 {
    margin-left: 40px;
  }

  .combinatioon-product {
    color: #777
  }

  .el-select-dropdown__item {
    font-size: 14px;
    padding: 8px 10px;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #48576a;
    height: auto;
    line-height: normal;
    box-sizing: border-box;
    cursor: pointer;
  }

  .productItem-info {
    float: left;
  }

  .order-good-selects {
    .el-select-dropdown__item {
      font-size: 14px;
      padding: 8px 10px;
      position: relative;
      white-space: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      color: rgb(72, 94, 106);
      height: auto;
      width: 680px;
      line-height: 1.5;
      box-sizing: border-box;
      cursor: pointer;
    }
  }

  .ar {
    text-align: right;
  }
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">新增付款申请</h2>
        <ul>
          <li class="text-center" style="margin-top:40px;position:absolute;bottom:30px;left:0;right:0;">
            <el-button type="success" @click="onSubmit">保存</el-button>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <h3>新增付款作业申请</h3>

        <div>
          <el-form ref="addForm" :rules="rules" :model="form" @submit.prevent="onSubmit" onsubmit="return false"
                   label-width="100px" style="padding-right: 20px">
            <el-form-item label="付款类型" prop="billPayType">
              <el-select type="text" v-model="form.billPayType" placeholder="请选择付款类型" @change="changeBillPayType">
                <el-option :value="'0'" :key="'0'" :label="'疫苗厂商付款'"></el-option>
                <el-option :value="'1'" :key="'1'" :label="'物流厂商付款'"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="疫苗厂商" prop="orgId" v-if="form.billPayType==='0'">
              <el-select filterable remote placeholder="请输入关键字搜索疫苗厂商" :remote-method="filterOrg" :clearable="true"
                         v-model="form.orgId">
                <el-option :value="org.remitteeId" :key="org.remitteeId" :label="org.remitteeName" v-for="org in orgList">
                  <div style="overflow: hidden">
                    <span class="pull-left" style="clear: right">{{org.remitteeName}}</span>
                    <span class="pull-right" style="color: #999">
                  </span>
                  </div>
                  <div style="overflow: hidden">
                    <span class="select-other-info pull-left">
                    <span>系统代码</span> {{org.remitteeManufacturerCode}}
                    </span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="物流厂商" v-if="form.billPayType==='1'" prop="orgId">
              <el-select filterable remote placeholder="请输入关键字搜索物流厂商" :remote-method="filterLogistics" :clearable="true"
                         v-model="form.orgId">
                <el-option :value="org.remitteeId" :key="org.remitteeId" :label="org.remitteeName"
                           v-for="org in logisticsList">
                  <div style="overflow: hidden">
                    <span class="pull-left" style="clear: right">{{org.remitteeName}}</span>
                    <span class="pull-right" style="color: #999">
                  </span>
                  </div>
                  <div style="overflow: hidden">
                    <span class="select-other-info pull-left">
                    <span>系统代码</span> {{org.remitteeManufacturerCode}}
                    </span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="应付总金额" v-if="form.orgId">
              ¥ {{payableTotalAmount | formatMoney }}
            </el-form-item>
            <el-form-item label="实付总金额" v-if="form.orgId">
              ¥ {{practicalTotalAmount | formatMoney }}
            </el-form-item>
            <el-form-item label="未付总金额" v-if="form.orgId">
              ¥ {{notTotalAmount | formatMoney }}
            </el-form-item>
            <el-form-item label="付款方式" prop="payType">
              <el-select placeholder="请选择付款方式" v-model="form.payType">
                <el-option :label="item.label" :value="item.key" :key="item.key" v-for="item in PaymentMethod"/>
              </el-select>
            </el-form-item>
            <el-form-item label="金额" prop="amount">
              <oms-input type="text" v-model="form.amount" @blur="formatPrice" placeholder="请输入金额,最多保留两位小数">
                <template slot="prepend">¥</template>
              </oms-input>
            </el-form-item>
            <el-form-item label="说明">
              <oms-input type="textarea" v-model="form.explain" placeholder="请输入备注信息"
                         :autosize="{ minRows: 2, maxRows: 5}"></oms-input>
            </el-form-item>
          </el-form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import {http, Address, BaseInfo, pay, BillOperation} from '../../../../../resources';
  import utils from '../../../../../tools/utils';

  export default {
    name: 'addForm',
    loading: false,
    props: {
      type: {
        'type': String,
        'default': '1'
      },
      defaultIndex: {
        type: Number,
        default: 0
      },
      action: {
        type: String,
        default: ''
      }
    },
    data: function () {
      let checkAmount = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入金额,最多保留两位小数'));
        } else {
          if (this.form.amount > this.notTotalAmount) {
            callback(new Error('输入的金额必须小于等于未付款总金额'));
          } else {
            callback();
          }
        }
      };
      return {
        loading: false,
        form: {
          type: '0',
          payType: '',
          orgId: '',
          explain: '',
          amount: '',
          billPayType: ''
        },
        payableTotalAmount: '',
        practicalTotalAmount: '',
        notTotalAmount: '',
        rules: {
          billPayType: [
            {required: true, message: '请选择付款类型', trigger: 'change'}
          ],
          payType: [
            {required: true, message: '请选择付款方式', trigger: 'change'}
          ],
          supplierId: [
            {required: true, message: '请选择供货厂商', trigger: 'change'}
          ],
          amount: [
            {required: true, message: '请输入金额', trigger: 'blur'},
            {validator: checkAmount, trigger: 'blur'}
          ]
        },
        orgList: [],
        logisticsList: [],
        doing: false
      };
    },
    computed: {
      PaymentMethod: function () {
        return this.$store.state.dict['PaymentMethod'];
      },
      totalMoney: function () {
        let totalMoney = 0.00;
        if (!this.form.detailDtoList.length) return totalMoney;
        this.form.detailDtoList.forEach(item => {
          totalMoney += item.amount * item.unitPrice;
        });
        return totalMoney;
      }
    },
    watch: {
      'form.orgId': function () {
        if (this.form.orgId) {
          if (this.form.billPayType === '0') {
            this.filterOrg();
            this.orgList.forEach(val => {
              if (this.form.orgId === val.remitteeId) {
                pay.getAmountInfo(val.id).then(res => {
                  this.payableTotalAmount = res.data.payableTotalAmount;
                  this.practicalTotalAmount = res.data.practicalTotalAmount;
                  this.notTotalAmount = res.data.notTotalAmount;
                });
              }
            });
          }
          if (this.form.billPayType === '1') {
            this.logisticsList.forEach(val => {
              this.filterLogistics();
              if (this.form.orgId === val.remitteeId) {
                pay.getAmountInfo(val.id).then(res => {
                  this.payableTotalAmount = res.data.payableTotalAmount;
                  this.practicalTotalAmount = res.data.practicalTotalAmount;
                  this.notTotalAmount = res.data.notTotalAmount;
                });
              }
            });
          }
        }
      }
    },
    mounted: function () {
    },
    methods: {
      changeBillPayType: function () {
        this.form.orgId = '';
        this.orgList = [];
        this.logisticsList = [];
        if (this.form.billPayType === '0') {
          this.filterOrg();
        }
        if (this.form.billPayType === '1') {
          this.filterLogistics();
        }
      },
      resetForm: function () {// 重置表单
        this.$refs['addForm'].resetFields();
        this.payableTotalAmount = '';
        this.practicalTotalAmount = '';
        this.notTotalAmount = '';
        this.orgList = [];
        this.logisticsList = [];
      },
      formatPrice() {// 格式化单价，保留两位小数
        this.form.amount = utils.autoformatDecimalPoint(this.form.amount);
      },
      doClose: function () {
        this.$emit('close');
      },
      filterOrg: function (query) {// 过滤来源单位
        let params = Object.assign({}, {
          pageNo: 1,
          pageSize: 20,
          keyWord: query,
          accountsPayableType: '0',
          payerId: this.$store.state.user.userCompanyAddress
        });
        pay.query(params).then(res => {
          this.orgList = res.data.list;
        });
      },
      filterLogistics: function (query) {// 过滤来源单位
        let params = Object.assign({}, {
          pageNo: 1,
          pageSize: 20,
          keyWord: query,
          accountsPayableType: '1',
          payerId: this.$store.state.user.userCompanyAddress
        });
        pay.query(params).then(res => {
          this.orgList = res.data.list;
        });
      },
      onSubmit: function () {// 提交表单
        let self = this;
        this.$refs['addForm'].validate((valid) => {
          if (!valid || this.doing) {
            this.doing = true;
          }
          BillOperation.save(this.form).then(res => {
            this.resetForm();
            this.$notify({
              duration: 2000,
              message: '新增付款作业申请成功',
              type: 'success'
            });
            self.$emit('change', res.data);
            this.$nextTick(() => {
              this.doing = false;
              this.$emit('close');
            });
          }).catch(error => {
            this.doing = false;
            this.$notify({
              duration: 2000,
              title: '新增付款作业申请失败',
              message: error.response.data.msg,
              type: 'error'
            });
          });
        });
      }
    }
  };
</script>
