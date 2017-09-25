<style lang="less" scoped="">

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

  .advanced-query-form {
    .el-select {
      display: block;
      position: relative;
    }
    .el-date-editor.el-input {
      width: 100%;
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
</style>
<template>
  <div class="order-page">
    <div class="container">
      <el-form v-show="showSearch" class="advanced-query-form">
        <el-row>
          <el-col :span="8">
            <oms-form-row label="货主订单号" :span="6">
              <oms-input type="text" v-model="searchCondition.orderNo" placeholder="请输入货主订单号"></oms-input>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row label="物流方式" :span="6">
              <el-select type="text" v-model="searchCondition.transportationMeansId" placeholder="请选择物流方式">
                <el-option :value="item.key" :key="item.key" :label="item.label"
                           v-for="item in transportationMeansList"></el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row label="来源单位" :span="6">
              <el-select filterable remote placeholder="请输入关键字搜索来源单位" :remote-method="filterOrg" :clearable="true"
                         v-model="searchCondition.customerId">
                <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in orgList"></el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row label="来源订单号" :span="6">
              <oms-input type="text" v-model="searchCondition.thirdPartyNumber" placeholder="请输入来源订单号"></oms-input>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row label="物流商" :span="6">
              <el-select filterable remote placeholder="请输入关键字搜索物流商" :remote-method="filterLogistics"
                         :clearable="true"
                         v-model="searchCondition.logisticsProviderId">
                <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in logisticsList"></el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="10">
            <oms-form-row label="预计入库/拟退货时间" :span="8">
              <el-col :span="24">
                <el-date-picker
                  v-model="expectedTime"
                  type="daterange"
                  placeholder="请选择" format="yyyy-MM-dd">
                </el-date-picker>
              </el-col>
            </oms-form-row>
          </el-col>
          <el-col :span="6">
            <oms-form-row label="" :span="6">
              <el-button type="primary" @click="searchInOrder">查询</el-button>
              <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
            </oms-form-row>
          </el-col>
        </el-row>
      </el-form>

      <div class="order-list-status container" style="margin-bottom:20px">
        <div class="status-item"
             :class="{'active':key==activeStatus,'exceptionPosition':key == 11,'w90':item.state === '4' }"
             v-for="(item,key) in orgType"
             @click="changeStatus(item,key)">
          <div class="status-bg" :class="['b_color_'+key]"></div>
          <div>{{item.title}}<span class="status-num">{{item.num}}</span></div>
        </div>
        <span class="pull-right">
          <a href="#" class="btn-circle" @click.stop.prevent="advancedQuery">
              <i class="iconfont icon-search"></i>
          </a>
        </span>
      </div>
      <div class="order-list clearfix">
        <el-row class="order-list-header" :gutter="10">
          <el-col :span="4">货主/订单号</el-col>
          <el-col :span="2">业务类型</el-col>
          <el-col :span="6">来源/订单号</el-col>
          <el-col :span="6">物流</el-col>
          <el-col :span="4">时间</el-col>
          <el-col :span="2">状态</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="orderList.length == 0">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else="" class="order-list-body">
          <div class="order-list-item" v-for="item in orderList" @click.prevent="showItem(item)"
               :class="['status-'+filterListColor(item.state),{'active':currentOrderId==item.id}]">
            <el-row>
              <el-col :span="4">
                <div class="f-grey">
                  {{item.orderNo }}
                </div>
                <div>
                  {{item.orgName }}
                </div>
              </el-col>
              <el-col :span="2">
                <div class="vertical-center">
                  <dict :dict-group="'bizInType'" :dict-key="item.bizType"></dict>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="f-grey" v-show="item.bizType < 2">{{item.thirdPartyNumber }}</div>
                <div v-show="item.bizType < 2">{{item.supplierName }}</div>
              </el-col>
              <el-col :span="6">
                <div v-show="item.bizType !== '2'">
                  <div>
                    物流方式：
                    <dict :dict-group="'transportationMeans'" :dict-key="item.transportationMeansId"></dict>
                  </div>
                </div>
                <div v-show="item.transportationMeansId === '1'||item.transportationMeansId === '3'  ">
                  物流商：{{ item.logisticsProviderName}}
                </div>
                <div v-show="item.transportationMeansId === '2'">提货地址：{{ item.transportationAddress}}</div>
              </el-col>
              <el-col :span="4">
                <div>
                  <span style="letter-spacing:2em;margin-right: -2em">下单</span>
                  ：{{item.createTime | date }}
                </div>
                <div v-show="item.bizType !== '2' ">
                  <span v-show="item.bizType === '1'" style="letter-spacing:0.5em;margin-right: -0.5em">拟退货</span>
                  <span v-show="item.bizType !== '1'">预计入库</span>
                  ：{{ item.expectedTime | date}}
                </div>
              </el-col>
              <el-col :span="2">
                <div class="vertical-center">
                  {{getOrderStatus(item)}}
                  <el-tag type="danger" v-show="item.exceptionFlag">异常</el-tag>
                  <el-tag type="warning" v-show="isLock(item)">被锁定</el-tag>
                </div>
              </el-col>
            </el-row>
            <div class="order-list-item-bg"></div>
          </div>
        </div>
      </div>


    </div>
    <div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">
      <el-pagination
        layout="prev, pager, next"
        :total="pager.count" :pageSize="pager.pageSize" @current-change="getOrderList"
        :current-page="pager.currentPage">
      </el-pagination>
    </div>
    <page-right :show="showDetail" @right-close="resetRightBox" :css="{'width':'1100px','padding':0}"
                class="order-detail-info" partClass="pr-no-animation">
      <show-form :orderId="currentOrderId" @close="resetRightBox"></show-form>
    </page-right>
  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import showForm from './show.order.out.vue';
  import { Order, BaseInfo } from '@/resources';

  export default {
    components: {
      showForm
    },
    data: function () {
      return {
        loadingData: true,
        showItemRight: false,
        showDetail: false,
        showSearch: false,
        orderList: [],
        filters: {
          type: 1,
          state: '',
          orderNo: '',
          logisticsProviderId: '',
          expectedStartTime: '',
          expectedEndTime: '',
          bizType: '0',
          transportationMeansId: '',
          customerId: '',
          thirdPartyNumber: '',
          deleteFlag: false
        },
        searchCondition: {
          orderNo: '',
          logisticsProviderId: '',
          expectedStartTime: '',
          expectedEndTime: '',
          transportationMeansId: '',
          customerId: '',
          thirdPartyNumber: ''
        },
        expectedTime: [],
        orgType: utils.outOrderType,
        activeStatus: 0,
        currentOrderId: '',
        orgList: [], // 来源单位列表
        logisticsList: [], // 物流商列表
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        },
        defaultIndex: 0, // 添加订单默认选中第一个tab
        action: '',
        user: {}
      };
    },
    mounted () {
      this.getOrderList(1);
    },
    computed: {
      transportationMeansList: function () {
        return this.$store.state.dict['transportationMeans'];
      },
      bizInTypes: function () {
        return this.$store.state.dict['bizInType'];
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
        this.searchCondition.expectedStartTime = this.formatTime(this.expectedTime[0]);
        this.searchCondition.expectedEndTime = this.formatTime(this.expectedTime[1]);
        Object.assign(this.filters, this.searchCondition);
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          orderNo: '',
          logisticsProviderId: '',
          expectedStartTime: '',
          expectedEndTime: '',
          transportationMeansId: '',
          customerId: '',
          thirdPartyNumber: ''
        };
        this.expectedTime = [];
        Object.assign(this.searchCondition, temp);
        Object.assign(this.filters, temp);
      },
      resetRightBox: function () {
        this.showDetail = false;
        this.showItemRight = false;
        this.defaultIndex = 0;
        this.action = '';
        // this.getOrderList(this.pager.currentPage);
      },
      add: function () {
        this.showItemRight = true;
        this.defaultIndex = 1;
        this.action = 'add';
      },
      onSubmit: function (order) {
        this.orderList.splice(0, 0, order);
        this.currentOrderId = order.id;
      },
      getOrderList: function (pageNo) {
        this.pager.currentPage = pageNo;
        let param = {};
        this.loadingData = true;
        param = Object.assign({}, this.filters, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        });
        Order.query(param).then(res => {
          this.orderList = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
        // this.queryStatusNum(param);
      },
      filterOrg: function (query) {// 过滤供货商
        let orgId = this.searchCondition.orgId;
        if (!orgId) {
          this.searchCondition.customerId = '';
          this.orgList = [];
          return;
        }
        BaseInfo.queryOrgByReation(orgId, {keyWord: query}).then(res => {
          this.orgList = res.data;
        });
      },
      filterLogistics: function (query) {// 过滤物流提供方
        let orgId = this.searchCondition.orgId;
        if (!orgId) {
          this.searchCondition.logisticsProviderId = '';
          this.logisticsList = [];
          return;
        }
        BaseInfo.queryOrgByValidReation(orgId, {keyWord: query, relation: '3'}).then(res => {
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
        this.searchCondition.customerId = '';
        this.orgList = [];
        this.filterOrg();
        this.filterLogistics();
      },
      queryStatusNum: function () {
//        Order.queryStateNum(params).then(res => {
//          let data = res.data;
//          this.orgType[0].num = this.obtionStatusNum(data['all']);
//          this.orgType[1].num = this.obtionStatusNum(data['pending-confirm']);
//          this.orgType[2].num = this.obtionStatusNum(data['audited']);
//          this.orgType[3].num = this.obtionStatusNum(data['be-received']);
//        });
      },
      isLock: function (item) { // 判断是不是被锁定
        let isLock = false;
        if (item.lockFlag && item.lockMan !== this.user.userId) {
          isLock = true;
        }
        return isLock;
      },
      obtionStatusNum: function (num) {
        if (typeof num !== 'number') {
          return 0;
        }
        return num;
      },
      remove: function (order) {
        Order.delete(order.id).then(() => {
          this.getOrderList();
        });
      },
      showItem: function (order) {
        this.currentOrderId = order.id;
        if (this.isLock(order)) {
          this.$notify.warning({
            duration: 2000,
            title: '被锁定',
            message: '该订单信息已被' + order.lockManName + '锁定'
          });
          return;
        }
        this.showDetail = true;
        let urlPre = '/platform/in/';
        if (this.$route.meta.type === 1) {
          urlPre = '/org/' + this.$route.params.id + '/inOrder/';
        }
        utils.pushHistory('oms-order|No:' + order.id, urlPre + order.id);
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
