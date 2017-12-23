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

  .order-good-selects {
    .el-select-dropdown__item {
      height: auto;
      width: 680px;
    }
  }

  .ar {
    text-align: right;
  }

  .btn-submit-save {
    position: absolute;
    bottom: 50px;
    left: 0;
    right: 0;
    z-index: 1;
    text-align: center;
    padding: 15px;
  }

  .invoice-list {
    margin-left: 30px;
    max-height: 300px;
    overflow: auto;
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
      </div>
      <div class="content-right min-gutter">
        <h3>付款申请详情</h3>
        <div>
          <el-form ref="auditForm" :rules="rules" :model="form" @submit.prevent="onSubmit" onsubmit="return false"
                   label-width="100px" style="padding-right: 20px">
            <el-form-item label="发票付款" class="mb0">
              {{form.billPayType === '0' ? '无' : '有' }}
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
            <el-form-item label="创建人" class="mb0">
              {{form.createName}}
            </el-form-item>
            <el-form-item label="创建时间" class="mb0">
              {{form.createTime | minute}}
            </el-form-item>
            <el-form-item label="付款明细" class="mb0">
              <span v-if="!form.detailList.length">无</span>
              <span v-show="form.detailList.length">(共{{ form.detailList.length }}条)</span>
            </el-form-item>
            <ul class="show-list invoice-list"
                v-if="form.detailList.length">
              <li class="show-item" style="background: #f1f1f1">
                <el-row type="flex">
                  <el-col :span="form.billPayType === '1' ? 6 : 7">货品名称</el-col>
                  <el-col :span="2">数量</el-col>
                  <el-col :span="form.billPayType === '1' ? 5 : 6">订单号</el-col>
                  <el-col :span="4" v-show="form.billPayType === '1'">关联发票号</el-col>
                  <el-col :span="form.billPayType === '1' ? 4 : 5">发生时间</el-col>
                  <el-col :span="form.billPayType === '1' ? 3 : 4">本次付款金额 </el-col>
                </el-row>
              </li>
              <li class="show-item" v-for="item in form.detailList">
                <el-row type="flex">
                  <el-col :span="form.billPayType === '1' ? 6 : 7">{{ item.goodsName }}</el-col>
                  <el-col :span="2">{{ item.count }}</el-col>
                  <el-col :span="form.billPayType === '1' ? 5 : 6">{{ item.orderNo }} </el-col>
                  <el-col :span="4" v-show="form.billPayType === '1'" class="break-word">
                    {{ item.invoiceNo ? item.invoiceNo : '无' }}
                  </el-col>
                  <el-col :span="form.billPayType === '1' ? 4 : 5">{{ item.createTime | date }}</el-col>
                  <el-col :span="form.billPayType === '1' ? 3 : 4"> ￥{{item.paidMoney | formatMoney}} </el-col>
                </el-row>
              </li>
            </ul>
            <el-form-item label="审批意见" style="margin-top: 10px">
              <oms-input v-show="form.status ==='0'" type="textarea" v-model="form.auditOpinion" placeholder="请输入审批意见"
                         :autosize="{ minRows: 2, maxRows: 5}"></oms-input>
              <span v-show="form.status!=='0'">
                <span v-show="!form.auditOpinion">无</span>
                <span v-show="form.auditOpinion">{{ form.auditedName }}   {{ form.auditTime | minute
                  }}  {{ form.auditOpinion }}</span>
              </span>
            </el-form-item>
            <el-form-item style="margin-top: 10px">
              <el-button v-show="form.status ==='0'" style="width: 100px" :plain="true" type="success" @click="audited"
                         native-type="submit">审核通过
              </el-button>
              <el-button v-show="form.status ==='0'" style="width: 100px" :plain="true" type="danger"
                         @click="notAudited"
                         native-type="submit">
                审核不通过
              </el-button>
              <el-button v-show="form.status ==='1'" style="width: 100px" :plain="true" type="danger" @click="review"
                         native-type="submit">
                通过复核
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { BillPayable, http } from '../../../../../resources';

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
        form: {
          detailList: []
        },
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
        this.form = {
          detailList: []
        };
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
            auditOpinion: this.form.auditOpinion
          }).then(() => {
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
      },
      review: function () {
        this.$confirm('确认通过对' + this.form.orgName + '的付款作业的复核?', '', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.put(`/bill-payable/review/${this.form.id}`).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: this.form.orgName + '的付款作业申请的复核未通过'
            });
            this.$emit('change', this.form);
            this.$emit('right-close');
          }).catch(() => {
            this.$notify.error({
              duration: 2000,
              message: this.form.orgName + '的付款作业申请的复核未通过失败'
            });
          });
        });
      }
    }
  };
</script>
