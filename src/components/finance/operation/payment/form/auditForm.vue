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
    bottom: 50px;
    left: 0;
    right: 0;
    z-index: 1;
    text-align: center;
    padding: 15px;
  }

  .invoice-list {
    /*margin-left: 30px;*/
    margin-bottom: 10px;

    .show-item {
      border-bottom: 1px solid #f1f1f1;
      padding: 8px 0;
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
      <!--<h2 class="clearfix right-title">付款申请详情</h2>-->
      <!--</div>-->
      <div class="content-right min-gutter">
        <h3>付款申请详情</h3>
        <div v-if="loadingData">
          <oms-loading :loading="loadingData"></oms-loading>
        </div>
        <div v-if="!loadingData">
          <el-row>
            <el-col :span="12">
              <oms-row :span="8" label="发票付款">{{form.billPayType === '0' ? '无' : '有' }}</oms-row>
              <oms-row :span="8" label="收款单位"> {{form.orgName }}</oms-row>
              <oms-row :span="8" label="付款方式">
                <dict :dict-group="'PaymentMethod'" :dict-key="form.payType"></dict>
              </oms-row>
              <oms-row :span="8" label="付款金额"> ¥ {{form.amount | formatMoney}}
              </oms-row>
            </el-col>
            <el-col :span="12">
              <oms-row :span="8" label="创建人"> {{form.createName}}
              </oms-row>
              <oms-row :span="8" label="创建时间"> {{form.createTime | minute}}
              </oms-row>
              <oms-row :span="8" label="付款说明"> {{form.explain}}
              </oms-row>
              <oms-row :span="8" label="审批意见" v-show="form.status !=='0'">
                <span>
                  <span v-show="!form.auditOpinion">无</span>
                  <span v-show="form.auditOpinion">{{ form.auditedName }}   {{ form.auditTime | minute}}  {{ form.auditOpinion }}</span>
                </span>
              </oms-row>
            </el-col>
          </el-row>
          <div class="detail-title">
            <span>付款明细</span>
            <span v-if="!form.detailList.length">：无</span>
            <span class="pull-right" v-show="form.detailList.length">(共{{ form.detailList.length }}条)</span>
          </div>
          <ul class="show-list invoice-list clearfix"
              v-if="form.detailList.length">
            <li class="show-item" style="background: #f1f1f1">
              <el-row type="flex">
                <el-col :span="form.billPayType === '1' ? 6 : 7">疫苗名称</el-col>
                <el-col :span="2">数量</el-col>
                <el-col :span="form.billPayType === '1' ? 4 : 5">订单号</el-col>
                <el-col :span="4" v-show="form.billPayType === '1'">关联发票号</el-col>
                <el-col :span="form.billPayType === '1' ? 3 : 4">发生时间</el-col>
                <el-col :span="form.billPayType === '1' ? 3 : 4">本次付款金额</el-col>
                <el-col :span="2" v-show="form.status ==='0'">操作</el-col>
              </el-row>
            </li>
            <li class="show-item" v-for="item in form.detailList">
              <el-row type="flex">
                <el-col :span="form.billPayType === '1' ? 6 : 7">{{ item.goodsName }}</el-col>
                <el-col :span="2">{{ item.count }}</el-col>
                <el-col :span="form.billPayType === '1' ? 4 : 5">{{ item.orderNo }}</el-col>
                <el-col :span="4" v-show="form.billPayType === '1'" class="break-word">
                  {{ item.invoiceNo ? item.invoiceNo : '无' }}
                </el-col>
                <el-col :span="form.billPayType === '1' ? 3 : 4">{{ item.createTime | date }}</el-col>
                <el-col :span="form.billPayType === '1' ? 3 : 4"> ￥{{item.paidMoney | formatMoney}}</el-col>
                <el-col :span="2" v-show="form.status ==='0'">
                  <perm label="payment-payable-audit">
                      <span class="delete-icon" @click.stop.prevent="deleteDetailItem(item)">
                          <i class="el-icon-t-remove"></i><span>删除</span>
                      </span>
                  </perm>
                </el-col>
              </el-row>
            </li>
            <li class="text-right is-total" v-show="form.status==='2'">
              <span>合计数量:{{total.count}}</span>
              <span class="ml-15">合计本次付款金额:¥{{total.paidMoney | formatMoney}}</span>
            </li>
          </ul>
          <oms-row :span="4" label="审批意见" v-show="form.status ==='0'">
            <oms-input type="textarea" v-model="form.auditOpinion" placeholder="请输入审批意见"
                       :autosize="{ minRows: 2, maxRows: 5}"></oms-input>
          </oms-row>
          <oms-row label="" :span="form.status ==='0' ? 4 : 2" class="mt-10">
            <perm label="payment-payable-audit">
              <el-button v-show="form.status ==='0'" style="width: 100px" :plain="true" type="success"
                         @click="audited"
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
            </perm>
          </oms-row>

          <!--<el-form ref="auditForm" :rules="rules" :model="form" @submit.prevent="onSubmit" onsubmit="return false"-->
          <!--label-width="100px" style="padding-right: 20px">-->
          <!--<el-form-item label="发票付款:" class="mb0">-->
          <!--{{form.billPayType === '0' ? '无' : '有' }}-->
          <!--</el-form-item>-->
          <!--<el-form-item label="付款单位:" class="mb0">-->
          <!--{{form.orgName }}-->
          <!--</el-form-item>-->
          <!--<el-form-item label="付款方式:" class="mb0">-->
          <!--<dict :dict-group="'PaymentMethod'" :dict-key="form.payType"></dict>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="付款金额:" class="mb0">-->
          <!--¥ {{form.amount | formatMoney}}-->
          <!--</el-form-item>-->
          <!--<el-form-item label="付款说明:" class="mb0">-->
          <!--{{form.explain}}-->
          <!--</el-form-item>-->
          <!--<el-form-item label="创建人:" class="mb0">-->
          <!--{{form.createName}}-->
          <!--</el-form-item>-->
          <!--<el-form-item label="创建时间:" class="mb0">-->
          <!--{{form.createTime | minute}}-->
          <!--</el-form-item>-->
          <!--<el-form-item label="付款明细:" class="mb0">-->
          <!--<span v-if="!form.detailList.length">无</span>-->
          <!--<span v-show="form.detailList.length">(共{{ form.detailList.length }}条)</span>-->
          <!--</el-form-item>-->
          <!--<ul class="show-list invoice-list"-->
          <!--v-if="form.detailList.length">-->
          <!--<li class="show-item" style="background: #f1f1f1">-->
          <!--<el-row type="flex">-->
          <!--<el-col :span="form.billPayType === '1' ? 5 : 6">疫苗名称</el-col>-->
          <!--<el-col :span="2">数量</el-col>-->
          <!--<el-col :span="form.billPayType === '1' ? 4 : 5">订单号</el-col>-->
          <!--<el-col :span="4" v-show="form.billPayType === '1'">关联发票号</el-col>-->
          <!--<el-col :span="form.billPayType === '1' ? 4 : 5">发生时间</el-col>-->
          <!--<el-col :span="form.billPayType === '1' ? 3 : 4">本次付款金额</el-col>-->
          <!--<el-col :span="2" v-show="form.status ==='0'">操作</el-col>-->
          <!--</el-row>-->
          <!--</li>-->
          <!--<li class="show-item" v-for="item in form.detailList">-->
          <!--<el-row type="flex">-->
          <!--<el-col :span="form.billPayType === '1' ? 5 : 6">{{ item.goodsName }}</el-col>-->
          <!--<el-col :span="2">{{ item.count }}</el-col>-->
          <!--<el-col :span="form.billPayType === '1' ? 4 : 5">{{ item.orderNo }}</el-col>-->
          <!--<el-col :span="4" v-show="form.billPayType === '1'" class="break-word">-->
          <!--{{ item.invoiceNo ? item.invoiceNo : '无' }}-->
          <!--</el-col>-->
          <!--<el-col :span="form.billPayType === '1' ? 4 : 5">{{ item.createTime | date }}</el-col>-->
          <!--<el-col :span="form.billPayType === '1' ? 3 : 4"> ￥{{item.paidMoney | formatMoney}}</el-col>-->
          <!--<el-col :span="2" v-show="form.status ==='0'">-->
          <!--<perm label="payment-payable-audit">-->
          <!--<span class="delete-icon" @click.stop.prevent="deleteDetailItem(item)">-->
          <!--<i class="el-icon-t-remove"></i><span>删除</span>-->
          <!--</span>-->
          <!--</perm>-->
          <!--</el-col>-->
          <!--</el-row>-->
          <!--</li>-->
          <!--</ul>-->
          <!--<el-form-item label="审批意见:" style="margin-top: 10px">-->
          <!--<oms-input v-show="form.status ==='0'" type="textarea" v-model="form.auditOpinion" placeholder="请输入审批意见"-->
          <!--:autosize="{ minRows: 2, maxRows: 5}"></oms-input>-->
          <!--<span v-show="form.status!=='0'">-->
          <!--<span v-show="!form.auditOpinion">无</span>-->
          <!--<span v-show="form.auditOpinion">{{ form.auditedName }}   {{ form.auditTime | minute-->
          <!--}}  {{ form.auditOpinion }}</span>-->
          <!--</span>-->
          <!--</el-form-item>-->
          <!--<el-form-item style="margin-top: 10px">-->
          <!--<perm label="payment-payable-audit">-->
          <!--<el-button v-show="form.status ==='0'" style="width: 100px" :plain="true" type="success"-->
          <!--@click="audited"-->
          <!--native-type="submit">审核通过-->
          <!--</el-button>-->
          <!--<el-button v-show="form.status ==='0'" style="width: 100px" :plain="true" type="danger"-->
          <!--@click="notAudited"-->
          <!--native-type="submit">-->
          <!--审核不通过-->
          <!--</el-button>-->
          <!--<el-button v-show="form.status ==='1'" style="width: 100px" :plain="true" type="danger" @click="review"-->
          <!--native-type="submit">-->
          <!--通过复核-->
          <!--</el-button>-->
          <!--</perm>-->
          <!--</el-form-item>-->
          <!--</el-form>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {BillPayable, http} from '../../../../../resources';

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
        doing: false,
        loadingData: true
      };
    },
    computed: {
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
      deleteDetailItem(item) {
        this.$confirm('是否删除本条明细', '', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(`/bill-receivable/detail/${item.detailId}`).then(() => {
            this.form.detailList = this.form.detailList.filter(f => f.detailId !== item.detailId);
          }).catch(() => {
            this.$notify.error({
              duration: 2000,
              message: '删除失败'
            });
          });
        });
      },
      queryDetail(key) {
        this.loadingData = true;
        http.get(`/bill-payable/${key}`).then(res => {
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
