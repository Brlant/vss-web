<style lang="less" scoped>
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

  .search-input {
    .el-select {
      display: block;
      position: relative;
    }
    .el-date-editor.el-input {
      width: 100%;
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
  }

  .payForm {
    .el-form-item {
      margin-bottom: 10px;
    }
  }
</style>
<template>
  <div>
    <div class="container">
      <div class="order-list-status container" style="margin-bottom:20px">
        <div class="status-item active"
             v-for="(item,key) in orgType">
          <div class="status-bg" :class="['b_color_'+key]"></div>
          <div class="title">{{item.title}}<span class="status-num">￥{{item.num | formatMoney }}</span></div>
        </div>
      </div>
      <div class="d-table" style="margin-top: 20px">
        <div class="d-table-left">
          <div class="d-table-col-wrap" :style="'height:'+bodyHeight" @scroll="scrollLoadingData">
            <h2 class="header">
            <span class="pull-right">
                <a href="#" class="btn-circle" @click.prevent="searchType"><i
                  class="el-icon-t-search"></i> </a>
            </span>
              <!--<span class="pull-right" style="margin-right: 8px">-->
              <!--<perm label="accounts-payable-add">-->
              <!--<a href="#" class="btn-circle" @click.stop.prevent="addDetail">-->
              <!--<i class="el-icon-t-plus"></i>-->
              <!--</a>-->
              <!--</perm>-->
              <!--</span>-->
              所有应付款
            </h2>
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
                    应付款总额 <span v-show="item.payableTotal"> ￥{{item.payableTotal | formatMoney }}</span>
                  </div>
                  <div>
                    {{item.remitteeName}}
                  </div>
                </li>
              </ul>
              <div class="btn-left-list-more" @click.stop="getOrgMore">
                <el-button v-show="typePager.currentPage<typePager.totalPage">加载更多</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="d-table-right">
          <!--<span class="pull-right" style="margin-right: 8px">-->
          <!--<perm label="accounts-payable-detail-add">-->
          <!--<a href="#" class="btn-circle" @click.stop.prevent="add">-->
          <!--<i class="el-icon-t-plus"></i>-->
          <!--</a>-->
          <!--</perm>-->
          <!--</span>-->
          <div v-if="!currentItem.id">
            <div class="empty-info">暂无信息</div>
          </div>
          <div v-else="" class="d-table-col-wrap" :style="'height:'+bodyHeight">
            <div class="content-body clearfix">
              <el-row>
                <el-col :span="15">
                  <oms-row label="收款方" :span="6">
                    {{currentItem.remitteeName}}
                  </oms-row>
                  <oms-row label="未付款总额" :span="6">
                    <span>￥{{(currentItem.paidTotal ? currentItem.payableTotal - currentItem.paidTotal : currentItem.payableTotal) | formatMoney}}</span>
                  </oms-row>
                </el-col>
                <el-col :span="9">
                  <oms-row label="应付款总额" :span="8">
                    <span>￥{{currentItem.payableTotal | formatMoney}}</span>
                  </oms-row>
                  <oms-row label="已付款总额" :span="8">
                    <span>￥{{(currentItem.paidTotal ? currentItem.paidTotal : 0) | formatMoney}}</span>
                  </oms-row>
                </el-col>
              </el-row>
            </div>
            <div>
              <el-form class="payForm" ref="payForm" :inline="true" onsubmit="return false">
                <el-form-item label="货品名称">
                  <el-select v-model="searchCondition.orgGoodsId" filterable remote placeholder="请输入名称搜索产品"
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
                <el-form-item label="发生时间">
                  <el-date-picker
                    v-model="createTimes"
                    type="daterange"
                    placeholder="请选择">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="是否付清">
                  <el-switch
                    v-model="searchCondition.status"
                    on-text="是"
                    off-text="否"
                    on-value="1"
                    off-value="0"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                  </el-switch>
                </el-form-item>
                <el-form-item style="margin-left: 10px">
                  <el-button type="primary" native-type="submit" @click="searchInOrder">查询</el-button>
                  <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
                </el-form-item>
              </el-form>
              <!--<span class="pull-right" style="margin-top: 8px">-->
              <!--<span class="btn-search-toggle open" v-show="showSearch">-->
              <!--<single-input v-model="filterRights.keyWord" placeholder="请输入订单号搜索"-->
              <!--:showFocus="showSearch"></single-input>-->
              <!--<i class="el-icon-t-search" @click.stop="showSearch=(!showSearch)"></i>-->
              <!--</span>-->
              <!--<a href="#" class="btn-circle" @click.stop.prevent="showSearch=(!showSearch)" v-show="!showSearch">-->
              <!--<i class="el-icon-t-search"></i>-->
              <!--</a>-->
              <!--</span>-->
            </div>
            <el-table :data="payDetails" class="header-list" border
                      :header-row-class-name="'headerClass'" v-loading="loadingData" maxHeight="600">
              <el-table-column prop="orderNo" label="订单号" :sortable="true"></el-table-column>
              <el-table-column prop="goodsName" label="货品名称" :sortable="true" width="180"></el-table-column>
              <el-table-column prop="createTime" label="发生时间" :sortable="true">
                <template slot-scope="scope">
                  {{ scope.row.createTime | date }}
                </template>
              </el-table-column>
              <el-table-column prop="billAmount" label="应付金额" :sortable="true">
                <template slot-scope="scope">
                  ￥{{ scope.row.billAmount | formatMoney}}
                </template>
              </el-table-column>
              <el-table-column prop="salePrice" label="待付金额" :sortable="true">
                <template slot-scope="scope">
                  ￥{{ (scope.row.billAmount - scope.row.prepaidAccounts) | formatMoney}}
                </template>
              </el-table-column>
              <el-table-column prop="saleMoney" label="状态" :sortable="true" :filters="filterStatus"
                               :filter-method="filterStatusMethod">
                <template slot-scope="scope">
                  {{statusTitle(scope.row.status)}}
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
    <page-right :show="showRight" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}">
      <add-form @change="onSubmit" :formItem="form" :index="index" @refreshDetails="refreshDetails"
                @close="resetRightBox"></add-form>
    </page-right>
    <page-right :show="showLeft" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}">
      <left-form @change="onSubmit" :index="index" @close="resetRightBox" @refresh="refresh"></left-form>
    </page-right>
    <page-right :show="showPart" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}"
                partClass="pr-no-animation">
      <show-detail @change="onSubmit" :orderId="orderId" :currentDetail="currentDetail" :index="index"
                   @close="resetRightBox"
                   @refresh="refresh"></show-detail>
    </page-right>
  </div>

