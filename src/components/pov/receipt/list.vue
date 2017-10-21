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

  .R {
    word-wrap: break-word;
    word-break: break-all;
  }

  .good-selects {
    .el-select-dropdown__item {
      font-size: 14px;
      padding: 8px 10px;
      position: relative;
      white-space: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      color: rgb(72, 94, 106);
      height: auto;
      width: 300px;
      line-height: 1.5;
      box-sizing: border-box;
      cursor: pointer;
    }
  }

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

  /*.order-list-item {*/
  /*cursor: pointer;*/
  /*}*/
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div class="order-list-status container">
        <div class="status-item" :class="{'active':key==activeStatus}"
             v-for="(item,key) in receiptType" @click="checkStatus(item, key)">
          <div class="status-bg" :class="['b_color_'+key]"></div>
          <div>{{item.title}}<span class="state-num">{{item.num}}</span></div>
        </div>
      </div>
      <div class="order-list clearfix" style="margin-top: 20px">
        <el-row class="order-list-header" :gutter="10">
          <el-col :span="5">货主/订单号</el-col>
          <el-col :span="4">业务类型</el-col>
          <el-col :span="5">POV</el-col>
          <el-col :span="4">时间</el-col>
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
          <div class="order-list-item" v-for="item in orderList"
               :class="['status-'+filterListColor(item.state),{'active':currentOrderId==item.id}]">
            <el-row>
              <el-col :span="5">
                <div class="f-grey">
                  {{item.orderNo }}
                </div>
                <div>
                  {{item.orgName }}
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
              <el-col :span="4">
                <div>下&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单：{{item.createTime | date }}</div>
                <div>预计送货：{{ item.expectedTime | date }}</div>
              </el-col>
              <el-col :span="3">
                <div class="vertical-center">
                  {{getOrderStatus(item)}}
                </div>
              </el-col>
              <el-col :span="3" class="opera-btn pt10">
                <perm label="pov-receipt-manager">
                  <span v-if="filters.status === '3' " @click="showPart(item)">
                    <a href="#" class="btn-circle btn-opera" @click.prevent=""><i
                      class="iconfont icon-allot"></i></a>
                    收货
                  </span>
                </perm>
                <span v-show="filters.status === '4' " @click="showDetailPart(item)">
                  <a href="#" class="btn-circle btn-opera" @click.prevent=""><i
                    class="iconfont icon-detail"></i></a>查看收货详情
                </span>
              </el-col>
            </el-row>
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
      <receipt-info :orderId="currentOrderId" @close="resetRightBox"></receipt-info>
    </page-right>
    <page-right :show="showDetailRight" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}">
      <receipt-detail :orderId="currentOrderId" @close="resetRightBox"></receipt-detail>
    </page-right>
  </div>
</template>
<script>
  import { povReceipt } from '@/resources';
  import utils from '@/tools/utils';
  import receiptInfo from './receipt.vue';
  import receiptDetail from './receipt-detail.vue';

  export default {
    components: {
      receiptInfo,
      receiptDetail
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
          status: 3
        },
        activeStatus: 0,
        currentOrderId: '',
        currentItem: {}
      };
    },
    mounted () {
      this.queryOrderList();
    },
    watch: {
      filters: {
        handler: function () {
          this.queryOrderList(1);
        },
        deep: true
      }
    },
    methods: {
      queryOrderList (pageNo) { // 得到需求分配列表
        this.orderList = [];
        this.pager.currentPage = pageNo;
        this.loadingData = false;
        let params = Object.assign({}, this.filters);
        povReceipt.queryWasks(params).then(res => {
          this.orderList = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
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
