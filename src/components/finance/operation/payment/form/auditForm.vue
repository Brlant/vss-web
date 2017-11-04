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
      .el-form-form {
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

  .btn-submit-save {
    margin-top: 150px;
  }

  .invoice-list {
    margin-left: 30px;
    .show-item {
      border-bottom: 1px solid #f1f1f1;
      line-height: 20px;
      .el-row {
        align-items: center;
        .el-col {
          padding-left: 5px;
          padding-right: 5px;
        }
      }
    }
  }

  .mb0 {
    margin-bottom: 0;
  }
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">付款申请详情</h2>
        <div class="btn-submit-save" v-if="form.status==='0'">
          <div style="margin-bottom: 10px">
            <el-button style="width: 100px" :plain="true" type="success" @click="audited" native-type="submit">审核通过
            </el-button>
          </div>
          <div style="margin-bottom: 10px">
            <el-button style="width: 100px" :plain="true" type="danger" @click="notAudited" native-type="submit">
              审核不通过
            </el-button>
          </div>
        </div>
      </div>
      <div class="content-right min-gutter">
        <h3>付款申请详情</h3>
        <div>
          <el-form ref="auditForm" :rules="rules" :model="form" @submit.prevent="onSubmit" onsubmit="return false"
                   label-width="100px" style="padding-right: 20px">
            <el-form-item label="付款单据编号" class="mb0">
              {{form.no }}
            </el-form-item>
            <el-form-item label="付款类型" class="mb0">
              {{billPayType(form.billPayType)}}
            </el-form-item>
            <el-form-item label="付款单位" class="mb0">
              {{form.orgName }}
            </el-form-item>
            <el-form-item label="付款方式" class="mb0">
              <dict :dict-group="'PaymentMethod'" :dict-key="form.payType"></dict>
            </el-form-item>
            <el-form-item label="付款金额" class="mb0">
              ¥ {{form.amount | formatMoney}}
            </el-form-item>
            <el-form-item label="付款说明" class="mb0">
              {{form.explain}}
            </el-form-item>
            <el-form-item label="付款单位发票" class="mb0">
            </el-form-item>
            <ul class="show-list invoice-list" v-show="form.invoiceList && form.invoiceList.length">
              <li class="show-item" style="background: #f1f1f1">
                <el-row type="flex">
                  <el-col :span="12">发票号 </el-col>
                  <el-col :span="12">金额 </el-col>
                </el-row>
              </li>
              <li class="show-item" v-for="item in form.invoiceList">
                <el-row type="flex">
                  <el-col :span="12"> {{ item.invoiceNumber }}</el-col>
                  <el-col :span="12"> ￥{{ item.amount | formatMoney}}</el-col>
                </el-row>
              </li>
            </ul>
            <el-form-item label="付款明细" class="mb0"></el-form-item>
            <ul class="show-list invoice-list"
                v-show="form.reconciliationDetailList && form.reconciliationDetailList.length">
              <li class="show-item" style="background: #f1f1f1">
                <el-row type="flex">
                  <el-col :span="8">货品名称 </el-col>
                  <el-col :span="6">订单号 </el-col>
                  <el-col :span="5">金额 </el-col>
                  <el-col :span="5">创建时间 </el-col>
                </el-row>
              </li>
              <li class="show-item" v-for="item in form.reconciliationDetailList">
                <el-row type="flex">
                  <el-col :span="8">{{ item.goodsName }} </el-col>
                  <el-col :span="6">{{ item.orderNo }} </el-col>
                  <el-col :span="5"> ￥{{item.billAmount | formatMoney}} </el-col>
                  <el-col :span="5">{{ item.createTime | date }} </el-col>
                </el-row>
              </li>
            </ul>
            <el-form-item label="审批意见" style="margin-top: 10px">
              <oms-input type="textarea" v-model="form.auditOpinion" placeholder="请输入备注信息"
                         :autosize="{ minRows: 2, maxRows: 5}"></oms-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {http, Address, BaseInfo, pay, BillPayable} from '../../../../../resources';
  import utils from '../../../../../tools/utils';
  export default {
    name: 'auditForm',
    loading: false,
    props: {
      detailId: '',
      action: {
        type: String,
        default: ''
      }
    },
    data: function () {
      return {
        loading: false,
        form: {},
        payableTotalAmount: '',
        practicalTotalAmount: '',
        notTotalAmount: '',
        rules: {},
        orgList: [],
        logisticsList: [],
        doing: false
      };
    },
    computed: {},
    watch: {
      detailId: function (val) {
        if (!val) return;
        this.queryDetail(val);
      }
    },
    mounted: function () {
    },
    methods: {
      queryDetail (key) {
        http.get(`/bill-payable/${key}`).then(res => {
          this.form = res.data;
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
        this.$refs['auditForm'].resetFields();
        this.payableTotalAmount = '';
        this.practicalTotalAmount = '';
        this.notTotalAmount = '';
        this.orgList = [];
        this.logisticsList = [];
      },
      doClose: function () {
        this.$emit('close');
      },
      audited: function () {
        this.$confirm('确认通过对' + this.form.orgName + '的付款作业的审核?', '', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          BillPayable.auditInfo(this.form.id, {
            auditOpinion: this.form.auditOpinion}).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: this.form.orgName + '的付款作业申请的已审核通过'
            });
            this.$emit('change', this.form);
            this.$emit('right-close');
          }).catch(() => {
            this.$notify.error({
              duration: 2000,
              message: this.form.orgName + '的付款作业申请的审核通过失败'
            });
          });
        });
      },
      notAudited: function () {
        this.$confirm('确认不通过对' + this.form.orgName + '的付款作业的审核?', '', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          BillPayable.refusedInfo(this.form.id, {auditOpinion: this.form.auditOpinion}).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: this.form.orgName + '的付款作业申请的审核未通过'
            });
            this.$emit('change', this.form);
            this.$emit('right-close');
          }).catch(() => {
            this.$notify.error({
              duration: 2000,
              message: this.form.orgName + '的付款作业申请的审核未通过失败'
            });
          });
        });
      }
    }
  };
</script>
