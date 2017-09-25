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
      text-align: left;
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
      .el-form-item {
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
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title" style="font-size: 16px">新增应收账单</h2>
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
            <el-form-item label="选择订单" prop="orderId">
              <el-select placeholder="请选择订单" v-model="form.orderId" filterable remote clearable
                         @click.native="queryOrders('')"
                         :remote-method="queryOrders">
                <el-option :label="item.orderNo" :value="item.id" :key="item.id" v-for="item in orders">
                  <span class="pull-left">订单号{{ item.orderNo }}</span>
                  <span class="pull-right">合计 ￥{{ item.totalAmount }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="单据金额" prop="billAmount">
              <el-input v-model="form.billAmount" placeholder="请输入单据金额"></el-input>
            </el-form-item>
            <el-form-item label="剩余金额" prop="unpaidAmount">
              <el-input v-model="form.unpaidAmount" placeholder="请输入剩余金额"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { receipt, Order } from '@/resources';
  export default {
    props: {
      currentItem: Object
    },
    data () {
      return {
        form: {
          orderId: '',
          billAmount: '',
          unpaidAmount: '',
          accountsPayableId: this.currentItem.id
        },
        rules: {
          orderId: {required: true, message: '请选择订单', trigger: 'change'},
          billAmount: {required: true, message: '请输入单据金额', trigger: 'blur'},
          unpaidAmount: {required: true, message: '请输入剩余金额', trigger: 'blur'}
        },
        orders: [] // 订单列表
      };
    },
    methods: {
      queryOrders (query) {
        let params = {
          keyWord: query,
          type: 1,
          bizType: '0',
          customerId: this.currentItem.payerId
        };
        Order.query(params).then(res => {
          this.orders = res.data.list;
        });
      },
      onSubmit () {
        this.$refs['form'].validate((valid) => {
          if (!valid) {
            return false;
          }
          receipt.addDetail(this.currentItem.id, this.form).then(() => {
            this.$notify.success({
              message: '应收款详情添加成功'
            });
            this.$refs['form'].resetFields();
            this.$emit('refreshDetails');
          }).catch(error => {
            this.$notify.error({
              message: error.response.data && error.response.data.msg || '应收款详情添加失败'
            });
          });
        });
      }
    }
  };
</script>
