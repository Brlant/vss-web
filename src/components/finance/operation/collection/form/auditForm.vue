<style lang="scss" scoped>
@import "../../../../../assets/mixins.scss";

$leftWidth: 0;

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
  /*margin-top: 10px;*/
  margin-bottom: 10px;

  .show-item {
    padding: 8px 0;
    border-bottom: 1px solid #f1f1f1;
    /*line-height: 20px;*/
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

.oms-row {
  font-size: 14px;
}

.detail-title {
  font-size: 14px;
  margin-top: 10px;
}
</style>

<template>
  <div>
    <div class="content-part">
      <!--<div class="content-left">-->
      <!--<h2 class="clearfix right-title">{{titleAry[type][0]}}详情</h2>-->
      <!--</div>-->
      <div class="content-right min-gutter">
        <h3>{{titleAry[type][0]}}详情</h3>
        <div v-if="loadingData">
          <oms-loading :loading="loadingData"></oms-loading>
        </div>
        <div v-if="!loadingData">
          <el-row>
            <el-col :span="12">
              <oms-row :label="`${titleAry[type][2]}单据编号`" :span="8">{{form.no }}</oms-row>
              <oms-row :label="titleAry[type][3]" :span="8">{{form[type ===1 ? 'ownerName' : 'orgName'] }}</oms-row>
              <oms-row :label="`${titleAry[type][2]}方式`" :span="8">
                <div v-show="form.advancePaymentFlag">
                  <span>预{{titleAry[type][2]}}</span>
                  <span v-show="form.payType">、<dict :dict-group="'PaymentMethod'"
                                                     :dict-key="form.payType"></dict></span>
                </div>
                <div v-show="!form.advancePaymentFlag">
                  <dict :dict-group="'PaymentMethod'" :dict-key="form.payType"></dict>
                </div>
              </oms-row>
              <oms-row :label="`${titleAry[type][2]}金额`" :span="8">
                ¥ {{form.amount | formatMoney}}
              </oms-row>
            </el-col>
            <el-col :span="12">
              <oms-row :span="8" label="创建人"> {{form.createName}}</oms-row>
              <oms-row :span="8" label="创建时间">{{form.createTime | minute}}</oms-row>
              <oms-row :span="8" label="状态">{{getOrderStatus(form)}}</oms-row>
              <oms-row :label="`${titleAry[type][2]}说明`" :span="8">
                {{form.explain}}
              </oms-row>
            </el-col>
          </el-row>
          <oms-row v-show="form.status!=='0' && form.status !=='-1'" :span="4" label="审核意见">
                <span v-show="form.status!=='0' && form.status !=='-1'">
                  <span v-show="!form.auditOpinion">无</span>
                  <span v-show="form.auditOpinion">{{ form.auditedName }}   {{ form.auditTime | minute}}  {{ form.auditOpinion }}</span>
                </span>
          </oms-row>
          <div class="detail-title">
            <span>{{`${titleAry[type][2]}明细`}}</span>
            <span v-show="!form.detailList.length">：无</span>
            <span v-show="form.detailList.length" class="pull-right">(共{{ form.detailList.length }}条)</span>
          </div>
          <ul v-show="form.detailList.length"
              class="show-list invoice-list clearfix">
            <li class="show-item" style="background: #f1f1f1">
              <el-row type="flex">
                <el-col :span="form.status==='0'?6:8">疫苗名称</el-col>
                <el-col :span="2">数量</el-col>
                <el-col :span="form.status==='0'?5:6">订单号</el-col>
                <el-col :span="4">发生时间</el-col>
                <el-col :span="4">本次收款金额</el-col>
                <el-col v-show="form.status ==='0'" :span="3">操作</el-col>
              </el-row>
            </li>
            <li v-for="item in form.detailList" class="show-item">
              <el-row type="flex">
                <el-col :span="form.status==='0'?6:8">{{ item.goodsName }}</el-col>
                <el-col :span="2">{{ item.count }}</el-col>
                <el-col :span="form.status==='0'?5:6">{{ item.orderNo }}</el-col>
                <el-col :span="4">{{ item.createTime | date }}</el-col>
                <el-col :span="4"> ￥{{item.paidMoney | formatMoney}}</el-col>
                <el-col v-show="form.status ==='0'" :span="3">
                  <perm label="payment-receivable-audit">
                      <span class="delete-icon" @click.stop.prevent="deleteDetailItem(item)">
                          <i class="el-icon-t-remove"></i><span>删除</span>
                      </span>
                  </perm>
                </el-col>
              </el-row>
            </li>
            <li v-show="form.status==='2'" class="text-right is-total">
              <span>合计数量:{{total.count}}</span>
              <span class="ml-15">合计本次收款金额:¥{{total.paidMoney | formatMoney}}</span>
            </li>
          </ul>
          <oms-row v-show="form.status ==='0' || form.status ==='-1'" :span="4" label="审核意见">
            <oms-input v-model="form.auditOpinion"
                       :autosize="{ minRows: 2, maxRows: 5}" placeholder="请输入审核意见"
                       type="textarea"></oms-input>
          </oms-row>
          <oms-row :span="form.status ==='0' || form.status ==='-1' ? 4 : 2" class="mt-10" label="">
            <div v-if="type===1">
              <perm v-show="form.status === '0'" :label="perms[1]">
                <el-button :disabled="doing" plain type="success" @click="audited('通过审核')">审核通过</el-button>
              </perm>
              <perm :label="perms[2]">
                <el-button v-show="isShowButton" :disabled="doing" plain @click="cancelItem">取消</el-button>
              </perm>
            </div>
            <div v-else>
              <perm v-show="form.status === '-1'" :label="perms[1]">
                <el-button :disabled="doing" plain type="success" @click="audited('通过审核')">审核通过</el-button>
              </perm>
              <perm v-show="form.status === '1'" :label="perms[2]">
                <el-button :disabled="doing" plain type="success" @click="audited('确认收款')">收款确认</el-button>
              </perm>
              <perm :label="perms[3]">
                <el-button v-show="isShowButton" :disabled="doing" plain @click="cancelItem">取消</el-button>
              </perm>
            </div>
          </oms-row>

          <!--<el-form ref="auditForm" :rules="rules" :model="form" @submit.prevent="onSubmit" onsubmit="return false"-->
          <!--label-width="100px" style="padding-right: 20px">-->
          <!--<el-form-item :label="`${titleAry[type][2]}单据编号:`" class="mb0">-->
          <!--{{form.no }}-->
          <!--</el-form-item>-->
          <!--<el-form-item :label="titleAry[type][3]+ ':'" class="mb0">-->
          <!--{{form[type ===1 ? 'ownerName' : 'orgName'] }}-->
          <!--</el-form-item>-->
          <!--<el-form-item :label="`${titleAry[type][2]}方式:`" class="mb0">-->
          <!--<div v-show="form.advancePaymentFlag">-->
          <!--<span>预{{titleAry[type][2]}}</span>-->
          <!--<span v-show="form.payType">、<dict :dict-group="'PaymentMethod'" :dict-key="form.payType"></dict></span>-->
          <!--</div>-->
          <!--<div v-show="!form.advancePaymentFlag">-->
          <!--<dict :dict-group="'PaymentMethod'" :dict-key="form.payType"></dict>-->
          <!--</div>-->
          <!--</el-form-item>-->
          <!--<el-form-item :label="`${titleAry[type][2]}金额:`" class="mb0">-->
          <!--¥ {{form.amount | formatMoney}}-->
          <!--</el-form-item>-->
          <!--<el-form-item :label="`${titleAry[type][2]}说明:`" class="mb0">-->
          <!--{{form.explain}}-->
          <!--</el-form-item>-->
          <!--<el-form-item label="创建人:" class="mb0">-->
          <!--{{form.createName}}-->
          <!--</el-form-item>-->
          <!--<el-form-item label="创建时间:" class="mb0">-->
          <!--{{form.createTime | minute}}-->
          <!--</el-form-item>-->
          <!--<el-form-item label="状态:" class="mb0">-->
          <!--{{getOrderStatus(form)}}-->
          <!--</el-form-item>-->
          <!--<el-form-item :label="`${titleAry[type][2]}明细:`" class="mb0">-->
          <!--<span v-show="!form.detailList.length">无</span>-->
          <!--<span v-show="form.detailList.length">(共{{ form.detailList.length }}条)</span>-->
          <!--</el-form-item>-->
          <!--<ul class="show-list invoice-list"-->
          <!--v-show="form.detailList.length">-->
          <!--<li class="show-item" style="background: #f1f1f1">-->
          <!--<el-row type="flex">-->
          <!--<el-col :span="form.status==='0'?6:8">疫苗名称</el-col>-->
          <!--<el-col :span="2">数量</el-col>-->
          <!--<el-col :span="form.status==='0'?5:6">订单号</el-col>-->
          <!--<el-col :span="4">发生时间</el-col>-->
          <!--<el-col :span="4">本次收款金额</el-col>-->
          <!--<el-col :span="3" v-show="form.status ==='0'">操作</el-col>-->
          <!--</el-row>-->
          <!--</li>-->
          <!--<li class="show-item" v-for="item in form.detailList">-->
          <!--<el-row type="flex">-->
          <!--<el-col :span="form.status==='0'?6:8">{{ item.goodsName }}</el-col>-->
          <!--<el-col :span="2">{{ item.count }}</el-col>-->
          <!--<el-col :span="form.status==='0'?5:6">{{ item.orderNo }}</el-col>-->
          <!--<el-col :span="4">{{ item.createTime | date }}</el-col>-->
          <!--<el-col :span="4"> ￥{{item.paidMoney | formatMoney}}</el-col>-->
          <!--<el-col :span="3" v-show="form.status ==='0'">-->
          <!--<perm label="payment-receivable-audit">-->
          <!--<span class="delete-icon" @click.stop.prevent="deleteDetailItem(item)">-->
          <!--<i class="el-icon-t-remove"></i><span>删除</span>-->
          <!--</span>-->
          <!--</perm>-->
          <!--</el-col>-->
          <!--</el-row>-->
          <!--</li>-->
          <!--</ul>-->
          <!--<el-form-item label="审核意见:">-->
          <!--<oms-input v-show="form.status ==='0' || form.status ==='-1'" type="textarea"-->
          <!--v-model="form.auditOpinion" placeholder="请输入审核意见"-->
          <!--:autosize="{ minRows: 2, maxRows: 5}"></oms-input>-->
          <!--<span v-show="form.status!=='0' && form.status !=='-1'">-->
          <!--<span v-show="!form.auditOpinion">无</span>-->
          <!--<span v-show="form.auditOpinion">{{ form.auditedName }}   {{ form.auditTime | minute-->
          <!--}}  {{ form.auditOpinion }}</span>-->
          <!--</span>-->
          <!--</el-form-item>-->
          <!--<el-form-item style="margin-top: 10px">-->
          <!--<div v-if="type===1">-->
          <!--<perm :label="perms[1]" v-show="form.status === '0'">-->
          <!--<el-button plain :disabled="doing" type="success" @click="audited('通过审核')">审核通过</el-button>-->
          <!--</perm>-->
          <!--<perm :label="perms[2]">-->
          <!--<el-button v-show="isShowButton" plain :disabled="doing" @click="cancelItem">取消</el-button>-->
          <!--</perm>-->
          <!--</div>-->
          <!--<div v-else>-->
          <!--<perm :label="perms[1]" v-show="form.status === '-1'">-->
          <!--<el-button plain :disabled="doing" type="success" @click="audited('通过审核')">审核通过</el-button>-->
          <!--</perm>-->
          <!--<perm :label="perms[2]" v-show="form.status === '1'">-->
          <!--<el-button plain :disabled="doing" type="success" @click="audited('确认收款')">收款确认</el-button>-->
          <!--</perm>-->
          <!--<perm :label="perms[3]">-->
          <!--<el-button v-show="isShowButton" plain :disabled="doing" @click="cancelItem">取消</el-button>-->
          <!--</perm>-->
          <!--</div>-->
          <!--</el-form-item>-->
          <!--</el-form>-->

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {CDCReceipt, http, POVPayment} from '@/resources';

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
      loadingData: true,
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
    isShowButton() {
      let {type, formItem} = this;
      let {status} = formItem;
      return type === 1 && status === '0' || type === 2 && (status === '-1' || status === '1');
    },
    total() {
      return this.form.detailList.reduce((pre, next) => {
        return {
          count: Number(pre.count) + Number(next.count),
          paidMoney: Number(pre.paidMoney) + Number(next.paidMoney)
        };
      }, {count: 0, paidMoney: 0}) || {};
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
    queryDetail(key) {
      this.loadingData = true;
      http.get(`/bill-receivable/${key}`).then(res => {
        this.form = res.data;
        this.loadingData = false;
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
    audited: function (title = '审核通过') {
      if (this.doing) return;
      this.$confirmOpera(`是否${title}?`, () => {
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
          successTitle: `${title}审核`,
          errorTitle: `${title}失败`,
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
    cancelItem() {
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
