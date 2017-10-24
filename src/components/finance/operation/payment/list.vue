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

  .cursor-span {
    cursor: pointer;
  }
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div class="opera-btn-group" :class="{up:!showSearch}">
        <div class="opera-icon">
          <span class="">
            <i class="iconfont icon-search"></i> 筛选查询
          </span>
          <span class="pull-right cursor-span" style="margin-left: 10px" @click.prevent="add">
            <perm label="payment-payable-add">
                  <a href="#" class="btn-circle" @click.prevent=""><i class="iconfont icon-plus"></i> </a>添加
            </perm>
          </span>
          <span class="pull-right switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <!--<el-form v-show="showSearch" class="advanced-query-form clearfix" style="padding-top: 10px">-->
          <!--<el-row>-->
            <!--<el-col :span="8">-->
              <!--<oms-form-row label="付款单据编号" :span="6">-->
                <!--<oms-input type="text" v-model="searchCondition.orderNo" placeholder="请输入付款单据编号"></oms-input>-->
              <!--</oms-form-row>-->
            <!--</el-col>-->
            <!--<el-col :span="8">-->
              <!--<oms-form-row label="付款单位" :span="6">-->
                <!--<el-select filterable remote placeholder="请输入关键字搜索供货厂商" :remote-method="filterOrg" :clearable="true"-->
                           <!--v-model="searchCondition.orgId">-->
                  <!--<el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in orgList"></el-option>-->
                <!--</el-select>-->
              <!--</oms-form-row>-->
            <!--</el-col>-->
            <!--<el-col :span="6">-->
              <!--<oms-form-row label="" :span="6">-->
                <!--<el-button type="primary" @click="searchInOrder">查询</el-button>-->
                <!--<el-button native-type="reset" @click="resetSearchForm">重置</el-button>-->
              <!--</oms-form-row>-->
            <!--</el-col>-->
          <!--</el-row>-->
        <!--</el-form>-->
      </div>


      <div class="order-list-status container" style="margin-bottom:20px">
        <div class="status-item"
             :class="{'active':key==activeStatus,'exceptionPosition':key === '5'}"
             v-for="(item,key) in orgType"
             @click="changeStatus(item,key)">
          <div class="status-bg" :class="['b_color_'+key]"></div>
          <div>{{item.title}}</div>
        </div>
      </div>
      <div class="order-list clearfix">
        <el-row class="order-list-header" :gutter="10">
          <el-col :span="4">付款单据编号</el-col>
          <el-col :span="3">付款类型</el-col>
          <el-col :span="3">付款单位</el-col>
          <el-col :span="2">付款方式</el-col>
          <el-col :span="4">付款金额</el-col>
          <el-col :span="5">付款说明</el-col>
          <el-col :span="3">操作</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="billList.length == 0">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else="" class="order-list-body flex-list-dom">
          <div class="order-list-item" v-for="item in billList"
               :class="['status-'+filterListColor(item.status),{'active':currentId==item.id}]">
            <el-row>
              <el-col :span="4">
                <div>
                  {{item.no }}
                </div>
              </el-col>
              <el-col :span="3">
                <div>
                  {{billPayType(item.billPayType)}}
                </div>
              </el-col>
              <el-col :span="3" class="pt10">
                <div>{{item.orgName }}</div>
              </el-col>
              <el-col :span="2">
                <div>
                  <dict :dict-group="'PaymentMethod'" :dict-key="item.payType"></dict>
                </div>
              </el-col>
              <el-col :span="4">
                <div>
                  <span v-if="item.amount">¥</span> {{item.amount | formatMoney}}
                </div>
              </el-col>
              <el-col :span="5">
                <div>
                  {{item.explain}}
                </div>
              </el-col>
              <el-col :span="3" class="opera-btn">
                <div>
                  <perm label="payment-payable-audit">
                    <span @click.stop="audit(item)" v-if="item.status==='0'">
                        <a @click.pervent="" class="btn-circle btn-opera">
                          <i class="iconfont icon-verify"></i>
                        </a>
                       审核
                    </span>
                  </perm>
                  <perm label="payment-payable-allotment">
                    <span @click.stop="allotmentBill(item)" v-if="item.status==='1'">
                        <a @click.pervent="" class="btn-circle btn-opera">
                          <i class="iconfont icon-edit"></i>
                        </a>
                       分配
                      </span>
                  </perm>
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
        :total="pager.count" :pageSize="pager.pageSize" @current-change="getBillList"
        :current-page="pager.currentPage">
      </el-pagination>
    </div>
    <page-right :show="showDetail" @right-close="resetRightBox" :css="{'width':'750px','padding':0}"
                class="order-detail-info" partClass="pr-no-animation">
      <audit-form :formItem="billInfo" @change="onSubmit" @right-close="resetRightBox"></audit-form>
    </page-right>
    <page-right :show="showItemRight" @right-close="resetRightBox" :css="{'width':'750px','padding':0}">
      <add-form @change="onSubmit" @right-close="resetRightBox"></add-form>
    </page-right>
    <page-right :show="showAllotmentRight" @right-close="resetRightBox" :css="{'width':'750px','padding':0}">
      <allotment-form :formItem="billInfo" @change="onSubmit" @right-close="resetRightBox"></allotment-form>
    </page-right>
  </div>
