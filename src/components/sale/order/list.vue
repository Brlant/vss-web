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
          <span class="pull-right cursor-span" style="margin-left: 10px" @click.prevent="add">
            <perm :label="vaccineType === '1'?'sales-order-add': 'second-vaccine-sales-order-add' ">
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
          <span class="pull-right cursor-span" style="margin-right: 15px" @click.prevent="batchAuditOrder"
                v-show="isShowCheckBox">
            <perm :label="vaccineType === '1'?'sales-order-batch-audit': 'second-vaccine-sales-order-batch-audit' ">
                  <a href="#" class="btn-circle" @click.prevent=""><i
                    class="el-icon-document"></i> </a>批量审单
            </perm>
          </span>
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
              <oms-form-row label="物流方式" :span="6">
                <el-select type="text" v-model="searchCondition.transportationMeansId" placeholder="请选择物流方式">
                  <el-option :value="item.key" :key="item.key" :label="item.label"
                             v-for="item in transportationMeansList"></el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="收货单位" :span="6">
                <el-select filterable remote placeholder="请输入名称搜索收货单位" :remote-method="filterOrg" :clearable="true"
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
          </el-row>
          <el-row>
            <el-col :span="8">
              <oms-form-row label="货主疫苗" :span="6">
                <el-select v-model="searchCondition.orgGoodsId" filterable remote placeholder="请输入名称或编号搜索货主疫苗"
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
                          v-show="item.orgGoodsDto.goodsNo">疫苗编号:</span>{{item.orgGoodsDto.goodsNo}}
                        </span>
                      <span class="select-other-info pull-left"><span
                        v-show="item.orgGoodsDto.salesFirmName">供货单位:</span>{{ item.orgGoodsDto.salesFirmName }}
                        </span>
                      <span class="select-other-info pull-left" v-if="item.orgGoodsDto.goodsDto">
                          <span v-show="item.orgGoodsDto.goodsDto.factoryName">生产厂商:</span>{{ item.orgGoodsDto.goodsDto.factoryName }}
                      </span>
                    </div>
                  </el-option>
                </el-select>
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
              <oms-form-row label="预计送货时间" :span="6">
                <el-col :span="24">
                  <el-date-picker
                    v-model="expectedTime"
                    type="daterange"
                    placeholder="请选择" format="yyyy-MM-dd">
                  </el-date-picker>
                </el-col>
              </oms-form-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <oms-form-row label="单位区域代码" :span="7">
                <oms-input type="text" v-model="searchCondition.orgAreaCode" placeholder="请输入单位区域代码"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <order-push-search v-model="searchCondition.pushStatus"/>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="" :span="3">
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
          <div><i class="el-icon-caret-right" v-if="key==activeStatus"></i>{{item.title}}<span class="status-num">{{item.num}}</span>
          </div>
        </div>
      </div>
      <div class="order-list clearfix">
        <el-row class="order-list-header">
          <el-col :span="5">
            <el-checkbox v-model="checkAll" @change="checkAllOrder" v-show="isShowCheckBox"/>
            货主/订单号
          </el-col>
          <el-col :span="4">业务类型</el-col>
          <el-col :span="5">收货单位</el-col>
          <el-col :span="5">时间</el-col>
          <el-col :span="2">状态</el-col>
          <el-col :span="3" class="opera-btn" v-if="filters.state < 4 ">操作</el-col>
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
              <el-col :span="5">
                <div v-show="isShowCheckBox" class="flex-layout" @click.stop="item.checked = !item.checked">
                  <el-checkbox v-model="item.checked" class="mr-5"/>
                  <div>
                    <div class="f-grey">
                      {{item.orderNo }}
                    </div>
                    <div>
                      {{item.orgName }}
                    </div>
                  </div>
                </div>
                <div v-show="!isShowCheckBox">
                  <div class="f-grey">
                    {{item.orderNo }}
                  </div>
                  <div>
                    {{item.orgName }}
                  </div>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="vertical-center">
                  <dict :dict-group="'bizOutType'" :dict-key="item.bizType"></dict>
                </div>
              </el-col>
              <el-col :span="5">
                <div>{{item.transactOrgName }}</div>
              </el-col>
              <el-col :span="5">
                <div>下单：{{item.createTime | minute }}</div>
                <div>预计送货：{{ item.expectedTime | date }}</div>
              </el-col>
              <el-col :span="2">
                <div class="vertical-center">
                  {{getOrderStatus(item)}}
                  <order-push-status :status="item.pushStatus" :msg="item.pushMessage"/>
                </div>
              </el-col>
              <el-col :span="3" class="opera-btn" v-if="filters.state < 4">
                <perm :label="vaccineType === '1'?'sales-order-edit': 'second-vaccine-sales-order-edit' "
                      v-show="filters.state === '0' || filters.state === '1'">
              <span @click.stop.prevent="editOrder(item)">
                <a href="#" class="btn-circle" @click.prevent=""><i
                  class="el-icon-t-edit"></i></a>
                编辑
              </span>
                </perm>
                <perm :label="vaccineType === '1'?'sales-order-conversion': 'second-vaccine-sales-order-conversion' "
                      v-show="filters.state === '2' || filters.state === '3'">
              <span @click.stop.prevent="transformReturnOrder(item)">
                <a href="#" class="btn-circle" @click.prevent=""><i
                  class="el-icon-t-reset"></i></a>
                <span style="font-size: 12px">转成销售退货订单</span>
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
      <el-cu-pagination
        layout="prev, pager, next"
        :total="pager.count" :pageSize="pager.pageSize" @current-change="getOrderList"
        :current-page="pager.currentPage">
      </el-cu-pagination>
    </div>
    <page-right :show="showDetail" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}"
                class="order-detail-info specific-part-z-index" partClass="pr-no-animation">
      <show-form :orderId="currentOrderId" :state="state" @refreshOrder="refreshOrder"
                 @close="resetRightBox" :vaccineType="vaccineType"></show-form>
    </page-right>
    <page-right :show="showItemRight" @right-close="beforeCloseConfirm" :css="{'width':'1000px','padding':0}">
      <add-form type="1" :defaultIndex="defaultIndex" :orderId="currentOrderId" @change="onSubmit" :action="action"
                @close="resetRightBox" :vaccineType="vaccineType"></add-form>
    </page-right>
  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import showForm from './show.order.out.vue';
  import addForm from './form/outForm.vue';
  import {BaseInfo, erpOrder, Vaccine} from '@/resources';
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
          logisticsProviderName: '',
          createStartTime: '',
          createEndTime: '',
          bizType: '2-0',
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
      vaccineType() {
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
      vaccineType() {
        this.getOrderList(1);
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
          expectedEndTime: '',
          pushStatus: ''
        };
        this.createdTime = '';
        this.expectedTime = '';
        Object.assign(this.searchCondition, temp);
        Object.assign(this.filters, temp);
      },
      searchProduct(keyWord) {
        let params = Object.assign({}, {
          keyWord: keyWord
        });
        Vaccine.query(params).then(res => {
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
          pageSize: this.pager.pageSize,
          goodsType: this.vaccineType === '1' ? '0' : '1'
        });
        // 明细查询
        param.isShowDetail = !!JSON.parse(window.localStorage.getItem('isShowGoodsList'));
        erpOrder.query(param).then(res => {
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
      filterOrg: function (query) {// 过滤供货商
        let orgId = this.$store.state.user.userCompanyAddress;
        if (!orgId) return;
        let params = {
          keyWord: query,
          relation: '2'
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
              message: error.response.data && error.response.data.msg || '转换失败'
            });
          });
        });
      }
    }
  };
</script>
