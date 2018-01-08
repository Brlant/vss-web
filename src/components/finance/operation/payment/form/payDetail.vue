<style lang="less">
  @import "../../../../../assets/mixins.less";

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

  .minor-part {
    color: #999;
  }
</style>
<template>
  <div>
    <el-form ref="payForm" :inline="true" onsubmit="return false">
      <el-form-item label="货品名称">
        <!--<oms-input v-model="searchCondition.goodsName"></oms-input>-->
        <el-select v-model="searchCondition.orgGoodsId" filterable remote placeholder="请输入名称搜索货品"
                   :remote-method="searchProduct" @click.native="searchProduct('')" :clearable="true"
                   popper-class="good-selects">
          <el-option v-for="item in goodesList" :key="item.orgGoodsDto.id"
                     :label="item.orgGoodsDto.name"
                     :value="item.orgGoodsDto.id">
            <div style="overflow: hidden">
              <span class="pull-left">{{item.orgGoodsDto.name}}</span>
            </div>
            <div style="overflow: hidden">
                        <span class="select-other-info pull-left"><span
                          v-show="item.orgGoodsDto.goodsNo">货品编号</span>  {{item.orgGoodsDto.goodsNo}}
                        </span>
              <span class="select-other-info pull-left"><span
                v-show="item.orgGoodsDto.salesFirmName">供货厂商</span>  {{ item.orgGoodsDto.salesFirmName }}
                        </span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发生时间" class="create-date">
        <el-date-picker
          v-model="createTimes"
          type="daterange"
          placeholder="请选择">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" @click="searchInOrder">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="product-list-detail">
      <h3 style="background: #f1f1f1">未选明细</h3>
      <table class="table">
        <thead>
        <tr>
          <th width="30px">操作</th>
          <th style="width: 240px">货品名称</th>
          <th>数量</th>
          <th>订单号</th>
          <th style="width: 100px" v-show="billPayType === '1'">关联发票号</th>
          <th>待付金额</th>
          <th>发生时间</th>
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
            <a href="#" @click.prevent="add(product)">
              <f-a name="plus"></f-a>
            </a>
          </td>
          <td>
            <span>{{product.goodsName}}</span>
          </td>
          <td>
            <span>{{product.goodsCount}}</span>
          </td>
          <td>
            <span>{{product.orderNo}}</span>
          </td>
          <td class="break-word" v-show="billPayType === '1'">
            <span>{{product.invoiceNo ? product.invoiceNo : '无'}}</span>
          </td>
          <td>
            <span> ¥{{ (product.billAmount - product.prepaidAccounts) | formatCount}}</span>
          </td>
          <td>
            {{product.createTime | date }}
          </td>
        </tr>
        </tbody>
      </table>
      <div class="text-center" v-show="pager.count>pager.pageSize && factoryId">
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
        <span style="float: left">已选明细</span>
        <span style="float: right">总付款金额：￥{{ amount | formatCount }}</span>
      </h3>
      <table class="table">
        <thead>
        <tr>
          <th style="width: 240px">订单号/货品名称</th>
          <th>数量</th>
          <th>发生时间</th>
          <th style="width: 100px" v-show="billPayType === '1'">关联发票号</th>
          <th>待付金额</th>
          <th>本次付款金额</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="product in selectPayments">
          <td>
            <span class="minor-part">{{product.orderNo}}</span>
            <div>{{product.goodsName}}</div>
          </td>
          <td>
            <span>{{product.goodsCount}}</span>
          </td>
          <td>
            {{product.createTime | date }}
          </td>
          <td class="break-word" v-show="billPayType === '1'">
            {{product.invoiceNo ? product.invoiceNo : '无'}}
          </td>
          <td>
            <span> ¥{{ (product.billAmount - product.prepaidAccounts) | formatCount}}</span>
          </td>
          <td>
            <el-input v-model="product.payment" style="width: 170px" @blur="paymentChange(product)">
              <template slot="prepend">
                <span>¥</span>
              </template>
            </el-input>
          </td>
          <td class="goods-btn" style="width: 60px">
            <a href="#" @click.prevent="remove(product)">
              <f-a name="delete"></f-a>
              删除</a>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>

</template>
<script>
  import { Vaccine } from '@/resources';

  export default {
    props: {
      selectPayments: Array,
      billPayType: '',
      factoryId: '',
      amount: ''
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
          pageSize: 50
        },
        filterRights: {
          orgGoodsId: '',
          createStartTime: '',
          createEndTime: ''
        },
        searchCondition: {
          orgGoodsId: '',
          createStartTime: '',
          createEndTime: ''
        },
        createTimes: '',
        goodesList: []
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
        this.goodesList = [];
        this.resetSearchForm();
        if (!val) return;
        this.queryPayments(1);
      },
      billPayType () {
        this.payments = [];
        this.goodesList = [];
        this.resetSearchForm();

        if (!this.factoryId) return;
        this.queryPayments(1);
      },
      filterRights: {
        handler: function () {
          this.queryPayments(1);
        },
        deep: true
      }
    },
    filters: {
      formatCount (val) {
        if (!val) return '0.00';
        if (typeof val === 'string') {
          return val;
        } else if (typeof val === 'number') {
          return val.toFixed(2);
        }
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
        let url = this.billPayType === '1'
          ? `/accounts-payable/remittee/${this.factoryId}/detail/invoice`
          : `/accounts-payable/remittee/${this.factoryId}/detail/no-invoice`;
        this.$http.get(url, {params}).then(res => {
          this.loadingData = false;
          res.data.list.forEach(item => {
            let count = item.billAmount - item.prepaidAccounts;
            item.payment = count ? count.toFixed(2) : 0.00;
          });
          this.payments = res.data.list;
          this.pager.count = res.data.count;
        });
      },
      searchProduct (keyWord) {
        if (!this.factoryId) return;
        let params = Object.assign({}, {
          keyWord: keyWord,
          salesFirm: this.factoryId
        });
        let level = this.$store.state.orgLevel;
        let api = level === 1 ? 'queryFirstVaccine' : 'querySecondVaccine';
        Vaccine[api](params).then(res => {
          this.goodesList = res.data.list;
        });
      },
      searchInOrder: function () {// 搜索
        this.searchCondition.createStartTime = this.formatTime(this.createTimes[0]);
        this.searchCondition.createEndTime = this.formatTime(this.createTimes[1]);
        Object.assign(this.filterRights, this.searchCondition);
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          orgGoodsId: '',
          createStartTime: '',
          createEndTime: ''
        };
        this.createTimes = '';
        Object.assign(this.searchCondition, temp);
        Object.assign(this.filterRights, temp);
      },
      formatTime: function (date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      },
      paymentChange (item) {
        let value = item.billAmount - item.prepaidAccounts;
        if (value < 0) {
          if (item.payment < value) {
            this.$notify.info({
              message: '输入的金额小于待付金额，已帮您调整为与待付金额相等'
            });
            item.payment = value;
          }
        } else {
          if (item.payment > value) {
            this.$notify.info({
              message: '输入的金额大于待付金额，已帮您调整为与待付金额相等'
            });
            item.payment = value;
          }
        }
        item.payment = Number(item.payment);
        item.payment = item.payment ? item.payment.toFixed(2) : 0.00;
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
