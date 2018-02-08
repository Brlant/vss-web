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

  .btn-submit-save {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    text-align: center;
    padding: 15px;
  }

  .invoice-list {
    margin-left: 30px;
    margin-bottom: 10px;
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
        <h2 class="clearfix right-title">收款申请详情</h2>
      </div>
      <div class="content-right min-gutter">
        <h3>收款申请详情</h3>
        <div>
          <el-form ref="auditForm" :rules="rules" :model="form" @submit.prevent="onSubmit" onsubmit="return false"
                   label-width="100px" style="padding-right: 20px">
            <el-form-item label="收款单据编号" class="mb0">
              {{form.no }}
            </el-form-item>
            <el-form-item label="收款单位" class="mb0">
              {{form.orgName }}
            </el-form-item>
            <el-form-item label="收款方式" class="mb0">
              <dict :dict-group="'PaymentMethod'" :dict-key="form.payType"></dict>
            </el-form-item>
            <el-form-item label="收款金额" class="mb0">
              ¥ {{form.amount | formatMoney}}
            </el-form-item>
            <el-form-item label="收款说明" class="mb0">
              {{form.explain}}
            </el-form-item>
            <el-form-item label="创建人" class="mb0">
              {{form.createName}}
            </el-form-item>
            <el-form-item label="创建时间" class="mb0">
              {{form.createTime | minute}}
            </el-form-item>
            <el-form-item label="收款明细" class="mb0">
              <span v-show="!form.detailList.length">无</span>
              <span v-show="form.detailList.length">(共{{ form.detailList.length }}条)</span>
            </el-form-item>
            <ul class="show-list invoice-list"
                v-show="form.detailList.length">
              <li class="show-item" style="background: #f1f1f1">
                <el-row type="flex">
                  <el-col :span="8">货品名称 </el-col>
                  <el-col :span="2">数量</el-col>
                  <el-col :span="6">订单号 </el-col>
                  <el-col :span="4">发生时间</el-col>
                  <el-col :span="4">本次收款金额 </el-col>
                </el-row>
              </li>
              <li class="show-item" v-for="item in form.detailList">
                <el-row type="flex">
                  <el-col :span="8">{{ item.goodsName }} </el-col>
                  <el-col :span="2">{{ item.count }}</el-col>
                  <el-col :span="6">{{ item.orderNo }} </el-col>
                  <el-col :span="4">{{ item.createTime | date }}</el-col>
                  <el-col :span="4"> ￥{{item.paidMoney | formatMoney}} </el-col>
                </el-row>
              </li>
            </ul>
            <el-form-item label="审批意见">
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
            </el-form-item>
          </el-form>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { BillReceivable, http } from '../../../../../resources';

  export default {
    name: 'auditForm',
    loading: false,
    props: {
      formItem: {
        type: Object,
        default: {},
        required: true
      },
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
      formItem: function (val) {
        this.form = {
          detailList: []
        };
        if (!val.id) return;
        this.queryDetail(val.id);
      }
    },

    methods: {
      queryDetail (key) {
        http.get(`/bill-receivable/${key}`).then(res => {
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
        this.$confirm('确认通过对' + this.form.orgName + '的收款作业的审核?', '', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          BillReceivable.auditInfo(this.form.id, {
            auditOpinion: this.form.auditOpinion
          }).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: this.form.orgName + '的收款作业申请的已审核通过'
            });
            this.$emit('change', this.form);
            this.$emit('right-close');
          }).catch(() => {
            this.$notify.error({
              duration: 2000,
              message: this.form.orgName + '的收款作业申请的审核通过失败'
            });
          });
        });
      },
      notAudited: function () {
        this.$confirm('确认不通过对' + this.form.orgName + '的收款作业的审核?', '', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          BillReceivable.refusedInfo(this.form.id, {auditOpinion: this.form.auditOpinion}).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: this.form.orgName + '的收款作业申请的审核未通过'
            });
            this.$emit('change', this.form);
            this.$emit('right-close');
          }).catch(() => {
            this.$notify.error({
              duration: 2000,
              message: this.form.orgName + '的收款作业申请的审核未通过失败'
            });
          });
        });
      }
    }
  };
</script>
