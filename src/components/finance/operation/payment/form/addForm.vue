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
        background-color: $activeColor;
        border-radius: 20px;
        color: $activeColorFont
      }
    }
    &:hover {
      background: #dee9eb
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

  .ml15 {
    margin-left: 40px;
  }

  .combinatioon-product {
    color: #777
  }

  .productItem-info {
    float: left;
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
          <li class="list-style" v-for="item in productListSet" @click="index = item.key"
              v-bind:class="{ 'active' : index==item.key}"><span>{{ item.name }}</span>
          </li>
          <li class="text-center" style="margin-top:40px;position:absolute;bottom:30px;left:0;right:0;">
            <el-button type="success" @click="onSubmit" :disabled="doing">保存</el-button>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <h3>新增付款作业申请</h3>

        <div class="hide-content" v-bind:class="{'show-content' : index==0}">
          <el-form ref="addForm" :rules="rules" :model="form" @submit.prevent="onSubmit" onsubmit="return false"
                   label-width="100px" style="padding-right: 20px">
            <el-form-item label="发票付款" prop="billPayType">
              <el-switch
                v-model="form.billPayType"
                active-text="有"
                inactive-text="无"
                active-value="1"
                inactive-value="0"
                @change="changeBillPayType"
              >
              </el-switch>
            </el-form-item>
            <el-form-item label="收款单位" prop="orgId">
              <el-select filterable remote placeholder="请输入名称搜索收款单位" :remote-method="filterOrg" :clearable="true"
                         v-model="form.orgId" @click.native.once="filterOrg('')">
                <el-option :value="org.remitteeId" :key="org.remitteeId" :label="org.remitteeName"
                           v-for="org in orgList">
                  <div style="overflow: hidden">
                    <span class="pull-left" style="clear: right">{{org.remitteeName}}</span>
                    <span class="pull-right" style="color: #999">
                  </span>
                  </div>
                  <div style="overflow: hidden">
                    <span class="select-other-info pull-left">
                    <span>系统代码:</span>{{org.remitteeManufacturerCode}}
                    </span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="付款方式" prop="payType">
              <el-select placeholder="请选择付款方式" v-model="form.payType">
                <el-option :label="item.label" :value="item.key" :key="item.key" v-for="item in PaymentMethod"/>
              </el-select>
            </el-form-item>
            <el-form-item label="付款金额" prop="amount">
              <oms-input type="text" v-model="form.amount" @blur="formatPrice" placeholder="请选择付款明细，自动计算总额" disabled>
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
          <pay-detail :selectPayments="selectPayments" :billPayType="form.billPayType"
                      :factoryId="form.orgId" :amount="form.amount"></pay-detail>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {BillPayable, pay} from '../../../../../resources';
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
          type: '0',
          payType: '2',
          orgId: '',
          explain: '',
          amount: '',
          billPayType: '0',
          relationList: []
        },
        rules: {
          billPayType: [
            {required: true, message: '请选择是否发票付款', trigger: 'change'}
          ],
          payType: [
            {required: true, message: '请选择付款方式', trigger: 'change'}
          ],
          orgId: [
            {required: true, message: '请选择收款单位', trigger: 'change'}
          ],
          amount: [
            {required: true, message: '请选择付款明细，自动计算总额', trigger: 'blur'}
          ]
        },
        orgList: [],
        logisticsList: [],
        doing: false,
        productListSet: [
          {name: '基本信息', key: 0},
          {name: '付款明细', key: 1}
        ],
        index: 0,
        selectPayments: []
      };
    },
    computed: {
      PaymentMethod: function () {
        return this.$getDict('PaymentMethod');
      },
      orgLevel() {
        return this.$store.state.orgLevel;
      }
    },
    watch: {
      selectPayments: {
        handler(val) {
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
      defaultIndex(val) {
        this.form = {
          type: '0',
          payType: '2',
          orgId: '',
          explain: '',
          amount: '',
          billPayType: '0',
          relationList: []
        };
        this.index = 0;
        this.selectPayments = [];
        this.$refs['addForm'].resetFields();
      }
    },
    mounted: function () {
    },
    methods: {
      changeBillPayType: function () {
        this.selectPayments = [];
      },
      resetForm: function () {// 重置表单
        this.$refs['addForm'].resetFields();
        this.orgList = [];
        this.logisticsList = [];
      },
      formatPrice() {// 格式化单价，保留两位小数
        this.form.amount = utils.autoformatDecimalPoint(this.form.amount);
      },
      doClose: function () {
        this.$emit('close');
      },
      filterOrg: function (query) {// 收款单位
        let params = Object.assign({}, {
          pageNo: 1,
          pageSize: 20,
          keyWord: query
        });
        pay.query(params).then(res => {
          this.orgList = res.data.list;
        });
      },
      onSubmit: function () {// 提交表单
        let isQualified = this.selectPayments.some(s => !s.payment);
        if (isQualified) {
          this.$notify.info({
            message: '付款明细中，存在本次付款金额为0的情况，请调整后，再进行保存'
          });
          return;
        }
        isQualified = this.selectPayments.some(s => s.payment && s.payment > (s.billAmount - s.prepaidAccounts));
        if (isQualified) {
          this.$notify.info({
            message: '付款明细中，存在本次付款金额大于待付金额的明细，请调整后，再进行保存'
          });
          return;
        }
        isQualified = this.selectPayments.some(s => s.payment < 0 && s.payment < (s.billAmount - s.prepaidAccounts));
        if (isQualified) {
          this.$notify.info({
            message: '付款明细中，存在本次付款金额小于待付金额的明细，请调整后，再进行保存'
          });
          return;
        }
        this.$refs['addForm'].validate((valid) => {
          if (!valid || this.doing) {
            this.index = 0;
            return;
          }
          this.doing = true;
          BillPayable.save(this.form).then(res => {
            this.resetForm();
            this.$notify({
              duration: 2000,
              message: '新增付款作业申请成功',
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
