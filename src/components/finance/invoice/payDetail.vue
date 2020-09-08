<style lang="scss">
@import "../../../assets/mixins.scss";

.ar {
  text-align: right;
}

.goods-btn {
  a:hover {
    color: $activeColor;
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
    <el-form ref="payForm" :inline="true" onsubmit="return false">
      <el-form-item label="疫苗名称">
        <!--<oms-input v-model="searchCondition.goodsName"></oms-input>-->
        <el-select v-model="searchCondition.orgGoodsId" :clearable="true" :remote-method="searchProduct" filterable
                   placeholder="请输入名称搜索疫苗" popper-class="good-selects" remote
                   @click.native="searchProduct('')">
          <el-option v-for="item in goodesList" :key="item.orgGoodsDto.id"
                     :label="item.orgGoodsDto.name"
                     :value="item.orgGoodsDto.id">
            <div style="overflow: hidden">
              <span class="pull-left">{{item.orgGoodsDto.name}}</span>
            </div>
            <div style="overflow: hidden">
                        <span class="select-other-info pull-left"><span
                          v-show="item.orgGoodsDto.goodsNo">货主货品编号:</span>{{item.orgGoodsDto.goodsNo}}
                        </span>
              <span class="select-other-info pull-left"><span
                v-show="item.orgGoodsDto.salesFirmName">供货单位:</span>{{ item.orgGoodsDto.salesFirmName }}
                        </span>
              <span v-if="item.orgGoodsDto.goodsDto" class="select-other-info pull-left">
                          <span v-show="item.orgGoodsDto.goodsDto.factoryName">生产单位:</span>{{ item.orgGoodsDto.goodsDto.factoryName }}
                </span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="create-date" label="发生时间">
        <el-date-picker
          v-model="createTimes"
          placeholder="请选择"
          type="daterange">
        </el-date-picker>
      </el-form-item>
      <el-form-item style="margin-left: 10px">
        <el-button native-type="submit" type="primary" @click="searchInOrder">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="product-list-detail">
      <h3 style="background: #f1f1f1">未选明细</h3>
      <table class="table">
        <thead>
        <tr>
          <th width="30px">操作</th>
          <th style="width: 240px">疫苗名称</th>
          <th>数量</th>
          <th>订单号</th>
          <th>应付金额</th>
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
          <td class="ar">
            <span v-show="Number(product.billAmount)">¥{{product.billAmount | formatMoney}}</span>
            <span v-if="!Number(product.billAmount)">-</span>
          </td>
          <td>
            {{product.createTime | date }}
          </td>
        </tr>
        </tbody>
      </table>
      <div v-show="pager.count>pager.pageSize" class="text-center">
        <el-pagination :current-page="pager.currentPage"
                       :pageSize="pager.pageSize"
                       :total="pager.count"
                       layout="prev, pager, next"
                       @current-change="queryPayments">
        </el-pagination>
      </div>
    </div>
    <div v-show="selectPayments.length" class="product-list-detail">
      <h3 style="background: #f1f1f1;overflow: hidden">
        <span style="float: left">已选明细</span>
        <span style="float: right">已选发票明细总额：￥{{ amount | formatMoney }}</span>
      </h3>
      <table class="table">
        <thead>
        <tr>
          <th style="width: 240px">疫苗名称</th>
          <th>数量</th>
          <th>订单号</th>
          <th>应付金额</th>
          <th>发生时间</th>
          <th width="60px">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="product in selectPayments">
          <td>
            <span>{{product.goodsName}}</span>
          </td>
          <td>
            <span>{{product.goodsCount}}</span>
          </td>
          <td>
            <span>{{product.orderNo}}</span>
          </td>
          <td class="ar">
            <span v-show="Number(product.billAmount)">¥{{product.billAmount | formatMoney}}</span>
            <span v-if="!Number(product.billAmount)">-</span>
          </td>
          <td>
            {{product.createTime | date }}
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
import {Vaccine} from '@/resources';

export default {
  props: {
    selectPayments: Array,
    factoryId: String,
    amount: String
  },
  data() {
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
    showPayments() {
      return this.payments.filter(f => this.selectPayments.every(e => e.id !== f.id));
    }
  },
  watch: {
    factoryId(val) {
      this.payments = [];
      this.goodesList = [];
      this.resetSearchForm();
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
    queryPayments(pageNo) {
      this.pager.currentPage = pageNo;
      this.loadingData = true;
      let params = Object.assign({}, {
        pageNo: pageNo,
        pageSize: this.pager.pageSize
      }, this.filterRights);
      this.$http.get(`/accounts-payable/remittee/${this.factoryId}/detail/no-invoice`, {params}).then(res => {
        this.loadingData = false;
        this.payments = res.data.list;
        this.pager.count = res.data.count;
      });
    },
    searchProduct(keyWord) {
      if (!this.factoryId) return;
      let params = Object.assign({}, {
        keyWord: keyWord,
        salesFirm: this.factoryId
      });
      Vaccine.query(params).then(res => {
        this.goodesList = res.data.list;
      });
    },
    searchInOrder: function () {// 搜索
      this.searchCondition.createStartTime = this.$formatAryTime(this.createTimes, 0);
      this.searchCondition.createEndTime = this.$formatAryTime(this.createTimes, 1);
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
    add(item) {
      let index = this.selectPayments.indexOf(item);
      if (index === -1) {
        this.selectPayments.push(item);
      }
    },
    remove(item) {
      let index = this.selectPayments.indexOf(item);
      this.selectPayments.splice(index, 1);
    }
  }
};
</script>
