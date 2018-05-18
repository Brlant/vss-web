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
      <div class="d-table" style="margin-top: 20px">
        <div class="d-table-left">
          <h2 class="header">
            <span class="pull-right">
                <a href="#" class="btn-circle" @click.prevent="searchType"><i
                  class="el-icon-t-search"></i> </a>
            </span>
            所有{{titleAry[type][0]}}
          </h2>
          <div class="d-table-col-wrap" :style="'height:'+ (bodyHeight - 60)  + 'px'" @scroll="scrollLoadingData">

            <div class="search-left-box clearfix" v-show="showTypeSearch">
              <oms-input v-model="filters.keyWord" placeholder="请输入名称搜索" :showFocus="showTypeSearch"></oms-input>
            </div>
            <div v-if="!currentItem.id" class="empty-info">
              暂无信息
            </div>
            <div v-else>
              <ul class="show-list">
                <li v-for="item in showTypeList" class="list-item" @click="showType(item)"
                    :class="{'active':item.id==currentItem.id}">
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
                <div @click.stop="getOrgMore" v-show="!$store.state.bottomLoading">
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
          <div v-else="" class="d-table-col-wrap" :style="'height:'+bodyHeight   + 'px'">
            <div class="content-body clearfix">
                <oms-row :label="`${titleAry[type][1]}方`" :span="3">
                  {{currentItem[type ===1 ? 'cdcName' :'povName']}}
                </oms-row>
                <oms-row label="余额" :span="3">
                    ￥{{currentItem.money | formatMoney}}
                </oms-row>
            </div>
            <div>
              <el-form class="payForm" ref="payForm" :inline="true" onsubmit="return false">
                <el-form-item label="创建时间">
                  <el-date-picker v-model="createTimes" type="daterange" placeholder="请选择">
                  </el-date-picker>
                </el-form-item>
                <el-form-item style="margin-left: 10px">
                  <el-button type="primary" native-type="submit" @click="searchInOrder">查询</el-button>
                  <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
            <el-table :data="payDetails" class="header-list" border
                      :header-row-class-name="'headerClass'" v-loading="loadingData">
              <el-table-column prop="billNo" label="单据号" min-width="85"></el-table-column>
              <el-table-column prop="rechargeAmount" label="抵扣金额">
                <template slot-scope="scope">
                  ￥{{ scope.row.rechargeAmount}}
                </template>
              </el-table-column>
              <el-table-column prop="salePrice" label="创建时间">
                <template slot-scope="scope">
                  {{ scope.row.createTime | time}}
                </template>
              </el-table-column>
            </el-table>

            <div class="text-center" v-show="pager.count>pager.pageSize">
              <el-pagination layout="prev, pager, next"
                             :total="pager.count"
                             :pageSize="pager.pageSize"
                             @current-change="getDetail"
                             :current-page="pager.currentPage">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
  import { pay, Vaccine, PaymentPending } from '@/resources';
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
          endTime: ''
        },
        searchCondition: {
          startTime: '',
          endTime: ''
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
        }
      };
    },
    computed: {
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        height = (height - 30);
        return height;
      },
      user () {
        return this.$store.state.user;
      },
      type () {
        return this.$route.meta.type;
      }
    },
    mounted () {
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
      user (val) {
        if (val.userCompanyAddress) {
          this.getOrgsList(1);
        }
      },
      type (val) {
        this.getOrgsList(1);
      }
    },
    methods: {
      scrollLoadingData (event) {
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
        PaymentPending.queryPaymentTotalList(params).then(res => {
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
      refresh () {
        this.getOrgsList();
        this.resetRightBox();
      },
      refreshDetails () {
        this.getDetail();
        this.resetRightBox();
      },
      searchProduct (keyWord) {
        let params = Object.assign({}, {
          keyWord: keyWord,
          salesFirm: this.currentItem.remitteeId
        });
        let level = this.$store.state.orgLevel;
        let api = level === 1 ? 'queryFirstVaccine' : 'querySecondVaccine';
        Vaccine[api](params).then(res => {
          this.goodesList = res.data.list;
        });
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
        this.searchCondition.startTime = this.formatTime(this.createTimes[0]);
        this.searchCondition.endTime = this.formatTime(this.createTimes[1]);
        Object.assign(this.filterRights, this.searchCondition);
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          startTime: '',
          endTime: ''
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
      showDetail (item) {
        this.orderId = item.orderId;
        this.currentDetail = item.remitteeId;
        this.showPart = true;
      },
      edit (row) {
        this.form = row;
        this.showRight = true;
      },
      addDetail () {
        this.showLeft = true;
      },
      onSubmit () {
        this.getOrgsList();
      },
      formatTime: function (date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      }
    }
  };
</script>
