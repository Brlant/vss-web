<style lang="less">
  @import "../../../assets/mixins.less";

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

  .ar {
    text-align: right;
  }

  .goods-btn {
    a:hover {
      color: @activeColor;
    }
  }

  .good-selects {
    .el-select-dropdown__item {
      width: auto;
      height: 70px;
    }
  }

  .el-form--inline .el-form-item {
    margin-right: 0;
  }

  .create-date {
    .el-date-editor--datetimerange.el-input {
      width: 310px;
    }
  }
</style>
<template>
  <div>
    <el-form ref="payForm" :inline="true">
      <el-form-item label="货品名称">
        <oms-input v-model="searchCondition.goodsName"></oms-input>
      </el-form-item>
      <el-form-item label="创建时间" style="width: 380px" class="create-date">
        <el-date-picker
          v-model="createTimes"
          type="datetimerange"
          placeholder="请选择">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" @click="searchInOrder">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="product-list-detail">
      <h3 style="background: #f1f1f1">付款明细(未选择)</h3>
      <table class="table">
        <thead>
        <tr>
          <th width="30px">操作</th>
          <th style="width: 240px">货品名称</th>
          <th>订单号</th>
          <th>应付金额</th>
          <th>创建时间</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="!showPayments.length">
          <td colspan="4">
            暂无数据
          </td>
        </tr>
        <tr v-for="product in showPayments">
          <td class="goods-btn" width="30px">
            <a href="#" @click.prevent="add(product)"><i
              class="el-icon-t-plus"></i></a>
          </td>
          <td>
            <span>{{product.goodsName}}</span>
          </td>
          <td>
            <span>{{product.orderNo}}</span>
          </td>
          <td class="ar">
            <span v-show="Number(product.billAmount)">¥{{product.billAmount | formatMoney}}</span>
            <span v-if="!Number(product.billAmount)">-</span>
          </td>
          <td>
            {{product.createTime | minute }}
          </td>
        </tr>
        </tbody>
      </table>
      <div class="text-center" v-show="pager.count>pager.pageSize">
        <el-pagination layout="prev, pager, next"
                       :total="pager.count"
                       :pageSize="pager.pageSize"
                       @current-change="queryPayments"
                       :current-page="pager.currentPage">
        </el-pagination>
      </div>
    </div>
    <div class="product-list-detail" v-show="selectPayments.length">
      <h3 style="background: #f1f1f1;overflow: hidden">
        <span style="float: left">付款明细(已选择)</span>
        <span style="float: right">发票金额：￥{{ amount | formatMoney }}</span>
      </h3>
      <table class="table">
        <thead>
        <tr>
          <th style="width: 300px">货品名称</th>
          <th>订单号</th>
          <th>应付金额</th>
          <th>创建时间</th>
          <th width="60px">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="product in selectPayments">
          <td>
            <span>{{product.goodsName}}</span>
          </td>
          <td>
            <span>{{product.orderNo}}</span>
          </td>
          <td class="ar">
            <span v-show="Number(product.billAmount)">¥{{product.billAmount | formatMoney}}</span>
            <span v-if="!Number(product.billAmount)">-</span>
          </td>
          <td>
            {{product.createTime | minute }}
          </td>
          <td class="goods-btn">
            <a href="#" @click.prevent="remove(product)"><i
              class="el-icon-t-delete"></i> 删除</a>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>

</template>
<script>
  import { pay } from '@/resources';

  export default {
    props: {
      selectPayments: Array,
      factoryId: String,
      amount: String
    },
    data () {
      return {
        payments: [],
        form: {
          detailId: ''
        },
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        },
        filterRights: {
          goodsName: '',
          createStartTime: '',
          createEndTime: ''
        },
        searchCondition: {
          goodsName: '',
          createStartTime: '',
          createEndTime: ''
        },
        createTimes: ''
      };
    },
    computed: {
      showPayments () {
        return this.payments.filter(f => this.selectPayments.every(e => e.id !== f.id));
      }
    },
    watch: {
      factoryId (val) {
        this.payments = [];
        if (!val) return;
        this.queryPayments(1);
      },
      filterRights: {
        handler: function () {
          this.queryPayments(1);
        },
        deep: true
      }
    },
    methods: {
      queryPayments (pageNo) {
        this.pager.currentPage = pageNo;
        this.loadingData = true;
        let params = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filterRights);
        pay.queryDetailByfy(this.factoryId, params).then(res => {
          this.loadingData = false;
          this.payments = res.data.list;
          this.pager.count = res.data.count;
        });
      },
      searchInOrder: function () {// 搜索
        this.searchCondition.createStartTime = this.formatTime(this.createTimes[0]);
        this.searchCondition.createEndTime = this.formatTime(this.createTimes[1]);
        Object.assign(this.filterRights, this.searchCondition);
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          goodsName: '',
          createStartTime: '',
          createEndTime: ''
        };
        this.createTimes = '';
        Object.assign(this.searchCondition, temp);
        Object.assign(this.filterRights, temp);
      },
      formatTime: function (date) {
        return date ? this.$moment(date).format('YYYY-MM-DD HH:mm:ss') : '';
      },
      add (item) {
        let index = this.selectPayments.indexOf(item);
        if (index === -1) {
          this.selectPayments.push(item);
        }
      },
      remove (item) {
        let index = this.selectPayments.indexOf(item);
        this.selectPayments.splice(item, 1);
      }
    }
  };
</script>
