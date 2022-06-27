<style lang="scss" scoped>

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
      <div :class="{up:!showSearch}" class="opera-btn-group">
        <div class="opera-icon">
          <span class="pull-right cursor-span" style="margin-left: 10px" @click.prevent="add">
            <perm label="breakage-order-add">
                    <a class="btn-circle" href="#" @click.prevent=""><i
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
        <el-form v-show="showSearch" class="advanced-query-form clearfix" onsubmit="return false"
                 style="padding-top: 10px">
          <el-row>
            <el-col :span="8">
              <oms-form-row :span="6" label="货主订单号">
                <oms-input v-model="searchCondition.orderNo" placeholder="请输入货主订单号" type="text"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="货主疫苗">
                <el-select v-model="searchCondition.orgGoodsId" :clearable="true" :remote-method="searchProduct" filterable
                           placeholder="请输入名称或编号搜索货主疫苗" popper-class="good-selects" remote
                           @click.native.once="searchProduct('')">
                  <el-option v-for="org in goodesList" :key="org.id" :label="org.goodsName"
                             :value="org.id">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{org.goodsName}}</span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left"><span
                        v-show="org.goodsNo">货主货品编号:</span>{{org.goodsNo}}
                      </span>
                      <span class="select-other-info pull-left"><span
                        v-show="org.saleFirmName">供货单位:</span>{{ org.saleFirmName }}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="下单时间">
                <el-col :span="24">
                  <el-date-picker
                    v-model="createdTime"
                    format="yyyy-MM-dd"
                    placeholder="请选择" type="daterange">
                  </el-date-picker>
                </el-col>
              </oms-form-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <order-push-search v-model="searchCondition.pushStatus"/>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="3" label="">
                <el-button native-type="submit" type="primary" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>


      <div class="order-list-status container" style="margin-bottom:20px">
        <div v-for="(item,key) in orgType"
             :class="{'active':key==activeStatus,'exceptionPosition':key == 11,'w90':item.state === '4',
          'cancelPosition': item.state==='5'}"
             class="status-item"
             @click="changeStatus(item,key)">
          <div :class="['b_color_'+key]" class="status-bg"></div>
          <div><i v-if="key==activeStatus" class="el-icon-caret-right"></i>{{item.title}}<span class="status-num">{{item.num}}</span>
          </div>
        </div>
      </div>
      <div class="order-list clearfix">
        <el-row class="order-list-header">
          <el-col :span="8">货主/订单号</el-col>
          <el-col :span="4">报损方式</el-col>
          <!--<el-col :span="5">收货单位</el-col>-->
          <el-col :span="5">时间</el-col>
          <el-col :span="2">状态</el-col>
          <el-col v-if="filters.state < 4 " :span="5" class="opera-btn">操作</el-col>
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
        <div v-else class="order-list-body flex-list-dom">
          <div v-for="item in orderList" :class="['status-'+filterListColor(item.state),{'active':currentOrderId==item.id}]" class="order-list-item"
               @click.prevent="showItem(item)">
            <el-row>
              <el-col :span="8">
                <div class="f-grey">
                  {{item.orderNo }}
                </div>
                <div>
                  {{item.orgName }}
                </div>
              </el-col>
              <el-col :span="4">
                <div class="f-grey">
                  <dict :dict-key="'' + item.goodsType" dict-group="orderGoodsType"></dict>
                </div>
                <dict :dict-group="'breakageType'" :dict-key="item.customerChannel"></dict>
              </el-col>
              <!--<el-col :span="5">-->
              <!--<div>{{item.transactOrgName }}</div>-->
              <!--</el-col>-->
              <el-col :span="5">
                <div>下单：{{item.createTime | minute }}</div>
                <!--<div>预计出库：{{ item.expectedTime | date }}</div>-->
              </el-col>
              <el-col :span="2">
                <div class="vertical-center">
                  {{getOrderStatus(item)}}
                  <order-push-status :msg="item.pushMessage" :status="item.pushStatus"/>
                </div>
              </el-col>
              <el-col v-if="filters.state < 4" :span="5" class="opera-btn">
                <perm v-show="filters.state === '1'" label="breakage-order-review-code">
                  <span @click.stop.prevent="scan(item)">
                    <a class="btn-circle" href="#" @click.prevent=""><i
                      class="el-icon-t-scan"></i></a>
                    扫码复核
                  </span>
                </perm>
                <perm v-show="filters.state === '0' || filters.state === '1'"
                      label="breakage-order-edit">
                  <span @click.stop.prevent="editOrder(item)">
                    <a class="btn-circle" href="#" @click.prevent=""><i
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
    <div v-show="pager.count>pager.pageSize && !loadingData" class="text-center">
      <el-cu-pagination
        :current-page="pager.currentPage"
        :pageSize="pager.pageSize" :total="pager.count" layout="prev, pager, next"
        @current-change="getOrderList">
      </el-cu-pagination>
    </div>
    <page-right :css="{'width':'1000px','padding':0}" :show="showDetail" class="order-detail-info specific-part-z-index"
                partClass="pr-no-animation" @right-close="resetRightBox">
      <show-form :orderId="currentOrderId" :state="state" @close="resetRightBox"
                 @refreshOrder="refreshOrder"></show-form>
    </page-right>
    <page-right :css="{'width':'1000px','padding':0}" :show="showItemRight" @right-close="beforeCloseConfirm">
      <add-form :action="action" :defaultIndex="defaultIndex" :orderId="currentOrderId" type="1" @change="onSubmit"
                @close="resetRightBox"></add-form>
    </page-right>
    <page-right :css="{'width':'800px','padding':0}" :show="showScanRight" @right-close="resetRightBox">
      <scan-code :orderId="currentOrderId" :show="showScanRight" @change="onSubmit" @close="resetRightBox"></scan-code>
    </page-right>
  </div>
