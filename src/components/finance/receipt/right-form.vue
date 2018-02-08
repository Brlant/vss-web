<style lang="less" scoped>
  @import "../../../assets/mixins.less";

  @leftWidth: 220px;

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
      width: @leftWidth;
    }
    .content-right {
      > h3 {
        left: @leftWidth;
      }
      left: @leftWidth;
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
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title" style="font-size: 16px">增加实收金额</h2>
        <ul>
          <li class="text-center" style="margin-top:40px;position:absolute;bottom:30px;left:0;right:0;">
            <el-button type="success" @click="onSubmit">保存</el-button>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <div class="hide-content show-content">
          <el-form ref="form" :rules="rules" :model="form"
                   label-width="160px" style="padding-right: 20px">
            <el-form-item label="实收金额" prop="money">
              <oms-input type="text" placeholder="请输入实收金额" v-model="form.paymentAmount" :min="0"
                         @blur="formatPrice">
                <template slot="prepend">¥</template>
              </oms-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import { receipt } from '@/resources';

  export default {
    props: {
      formItem: Object
    },
    data () {
      return {
        form: {
          detailId: '',
          paymentAmount: ''
        },
        rules: {
          paymentAmount: {required: true, message: '请输入实收金额', trigger: 'blur'}
        }
      };
    },
    methods: {
      formatPrice: function () {// 格式化单价，保留两位小数
        this.form.paymentAmount = utils.autoformatDecimalPoint(this.form.paymentAmount);
      },
      onSubmit () {
        this.$refs['form'].validate((valid) => {
          if (!valid) {
            return false;
          }
          this.form.detailId = this.formItem.id;
          this.form.paymentAmount = parseFloat(this.form.paymentAmount);
          receipt.modifyDetail(this.formItem.id, this.form).then(() => {
            this.$notify.success({
              message: '增加实收金额成功'
            });
            this.$refs['form'].resetFields();
            this.$emit('refreshDetails');
          }).catch(error => {
            this.$notify.error({
              message: error.response.data && error.response.data.msg || '增加实收金额失败'
            });
          });
        });
      }
    }
  };
</script>
