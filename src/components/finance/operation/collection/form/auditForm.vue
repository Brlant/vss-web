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
      &:hover {
        background: $dialog-left-bg;
      }
    }
  }

  .mb0 {
    margin-bottom: 0;
  }

  .delete-icon {
    &:hover {
      color: $activeColor
    }
    cursor: pointer;
    .el-icon-t-remove {
      vertical-align: middle;
      font-size: 20px;
    }
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
            <el-form-item :label="`${titleAry[type][2]}单据编号`" class="mb0">
              {{form.no }}
            </el-form-item>
            <el-form-item :label="titleAry[type][3]" class="mb0">
              {{form.orgName }}
            </el-form-item>
            <el-form-item :label="`${titleAry[type][2]}方式`" class="mb0">
              <dict :dict-group="'PaymentMethod'" :dict-key="form.payType"></dict>
            </el-form-item>
            <el-form-item :label="`${titleAry[type][2]}金额`" class="mb0">
              ¥ {{form.amount | formatMoney}}
            </el-form-item>
            <el-form-item :label="`${titleAry[type][2]}说明`" class="mb0">
              {{form.explain}}
            </el-form-item>
            <el-form-item label="创建人" class="mb0">
              {{form.createName}}
            </el-form-item>
            <el-form-item label="创建时间" class="mb0">
              {{form.createTime | minute}}
            </el-form-item>
            <el-form-item label="状态" class="mb0">
              {{getOrderStatus(form)}}
            </el-form-item>
            <el-form-item :label="`${titleAry[type][2]}明细`" class="mb0">
              <span v-show="!form.detailList.length">无</span>
              <span v-show="form.detailList.length">(共{{ form.detailList.length }}条)</span>
            </el-form-item>
            <ul class="show-list invoice-list"
                v-show="form.detailList.length">
              <li class="show-item" style="background: #f1f1f1">
                <el-row type="flex">
                  <el-col :span="form.status==='0'?6:8">货品名称</el-col>
                  <el-col :span="2">数量</el-col>
                  <el-col :span="form.status==='0'?5:6">订单号</el-col>
                  <el-col :span="4">发生时间</el-col>
                  <el-col :span="4">本次收款金额</el-col>
                  <el-col :span="3" v-show="form.status ==='0'">操作</el-col>
                </el-row>
              </li>
              <li class="show-item" v-for="item in form.detailList">
                <el-row type="flex">
                  <el-col :span="form.status==='0'?6:8">{{ item.goodsName }}</el-col>
                  <el-col :span="2">{{ item.count }}</el-col>
                  <el-col :span="form.status==='0'?5:6">{{ item.orderNo }}</el-col>
                  <el-col :span="4">{{ item.createTime | date }}</el-col>
                  <el-col :span="4"> ￥{{item.paidMoney | formatMoney}}</el-col>
                  <el-col :span="3" v-show="form.status ==='0'">
                    <perm label="payment-receivable-audit">
                      <span class="delete-icon" @click.stop.prevent="deleteDetailItem(item)">
                          <i class="el-icon-t-remove"></i><span>删除</span>
                      </span>
                    </perm>
                  </el-col>
                </el-row>
              </li>
            </ul>
            <el-form-item label="审核意见">
              <oms-input v-show="form.status ==='0' || form.status ==='-1'" type="textarea"
                         v-model="form.auditOpinion" placeholder="请输入审核意见"
                         :autosize="{ minRows: 2, maxRows: 5}"></oms-input>
              <span v-show="form.status!=='0' && form.status !=='-1'">
                 <span v-show="!form.auditOpinion">无</span>
                <span v-show="form.auditOpinion">{{ form.auditedName }}   {{ form.auditTime | minute
                  }}  {{ form.auditOpinion }}</span>
              </span>
            </el-form-item>
            <el-form-item style="margin-top: 10px">
              <div v-if="type===1">
                <perm :label="perms[1]" v-show="form.status === '0'">
                  <el-button  plain :disabled="doing" type="success" @click="audited">审核通过</el-button>
                </perm>
                <perm :label="perms[2]">
                  <el-button v-show="isShowButton" plain :disabled="doing" @click="cancelItem">取消</el-button>
                </perm>
              </div>
              <div v-else>
                <perm :label="perms[1]" v-show="form.status === '-1'">
                  <el-button  plain :disabled="doing" type="success" @click="audited">审核通过</el-button>
                </perm>
                <perm :label="perms[2]" v-show="form.status === '1'">
                  <el-button  plain :disabled="doing" type="success" @click="audited">审核通过</el-button>
                </perm>
                <perm :label="perms[3]">
                  <el-button v-show="isShowButton" plain :disabled="doing" @click="cancelItem">取消</el-button>
                </perm>
              </div>
            </el-form-item>
          </el-form>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { CDCReceipt, http, POVPayment } from '@/resources';

  export default {
    name: 'auditForm',
    loading: false,
    props: {
      formItem: {
        type: Object,
        default: {},
        required: true
      },
      type: Number,
      titleAry: Object,
      getOrderStatus: Function,
      perms: Array
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
    computed: {
      isShowButton () {
        let {type, formItem} = this;
        let {status} = formItem;
        return type === 1 && status === '0' || type === 2 && (status === '-1' || status === '1');
      }
    },
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
        if (this.doing) return;
        this.$confirmOpera('确认审核通过?', () => {
          this.doing = true;
          let {formItem} = this;
          let url = {
            '0': POVPayment.audit,
            '-1': CDCReceipt.audit,
            '1': CDCReceipt.review
          };
          const auditOpinion = this.form.auditOpinion;
          let httpRequest = url[formItem.status](formItem.id, {auditOpinion});
          this.$httpRequestOpera(httpRequest, {
            successTitle: '审核通过',
            errorTitle: '审核失败',
            success: res => {
              this.doing = false;
              this.$emit('change');
              this.$emit('right-close');
            },
            error: res => {
              this.doing = false;
              this.$emit('change');
            }
          });
        });
      },
      cancelItem () {
        this.$confirmOpera('确认取消' + this.titleAry[this.type][0] + '？', () => {
          this.doing = true;
          let httpRequest = this.$http.put(`/pov-bill/cancel/${this.formItem.id}`);
          this.$httpRequestOpera(httpRequest, {
            successTitle: '取消成功',
            errorTitle: '取消失败',
            success: res => {
              this.doing = false;
              this.$emit('change');
              this.$emit('right-close');
            },
            error: res => {
              this.doing = false;
              this.$emit('change');
            }
          });
        });
      }
    }
  };
</script>