</template>
<script>
import utils from '@/tools/utils';
import showForm from './show.order.out.vue';
import addForm from './form/outForm.vue';
import {BaseInfo} from '@/resources';
import OrderMixin from '@/mixins/orderMixin';
import scanCode from './form/scan-code';

export default {
  components: {
    showForm, addForm, scanCode
  },
  data: function () {
    return {
      loadingData: true,
      showItemRight: false,
      showScanRight: false,
      showPart: false,
      showDetail: false,
      showSearch: false,
      orderList: [],
      filters: {
        type: 1,
        state: '0',
        orderNo: '',
        logisticsProviderName: '',
        createStartTime: '',
        createEndTime: '',
        bizType: '2-4',
        transportationMeansId: '',
        transactOrgId: '',
        thirdPartyNumber: '',
        orgGoodsId: '',
        orgAreaCode: '',
        deleteFlag: false,
        expectedStartTime: '',
        expectedEndTime: '',
        pushStatus: ''
      },
      searchCondition: {
        searchType: 1,
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
        expectedEndTime: '',
        pushStatus: ''
      },
      createdTime: '',
      expectedTime: '',
      orgType: utils.outBreakageOrderType,
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
      return this.$getDict('outTransportMeans');
    },
    bizInTypes: function () {
      return this.$getDict('bizOutType');
    },
    breakageOrgType() {
      return this.$store.state.breakageOrgType;
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
    scan(item) {
      this.currentOrderId = item.id;
      this.showScanRight = true;
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
        expectedEndTime: '',
        pushStatus: ''
      };
      this.createdTime = '';
      this.expectedTime = '';
      Object.assign(this.searchCondition, temp);
      Object.assign(this.filters, temp);
    },
    searchProduct(keyWord) {
      let orgId = this.$store.state.user.userCompanyAddress;
      let params = Object.assign({}, {
        deleteFlag: false,
        orgId: orgId,
        keyWord: keyWord
      });
      // 查询即时库存
      this.$http.get('/erp-stock/goods-list', {params}).then(res => {
        this.goodesList = res.data.list;
      });
    },
    resetRightBox: function () {
      this.showDetail = false;
      this.showItemRight = false;
      this.defaultIndex = 0;
      this.action = '';
      this.showPart = false;
      this.showScanRight = false;
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
      this.$http.get('/erp-breakage', {params: param}).then(res => {
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
    filterOrg: function (query) {// 过滤供货商
      let orgId = this.$store.state.user.userCompanyAddress;
      if (!orgId) return;
      let params = {
        keyWord: query,
        relation: '0'
      };
      BaseInfo.queryOrgByValidReation(orgId, params).then(res => {
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
      this.$http.get('/erp-breakage/count', {params}).then(res => {
        let data = res.data;
        this.orgType[0].num = this.obtionStatusNum(data['out-pend-confirm']);
        this.orgType[1].num = this.obtionStatusNum(data['out-pend-check']);
        this.orgType[2].num = this.obtionStatusNum(data['out-pend-execute']);
        // this.orgType[3].num = this.obtionStatusNum(data['out-pov-receipt']);
        this.orgType[4].num = this.obtionStatusNum(data['out-complete']);
        this.orgType[5].num = this.obtionStatusNum(data['out-cancel']);
      });
    },
    getTimeTitle: function (item) {
      let title = '';
      switch (item.transportationMeansId) {
        case '0': {
          title = '预计送货：';
          if (item.bizType === '2-1') {
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
      if (item.bizType === '2-2') {
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
    },
    transformReturnOrder(item) {
      this.$confirm('是否转换成销售退货订单', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.put(`/erp-order/${item.id}/conversion`).then(() => {
          this.$notify.success({
            message: '转换成功'
          });
          this.getOrderList(this.pager.currentPage);
        }).catch(error => {
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || '转换失败'
          });
        });
      }).catch(() => {
      });
    }
  }
};
</script>