</template>
<script>
  import { pay, OrgGoods, Vaccine } from '@/resources';
  import addForm from './right-form.vue';
  import leftForm from './letf-form.vue';
  import showDetail from './show.order.in.vue';

  export default {
    components: {
      addForm, leftForm, showDetail
    },
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
          orgGoodsId: '',
          createStartTime: '',
          createEndTime: '',
          status: ''
        },
        searchCondition: {
          orgGoodsId: '',
          createStartTime: '',
          createEndTime: '',
          status: '0'
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
        filterStatus: [
          {text: '未付清', value: '0'},
          {text: '已付清', value: '1'}
        ],
        goodesList: []
      };
    },
    computed: {
      bodyHeight: function () {
        return this.$store.state.bodyHeight;
      },
      user () {
        return this.$store.state.user;
      }
    },
    mounted () {
      this.getOrgsList(1);
      this.queryTotalMoney();
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
      filterStatusMethod (value, row) {
        return row.status === value;
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
        }, this.filters);
        pay.query(params).then(res => {
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
      queryTotalMoney () {
        this.$http.get('/accounts-payable/statistics').then(res => {
          this.orgType[0].num = res.data['paidMoney'];
          this.orgType[1].num = res.data['totalMoney'] - res.data['paidMoney'];
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
        pay.queryDetail(this.currentItem.id, params).then(res => {
          this.loadingData = false;
          this.payDetails = res.data.list;
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
          orgGoodsId: '',
          createStartTime: '',
          createEndTime: '',
          status: '0'
        };
        this.createTimes = '';
        Object.assign(this.searchCondition, temp);
        Object.assign(this.filterRights, temp, {status: ''});
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
