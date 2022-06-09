<style lang="scss" scoped>
@import "../../../assets/mixins";

.el-form .el-select {
  display: block;
}

.d-table-right {
  .org-name-h2 {
    font-size: 16px;
    font-weight: bold;
  }
}

.d-table-col-wrap {
  overflow: auto;
}

.pov-info {
  margin-bottom: 20px;

  .font-bold {
    font-size: 14px;
  }
}

.oms-row {
  font-size: 14px;
  margin-bottom: 10px;
}

.content-body {
  margin: 20px 0;
}

.el-form--inline .el-form-item {
  margin-right: 0;
}

.order-list-status .status-item {
  cursor: default;
}

.status-item {
  width: 160px;

  > div span.status-num {
    display: block;
    font-size: 18px;
  }
}

.order-list-status .status-item.active, .order-list-status .status-item:hover {
  height: 40px;
  width: 160px;
}

.payForm {
  .el-form-item {
    margin-bottom: 10px;
  }
}

.d-table > div.d-table-left {
  width: 220px;
}

.show-list .list-item {
  padding-right: 10px;
}
</style>
<template>
  <div class="pay-part">
    <div class="container">
      <div class="d-table-flex" style="margin-top: 20px">
        <div class="d-table-left">
          <h2 class="header">
            <span class="pull-right">
                <a class="btn-circle" href="#" @click.prevent="searchType"><i
                  class="el-icon-t-search"></i> </a>
            </span>
            所有{{titleAry[type][0]}}
          </h2>
          <div :style="'height:'+ (bodyHeight - 60)  + 'px'" class="d-table-col-wrap" @scroll="scrollLoadingData">

            <div v-show="showTypeSearch" class="search-left-box clearfix">
              <oms-input v-model="filters.keyWord" :showFocus="showTypeSearch" placeholder="请输入名称搜索"></oms-input>
            </div>
            <div v-if="!currentItem.id" class="empty-info">
              暂无信息
            </div>
            <div v-else>
              <ul class="show-list">
                <li v-for="item in showTypeList" :class="{'active':item.id==currentItem.id}" class="list-item"
                    @click="showType(item)">
                  <div class="id-part">
                    余额: <span> ￥{{item.money | formatMoney }}</span>
                  </div>
                  <div>
                    {{item[type ===1 ? 'cdcName' :'povName']}}
                  </div>
                </li>
              </ul>
              <div class="btn-left-list-more">
                <bottom-loading></bottom-loading>
                <div v-show="!$store.state.bottomLoading" @click.stop="getOrgMore">
                  <el-button v-show="typePager.currentPage<typePager.totalPage">加载更多</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-table-right">
          <div v-if="!currentItem.id">
            <div class="empty-info">暂无信息</div>
          </div>
          <div v-else :style="'height:'+bodyHeight   + 'px'" class="d-table-col-wrap">
            <div class="content-body clearfix">
              <oms-row :label="`${titleAry[type][1]}方`" :span="3">
                {{currentItem[type ===1 ? 'cdcName' :'povName']}}
              </oms-row>
              <oms-row :span="3" label="余额">
                ￥{{currentItem.money | formatMoney}}
              </oms-row>
            </div>
            <div>
              <el-form ref="payForm" :inline="true" class="payForm" onsubmit="return false">
                <el-form-item label="创建时间">
                  <el-date-picker v-model="createTimes" placeholder="请选择" type="daterange">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="类型">
                  <el-radio-group v-model="searchCondition.type">
                    <el-radio label="0">充值</el-radio>
                    <el-radio label="1">抵扣</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item style="margin-left: 10px">
                  <el-button native-type="submit" type="primary" @click="searchInOrder">查询</el-button>
                  <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
            <el-table v-loading="loadingData" :data="payDetails" :header-row-class-name="'headerClass'"
                      border class="header-list">
              <el-table-column label="单据号" min-width="85" prop="billNo"></el-table-column>
              <el-table-column label="类型" prop="type">
                <template slot-scope="scope">
                  {{ scope.row.type === '0' ? '充值' : '抵扣'}}
                </template>
              </el-table-column>
              <el-table-column label="金额" prop="rechargeAmount">
                <template slot-scope="scope">
                  {{ scope.row.rechargeAmount}}
                </template>
              </el-table-column>
              <el-table-column label="创建时间" prop="salePrice">
                <template slot-scope="scope">
                  {{ scope.row.createTime | time}}
                </template>
              </el-table-column>
            </el-table>

            <div v-show="pager.count>pager.pageSize" class="text-center">
              <el-pagination :current-page="pager.currentPage"
                             :pageSize="pager.pageSize"
                             :total="pager.count"
                             layout="prev, pager, next"
                             @current-change="getDetail">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import {PaymentPending, Vaccine} from '@/resources';

