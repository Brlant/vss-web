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

  .table-billOrder-list {
    font-size: 12px;
    > tbody > tr > td, > thead > tr > th {
      padding: 5px;
    }
  }

  .order-billOrder-box {
    position: relative;
    border-radius: 10px;
    font-size: 12px;
    line-height: 26px;
    .billOrder-info-fix {
      background: #f6f6f6;
      margin-top: 10px;
      padding: 5px;
      margin-bottom: 20px;
    }
    &:hover {
      border-color: #aaa
    }
    .billOrder-remove {
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

  .billOrder-list-detail {
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

  .combinatioon-billOrder {
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

  .billOrderItem-info {
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
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">新增采购订单</h2>
        <ul>
          <li class="list-style" v-for="item in billOrderListSet" @click="setIndexValue(item.key)"
              v-bind:class="{ 'active' : index==item.key}"><span>{{ item.name }}</span>
          </li>
          <li class="text-center" style="margin-top:40px;position:absolute;bottom:30px;left:0;right:0;">
            <el-button type="success" @click="onSubmit">保存订单</el-button>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <h3>{{currentPartName}}</h3>

        <div class="hide-content" v-bind:class="{'show-content' : index==0}">
          <el-form ref="orderAddForm" label-width="160px" style="padding-right: 20px">
            <el-form-item label="付款单据编号">
              {{billInfo.no }}
            </el-form-item>
            <el-form-item label="付款类型">
              {{billPayType(billInfo.billPayType)}}
            </el-form-item>
            <el-form-item label="付款单位">
              {{billInfo.orgName }}
            </el-form-item>
            <el-form-item label="付款方式">
              <dict :dict-group="'PaymentMethod'" :dict-key="billInfo.payType"></dict>
            </el-form-item>
            <el-form-item label="付款总金额">
              ¥ {{billInfo.amount | formatMoney}}
            </el-form-item>
            <el-form-item label="付款说明">
              {{billInfo.explain}}
            </el-form-item>
            <el-form-item label="审核意见">
              {{billInfo.auditOpinion}}
            </el-form-item>
            <el-form-item label-width="120px">
              <el-button type="primary" @click="index++">金额分配</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="hide-content" v-bind:class="{'show-content' : index==1}">

          <div class="oms-form order-product-box">
            <el-form ref="billInfoForm" :rules="billOrderRules" :model="billOrder" label-width="120px">
              <el-form-item label="订单" prop="accountsPayableDetailId">
                <el-select filterable remote placeholder="请输入货主订单号搜索订单" :remote-method="searchAccountsPayableDetailList"
                           :clearable="true" v-model="billOrder.accountsPayableDetailId"
                           @change="setOrderNo(billOrder.accountsPayableDetailId)">
                  <el-option :value="item.id" :key="item.id" :label="item.orderNo"
                             v-for="item in accountsPayableDetailList">
                    <div style="overflow: hidden">
                      <span class="pull-left" style="clear: right">货主订单号 {{item.orderNo}}</span>
                      <span class="pull-right" style="color: #999">
                        <span>创建时间</span> {{item.createTime | date}}
                      </span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left">
                        <span>单据金额</span> ¥ {{item.billAmount | formatMoney}}
                      </span>
                      <span class="select-other-info pull-left">
                        <span>已付金额</span> ¥ {{item.prepaidAccounts | formatMoney}}
                      </span>
                      <span class="select-other-info pull-left">
                        <span>未付金额</span> ¥ {{item.billAmount - item.prepaidAccounts | formatMoney}}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="金额" prop="amount">
                <oms-input type="text" v-model="billOrder.amount" @blur="formatPrice" placeholder="请输入金额,最多保留两位小数">
                  <template slot="prepend">¥</template>
                </oms-input>
              </el-form-item>
            </el-form>
            <div class="product-info-fix clearfix" v-if="billOrder.accountsPayableDetailId">
              <el-row>
                <el-col :span="12">
                  <oms-row label="货主订单号" :span="8">
                    {{billOrder.orderNo}}
                  </oms-row>
                  <oms-row label="创建时间" :span="8">
                    {{billOrder.createTime | date}}
                  </oms-row>
                  <oms-row label="单据金额" :span="8">
                    ¥ {{billOrder.billAmount | formatMoney}}
                  </oms-row>
                  <oms-row label="已付金额" :span="8">
                    ¥ {{billOrder.prepaidAccounts | formatMoney}}
                  </oms-row>
                  <oms-row label="未付金额" :span="8">
                    ¥ {{billOrder.billAmount - billOrder.prepaidAccounts | formatMoney}}
                  </oms-row>
                </el-col>
              </el-row>
            </div>
            <oms-form-row label="" :span="4">
              <el-button type="primary" @click="addBillOrder">加入订单</el-button>
            </oms-form-row>
            <div class="billOrder-list-detail">
              <h3 style="background: #13ce66;color: #fff">已分配订单</h3>
              <table class="table">
                <thead>
                <tr>
                  <th style="width:180px">货主订单号</th>
                  <th>金额</th>
                  <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in form.billOrderList">
                  <td>
                    <span>{{item.orderNo}}</span>
                  </td>
                  <td>
                    <span v-show="item.amount">¥</span>{{item.amount | formatMoney}}
                  </td>
                  <td><a href="#" @click.prevent="remove(item)"><i class="iconfont icon-delete"></i> 删除</a></td>
                </tr>
                <tr>
                  <td></td>
                  <td><span
                    style="color: #333;font-weight: 700">未分配金额:</span><span>¥ {{notTotalAmount | formatMoney}} </span>
                  </td>
                  <td><span style="color: #333;font-weight: 700"
                            v-show="form.billOrderList.length">已分配金额:</span><span
                    v-show="form.billOrderList.length">¥ {{totalAmount | formatMoney}} </span></td>
                  <td>
                    <el-tag type="success" v-if="notTotalAmount===0">已分配完成</el-tag>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {http, pay, BillPayable} from './../../../../../resources';
  import utils from '@/tools/utils';

  export default {
    name: 'allotmentForm',
    loading: false,
    props: {
      formItem: {
        type: Object,
        default: {},
        required: true
      }
    },
    data: function () {
      let checkAmount = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入金额,最多保留两位小数'));
        } else {
          if (this.notTotalAmount === 0) {
            callback(new Error('分配操作已经完成,无需再进行分配操作'));
          }
          let amount = parseInt(value, 0);
          if (amount > this.notTotalAmount) {
            callback(new Error('输入的金额必须小于等于未分配金额'));
          } else {
            callback();
          }
        }
      };
      return {
        loading: false,
        billOrder: {
          'accountsPayableDetailId': '',
          'orderNo': '',
          'amount': '',
          'createTime': '',
          'billAmount': '',
          'prepaidAccounts': ''
        },
        accountsPayableDetailList: [],
        form: {
          id: '',
          'billOrderList': []
        },
        currentPartName: '',
        index: 0,
        billOrderListSet: [
          {name: '付款单据', key: 0},
          {name: '金额分配', key: 1}
        ],
        billInfo: {},
        billOrderRules: {
          accountsPayableDetailId: [
            {required: true, message: '请选择订单', trigger: 'change'}
          ],
          amount: [
            {required: true, message: '请输入金额', trigger: 'change'},
            {validator: checkAmount, trigger: 'blur'}
          ]
        },
        doing: false
      };
    },
    computed: {
      notTotalAmount: function () {
        let notTotalAmount = 0;
        let practicalTotalAmount = 0;
        let payableTotalAmount = this.billInfo.amount;
        this.form.billOrderList.forEach(val => {
          practicalTotalAmount = practicalTotalAmount + val.amount;
        });
        if (payableTotalAmount) {
          notTotalAmount = payableTotalAmount - practicalTotalAmount;
        }
        return notTotalAmount;
      },
      totalAmount: function () {
        let totalAmount = 0;
        this.form.billOrderList.forEach(val => {
          totalAmount = totalAmount + val.amount;
        });
        return totalAmount;
      }
    },
    watch: {
      formItem: function (val) {
        this.billInfo = Object.assign({}, val);
      },
      index: function (val) {
        this.billOrderListSet.forEach((item) => {
          if (item.key === val) {
            this.currentPartName = item.name;
          }
        });
      },
      'billInfo.id': function (val) {
        if (!val) {
          this.resetForm();
        }
      }
    },
    mounted: function () {
      this.searchAccountsPayableDetailList();
    },
    methods: {
      setOrderNo: function (id) {
        if (id) {
          this.accountsPayableDetailList.forEach(val => {
            if (id === val.id) {
              this.billOrder.orderNo = val.orderNo;
              this.billOrder.createTime = val.createTime;
              this.billOrder.billAmount = val.billAmount;
              this.billOrder.prepaidAccounts = val.prepaidAccounts;
            }
          });
        }
      },
      addBillOrder: function () {
        this.$refs['billInfoForm'].validate((valid) => {
          if (valid) {
            // 将输入的订单和金额加入到列表中
            if (this.billOrder.accountsPayableDetailId && this.billOrder.amount) {
              let amount = parseInt(this.billOrder.amount, 0);
              this.form.billOrderList.push({
                accountsPayableDetailId: this.billOrder.accountsPayableDetailId,
                amount: amount,
                orderNo: this.billOrder.orderNo
              });
              // 清空表单
              this.$refs['billInfoForm'].resetFields();
            } else {
              this.$notify({
                duration: 2000,
                title: '警告',
                message: '请输入订单和金额再进行分配操作',
                type: 'error'
              });
            }
          } else {
            if (this.notTotalAmount === 0) {
              this.$notify({
                duration: 2000,
                title: '警告',
                message: '分配操作已经完成,无需再进行分配操作',
                type: 'warning'
              });
              // 清空表单
              this.$refs['billInfoForm'].resetFields();
            } else {
              this.$notify({
                duration: 2000,
                title: '警告',
                message: '请输入正确的订单和金额再进行分配操作',
                type: 'error'
              });
            }
          }
        });
      },
      billPayType: function (value) {
        let title = '';
        if (value === '0') {
          title = '疫苗厂商付款';
        } else {
          title = '物流厂商付款';
        }
        return title;
      },
      resetForm: function () {// 重置表单
        this.$refs['billInfoForm'].resetFields();
        this.billOrder = {'accountsPayableDetailId': '', 'orderNo': '', 'amount': ''};
        this.accountsPayableDetailList = [];
        this.form = {id: '', 'billOrderList': []};
        this.currentPartName = '';
        this.index = 0;
        this.billInfo = {};
      },
      formatPrice: function () {// 格式化金额，保留两位小数
        this.billOrder.amount = utils.autoformatDecimalPoint(this.billOrder.amount);
      },
      setIndexValue: function (value) {// 左侧显示页切换
        this.index = value;
      },
      doClose: function () {
        this.$emit('close');
      },
      searchAccountsPayableDetailList: function (query) {
        if (!this.billInfo.accountsPayableId) return;
        let params = Object.assign({}, {
          pageNo: 1,
          pageSize: 20,
          keyWord: query
        });
        pay.queryDetail(this.billInfo.accountsPayableId, params).then(res => {
          this.accountsPayableDetailList = res.data.list;
        });
      },
      remove: function (item) {
        this.form.billOrderList.splice(this.form.billOrderList.indexOf(item), 1);
        this.searchAccountsPayableDetailList();
      },
      onSubmit: function () {// 提交表单
        let self = this;
        if (this.doing) {
            this.index = 0;
            return false;
          }
        let saveData = JSON.parse(JSON.stringify(self.form));
        if (saveData.billOrderList.length === 0) {
          this.$notify({
            duration: 2000,
            message: '请进行分配金额操作',
            type: 'warning'
          });
          return false;
        }
        if (this.notTotalAmount !== 0) {
          this.$notify({
            duration: 2000,
            message: '金额未分配完,请继续进行分配金额操作',
            type: 'warning'
          });
          return false;
        }
        if (!this.form.id) {
          saveData.id = this.billInfo.id;
        }
        this.doing = true;
        BillPayable.banding(saveData.id, saveData).then(res => {
            this.resetForm();
            this.$notify({
              duration: 2000,
              message: '分配金额操作成功',
              type: 'success'
            });
            self.$emit('change', res.data);
            this.$nextTick(() => {
              this.doing = false;
              this.$emit('right-close');
            });
          }).catch(error => {
            this.doing = false;
            this.$notify({
              duration: 2000,
              title: '分配金额操作失败',
              message: error.response.data.msg,
              type: 'error'
            });
          });
      }
    }
  };
</script>
