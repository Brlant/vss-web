<style lang="scss" scoped="">


  .align-word {
    letter-spacing: 1em;
    margin-right: -1em;
  }

  .color-blue {
    color: #00ff00;
  }

  .color-red {
    color: red;
  }

  .order-list-item {
    cursor: pointer;
  }
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div class="order-list-status container">
        <div class="status-item" :class="{'active':key==activeStatus}"
             v-for="(item,key) in receiptType" @click="checkStatus(item, key)">
          <div class="status-bg" :class="['b_color_'+key]"></div>
          <div><i class="el-icon-caret-right" v-if="key==activeStatus"></i>{{item.title}}<span class="status-num">{{item.num}}</span></div>
        </div>
        <goods-switch class="pull-right"></goods-switch>
      </div>
      <div class="order-list clearfix" style="margin-top: 20px">
        <el-row class="order-list-header">
          <el-col :span=" filters.status === '10' ? 5 : 6">货主/订单号</el-col>
          <el-col :span="3">业务类型</el-col>
          <el-col :span="filters.status === '10' ? 5 : 6">接种点</el-col>
          <el-col :span="filters.status === '10' ? 5 : 6">时间</el-col>
          <el-col :span="3">状态</el-col>
          <el-col :span="3" v-if="filters.status === '10'">操作</el-col>
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
          <div class="order-list-item" v-for="item in orderList" @click="showDetailPart(item)"
               :class="['status-'+filterListColor(item.state),{'active':currentOrderId==item.id}]">
            <el-row>
              <el-col :span="filters.status === '10' ? 5 : 6">
                <div class="f-grey">
                  {{item.orderNo }}
                </div>
                <div>
                  {{item.orgName }}
                </div>
              </el-col>
              <el-col :span="3">
                <div class="vertical-center">
                  <dict :dict-group="'bizOutType'" :dict-key="item.bizType"></dict>
                </div>
              </el-col>
              <el-col :span="filters.status === '10' ? 5 : 6">
                <div>{{item.transactOrgName }}</div>
              </el-col>
              <el-col :span="filters.status === '10' ? 5 : 6">
                <div>下单：{{item.createTime | minute }}</div>
                <div>预计送货：{{ item.expectedTime | date }}</div>
              </el-col>
              <el-col :span="3">
                <div class="vertical-center">
                  {{getOrderStatus(item)}}
                </div>
              </el-col>
              <el-col :span="3" class="opera-btn pt10" v-if="filters.status === '10' ">
                <perm label="pov-receipt-manager">
                  <span @click.stop="showPart(item)">
                    <a href="#" class="btn-circle btn-opera" @click.prevent=""><i
                      class="el-icon-t-allot"></i></a>
                    收货
                  </span>
                </perm>
              </el-col>
            </el-row>
            <order-goods-info :order-item="item"></order-goods-info>
            <div class="order-list-item-bg"></div>
          </div>
        </div>
      </div>
      <div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">
        <el-pagination
          layout="prev, pager, next"
          :total="pager.count" :pageSize="pager.pageSize" @current-change="queryOrderList"
          :current-page="pager.currentPage">
        </el-pagination>
      </div>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}">
      <receipt-info :orderId="currentOrderId" :showRight="showRight" @close="resetRightBox" @refreshOrder="refreshOrder"></receipt-info>
    </page-right>
    <page-right :show="showDetailRight" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}">
      <show-detail :orderId="currentOrderId" :showRight="showDetailRight" @close="resetRightBox"></show-detail>
    </page-right>
  </div>
</template>
<script>
  import { http, povReceipt } from '@/resources';
  import utils from '@/tools/utils';
  import showDetail from './show.order.vue';
  import receiptInfo from './receipt.vue';

  export default {
    components: {
      showDetail,
      receiptInfo
    },
    data () {
      return {
        loadingData: false,
        orderList: [],
        showRight: false,
        showDetailRight: false,
        receiptType: utils.receiptType,
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 15
        },
        filters: {
          status: '10'
        },
        activeStatus: 0,
        currentOrderId: '',
        currentItem: {}
      };
    },
    computed: {
      isShowGoodsList () {
        return this.$store.state.isShowGoodsList;
      }
    },
    watch: {
      filters: {
        handler: function () {
          this.queryOrderList(1);
        },
        deep: true
      },
      isShowGoodsList () {
        this.queryOrderList(this.pager.currentPage);
      }
    },
    mounted () {
      this.queryOrderList();
    },
    methods: {
      queryOrderList (pageNo) { // 得到需求分配列表
        this.orderList = [];
        this.pager.currentPage = pageNo;
        this.loadingData = false;
        let params = Object.assign({}, this.filters);
        // 明细查询
        params.isShowDetail = !!JSON.parse(window.localStorage.getItem('isShowGoodsList'));
        povReceipt.queryWasks(params).then(res => {
          this.orderList = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
        this.queryCount(params);
      },
      queryCount (params) {
        http.get('/erp-receipt/order/count', {params}).then(res => {
          this.receiptType[0].num = this.obtionStatusNum(res.data['out-pov-receipt']);
          this.receiptType[1].num = this.obtionStatusNum(res.data['out-complete']);
        });
      },
      refreshOrder () {
        this.currentOrderId = '';
        this.queryOrderList(this.pager.currentPage);
      },
      obtionStatusNum: function (num) {
        if (typeof num !== 'number') {
          return 0;
        }
        return num;
      },
      resetRightBox () {
        this.showRight = false;
        this.showDetailRight = false;
      },
      showPart (item) {
        this.currentItem = item;
        this.currentOrderId = item.id;
        this.showRight = true;
      },
      showDetailPart (item) {
        this.currentItem = item;
        this.currentOrderId = item.id;
        this.showDetailRight = true;
      },
      checkStatus (item, key) {
        this.activeStatus = key;
        this.filters.status = item.state;
      },
      filterListColor: function (index) {// 过滤左边列表边角颜色
        let state = -1;
        for (let key in this.receiptType) {
          if (this.receiptType[key].state === index) {
            state = key;
          }
        }
        return state;
      },
      getOrderStatus: function (order) {
        let title = '';
        for (let key in this.receiptType) {
          if (order.state === this.receiptType[key].state) {
            title = this.receiptType[key].title;
          }
        }
        return title;
      }
    }
  };
</script>
