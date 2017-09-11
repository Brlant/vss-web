<style lang="less" scoped="">
  .advanced-query-form {
    .el-select {
      display: block;
      position: relative;
    }
    .el-date-editor.el-input {
      width: 100%;
    }
    padding-top: 20px;
  }

  .i-bg {
    display: inline-block;
    background: #eee;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    text-align: center;
    line-height: 35px;
    margin-right: 10px;
    margin-bottom: 10px;
  }

  .container {
    padding-left: 15px;
    padding-right: 15px;
  }
</style>
<template>
  <div class="order-page">
    <h4 class="position-nav">
      <span class="position-nav-text">{{$route.meta.title}}</span>
      <span class="pull-right btn-group-right">
          <a href="#" class="btn-circle" @click.stop.prevent="showSearch = !showSearch">
              <i class="iconfont icon-search"></i>
          </a>
      </span>
    </h4>

    <div class="container">

      <el-form v-show="showSearch" class="advanced-query-form">
        <el-row>
          <el-col :span="8">
            <oms-form-row label="选择货主" :span="6">
              <el-select filterable remote placeholder="请输入关键字搜索货主信息" :remote-method="filterCustomer"
                         :clearable="true"
                         v-model="searchCondition.orgId" @change="orgChange">
                <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in orgList"></el-option>
              </el-select>
            </oms-form-row>
          </el-col>
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
              <div @click="isOrgListExist">
                <el-select filterable remote placeholder="请输入关键字搜索来源单位" :remote-method="filterOrg" :clearable="true"
                           v-model="searchCondition.supplierId">
                  <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in customerList"></el-option>
                </el-select>
              </div>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row label="来源订单号" :span="6">
              <oms-input type="text" v-model="searchCondition.thirdPartyNumber" placeholder="请输入来源订单号"></oms-input>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row label="物流商" :span="6">
              <div @click="isOrgListExist">
                <el-select filterable remote placeholder="请输入关键字搜索物流商" :remote-method="filterLogistics"
                           :clearable="true"
                           v-model="searchCondition.logisticsProviderId">
                  <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in logisticsList"></el-option>
                </el-select>
              </div>
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
          <el-col :span="8">
            <oms-form-row label="" :span="6">
              <el-button type="primary" @click="searchInOrder">查询</el-button>
              <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
            </oms-form-row>
          </el-col>
        </el-row>
      </el-form>

      <div class="order-list-status">
        <div class="status-item" :class="{'active':key==activeStatus}"
             v-for="(item,key) in orgType" @click="checkStatus(item, key)">
          <div class="status-bg" :class="['b_color_'+key]"></div>
          <div>{{item.title}}<span class="status-num">{{item.num}}</span></div>
        </div>

      </div>
      <div class="order-list" style="margin-top: 20px">
        <el-row class="order-list-header" :gutter="10">
          <el-col :span="4">货主/订单号</el-col>
          <el-col :span="2">业务类型</el-col>
          <el-col :span="4">来源/订单号</el-col>
          <el-col :span="5">物流</el-col>
          <el-col :span="2">状态</el-col>
          <el-col :span="4">时间</el-col>
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
        <div v-else="" class="order-list-body">
          <div class="order-list-item" v-for="item in orderList"
               :class="['status-'+(parseInt(item.wmsStatus, 10)+1) ,{'active':currentOrderId==item.id}]">
            <el-row>
              <el-col :span="4">
                <div class="f-grey">
                  {{item.orderNo }}
                </div>
                <div>
                  {{item.orgName }}
                </div>
              </el-col>
              <el-col :span="2" class="pt10">
                <div>
                  采购入库
                  <!--<dict :dict-group="'bizInType'" :dict-key="item.bizType"></dict>-->
                </div>
              </el-col>
              <el-col :span="4">
                <div class="f-grey" v-show="item.bizType < 2">{{item.thirdPartyNumber }}</div>
                <div v-show="item.bizType < 2">{{item.supplierName }}</div>
              </el-col>
              <el-col :span="5">
                <div v-show="item.bizType !== '2'">
                  <div v-show="item.transportationMeansId">
                    物流方式：
                    <dict :dict-group="'transportationMeans'" :dict-key="item.transportationMeansId"></dict>
                  </div>
                </div>
                <div v-show="item.transportationMeansId === '1'||item.transportationMeansId === '3'  ">
                  <span v-show="item.logisticsProviderName"> 物流商：{{ item.logisticsProviderName}}</span>
                </div>
                <div v-show="item.transportationMeansId === '2'">
                  <span v-show="item.transportationAddress">
                      提货地址：{{ item.transportationAddress}}
                  </span>
                </div>
              </el-col>
              <el-col :span="2" class="pt10">
                <div>
                  {{getOrderStatus(item)}}
                </div>
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
              <el-col :span="3" class="opera-btn">
                <span v-show="item.wmsStatus === '0'" @click="showRightPart(item)">
                  <a href="#" class="btn-circle btn-bg-mr" @click.prevent=""><i
                    class="iconfont icon-appoint"></i></a>
                  指派复核人
                </span>
                <span v-show="item.wmsStatus === '1'" @click="showRightPart(item)">
                  <a href="#" class="btn-circle btn-bg-mr" @click.prevent=""><i
                    class="iconfont icon-scan"></i></a>
                  扫描复核
                </span>
                <span v-show="item.wmsStatus === '2'  " @click="showRightPart(item)">
                  <a href="#" class="btn-circle btn-bg-mr" @click.prevent=""><i
                    class="iconfont icon-affirm"></i></a>
                  分配货位
                </span>
                <span v-show="item.wmsStatus === '3' " @click="showRightPart(item)">
                  <a href="#" class="btn-circle btn-bg-mr" @click.prevent=""><i
                    class="iconfont icon-appoint"></i></a>
                  指派上架人
                </span>
                <div v-show="item.wmsStatus === '4' " @click="onShelf(item)">
                  <a href="#" class="btn-circle btn-bg-mr" @click.prevent=""><i
                    class="iconfont icon-shelf"></i></a>
                  上架
                </div>
                <!--<span v-show="item.wmsStatus === '5' " @click="showRightPart(item)">-->
                <!--<a href="#" class="btn-circle btn-bg-mr" @click.prevent=""><i-->
                <!--class="iconfont icon-detail"></i></a>-->
                <!--查看详情-->
                <!--</span>-->
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
        :total="pager.count" :pageSize="pager.pageSize" @current-change="getOrders"
        :current-page="pager.currentPage">
      </el-pagination>
    </div>
    <page-right :show=" showPartIndex === '0'" @right-close="resetRightBox" :css="{'width':'1200px','padding':0}">
      <review-man @close="resetRightBox" :orderId="currentOrderId" :showPartIndex="showPartIndex"></review-man>
    </page-right>
    <page-right :show=" showPartIndex === '1'" @right-close="resetRightBox" :css="{'width':'1200px','padding':0}">
      <scan @close="resetRightBox" :orderId="currentOrderId" :showPartIndex="showPartIndex"></scan>
    </page-right>
    <page-right :show=" showPartIndex === '2' " @right-close="resetRightBox" :css="{'width':'1200px','padding':0}">
      <allot-place @close="resetRightBox" :orderId="currentOrderId" :showPartIndex="showPartIndex"></allot-place>
    </page-right>
    <page-right :show=" showPartIndex === '3'" @right-close="resetRightBox" :css="{'width':'1200px','padding':0}">
      <shelf-man @close="resetRightBox" :orderId="currentOrderId" :showPartIndex="showPartIndex"></shelf-man>
    </page-right>
    <page-right :show=" showPartIndex === '5'" @right-close="resetRightBox" :css="{'width':'1200px','padding':0}">
      <detail @close="resetRightBox" :showPartIndex="showPartIndex"></detail>
    </page-right>
  </div>
