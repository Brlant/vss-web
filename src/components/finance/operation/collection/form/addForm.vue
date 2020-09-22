<style lang="scss" scoped>
@import "../../../../../assets/mixins.scss";

$leftWidth: 200px;

.el-form .el-checkbox__label {
  font-size: 12px;
  padding-left: 5px;
}

.el-form .el-checkbox__inner {
  width: 14px;
  height: 14px;
}

.content-part {
  .content-left {
    text-align: center;
    width: $leftWidth;
  }

  .content-right {
    > h3 {
      left: $leftWidth;
    }

    left: $leftWidth;
  }
}

.el-form .el-select {
  display: block;
}

.ml15 {
  margin-left: 40px;
}

.combinatioon-product {
  color: #777
}

.el-select-dropdown__item {
  height: auto;
}

.productItem-info {
  float: left;
}

.ar {
  text-align: right;
}

.content-part .content-left .list-style {
  .pay-count {
    display: inline;
    padding: 0;
  }

  span {
    padding: 8px 20px;
  }
}

</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">新增{{titleAry[type][0]}}</h2>
        <ul>
          <li v-for="item in productListSet" class="list-style" v-bind:class="{ 'active' : index===item.key}"
              @click="index = item.key">
            <span>
              {{ item.name }}<span v-show="selectPayments.length && item.key === 2" class="pay-count"> ({{selectPayments.length}})</span>
            </span>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <h3>新增{{titleAry[type][0]}}</h3>

        <div class="hide-content" v-bind:class="{'show-content' : index===0}">
          <el-form ref="addForm" :model="form" label-width="110px" onsubmit="return false"
                   style="padding-right: 20px" @submit.prevent="onSubmit">
            <el-form-item v-show="form.amount" :label="`${titleAry[type][2]}总金额:`">
              ￥{{form.amount}}
            </el-form-item>
            <el-form-item v-show="payPendingMoney" :label="`使用预${titleAry[type][2]}`">
              <el-switch v-model="form.advancePaymentFlag"
                         active-text="是" inactive-text="否" @change="advancePaymentFlagChange"></el-switch>
            </el-form-item>
            <el-form-item v-if="(payPendingMoney - form.amount < 0) && form.advancePaymentFlag || !form.advancePaymentFlag" :label="`${form.advancePaymentFlag ? '其他' : ''}${titleAry[type][2]}方式`"
                          :rules="{required: true, message: `请选择${titleAry[type][2]}方式`, trigger: 'change'}"
                          prop="payType">
              <el-radio-group v-model="form.payType">
                <el-radio v-for="item in PaymentMethod" :key="item.key" :label="item.key">
                  {{item.label}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-show="form.advancePaymentFlag" :label="`${titleAry[type][2]}来源:`">
              <div :style="{'line-height': payPendingMoney - form.amount < 0 ? '24px' : 'inherit' }">
                <el-tag type="primary">预{{titleAry[type][2]}}</el-tag>
                ￥{{payPendingMoney | formatMoney}}
              </div>
              <div v-if="payPendingMoney - form.amount < 0" style="line-height: 24px">
                <el-tag type="primary">
                  <span v-show="!form.payType">其他</span>
                  <dict :dict-group="'PaymentMethod'" :dict-key="form.payType"></dict>
                </el-tag>
                ￥{{(form.amount-payPendingMoney) | formatMoney}}
              </div>
            </el-form-item>

            <el-form-item label="说明">
              <oms-input v-model="form.explain" :autosize="{ minRows: 2, maxRows: 5}" placeholder="请输入说明"
                         type="textarea"></oms-input>
            </el-form-item>
            <el-form-item>
              <el-button :disabled="doing" type="success" @click="onSubmit">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="hide-content show-content">
          <pay-detail ref="payDetail" :amount="form.amount" :defaultIndex="defaultIndex" :factoryId="form.orgId"
                      :index="index"
                      :selectPayments="selectPayments" :titleAry="titleAry" :type="type"
                      @orgChange="orgChange"></pay-detail>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {CDCReceipt, PaymentPending, POVPayment} from '../../../../../resources';
import utils from '../../../../../tools/utils';
import payDetail from './payDetail.vue';

export default {
  name: 'addForm',
  loading: false,
  props: {
    type: Number,
    titleAry: Object,
    defaultIndex: {
      type: Number,
      default: 0
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
        advancePaymentFlag: false,
        orgId: '',
        explain: '',
        amount: '',
        accountsPayableId: '',
        relationList: []
      },
      payableTotalAmount: '',
      practicalTotalAmount: '',
      notTotalAmount: '',
      orgList: [],
      logisticsList: [],
      doing: false,
      index: 1,
      selectPayments: [],
      payPendingMoney: 0
    };
  },
  computed: {
    PaymentMethod: function () {
      return this.$getDict('PaymentMethod');
    },
    productListSet() {
      let {titleAry, type} = this;
      return [
        {name: `可选${titleAry[type][2]}明细`, key: 1},
        {name: `已选${titleAry[type][2]}明细`, key: 2},
        {name: `${titleAry[type][2]}方式`, key: 0}
      ];
    }
  },
  watch: {
    selectPayments: {
      handler(val) {
        let amount = 0;
        val.forEach(i => {
          amount += Number(i.payment);
        });
        this.form.amount = amount ? utils.autoformatDecimalPoint(amount.toString()) : '0.00';
        this.form.relationList = val.map(m => {
          return {
            reconciliationId: m.id,
            paidMoney: m.payment
          };
        });
      },
      deep: true
    },
    defaultIndex(val) {
      this.form = {
        type: '1',
        payType: '',
        advancePaymentFlag: false,
        orgId: '',
        explain: '',
        amount: '',
        accountsPayableId: '',
        relationList: []
      };
      this.index = 1;
      this.selectPayments = [];
      this.$refs['addForm'].resetFields();
    },
    payPendingMoney(val) {
      this.form.advancePaymentFlag = !!val;
    }
  },
  mounted: function () {

  },
  methods: {
    resetForm: function () {// 重置表单
      this.$refs['addForm'].resetFields();
      this.payableTotalAmount = '';
      this.practicalTotalAmount = '';
      this.notTotalAmount = '';
      this.orgList = [];
      this.logisticsList = [];
      this.form.relationList = [];
    },
    formatPrice() {// 格式化单价，保留两位小数
      this.form.amount = utils.autoformatDecimalPoint(this.form.amount);
    },
    doClose: function () {
      this.$emit('close');
    },
    payTypeChange(val) {
      if (val) {
        let o1 = this.$store.state.user.userCompanyAddress;
        let o2 = this.$refs.payDetail.searchCondition.orgId;
        if (!o1 || !o2) return;
        let params = {
          povId: this.type === 1 ? o1 : o2,
          cdcId: this.type === 1 ? o2 : o1
        };
        PaymentPending.queryPaymentTotal(params).then(res => {
          this.payPendingMoney = res.data.money;
        });
      }
    },
    orgChange() {
      this.payPendingMoney = 0;
      this.payTypeChange(true);
    },
    advancePaymentFlagChange(val) {
      this.form.payType = '';
      this.payTypeChange(val);
    },
    onSubmit: function () {// 提交表单
      let {titleAry, type} = this;
      let title = titleAry[type][2];
      if (!this.selectPayments.length) {
        return this.$notify.info({
          message: `请选择${title}明细`
        });
      }
      let isQualified = this.selectPayments.some(s => !s.payment);
      if (isQualified) {
        this.$notify.info({
          message: `${title}明细中，存在本次${title}金额为0的情况，请调整后，再进行保存`
        });
        return;
      }
      isQualified = this.selectPayments.some(s => s.payment && s.payment > s.billAmount);
      if (isQualified) {
        this.$notify.info({
          message: `${title}明细中，存在本次${title}金额大于待${title}金额的明细，请调整后，再进行保存`
        });
        return;
      }
      isQualified = this.selectPayments.some(s => s.payment < 0 && s.payment < s.billAmount);
      if (isQualified) {
        this.$notify.info({
          message: `${title}明细中，存在本次${title}金额小于待${title}金额的明细，请调整后，再进行保存`
        });
        return;
      }
      this.form[type === 1 ? 'cdcId' : 'povId'] = this.$refs.payDetail.searchCondition.orgId;
      this.$refs['addForm'].validate((valid) => {
        if (!valid || this.doing) {
          this.index = 0;
          return;
        }
        this.doing = true;
        const http = type === 1 ? POVPayment.save : CDCReceipt.save;
        http(this.form).then(res => {
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
            message: error.response && error.response.data && error.response.data.msg || '网络异常',
            type: 'error'
          });
        });
      });
    }
  }
};
</script>
