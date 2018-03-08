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
          <span class="pull-right cursor-span" style="margin-left: 10px" @click.prevent="add">
            <perm label="return-manager-add">
                    <a href="#" class="btn-circle" @click.prevent=""><i
                      class="el-icon-t-plus"></i> </a>添加
            </perm>
          </span>
          <span class="pull-left switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
          <goods-switch class="pull-right"></goods-switch>
        </div>
        <el-form v-show="showSearch" class="advanced-query-form clearfix" style="padding-top: 10px" onsubmit="return false">
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
              <oms-form-row label="供货厂商" :span="6">
                <el-select filterable remote placeholder="请输入名称搜索供货厂商" :remote-method="filterOrg" :clearable="true"
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
              <oms-form-row label="货主货品" :span="6">
                <el-select v-model="searchCondition.orgGoodsId" filterable remote placeholder="请输入名称搜索货主货品"
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
                          v-show="item.orgGoodsDto.goodsNo">货品编号:</span>{{item.orgGoodsDto.goodsNo}}
                        </span>
                      <span class="select-other-info pull-left"><span
                        v-show="item.orgGoodsDto.salesFirmName">供货厂商:</span>{{ item.orgGoodsDto.salesFirmName }}
                        </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="预计出库时间" :span="7">
                <el-col :span="24">
                  <el-date-picker
                    v-model="expectedTime"
                    type="daterange"
                    placeholder="请选择">
                  </el-date-picker>
                </el-col>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="下单时间" :span="6">
                <el-col :span="24">
                  <el-date-picker
                    v-model="createTimes"
                    type="daterange"
                    placeholder="请选择" format="yyyy-MM-dd">
                  </el-date-picker>
                </el-col>
              </oms-form-row>
            </el-col>
            <el-col :span="4">
              <oms-form-row label="" :span="5">
                <el-button type="primary" native-type="submit" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>


      <div class="order-list-status container" style="margin-bottom:20px">
        <div class="status-item"
             :class="{'active':key==activeStatus,'exceptionPosition':key == 11,'w90':item.state === '4',
             'cancelPosition': item.state==='5'}"
             v-for="(item,key) in orgType"
             @click="changeStatus(item,key)">
          <div class="status-bg" :class="['b_color_'+key]"></div>
          <div><i class="el-icon-caret-right" v-if="key==activeStatus"></i>{{item.title}}<span class="status-num">{{item.num}}</span></div>
        </div>
      </div>
      <div class="order-list clearfix">
        <el-row class="order-list-header">
          <el-col :span="filters.state === '0' ? 5: 6">货主/订单号</el-col>
          <el-col :span="filters.state === '0' ? 3: 5">业务类型</el-col>
          <el-col :span="5">供货厂商</el-col>
          <el-col :span="5">时间</el-col>
          <el-col :span="3">状态</el-col>
          <el-col :span="3" v-if="filters.state === '0'">操作</el-col>
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
        <div v-else="" class="order-list-body flex-list-dom">
          <div class="order-list-item" v-for="item in orderList" @click.prevent="showItem(item)"
               :class="['status-'+filterListColor(item.state),{'active':currentOrderId==item.id}]">
            <el-row>
              <el-col :span="filters.state === '0' ? 5: 6">
                <div class="f-grey">
                  {{item.orderNo }}
                </div>
                <div>
                  {{item.orgName }}
                </div>
              </el-col>
              <el-col :span="filters.state === '0' ? 3: 5">
                <div>
                  <dict :dict-group="'bizOutType'" :dict-key="item.bizType"></dict>
                </div>
              </el-col>
              <el-col :span="5" class="pt10">
                <div>{{item.transactOrgName }}</div>
              </el-col>
              <el-col :span="5">
                <div>下单：{{item.createTime | minute }}</div>
                <div>预计出库：{{ item.expectedTime | date }}</div>
              </el-col>
              <el-col :span="3">
                <div class="vertical-center">
                  {{getOrderStatus(item)}}
                </div>
              </el-col>
              <el-col :span="3" class="opera-btn" v-if="filters.state === '0' || filters.state === '1' ">
                <perm label="return-manager-edit">
                  <span @click.stop.prevent="editOrder(item)">
                    <a href="#" class="btn-circle" @click.prevent=""><i
                      class="el-icon-t-edit"></i></a>
                  编辑
                 </span>
                </perm>
              </el-col>
            </el-row>
            <order-goods-info :order-item="item"></order-goods-info>
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
                class="order-detail-info specific-part-z-index" partClass="pr-no-animation">
      <show-form :orderId="currentOrderId" :state="state" @refreshOrder="refreshOrder"
                 @close="resetRightBox"></show-form>
    </page-right>
    <page-right :show="showItemRight" @right-close="beforeCloseConfirm" :css="{'width':'1000px','padding':0}">
      <add-form type="1" :defaultIndex="defaultIndex" :orderId="currentOrderId" @change="onSubmit" :action="action"
                @close="resetRightBox"></add-form>
    </page-right>
  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import showForm from './show.order.out.vue';
  import addForm from './form/outForm.vue';
  import { BaseInfo, erpOrder, Vaccine } from '@/resources';
  import OrderMixin from '@/mixins/orderMixin';

  export default {
    components: {
      showForm, addForm
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
          type: 1,
          state: '0',
          orderNo: '',
          logisticsProviderId: '',
          expectedStartTime: '',
          expectedEndTime: '',
          createStartTime: '',
          createEndTime: '',
          bizType: '1',
          transportationMeansId: '',
          transactOrgId: '',
          thirdPartyNumber: '',
          orgGoodsId: '',
          deleteFlag: false
        },
        searchCondition: {
          searchType: 1,
          orderNo: '',
          logisticsProviderId: '',
          expectedStartTime: '',
          expectedEndTime: '',
          createStartTime: '',
          createEndTime: '',
          transportationMeansId: '',
          transactOrgId: '',
          orgGoodsId: '',
          thirdPartyNumber: ''
        },
        expectedTime: '',
        createTimes: '',
        orgType: utils.outReturnOrderType,
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
        user: {},
        state: '',
        goodesList: []
      };
    },
    mixins: [OrderMixin],
    mounted () {
      this.getOrderList(1);
      let orderId = this.$route.params.id;
      if (orderId && orderId !== 'list') {
        this.currentOrderId = orderId;
        this.showDetail = true;
      }
    },
    computed: {
      transportationMeansList: function () {
        return this.$getDict('outTransportMeans');
      },
      bizInTypes: function () {
        return this.$getDict('bizOutType');
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
      showPartItem (item) {
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
        this.searchCondition.expectedStartTime = this.formatTime(this.expectedTime[0]);
        this.searchCondition.expectedEndTime = this.formatTime(this.expectedTime[1]);
        this.searchCondition.createStartTime = this.formatTime(this.createTimes[0]);
        this.searchCondition.createEndTime = this.formatTime(this.createTimes[1]);
        Object.assign(this.filters, this.searchCondition);
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          searchType: '',
          orderNo: '',
          logisticsProviderId: '',
          expectedStartTime: '',
          expectedEndTime: '',
          createStartTime: '',
          createEndTime: '',
          transportationMeansId: '',
          transactOrgId: '',
          orgGoodsId: '',
          thirdPartyNumber: ''
        };
        this.expectedTime = '';
        this.createTimes = '';
        Object.assign(this.searchCondition, temp);
        Object.assign(this.filters, temp);
      },
      editOrder (item) {
        this.action = 'edit';
        this.currentOrderId = item.id;
        this.showItemRight = true;
        this.defaultIndex = 2;
      },
      resetRightBox: function () {
        this.showDetail = false;
        this.showItemRight = false;
        this.defaultIndex = 0;
        this.action = '';
        this.showPart = false;
        // this.getOrderList(this.pager.currentPage);
        this.$router.push('/purchase/rejected/list');
      },
      add: function () {
        this.showItemRight = true;
        this.defaultIndex = 1;
        this.action = 'add';
      },
      onSubmit: function () {
        this.getOrderList(1);
        if (this.defaultIndex === 2) {
          let orderId = this.currentOrderId;
          this.currentOrderId = '';
          this.$nextTick(() => {
            this.currentOrderId = orderId;
          });
        }
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
        erpOrder.query(param).then(res => {
          this.orderList = res.data.list;
//          this.pager.count = res.data.count;
          if (this.orderList.length === this.pager.pageSize) {
            this.pager.count = this.pager.currentPage * this.pager.pageSize + 1;
          }
          this.loadingData = false;
        });
        this.queryStatusNum(param);
      },
      refreshOrder () {
        this.currentOrderId = '';
        this.getOrderList(1);
      },
      searchProduct (keyWord) {
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
      filterOrg: function (query) {// 过滤供货商
        let orgId = this.$store.state.user.userCompanyAddress;
        if (!orgId) {
          this.searchCondition.transactOrgId = '';
          this.orgList = [];
          return;
        }
        BaseInfo.queryOrgByReation(orgId, {keyWord: query, relation: '1'}).then(res => {
          this.orgList = res.data;
        });
      },
      filterLogistics: function (query) {// 过滤物流提供方
        let orgId = this.$store.state.user.userCompanyAddress;
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
      getTimeTitle: function (item) {
        let title = '';
        switch (item.transportationMeansId) {
          case '0': {
            title = '预计送货：';
            if (item.bizType === '1') {
              title = '预计出库：';
            }
            break;
          }
          case '1': {
            title = '预计提货：';
            break;
          }
          case '2': {
            title = '预计发货：';
            break;
          }
        }
        if (item.bizType === '2') {
          title = '';
        }
        return title;
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
        // Order.delete(order.id).then(() => {
        //   this.getOrderList();
        // });
      },
      showItem: function (order) {
        this.currentOrderId = order.id;
        this.state = order.state;
        this.showDetail = true;
        this.$router.push(`/purchase/rejected/${order.id}`);
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
