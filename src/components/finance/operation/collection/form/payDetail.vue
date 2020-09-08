<style lang="scss" scoped>
@import "../../../../../assets/mixins.scss";

.goods-btn {
  a:hover {
    color: $activeColor;
  }
}

.el-form--inline .el-form-item {
  margin-right: 0;
}

.el-select {
  width: 100%;
}
</style>
<template>
  <div>
    <div v-show="index===1">
      <el-form ref="payForm" :model="searchCondition" label-width="100px">
        <el-form-item :label="`${titleAry[type][3]}`" :rules="{required: true, message: '请选择收货单位', blur: 'change'}"
                      prop="orgId">
          <el-select v-model="searchCondition.orgId" :clearable="true" :placeholder="`请输入名称搜索${titleAry[type][3]}`" :remote-method="filterOrg"
                     filterable
                     popper-class="good-selects" remote @blur=""
                     @change="orgChange" @click.native.once="filterOrg('')">
            <div v-if="type === 2">
              <el-option v-for="org in orgList" :key="org.id" :label="org.name" :value="org.id">
                <div style="overflow: hidden">
                  <span class="pull-left" style="clear: right">{{org.name}}</span>
                </div>
                <div style="overflow: hidden">
                    <span class="select-other-info pull-left">
                      <span>系统代码:</span>{{org.manufacturerCode}}
                    </span>
                </div>
              </el-option>
            </div>
            <div v-else>
              <el-option v-for="item in orgList" :key="item.orgId" :label="item.orgName" :value="item.orgId"/>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="疫苗名称">
          <el-select v-model="searchCondition.orgGoodsId" :clearable="true" :remote-method="searchProduct" filterable
                     placeholder="请输入名称搜索疫苗" popper-class="good-selects" remote
                     @change="orgGoodsIdChange" @click.native="searchProduct('')">
            <el-option v-for="item in goodesList" :key="item.orgGoodsDto.id"
                       :label="item.orgGoodsDto.name"
                       :value="item.orgGoodsDto.id">
              <div>
                <div>
                  <span class="pull-left">{{item.orgGoodsDto.name}}</span>
                </div>
                <div class="clearfix">
                  <span class="select-other-info pull-left">
                    <span v-show="item.orgGoodsDto.goodsNo">货主货品编号:</span>{{item.orgGoodsDto.goodsNo}}
                  </span>
                  <span class="select-other-info pull-left"><span
                    v-show="item.orgGoodsDto.salesFirmName">供货单位:</span>{{ item.orgGoodsDto.salesFirmName }}
                  </span>
                  <span v-if="item.orgGoodsDto.goodsDto" class="select-other-info pull-left">
                          <span v-show="item.orgGoodsDto.goodsDto.factoryName">生产单位:</span>{{ item.orgGoodsDto.goodsDto.factoryName }}
                </span>
                </div>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发生时间">
          <el-date-picker
            v-model="createTimes"
            placeholder="请选择" type="daterange"
            @change="createTimeChange">
          </el-date-picker>
          <el-button class="ml-15" type="primary" @click.stop="searchInOrder">查询</el-button>
        </el-form-item>

      </el-form>
      <div class="product-list-detail">
        <h3 style="background: #f1f1f1">可选{{titleAry[type][2]}}明细</h3>
        <table class="table">
          <thead>
          <tr>
            <th width="30px">操作</th>
            <th style="width: 240px">疫苗名称</th>
            <th>数量</th>
            <th>订单号</th>
            <th>待{{titleAry[type][2]}}金额</th>
            <th>发生时间</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="!showPayments.length">
            <td colspan="6">
              <div class="empty-info mini">暂无数据</div>
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
            <td>
              <span> ¥{{ product.billAmount | formatCount}}</span>
            </td>
            <td>
              {{product.createTime | date }}
            </td>
          </tr>
          </tbody>
        </table>
        <div v-show="pager.count>pager.pageSize && searchCondition.orgId" class="text-center">
          <el-pagination :current-page="pager.currentPage"
                         :pageSize="pager.pageSize"
                         :total="pager.count"
                         layout="prev, pager, next"
                         @current-change="queryPayments">
          </el-pagination>
        </div>
      </div>
    </div>
    <div v-show="index===2">
      <div v-show="selectPayments.length" class="product-list-detail">
        <h3 style="background: #f1f1f1;overflow: hidden">
          <span style="float: left">已选{{titleAry[type][2]}}明细</span>
          <span style="float: right">总{{titleAry[type][2]}}金额：￥{{ amount | formatMoney }}</span>
        </h3>
        <table class="table">
          <thead>
          <tr>
            <th style="width: 260px">订单号/疫苗名称</th>
            <th>数量</th>
            <th>发生时间</th>
            <th>待{{titleAry[type][2]}}金额</th>
            <th>本次{{titleAry[type][2]}}金额</th>
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
            <td>
              <span> ¥{{ product.billAmount | formatCount}}</span>
            </td>
            <td>
              <el-input v-model="product.payment" style="width: 150px" @blur="paymentChange(product)">
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
          <tr>
            <td :colspan="6" class="text-right is-total">
              <span>合计数量:{{total.goodsCount}}</span>
              <span class="ml-15">合计本次{{titleAry[type][2]}}金额:¥{{total.payment | formatMoney}}</span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div v-show="!selectPayments.length" class="empty-info mini">暂无数据</div>
    </div>
  </div>