export default {
  data: function () {
    return {
      loadingData: false,
      showRight: false,
      showLeft: false,
      showPart: false,
      showTypeSearch: false,
      showSearch: false,
      showTypeList: [],
      filters: {
        keyWord: ''
      },
      filterRights: {
        startTime: '',
        endTime: '',
        type: ''
      },
      searchCondition: {
        startTime: '',
        endTime: '',
        type: ''
      },
      createTimes: '',
      action: 'add',
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: 10,
        totalPage: 1
      },
      typePager: {
        currentPage: 1,
        count: 0,
        pageSize: 20,
        totalPage: 1
      },
      form: {},
      currentItem: {}, //  左边列表点击时，添加样式class
      payDetails: [], // 疫苗列表
      index: 0,
      orderId: '',
      currentDetail: {},
      orgGoods: [],
      orgType: {
        0: {title: '已付总额', num: ''},
        1: {title: '未付总额', num: ''}
      },
      goodesList: [],
      titleAry: {
        1: ['预付款', '预收款'],
        2: ['预收款', '预付款']
      },
      requestTime: 0
    };
  },
  computed: {
    bodyHeight: function () {
      let height = parseInt(this.$store.state.bodyHeight, 10);
      height = (height - 30);
      return height;
    },
    user() {
      return this.$store.state.user;
    },
    type() {
      return this.$route.meta.type;
    }
  },
  mounted() {
    this.getOrgsList(1);
  },
  watch: {
    filters: {
      handler: function () {
        this.getOrgsList(1);
      },
      deep: true
    },
    filterRights: {
      handler: function () {
        this.getDetail(1);
      },
      deep: true
    },
    user(val) {
      if (val.userCompanyAddress) {
        this.getOrgsList(1);
      }
    },
    type(val) {
      this.getOrgsList(1);
    }
  },
  methods: {
    scrollLoadingData(event) {
      this.$scrollLoadingData(event);
    },
    statusTitle: function (status) {
      if (status) {
        let title = '';
        if (status === '0') {
          title = '未付清';
        } else if (status === '1') {
          title = '已付清';
        }
        return title;
      }
    },
    resetRightBox: function () {
      this.showRight = false;
      this.showLeft = false;
      this.showPart = false;
    },
    searchType: function () {
      this.showTypeSearch = !this.showTypeSearch;
    },
    getOrgsList: function (pageNo, isContinue = false) {
      let orgId = this.user.userCompanyAddress;
      if (!orgId) return;
      this.typePager.currentPage = pageNo;
      let params = Object.assign({}, {
        pageNo: pageNo,
        pageSize: this.pager.pageSize
      }, {
        povName: this.type === 1 ? this.filters.keyWord : null,
        cdcName: this.type === 2 ? this.filters.keyWord : null,
        povId: this.type === 1 ? this.$store.state.user.userCompanyAddress : null,
        cdcId: this.type === 2 ? this.$store.state.user.userCompanyAddress : null
      });
      let rTime = Date.now();
      this.requestTime = rTime;
      PaymentPending.queryPaymentTotalList(params).then(res => {
        if (this.requestTime > rTime) return;
        this.$store.commit('initBottomLoading', false);
        if (isContinue) {
          this.showTypeList = this.showTypeList.concat(res.data.list);
        } else {
          this.showTypeList = res.data.list;
          if (this.showTypeList.length !== 0) {
            this.currentItem = res.data.list[0];
            this.getDetail(1);
          } else {
            this.currentItem = Object.assign({'id': ''});
          }
        }
        this.typePager.totalPage = res.data.totalPage;

      });
    },
    refresh() {
      this.getOrgsList();
      this.resetRightBox();
    },
    refreshDetails() {
      this.getDetail();
      this.resetRightBox();
    },
    getDetail: function (pageNo) {
      this.payDetails = [];
      if (!this.currentItem.id) return;
      this.pager.currentPage = pageNo;
      this.loadingData = true;
      let params = Object.assign({}, {
        pageNo: pageNo,
        pageSize: this.pager.pageSize
      }, this.filterRights);
      this.$http.get(`/advance-payment/${this.currentItem.id}/detail/pager`, {params}).then(res => {
        this.loadingData = false;
        this.payDetails = res.data.list;
        this.pager.count = res.data.count;
      });
    },
    searchInOrder: function () {// 搜索
      this.searchCondition.startTime = this.$formatAryTime(this.createTimes, 0);
      this.searchCondition.endTime = this.$formatAryTime(this.createTimes, 1);
      Object.assign(this.filterRights, this.searchCondition);
    },
    resetSearchForm: function () {// 重置表单
      let temp = {
        startTime: '',
        endTime: '',
        type: ''
      };
      this.createTimes = '';
      Object.assign(this.searchCondition, temp);
      Object.assign(this.filterRights, temp);
    },
    getOrgMore: function () {
      this.getOrgsList(this.typePager.currentPage + 1, true);
    },
    showType: function (item) {
      this.currentItem = item;
      this.goodesList = [];
      this.getDetail(1);
    },
    showDetail(item) {
      this.orderId = item.orderId;
      this.currentDetail = item.remitteeId;
      this.showPart = true;
    },
    edit(row) {
      this.form = row;
      this.showRight = true;
    },
    addDetail() {
      this.showLeft = true;
    },
    onSubmit() {
      this.getOrgsList();
    },
    formatTime: function (date) {
      return date ? this.$moment(date).format('YYYY-MM-DD') : '';
    }
  }
};
</script>
