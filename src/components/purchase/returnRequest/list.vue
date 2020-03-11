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
            <perm label="return-request-add">
                    <a href="#" class="btn-circle" @click.prevent=""><i
                      class="el-icon-t-plus"></i> </a>添加
            </perm>
          </span>
          <span class="pull-left switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form v-show="showSearch" class="advanced-query-form clearfix" style="padding-top: 10px"
                 onsubmit="return false">
          <el-row>
            <el-col :span="8">
              <oms-form-row label="退货申请单号" :span="8">
                <oms-input type="text" v-model="searchCondition.id" placeholder="请输入退货申请单号"></oms-input>
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
            <el-col :span="8" v-if="pageType === 'pov'">
              <oms-form-row label="供货单位" :span="6">
                <el-select filterable remote placeholder="请输入名称搜索供货单位" :remote-method="filterOrg" :clearable="true"
                           v-model="searchCondition.cdcId" popperClass="good-selects"
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
            <el-col :span="8" v-if="pageType === 'cdc'">
              <oms-form-row label="退货单位" :span="6">
                <el-select filterable remote placeholder="请输入名称搜索退货单位" :remote-method="filterPOV" :clearable="true"
                           v-model="searchCondition.povId" popperClass="good-selects"
                           @click.native.once="filterOrg('')">
                  <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in povList">
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
          </el-row>
          <div v-if="pageType === 'pov'">
            <el-row>
              <el-col :span="8">
                <oms-form-row label="预计退货日期" :span="8">
                  <el-col :span="24">
                    <el-date-picker
                      v-model="demandTime"
                      type="daterange"
                      placeholder="请选择">
                    </el-date-picker>
                  </el-col>
                </oms-form-row>
              </el-col>
              <el-col :span="8">
                <oms-form-row label="申请时间" :span="6">
                  <el-col :span="24">
                    <el-date-picker
                      v-model="applyTime"
                      type="datetimerange"
                      :default-time="['00:00:00', '23:59:59']"
                      placeholder="请选择">
                    </el-date-picker>
                  </el-col>
                </oms-form-row>
              </el-col>
              <el-col :span="8">
                <oms-form-row label="" :span="5">
                  <el-button type="primary" native-type="submit" @click="searchInOrder">查询</el-button>
                  <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
                </oms-form-row>
              </el-col>
            </el-row>
          </div>
          <div v-if="pageType === 'cdc'">
            <el-row>
              <el-col :span="8">
                <oms-form-row label="退货单位区域代码" :span="8">
                  <oms-input type="text" v-model="searchCondition.orgAreaCode" placeholder="请输入单位区域代码"></oms-input>
                </oms-form-row>
              </el-col>
              <el-col :span="8">
                <oms-form-row label="预计退货日期" :span="7">
                  <el-col :span="24">
                    <el-date-picker
                      v-model="demandTime"
                      type="daterange"
                      placeholder="请选择">
                    </el-date-picker>
                  </el-col>
                </oms-form-row>
              </el-col>
              <el-col :span="8">
                <oms-form-row label="申请时间" :span="6">
                  <el-col :span="24">
                    <el-date-picker
                      v-model="applyTime"
                      type="datetimerange"
                      :default-time="['00:00:00', '23:59:59']"
                      placeholder="请选择">
                    </el-date-picker>
                  </el-col>
                </oms-form-row>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <oms-form-row label="" :span="5">
                  <el-button type="primary" native-type="submit" @click="searchInOrder">查询</el-button>
                  <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
                </oms-form-row>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>

      <div class="order-list-status container" style="margin-bottom:20px">
        <div class="status-item" :style="`width: ${['2', '5'].includes(item.state) ? 140 : 120}px`"
             :class="{'active':key==activeStatus}"
             v-for="(item,key) in orgType"
             @click="changeStatus(item,key)">
          <div class="status-bg" :class="['b_color_'+key]"></div>
          <div><i class="el-icon-caret-right" v-if="key==activeStatus"></i>{{item.title}}<span class="status-num">{{item.num}}</span>
          </div>
        </div>
      </div>
      <div class="order-list clearfix">
        <el-row class="order-list-header">
          <el-col :span="5">
            退货单位/退货申请单号
          </el-col>
          <el-col :span="3">订单类型</el-col>
          <el-col :span="5">供货单位</el-col>
          <el-col :span="5">时间</el-col>
          <el-col :span="3">状态</el-col>
          <el-col :span="3">操作</el-col>
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
               :class="['status-'+filterListColor(item.status),{'active':currentOrderId==item.id}]">
            <el-row>
              <el-col :span="5">
                <div class="f-grey">
                  {{item.id }}
                </div>
                <div>
                  {{item.povName }}
                </div>
              </el-col>
              <el-col :span="3">
                <dict dict-group="orderGoodsType" :dict-key="'' + item.goodsType"></dict>
              </el-col>
              <el-col :span="5" class="pt10">
                <div>{{item.cdcName }}</div>
              </el-col>
              <el-col :span="5">
                <div>申请时间：{{item.applyTime | minute }}</div>
                <div>预计退货日期：{{ item.demandTime | date }}</div>
              </el-col>
              <el-col :span="3">
                <div class="vertical-center">
                  {{getOrderStatus(item)}}
                </div>
              </el-col>
              <el-col :span="3" class="opera-btn">
                <perm label="return-request-query-edit" v-if="pageType === 'pov' && item.status  === 0">
                  <span @click.stop.prevent="editOrder(item)">
                    <a href="#" class="btn-circle" @click.prevent=""><i
                      class="el-icon-t-edit"></i></a>
                  编辑
                 </span>
                </perm>
                <perm label="sub-unit-return-request-query-edit" v-if="pageType === 'cdc' && item.status === 1">
                  <span @click.stop.prevent="editCount(item)">
                    <a href="#" class="btn-circle" @click.prevent=""><i
                      class="el-icon-t-edit"></i></a>
                  编辑
                 </span>
                </perm>
              </el-col>
            </el-row>
            <div class="order-list-item-bg"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">
      <el-cu-pagination
        layout="prev, pager, next"
        :total="pager.count" :pageSize="pager.pageSize" @current-change="getOrderList"
        :current-page="pager.currentPage">
      </el-cu-pagination>
    </div>
    <page-right :show="showDetail" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}"
                class="order-detail-info specific-part-z-index" partClass="pr-no-animation">
      <show-form :orderId="currentOrderId" :state="state + ''" @refreshOrder="refreshOrder"
                 @close="resetRightBox"></show-form>
    </page-right>
    <page-right :show="showItemRight" @right-close="beforeCloseConfirm" :css="{'width':'1000px','padding':0}">
      <add-form type="1" :defaultIndex="defaultIndex" :orderId="currentOrderId" @change="onSubmit" :action="action"
                @close="resetRightBox"></add-form>
    </page-right>
    <page-right :show="showItemRight" @right-close="beforeCloseConfirm" :css="{'width':'1000px','padding':0}">
      <add-form type="1" :defaultIndex="defaultIndex" :orderId="currentOrderId" @change="onSubmit" :action="action"
                @close="resetRightBox"></add-form>
    </page-right>
    <page-right :show="showEditPart" :css="{'width':'1000px','padding':0}" @right-close="resetRightBox">
      <edit-count @change="onSubmit" :currentItem="currentItem" :showEditPart="showEditPart"
                  @close="resetRightBox"></edit-count>
    </page-right>
  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import showForm from './show.order.out.vue';
  import addForm from './form/outForm.vue';
  import {BaseInfo, returnRequest, Vaccine} from '@/resources';
  import OrderMixin from '@/mixins/orderMixin';
  import editCount from './form/editCount';

  export default {
    components: {
      showForm, addForm, editCount
    },
    data: function () {
      return {
        loadingData: true,
        showItemRight: false,
        showEditPart: false,
        showPart: false,
        showDetail: false,
        showSearch: false,
        orderList: [],
        filters: {
          type: 1,
          status: '0',
          id: '',
          logisticsProviderName: '',
          demandEndTime: '',
          demandStartTime: '',
          applyStartTime: '',
          applyEndTime: '',
          transportationMeansId: '',
          cdcId: '',
          povId: '',
          thirdPartyNumber: '',
          orgGoodsId: '',
          deleteFlag: false,
          pushStatus: '',
          orgAreaCode: ''
        },
        searchCondition: {
          searchType: 1,
          id: '',
          logisticsProviderName: '',
          demandEndTime: '',
          demandStartTime: '',
          applyStartTime: '',
          applyEndTime: '',
          transportationMeansId: '',
          cdcId: '',
          povId: '',
          orgGoodsId: '',
          thirdPartyNumber: '',
          pushStatus: '',
          orgAreaCode: ''
        },
        demandTime: '',
        applyTime: '',
        orgType: utils[this.$route.meta.type === 'pov' ? 'outReturnRequestType' : 'outCdcReturnRequestType'],
        activeStatus: 0,
        currentOrderId: '',
        currentItem: {},
        orgList: [], // 来源单位列表
        logisticsList: [], // 物流商列表
        povList: [],
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
    mounted() {
      if (this.$route.meta.type === 'pov') {
        this.filters.status = '0';
        this.activeStatus = '0';
      } else {
        this.filters.status = '1';
        this.activeStatus = '1';
      }
      this.getOrderList(1);
    },
    computed: {
      transportationMeansList: function () {
        return this.$getDict('outTransportMeans');
      },
      bizInTypes: function () {
        return this.$getDict('bizOutType');
      },
      pageType() {
        return this.$route.meta.type;
      }
    },
    watch: {
      filters: {
        handler: function () {
          this.getOrderList(1);
        },
        deep: true
      },
      pageType() {
        this.orgType = utils[this.$route.meta.type === 'pov' ? 'outReturnRequestType' : 'outCdcReturnRequestType'];
        this.getOrderList(1);
      }
    },
    methods: {
      showPartItem(item) {
        this.currentOrderId = item.id;
        this.showPart = true;
      },
      getOrderStatus: function (order) {
        let state = '';
        for (let key in this.orgType) {
          if (order.status + '' === this.orgType[key].state) {
            state = this.orgType[key].title;
          }
        }
        return state;
      },
      searchInOrder: function () {// 搜索
        this.searchCondition.demandStartTime = this.$formatAryTime(this.demandTime, 0, 'YYYY-MM-DD 00:00:00');
        this.searchCondition.demandEndTime = this.$formatAryTime(this.demandTime, 1, 'YYYY-MM-DD 23:59:59');
        this.searchCondition.applyStartTime = this.$formatAryTime(this.applyTime, 0, 'YYYY-MM-DD HH:mm:ss');
        this.searchCondition.applyEndTime = this.$formatAryTime(this.applyTime, 1, 'YYYY-MM-DD HH:mm:ss');
        Object.assign(this.filters, this.searchCondition);
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          searchType: '',
          id: '',
          logisticsProviderName: '',
          demandEndTime: '',
          demandStartTime: '',
          applyStartTime: '',
          applyEndTime: '',
          transportationMeansId: '',
          cdcId: '',
          povId: '',
          orgGoodsId: '',
          thirdPartyNumber: '',
          pushStatus: '',
          orgAreaCode: ''
        };
        this.demandTime = '';
        this.applyTime = '';
        Object.assign(this.searchCondition, temp);
        Object.assign(this.filters, temp);
      },
      editOrder(item) {
        this.action = 'edit';
        this.currentOrderId = item.id;
        this.showItemRight = true;
        this.defaultIndex = 2;
      },
      editCount(item) {
        this.currentItem = item;
        this.currentOrderId = item.id;
        this.showEditPart = true;
      },
      resetRightBox: function () {
        this.showDetail = false;
        this.showItemRight = false;
        this.defaultIndex = 0;
        this.action = '';
        this.showPart = false;
        this.showEditPart = false;
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
        returnRequest[this.pageType === 'pov' ? 'povQuery' : 'cdcQuery'](param).then(res => {
          this.initCheck(res.data.list);
          this.orderList = res.data.list;
//          this.pager.count = res.data.count;
          if (this.orderList.length === this.pager.pageSize) {
            this.pager.count = this.pager.currentPage * this.pager.pageSize + 1;
          }
          this.loadingData = false;
        });
        this.queryStatusNum(param);
      },
      refreshOrder() {
        this.getOrderList(this.pager.currentPage);
      },
      searchProduct(keyWord) {
        let params = Object.assign({}, {
          keyWord: keyWord
        });
        Vaccine.query(params).then(res => {
          this.goodesList = res.data.list;
        });
      },
      filterOrg: function (query) {// 过滤供货商
        let orgId = this.$store.state.user.userCompanyAddress;
        if (!orgId) {
          this.searchCondition.cdcId = '';
          this.orgList = [];
          return;
        }
        BaseInfo.queryOrgByReation(orgId, {keyWord: query, relation: '1'}).then(res => {
          this.orgList = res.data;
        });
      },
      filterPOV: function (query) {// 过滤POV
        let orgId = this.$store.state.user.userCompanyAddress;
        if (!orgId) return;
        let params = {
          keyWord: query,
          type: '1',
          vaccineType: this.vaccineType,
          subjectOrgId: orgId
        };
        BaseInfo.queryOrgByVossAuth(orgId, params).then(res => {
          this.povList = res.data;
        });
      },
      filterLogistics: function (query) {// 过滤物流提供方
        let orgId = this.$store.state.user.userCompanyAddress;
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
          if (this.orgType[key].state === index + '') {
            status = key;
          }
        }
        return status;
      },
      queryStatusNum: function (params) {
        returnRequest[this.pageType === 'pov' ? 'povQueryCount' : 'cdcQueryCount'](params).then(res => {
          let data = res.data;
          Object.values(this.orgType).forEach(i => {
            let item = res.data.find(f => f.status + '' === i.state);
            i.num = item && item.count || 0;
          });
        });
      },
      showItem: function (order) {
        this.currentOrderId = '';
        this.$nextTick(() => {
          this.currentOrderId = order.id;
          this.state = order.status;
          this.showDetail = true;
        });
      },
      changeStatus: function (item, key) {// 订单分类改变
        this.activeStatus = key;
        this.filters.status = item.state;
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
