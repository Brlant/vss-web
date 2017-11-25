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
        <h2 class="clearfix right-title">新增收款申请</h2>
        <ul>
          <li class="list-style" v-for="item in productListSet" @click="index = item.key"
              v-bind:class="{ 'active' : index==item.key}"><span>{{ item.name }}</span>
          </li>
          <li class="text-center" style="margin-top:40px;position:absolute;bottom:30px;left:0;right:0;">
            <el-button type="success" @click="onSubmit">保存</el-button>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <h3>新增收款作业申请</h3>

        <div class="hide-content" v-bind:class="{'show-content' : index==0}">
          <el-form ref="addForm" :rules="rules" :model="form" @submit.prevent="onSubmit" onsubmit="return false"
                   label-width="100px" style="padding-right: 20px">
            <el-form-item label="接种点" prop="orgId">
              <el-select filterable remote placeholder="请输入名称搜索接种点" :remote-method="filterOrg" :clearable="true"
                         v-model="form.orgId" popper-class="good-selects" @change="setAccountsPayableId"
                         @click.native.once="filterOrg('')">
                <el-option :value="org.subordinateId" :key="org.subordinateId" :label="org.subordinateName"
                           v-for="org in orgList">
                  <div style="overflow: hidden">
                    <span class="pull-left" style="clear: right">{{org.subordinateName}}</span>
                  </div>
                  <div style="overflow: hidden">
                  <span class="select-other-info pull-left">
                    <span>系统代码</span> {{org.subordinateCode}}
                  </span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="收款方式" prop="payType">
              <el-select placeholder="请选择收款方式" v-model="form.payType">
                <el-option :label="item.label" :value="item.key" :key="item.key" v-for="item in PaymentMethod"/>
              </el-select>
            </el-form-item>
            <el-form-item label="金额" prop="amount">
              <oms-input type="text" v-model="form.amount" placeholder="请选择收款明细，自动计算总额" disabled>
                <template slot="prepend">¥</template>
              </oms-input>
            </el-form-item>
            <el-form-item label="说明">
              <oms-input type="textarea" v-model="form.explain" placeholder="请输入备注信息"
                         :autosize="{ minRows: 2, maxRows: 5}"></oms-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="hide-content" v-bind:class="{'show-content' : index==1}">
          <pay-detail :selectPayments="selectPayments"
                      :factoryId="form.orgId" :amount="form.amount"></pay-detail>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { http, Address, BaseInfo, receivable, BillReceivable, cerpAction } from '../../../../../resources';
  import utils from '../../../../../tools/utils';
  import payDetail from './payDetail.vue';

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
    components: {
      payDetail
    },
    data: function () {
      return {
        loading: false,
        form: {
          type: '1',
          payType: '',
          orgId: '',
          explain: '',
          amount: '',
          billPayType: '',
          accountsPayableId: '',
          relationList: []
        },
        payableTotalAmount: '',
        practicalTotalAmount: '',
        notTotalAmount: '',
        rules: {
          billPayType: [
            {required: true, message: '请选择收款类型', trigger: 'change'}
          ],
          payType: [
            {required: true, message: '请选择收款方式', trigger: 'change'}
          ],
          orgId: [
            {required: true, message: '请选择接种点', trigger: 'change'}
          ],
          amount: [
            {required: true, message: '请选择收款明细，自动计算总额', trigger: 'blur'}
          ]
        },
        orgList: [],
        logisticsList: [],
        doing: false,
        productListSet: [
          {name: '基本信息', key: 0},
          {name: '收款明细', key: 1}
        ],
        index: 0,
        selectPayments: []
      };
    },
    computed: {
      PaymentMethod: function () {
        return this.$store.state.dict['PaymentMethod'];
      }
    },
    watch: {
      selectPayments: {
        handler (val) {
          let amount = 0;
          val.forEach(i => {
            amount += Number(i.payment);
          });
          this.form.amount = amount ? utils.autoformatDecimalPoint(amount.toString()) : '';
          this.form.relationList = val.map(m => {
            return {
              reconciliationId: m.id,
              paidMoney: m.payment
            };
          });
        },
        deep: true
      },
      defaultIndex (val) {
        this.form = {
          type: '1',
          payType: '',
          orgId: '',
          explain: '',
          amount: '',
          billPayType: '',
          accountsPayableId: '',
          relationList: []
        };
        this.$refs['addForm'].resetFields();
      }
    },
    mounted: function () {
      this.filterOrg();
    },
    methods: {
      setAccountsPayableId: function () {
        if (this.form.orgId) {
          this.filterOrg();
          this.orgList.forEach(val => {
            if (this.form.orgId === val.remitteeId) {
              this.form.accountsPayableId = val.id;
            }
          });
        }
      },
      changeBillPayType: function () {
        this.form.orgId = '';
        this.orgList = [];
        this.logisticsList = [];
        this.filterOrg();
      },
      resetForm: function () {// 重置表单
        this.$refs['addForm'].resetFields();
        this.payableTotalAmount = '';
        this.practicalTotalAmount = '';
        this.notTotalAmount = '';
        this.orgList = [];
        this.logisticsList = [];
        this.form.relationList = [];
      },
      formatPrice () {// 格式化单价，保留两位小数
        this.form.amount = utils.autoformatDecimalPoint(this.form.amount);
      },
      doClose: function () {
        this.$emit('close');
      },
      filterOrg: function (query) {// 过滤来源单位
        let params = Object.assign({}, {
          keyWord: query
        });
        cerpAction.queryAllPov(params).then(res => {
          this.orgList = res.data.list;
        });
      },
      onSubmit: function () {// 提交表单
        let isQualified = this.selectPayments.some(s => s.payment > (s.billAmount - s.prepaidAccounts));
        if (isQualified) {
          this.$notify.info({
            message: '收款明细中，存在本次收款金额大于待收金额的明细，请调整后，再进行保存'
          });
          return;
        }
        this.$refs['addForm'].validate((valid) => {
          if (!valid || this.doing) {
            return;
          }
          this.doing = true;
          BillReceivable.save(this.form).then(res => {
            this.resetForm();
            this.$notify({
              duration: 2000,
              message: '新增收款作业申请成功',
              type: 'success'
            });
            this.$emit('change', res.data);
            this.$nextTick(() => {
              this.doing = false;
              this.$emit('right-close');
            });
          }).catch(error => {
            this.doing = false;
            this.$notify({
              duration: 2000,
              title: '新增收款作业申请失败',
              message: error.response.data.msg,
              type: 'error'
            });
          });
        });
      }
    }
  };
</script>