</template>
<script>
  import utils from '../../../../tools/utils';
  import auditForm from './form/auditForm.vue';
  import addForm from './form/addForm.vue';
  import allotmentForm from './form/allotmentForm.vue';
  import {Order, BaseInfo, erpOrder, BillPayable} from '../../../../resources';

  export default {
    components: {
      auditForm, addForm, allotmentForm
    },
    data: function () {
      return {
        loadingData: true,
        showItemRight: false,
        showDetail: false,
        showSearch: false,
        showAllotmentRight: false,
        billList: [],
        filters: {
          status: '0'
        },
        searchCondition: {
          orderNo: '',
          orgId: ''
        },
        expectedTime: '',
        orgType: utils.paymentOperation,
        activeStatus: 0,
        currentId: '',
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        },
        billInfo: {}
      };
    },
    mounted() {
      this.getBillList(1);
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
          this.getBillList(1);
        },
        deep: true
      }
    },
    methods: {
      billPayType: function (value) {
        let title = '';
        if (value === '0') {
          title = '疫苗厂商付款';
        } else {
          title = '物流厂商付款';
        }
        return title;
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
        Object.assign(this.filters, this.searchCondition);
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          orderNo: '',
          orgId: ''
        };
        Object.assign(this.searchCondition, temp);
        Object.assign(this.filters, temp);
      },
      resetRightBox: function () {
        this.showDetail = false;
        this.showItemRight = false;
        this.showAllotmentRight = false;
        this.action = '';
        this.billInfo = {};
      },
      add: function () {
        this.showItemRight = true;
        this.defaultIndex = 1;
      },
      audit: function (item) {
        this.showDetail = true;
        this.billInfo = item;
      },
      allotmentBill: function (item) {
        this.showAllotmentRight = true;
        this.billInfo = item;
      },
      onSubmit: function () {
        this.getBillList(1);
      },
      getBillList: function (pageNo) {
        this.pager.currentPage = pageNo;
        this.loadingData = true;
        let param = Object.assign({}, this.filters, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          type: '0'
        });
        BillPayable.query(param).then(res => {
          this.billList = res.data.list;
            this.pager.count = res.data.count;
            this.loadingData = false;
          });
//        this.queryStatusNum(param);
      },
      filterListColor: function (index) {// 过滤左边列表边角颜色
        let status = -1;
        for (let key in this.orgType) {
          if (this.orgType[key].status === index) {
            status = key;
          }
        }
        return status;
      },
//      queryStatusNum: function (params) {
//        erpOrder.queryStateNum(params).then(res => {
//          let data = res.data;
//          this.orgType[0].num = this.obtionStatusNum(data['in-pend-check']);
//          this.orgType[1].num = this.obtionStatusNum(data['in-pend-execute']);
//          this.orgType[2].num = this.obtionStatusNum(data['in-complete']);
//          this.orgType[3].num = this.obtionStatusNum(data['in-cancel']);
//          this.orgType[4].num = this.obtionStatusNum(data['in-refuse']);
//          this.orgType[5].num = this.obtionStatusNum(data['exception']);
//        });
//      },
      obtionStatusNum: function (num) {
        if (typeof num !== 'number') {
          return 0;
        }
        return num;
      },
      changeStatus: function (item, key) {
        this.activeStatus = key;
        this.filters.status = item.status;
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