</template>
<script>
import methodsMixin from '@/mixins/methodsMixin';

export default {
  props: {
    selectPayments: Array,
    amount: '',
    index: Number,
    type: Number,
    titleAry: Object,
    defaultIndex: Number
  },
  mixins: [methodsMixin],
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
        orgId: '',
        orgGoodsId: '',
        createStartTime: '',
        createEndTime: ''
      },
      searchCondition: {
        orgId: '',
        orgGoodsId: '',
        createStartTime: '',
        createEndTime: ''
      },
      createTimes: '',
      goodesList: [],
      orgList: []
    };
  },
  computed: {
    showPayments() {
      return this.payments.filter(f => this.selectPayments.every(e => e.id !== f.id));
    },
    total() {
      return this.selectPayments.reduce((pre, next) => {
        return {
          goodsCount: Number(pre.goodsCount) + Number(next.goodsCount),
          payment: Number(pre.payment) + Number(next.payment)
        };
      }, {goodsCount: 0, payment: 0}) || {};
    }
  },
  watch: {
    type() {
      this.payments = [];
      this.goodesList = [];
      this.searchCondition.orgId = '';
      this.orgList = [];
      this.resetSearchForm();
      this.orgChange(false);
    },
    defaultIndex() {
      this.payments = [];
      this.goodesList = [];
      this.searchCondition.orgId = '';
      this.orgList = [];
      this.resetSearchForm();
      this.orgChange(false);
    },
    filterRights: {
      handler: function () {
        this.queryPayments(1);
      },
      deep: true
    }
  },
  filters: {
    formatCount(val) {
      if (!val) return '0.00';
      if (typeof val === 'string') {
        return val;
      } else if (typeof val === 'number') {
        return val.toFixed(2);
      }
    }
  },
  methods: {
    queryPayments(pageNo) {
      if (!this.searchCondition.orgId) return;
      this.pager.currentPage = pageNo;
      this.loadingData = true;
      this.filterRights.orgId = undefined;
      let params = Object.assign({}, {
        pageNo: pageNo,
        pageSize: this.pager.pageSize
      }, this.filterRights);
      let url = this.type === 1 ? `accounts-payable/remittee/${this.searchCondition.orgId}/detail`
        : `/accounts-receivable/${this.searchCondition.orgId}/valid-detail`;
      this.$http.get(url, {params}).then(res => {
        this.loadingData = false;
        res.data.list.forEach(item => {
          let count = item.billAmount;
          item.payment = count ? count.toFixed(2) : 0.00;
        });
        this.payments = res.data.list;
        this.pager.count = res.data.count;
      });
    },
    orgChange(val) {
      this.payments = [];
      this.$parent.selectPayments = [];
      val && this.searchInOrder();
      this.$emit('orgChange');
    },
    orgGoodsIdChange(val) {
      this.searchInOrder();
    },
    createTimeChange(val) {
      this.searchInOrder();
    },
    searchProduct(keyWord) {
      if (!this.searchCondition.orgId) return;
      if (!keyWord && this.goodesList.length) return;
      let o1 = this.$store.state.user.userCompanyAddress;
      let o2 = this.searchCondition.orgId;
      if (!o1 || !o2) return;
      let params = {
        povId: this.type === 1 ? o1 : o2,
        cdcId: this.type === 1 ? o2 : o1,
        keyWord: keyWord
      };
      this.$http.get('/erp-stock/bill/goods-list', {params}).then(res => {
        this.goodesList = res.data.list;
      });
    },
    searchInOrder: function (isShowTip = true) {// 搜索
      let {titleAry, type} = this;
      if (!this.searchCondition.orgId && isShowTip) {
        return this.$notify.info({message: `请选择${titleAry[type][3]}`});
      }
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
    paymentChange(item) {
      let value = item.billAmount;
      if (value < 0) {
        if (item.payment < value) {
          this.$notify.info({message: this.getTitle('小于')});
        }
      } else {
        if (item.payment > value) {
          this.$notify.info({message: this.getTitle('大于')});
        }
      }
      item.payment = Number(item.payment);
      item.payment = item.payment ? item.payment.toFixed(2) : 0.00;
    },
    getTitle(tlt) {
      let {titleAry, type} = this;
      return `输入的金额${tlt}待${titleAry[type][2]}金额，请修改本次${titleAry[type][2]}金额，否则无法添加${titleAry[type][0]}`;
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
