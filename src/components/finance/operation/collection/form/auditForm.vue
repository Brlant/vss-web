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
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    text-align: center;
    padding: 15px;
  }
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">审核收款申请</h2>
        <div class="btn-submit-save">
          <div style="margin-bottom: 10px">
            <el-button style="width: 100px" type="warning" @click="audited" native-type="submit">审核通过
            </el-button>
          </div>
          <div style="margin-bottom: 10px">
            <el-button style="width: 100px" type="warning" @click="notAudited" native-type="submit">
              审核不通过
            </el-button>
          </div>
        </div>
      </div>
      <div class="content-right min-gutter">
        <h3>审核收款作业申请</h3>
        <div>
          <el-form ref="auditForm" :rules="rules" :model="form" @submit.prevent="onSubmit" onsubmit="return false"
                   label-width="100px" style="padding-right: 20px">
            <el-form-item label="收款单据编号">
              {{form.no }}
            </el-form-item>
            <el-form-item label="收款类型">
              {{billPayType(form.billPayType)}}
            </el-form-item>
            <el-form-item label="收款单位">
              {{form.orgName }}
            </el-form-item>
            <el-form-item label="收款方式">
              <dict :dict-group="'PaymentMethod'" :dict-key="form.payType"></dict>
            </el-form-item>
            <el-form-item label="收款金额">
              ¥ {{form.amount | formatMoney}}
            </el-form-item>
            <el-form-item label="收款说明">
              {{form.explain}}
            </el-form-item>
            <el-form-item label="审批意见">
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
  import {http, Address, BaseInfo, pay, BillReceivable} from '../../../../../resources';
  import utils from '../../../../../tools/utils';

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
        form: this.formItem,
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
        this.form = Object.assign({}, val);
      }
    },
    mounted: function () {
    },
    methods: {
      billPayType: function (value) {
        let title = '';
        if (value === '0') {
          title = '疫苗厂商收款';
        } else {
          title = '物流厂商收款';
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
        this.$confirm('确认通过收款作业申请"' + this.form.no + '"的审核?', '', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          BillReceivable.auditInfo(this.form.id, {
            auditOpinion: this.form.auditOpinion}).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '审核收款作业申请"' + this.form.no + '"成功'
            });
            this.$emit('change', this.form);
            this.$emit('right-close');
          }).catch(() => {
            this.$notify.error({
              duration: 2000,
              message: '审核收款作业申请"' + this.form.no + '"失败'
            });
          });
        });
      },
      notAudited: function () {
        this.$confirm('确认不通过收款作业申请"' + this.form.no + '"的审核?', '', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          BillReceivable.refusedInfo(this.form.id, {auditOpinion: this.form.auditOpinion}).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '收款作业申请"' + this.form.no + '"审核未通过'
            });
            this.$emit('change', this.form);
            this.$emit('right-close');
          }).catch(() => {
            this.$notify.error({
              duration: 2000,
              message: '收款作业申请"' + this.form.no + '"审核未通过失败'
            });
          });
        });
      }
    }
  };
</script>