</template>
<script>
  import utils from '../../../tools/utils';
  import allotPlace from './allot-place.vue';
  import detail from './detail.vue';
  import reviewMan from './review-man.vue';
  import shelfMan from './shelf-man.vue';
  import scan from './scan.vue';

  import {BaseInfo, InWork} from '@/resources';

  export default {
    components: {allotPlace, detail, reviewMan, shelfMan, scan},
    data() {
      return {
        activeStatus: 0, // 当前状态
        loadingData: true,
        showPartIndex: '', // 是否显示确认
        showSearch: false,
        orgType: utils.inType,
        orderList: [],
        currentOrderId: '',
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        },
        filters: {
          type: 0,
          state: 4,
          wmsStatus: null,
          deleteFlag: false,
          orgId: '',
          orderNo: '',
          logisticsProviderId: '',
          expectedStartTime: '',
          expectedEndTime: '',
          transportationMeansId: '',
          supplierId: '',
          thirdPartyNumber: ''
        },
        searchCondition: {
          orgId: '',
          orderNo: '',
          logisticsProviderId: '',
          expectedStartTime: '',
          expectedEndTime: '',
          transportationMeansId: '',
          supplierId: '',
          thirdPartyNumber: ''
        },
        expectedTime: [],
        orgList: [], // 查询 货主列表
        customerList: [], // 来源单位列表
        logisticsList: [] // 物流商列表
      };
    },
    mounted() {
      this.filterCustomer();
      this.getOrders(1);

    },
    computed: {
      transportationMeansList: function () {
        return this.$store.state.dict['transportationMeans'];
      }
    },
    watch: {
      filters: {
        handler: function () {
          this.getOrders(1);
        },
        deep: true
      }
    },
    methods: {
      resetRightBox: function () { // 重置弹出窗
        this.showPartIndex = '';
        this.getOrders(this.pager.currentPage);
      },

      checkStatus(item, key) {
        this.activeStatus = key;
        this.filters.wmsStatus = item.state;
      },
      showRightPart: function (item) {
        this.currentOrderId = item.id;
        this.$nextTick(() => {
          this.showPartIndex = item.wmsStatus;
        });
      },
      onShelf(item) {
        this.$confirm('是否确认上架', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          InWork.onShelf(item.id).then(res => {
            this.$notify.success({
              message: '确认上架成功'
            });
            this.getOrders(this.pager.currentPage);
          }).catch(error => {
            this.$notify.error({
              message: error.response.data && error.response.data.msg || '确认上架失败'
            });
          });
        });
      },
      getOrders(pageNo) { // 从oms中查询订单
        this.pager.currentPage = pageNo;
        let params = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filters);
        this.loadingData = true;
        InWork.queryOmsOrder(params).then(res => {
          res.data.list.forEach(item => {
            item.isChecked = false;
          });
          this.orderList = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
        this.queryOrderCount();
      },
      queryOrderCount() {
        let params = JSON.parse(JSON.stringify(this.filters));
        params.wmsStatus = null;
        InWork.queryOrderCount(params).then(res => {
          this.orgType[0].num = res.data['all'];
          this.orgType[1].num = res.data['assign-reviewer'];
          this.orgType[2].num = res.data['review-code'];
          this.orgType[3].num = res.data['assign-store'];
          this.orgType[4].num = res.data['assign-pick-operator'];
          this.orgType[5].num = res.data['pending-picking'];
          this.orgType[6].num = res.data['completed'];
        });
      },
      getOrderStatus: function (order) { // 获取订单状态
        let orgTypeItem = this.orgType[parseInt(order.wmsStatus, 10) + 1];
        return orgTypeItem && orgTypeItem.title || '';
      },
      filterCustomer: function (query) {// 过滤客户
        BaseInfo.query({keyWord: query, type: 0}).then(res => {
          this.orgList = res.data.list;
        });
      },
      filterOrg: function (query) {// 过滤供货商
        let orgId = this.searchCondition.orgId;
        if (!orgId) {
          this.searchCondition.supplierId = '';
          this.customerList = [];
          return;
        }
        BaseInfo.queryOrgByReation(orgId, {keyWord: query}).then(res => {
          this.customerList = res.data;
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
      orgChange: function () {
        this.searchCondition.supplierId = '';
        this.customerList = [];
        this.filterOrg();
        this.filterLogistics();
      },
      searchInOrder: function () {// 搜索
        if (!this.expectedTime[0]) {
          this.searchCondition.expectedStartTime = '';
        } else {
          this.searchCondition.expectedStartTime = this.$moment(this.expectedTime[0]).format('YYYY-MM-DD');
        }
        if (!this.expectedTime[1]) {
          this.searchCondition.expectedEndTime = '';
        } else {
          this.searchCondition.expectedEndTime = this.$moment(this.expectedTime[1]).format('YYYY-MM-DD');
        }
        Object.assign(this.filters, this.searchCondition);
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          orgId: '',
          orderNo: '',
          logisticsProviderId: '',
          expectedStartTime: '',
          expectedEndTime: '',
          transportationMeansId: '',
          supplierId: '',
          thirdPartyNumber: ''
        };
        this.expectedTime = [];
        if (this.isSupplierOrOrg) {
          temp.orgId = this.$route.params.id;
        }
        Object.assign(this.searchCondition, temp);
        Object.assign(this.filters, temp);
      },
      isOrgListExist: function () {
        if (!this.searchCondition.orgId) {
          this.$notify.info({
            duration: 2000,
            message: '请先选择货主'
          });
          return;
        }
        if (this.customerList.length === 0) {
          this.$notify.info({
            duration: 2000,
            message: '货主无来源单位'
          });
        }
      }
    }
  };
</script>
