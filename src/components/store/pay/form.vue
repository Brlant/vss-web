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
        <h2 class="clearfix right-title" style="font-size: 16px">新增应付账单</h2>
        <ul>
          <li class="text-center" style="margin-top:40px;position:absolute;bottom:30px;left:0;right:0;">
            <el-button type="success" @click="onSubmit">保存</el-button>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <div class="hide-content show-content">
          <el-form ref="orderAddForm" :rules="rules" :model="form"
                   label-width="160px" style="padding-right: 20px">
            <span style="font-size: 14px">【应付款详情】</span>
            <el-form-item label="选择货主" prop="orgId">
              <el-select placeholder="请选择货主" v-model="form.orgId" filterable remote clearable
                         @click.native="queryOrgs('')"
                         @change="changeOrg"
                         :remote-method="queryOrgs">
                <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in orgs">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择厂商" prop="orgId">
              <el-select placeholder="请选择厂商" v-model="form.dealerId" filterable remote clearable
                         @click.native="queryDealers('')"
                         @change="changeDealer"
                         :remote-method="queryDealers">
                <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in dealers">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="应付款总额" prop="orgId">
              <span>{{ form.totalMoney }}</span>
            </el-form-item>
            <span style="font-size: 14px">【应付款明细】</span>
            <el-form-item label="选择订单" prop="orgId">
              <el-select placeholder="请选择订单" v-model="form.order" filterable remote clearable
                         @click.native="queryOrders('')"
                         @change="changeOrder"
                         :remote-method="queryOrders">
                <el-option :label="item.no" :value="item" :key="item.id" v-for="item in orders">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="单据金额" prop="orgId" style="margin-bottom: 0">
              <span>{{ form.bill }}</span>
            </el-form-item>
            <el-form-item label="剩余应付金额" prop="orgId">
              <span>{{form.surplusMoney}}</span>
            </el-form-item>
            <el-form-item>
              <el-button type="success">添加应付款明细</el-button>
            </el-form-item>
          </el-form>
          <div class="product-list-detail">
            <h3 style="background: #13ce66;color: #fff">已选订单应付款明细</h3>
            <table class="table">
              <thead>
              <tr>
                <th>货主订单号</th>
                <th>单据金额</th>
                <th>剩余应付金额</th>
                <th>操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="d in details">
                <td>

                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { BaseInfo, Order } from '@/resources';

  export default {
    data () {
      return {
        form: {
          orgId: '',
          dealerId: '',
          order: {},
          totalMoney: 100000,
          bill: '',
          surplusMoney: ''
        },
        details: [],
        orgs: [], // 货主
        dealers: [], //销售商
        orders: [], // 订单列表
        rules: {}
      };
    },
    methods: {
      queryOrgs (query) {
        BaseInfo.query({keyWord: query, deleteFlag: false, type: 0, orgAuditStatus: '1'}).then(res => {
          this.orgs = res.data.list;
        });
      },
      queryDealers (query) {
        if (!this.form.orgId) {
          this.dealers = [];
        }
        let params = {
          keyWord: query,
          relation: ''
        };
        BaseInfo.queryOrgByValidReation(this.form.orgId, params).then(res => {
          this.dealers = res.data;
        });
      },
      queryOrders (query) {
        if (!this.form.orgId && !this.form.dealerId) {
          this.orders = [];
        }
        this.orders = [
          {id: 1, no: '001', totalAmount: 1000},
          {id: 2, no: '002', totalAmount: 2000},
          {id: 3, no: '003', totalAmount: 3000},
          {id: 4, no: '004', totalAmount: 4000},
          {id: 5, no: '005', totalAmount: 5000},
        ];
//        let params = {
//          keyWord: query,
//          orgId: this.form.orgId,
//          supplierId: this.form.dealerId
//        };
//        Order.query(params).then(res => {
//          this.orders = res.data.list;
//        });
      },
      changeOrg (val) {
        if (!val) this.form.dealerId = '';
      },
      changeDealer (val) {
        if (!val) this.form.order = {};
      },
      changeOrder (order) {
        if (!order.id) {
          this.form.bill = '';
          this.form.surplusMoney = '';
        }
        this.form.bill = order.totalAmount;
        this.form.surplusMoney = order.totalAmount;
      },
      onSubmit () {

      }
    }
  };
</script>
