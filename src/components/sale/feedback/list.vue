<style lang="scss" scoped="">

  .page-right-part {
    box-sizing: content-box;
    width: 800px;
    padding: 30px 0;
    overflow: auto;

    .title {
      margin-left: 30px;
    }

    .order-info-part {
      padding: 0 50px;
    }

    .goods-info-left {
      width: 330px;
      margin-left: 30px;
      padding: 20px;
      float: left;
      border: 1px solid rgb(238, 238, 238);
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    .goods-info-right {
      width: 210px;
      padding: 32px 20px 33px 20px;
      background-color: rgb(238, 238, 238);
      border: 1px solid rgb(238, 238, 238);
      float: left;

      .el-row {
        margin-bottom: 5px;
      }

      margin-bottom: 20px;
    }

    .min-gutter {
      .el-form-item {
        margin-bottom: 4px;
      }
    }

    .border-show {
      height: 15px;
      width: 100%;
      border-bottom: 1px solid #777777;
      opacity: 0.2;
      margin-bottom: 10px;
    }

  }

  .exceptionPosition {
    /*margin-left: 40px;*/
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  .table {
    .order-list-item {
      color: #999;
      line-height: 20px;
      cursor: pointer;
    }

    border-collapse: separate;
    border-spacing: 0;

    > tbody > tr > td {
      border-top: 1px solid #eee;
    }

  }

  .empty-position {
    width: 150px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .w90 {
    width: 90px;
  }

  .order-list-item {
    cursor: pointer;
  }

  .cursor-span {
    cursor: pointer;
  }

</style>
<template>
  <div class="order-page">
    <div class="container">
      <div class="opera-btn-group" :class="{up:!showSearch}">
        <div class="opera-icon">
          <span class="pull-left switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
          <goods-switch class="pull-right"></goods-switch>
        </div>
        <el-form v-show="showSearch" class="advanced-query-form clearfix" style="padding-top: 10px"
                 onsubmit="return false">
          <el-row>
            <el-col :span="8">
              <oms-form-row label="货主订单号" :span="6">
                <oms-input type="text" v-model="searchCondition.orderNo" placeholder="请输入货主订单号"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="接种点" :span="6">
                <el-select filterable remote placeholder="请输入名称搜索接种点" :remote-method="filterOrg" :clearable="true"
                           v-model="searchCondition.transactOrgId" popperClass="good-selects"
                           @click.native.once="filterOrg('')">
                  <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in orgList">
                    <div style="overflow: hidden">
                      <span class="pull-left" style="clear: right">{{org.name}}</span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left">
                      <span>系统代码:</span>{{org.manufacturerCode}}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="单位区域代码" :span="7">
                <oms-input type="text" v-model="searchCondition.orgAreaCode" placeholder="请输入单位区域代码"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="下单时间" :span="6">
                <el-col :span="24">
                  <el-date-picker
                    v-model="createdTime"
                    type="daterange"
                    placeholder="请选择" format="yyyy-MM-dd">
                  </el-date-picker>
                </el-col>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :label="`预计${isInOrder ? '到': '送'}货时间`" :span="7">
                <el-col :span="24">
                  <el-date-picker
                    v-model="expectedTime"
                    type="daterange"
                    placeholder="请选择" format="yyyy-MM-dd">
                  </el-date-picker>
                </el-col>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="" :span="6">
                <el-button type="primary" native-type="submit" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>


      <!--<div class="order-list-status container" style="margin-bottom:20px">-->
      <!--<div class="status-item"-->
      <!--:class="{'active':key==activeStatus,'exceptionPosition':key == 11,'w90':item.state === '4',-->
      <!--'cancelPosition': item.state==='5'}"-->
      <!--v-for="(item,key) in orgType"-->
      <!--@click="changeStatus(item,key)">-->
      <!--<div class="status-bg" :class="['b_color_'+key]"></div>-->
      <!--<div><i class="el-icon-caret-right" v-if="key==activeStatus"></i>{{item.title}}<span class="status-num">{{item.num}}</span>-->
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->
      <div class="order-list clearfix">
        <el-row class="order-list-header">
          <el-col :span="6">货主/订单号</el-col>
          <el-col :span="4">业务类型</el-col>
          <el-col :span="6" v-show="orderList.length">{{isInOrder ? '供货单位' : '接种点'}}/订单号</el-col>
          <el-col :span="6">时间</el-col>
          <el-col :span="2">状态</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="!orderList.length">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else="" class="order-list-body flex-list-dom">
          <div class="order-list-item order-list-item-bg" v-for="item in orderList" @click.prevent="showItem(item)"
               :class="[{'active':currentOrderId===item.id}]">
            <el-row>
              <el-col :span="6">
                <div class="f-grey">
                  {{item.orderNo }}
                </div>
                <div>
                  {{item.orgName }}
                </div>
              </el-col>
              <el-col :span="4">
                <div class="vertical-center">
                  <dict :dict-group="'bizType'" :dict-key="item.bizType"></dict>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="f-grey" v-show="item.thirdPartyNumber">{{item.thirdPartyNumber }}</div>
                <div>{{item.transactOrgName }}</div>
              </el-col>
              <el-col :span="6">
                <div>下单：{{item.createTime | minute }}</div>
                <div>预计到货：{{ item.expectedTime | date }}</div>
              </el-col>
              <el-col :span="2">
                <div class="vertical-center">
                  {{getOrderStatus(item)}}
                </div>
              </el-col>
            </el-row>
            <order-goods-info :order-item="item"></order-goods-info>
            <!--<div class="order-list-item-bg"></div>-->
          </div>
        </div>
      </div>
    </div>
    <div class="text-center" v-show="orderList.length&& !loadingData">
      <el-pagination
        layout="prev, pager, next, total"
        :total="pager.count" :pageSize="pager.pageSize" @current-change="getOrderList"
        :current-page="pager.currentPage">
      </el-pagination>
    </div>
    <page-right :show="showDetail" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}"
                class="order-detail-info specific-part-z-index" partClass="pr-no-animation">
      <show-form :orderId="currentOrderId" :state="state" @refreshOrder="refreshOrder"
                 @close="resetRightBox"></show-form>
    </page-right>
  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import showForm from './show.order.out.vue';
  import {BaseInfo, erpOrder, Vaccine} from '@/resources';
  import OrderMixin from '@/mixins/orderMixin';

  export default {
    components: {
      showForm
    },
    data: function () {
      return {
        loadingData: true,
        showItemRight: false,
        showPart: false,
        showDetail: false,
        showSearch: false,
        orderList: [],
        filters: {
          state: '',
          orderNo: '',
          logisticsProviderName: '',
          createStartTime: '',
          createEndTime: '',
          bizType: '',
          transportationMeansId: '',
          transactOrgId: '',
          thirdPartyNumber: '',
          orgGoodsId: '',
          orgAreaCode: '',
          deleteFlag: false,
          expectedStartTime: '',
          expectedEndTime: ''
        },
        searchCondition: {
          orderNo: '',
          logisticsProviderName: '',
          createStartTime: '',
          createEndTime: '',
          transportationMeansId: '',
          transactOrgId: '',
          orgGoodsId: '',
          orgAreaCode: '',
          thirdPartyNumber: '',
          expectedStartTime: '',
          expectedEndTime: ''
        },
        createdTime: '',
        expectedTime: '',
        orgType: utils.assginOutAndPovType,
        activeStatus: 0,
        currentOrderId: '',
        orgList: [], // 来源单位列表
        logisticsList: [], // 物流商列表
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 10
        },
        defaultIndex: 0, // 添加订单默认选中第一个tab
        action: '',
        user: {},
        state: '',
        goodesList: []
      };
    },
    mixins: [OrderMixin],
    mounted() {
      this.getOrderList(1);
      let orderId = this.$route.params.id;
      if (orderId && orderId !== 'list') {
        this.currentOrderId = orderId;
        this.showDetail = true;
      }
    },
    computed: {
      transportationMeansList: function () {
        return this.$getDict(this.isInOrder ? 'transportationMeans' : 'outTransportMeans');
      },
      isInOrder() {
        return this.orderList.some(s => s.bizType[0] === '1');
      }
    },
    watch: {
      filters: {
        handler: function () {
          this.getOrderList(1);
        },
        deep: true
      }
    },
    methods: {
      editOrder(item) {
        this.action = 'edit';
        this.currentOrderId = item.id;
        this.showItemRight = true;
        this.defaultIndex = 2;
      },
      showPartItem(item) {
        this.currentOrderId = item.id;
        this.showPart = true;
      },
      getOrderStatus: function (order) {
        let state = '';
        for (let key in this.orgType) {
          if (order.state === this.orgType[key].state) {
            state = this.orgType[key].title;
          }
        }
        return state;
      },
      searchInOrder: function () {// 搜索
        this.searchCondition.createStartTime = this.$formatAryTime(this.createdTime, 0);
        this.searchCondition.createEndTime = this.$formatAryTime(this.createdTime, 1);
        this.searchCondition.expectedStartTime = this.$formatAryTime(this.expectedTime, 0);
        this.searchCondition.expectedEndTime = this.$formatAryTime(this.expectedTime, 1);
        Object.assign(this.filters, this.searchCondition);
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          searchType: '',
          orderNo: '',
          logisticsProviderName: '',
          createStartTime: '',
          createEndTime: '',
          transportationMeansId: '',
          transactOrgId: '',
          thirdPartyNumber: '',
          orgGoodsId: '',
          orgAreaCode: '',
          expectedStartTime: '',
          expectedEndTime: ''
        };
        this.createdTime = '';
        this.expectedTime = '';
        Object.assign(this.searchCondition, temp);
        Object.assign(this.filters, temp);
      },
      searchProduct(keyWord) {
        let params = Object.assign({}, {
          keyWord: keyWord,
          orgId: this.$store.state.user['userCompanyAddress']
        });
        let level = this.$store.state.orgLevel;
        let api = level === 1 ? 'queryFirstVaccine' : 'querySecondVaccine';
        Vaccine[api](params).then(res => {
          this.goodesList = res.data.list;
        });
      },
      resetRightBox: function () {
        this.showDetail = false;
        this.showItemRight = false;
        this.defaultIndex = 0;
        this.action = '';
        this.showPart = false;
        // this.getOrderList(this.pager.currentPage);
        this.$router.push('list');
      },
      add: function () {
        this.showItemRight = true;
        this.defaultIndex = 1;
        this.action = 'add';
      },
      onSubmit: function () {
        this.currentOrderId = '';
        this.getOrderList(1);
      },
      getOrderList: function (pageNo) {
        if (pageNo === 1) {
          this.pager.count = 0;
        }
        this.pager.currentPage = pageNo;
        let param = {};
        this.loadingData = true;
        param = Object.assign({}, this.filters, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        });
        // 明细查询
        param.isShowDetail = !!JSON.parse(window.localStorage.getItem('isShowGoodsList'));
        this.$http.get('/pov-order/pager', {params: param}).then(res => {
          this.orderList = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
        // this.queryStatusNum(param);
      },
      refreshOrder() {
        this.getOrderList(this.pager.currentPage);
      },
      filterOrg: function (query) {// 过滤供货商
        let orgId = this.$store.state.user.userCompanyAddress;
        if (!orgId) return;
        let params = {
          keyWord: query,
          relation: '0'
        };
        BaseInfo.queryOrgByAllRelation(orgId, params).then(res => {
          this.orgList = res.data;
        });
      },
      filterLogistics: function (query) {// 过滤物流提供方
        let orgId = this.searchCondition.orgId;
        if (!orgId) {
          this.searchCondition.logisticsProvider = '';
          this.logisticsList = [];
          return;
        }
        BaseInfo.queryOrgByAllRelation(orgId, {keyWord: query, relation: '3'}).then(res => {
          this.logisticsList = res.data;
        });
      },
      filterListColor: function (index) {// 过滤左边列表边角颜色
        let status = -1;
        for (let key in this.orgType) {
          if (this.orgType[key].state === index) {
            status = key;
          }
        }
        return status;
      },
      orgChange: function () {
        this.searchCondition.transactOrgId = '';
        this.orgList = [];
        this.filterOrg();
        this.filterLogistics();
      },
      queryStatusNum: function (params) {
        erpOrder.queryStateNum(params).then(res => {
          let data = res.data;
          this.orgType[0].num = this.obtionStatusNum(data['out-pend-confirm']);
          this.orgType[1].num = this.obtionStatusNum(data['out-pend-check']);
          this.orgType[2].num = this.obtionStatusNum(data['out-pend-execute']);
          this.orgType[3].num = this.obtionStatusNum(data['out-pov-receipt']);
          this.orgType[4].num = this.obtionStatusNum(data['out-complete']);
          this.orgType[5].num = this.obtionStatusNum(data['out-cancel']);
        });
      },
      obtionStatusNum: function (num) {
        if (typeof num !== 'number') {
          return 0;
        }
        return num;
      },
      showItem: function (order) {
        this.currentOrderId = order.id;
        this.state = order.state;
        this.showDetail = true;
        this.$router.push(`${order.id}`);
      },
      changeStatus: function (item, key) {// 订单分类改变
        this.activeStatus = key;
        this.filters.state = item.state;
      },
      advancedQuery: function () {
        this.showSearch = !this.showSearch;
      },
      formatTime: function (date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      }
    }
  };
</script>
