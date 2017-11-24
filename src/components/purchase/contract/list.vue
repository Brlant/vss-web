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

  .good-selects {
    .el-select-dropdown__item {
      width: auto;
    }
  }
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div class="opera-btn-group" :class="{up:!showSearch}">
        <div class="opera-icon">
          <span class="">
            <i class="el-icon-t-search"></i> 筛选查询
          </span>
          <span class="pull-right cursor-span" style="margin-left: 10px" @click.prevent="add">
            <perm label="purchasing-contract-add">
                  <a href="#" class="btn-circle" @click.prevent=""><i
                    class="el-icon-t-plus"></i> </a>添加
            </perm>
          </span>
          <span class="pull-right switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form v-show="showSearch" class="advanced-query-form clearfix" style="padding-top: 10px" onsubmit="return false">
          <el-row>
            <el-col :span="8">
              <oms-form-row label="合同名称/编号" :span="7">
                <oms-input type="text" v-model="searchCondition.keyWord" placeholder="请输入合同名称/编号"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="供货厂商" :span="5">
                <el-select filterable remote placeholder="请输入名称搜索供货厂商" :remote-method="filterOrg"
                           @click.native="filterOrg('')"
                           :clearable="true"
                           v-model="searchCondition.transactOrgId" popperClass="good-selects">
                  <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in orgList">
                    <div style="overflow: hidden">
                      <span class="pull-left" style="clear: right">{{org.name}}</span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left">
                        <span>系统代码</span> {{org.manufacturerCode}}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
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
             :class="{'active':key==activeStatus,'exceptionPosition':key === '5'}"
             v-for="(item,key) in orgType"
             @click="changeStatus(item,key)">
          <div class="status-bg" :class="['b_color_'+key]"></div>
          <div>{{item.title}}<span class="status-num">{{item.num}}</span></div>
        </div>
      </div>
      <div class="order-list clearfix">
        <el-row class="order-list-header" :gutter="10">
          <el-col :span="8">编号/合同名称</el-col>
          <el-col :span="8">供货厂商</el-col>
          <el-col :span="4">创建时间</el-col>
          <el-col :span="4">操作</el-col>
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
          <div class="order-list-item" v-for="item in orderList" @click.prevent="showContract(item)"
               :class="['status-'+filterListColor(item.availabilityStatus),{'active':currentOrderId==item.id}]">
            <el-row>
              <el-col :span="8" class="pt10">
                <div class="f-grey">
                  {{item.no }}
                </div>
                <div>
                  {{item.name }}
                </div>
              </el-col>
              <el-col :span="8" class="pt10">
                <div>{{item.transactOrgName }}</div>
              </el-col>
              <el-col :span="4">
                <div>
                  {{item.createTime | minute }}
                </div>
              </el-col>
              <el-col :span="4" class="opera-btn">
                <perm label="purchasing-contract-edit">
                   <span @click.stop.prevent="editContract(item)">
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
      <el-pagination
        layout="prev, pager, next"
        :total="pager.count" :pageSize="pager.pageSize" @current-change="getOrderList"
        :current-page="pager.currentPage">
      </el-pagination>
    </div>
    <page-right :show="showItemRight" class="specific-part-z-index" @right-close="resetRightBox"
                :css="{'width':'1000px','padding':0}">
      <add-form type="0" :defaultIndex="defaultIndex" :orderId="currentOrderId" @change="onSubmit" :purchase="purchase"
                :action="action"
                @right-close="resetRightBox"></add-form>
    </page-right>
    <page-right :show="showDetail" class="specific-part-z-index" @right-close="resetRightBox"
                :css="{'width':'1000px','padding':0}">
      <show-form type="0" :defaultIndex="defaultIndex" :orderId="currentOrderId" @change="onSubmit" :purchase="purchase"
                 :action="action"
                 @right-close="resetRightBox"></show-form>
    </page-right>
  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import addForm from './form/InForm.vue';
  import showForm from './form/showForm.vue';
  import {Order, BaseInfo, PurchaseContract} from '@/resources';

  export default {
    components: {
      addForm, showForm
    },
    data: function () {
      return {
        loadingData: true,
        showItemRight: false,
        showDetail: false,
        showSearch: false,
        orderList: [],
        filters: {
          availabilityStatus: true
        },
        searchCondition: {
          keyWord: '',
          transactOrgId: ''
        },
        expectedTime: '',
        orgType: {
          0: {'title': '正常', 'num': '', 'availabilityStatus': true},
          1: {'title': '停用', 'num': '', 'availabilityStatus': false}
        },
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
        purchase: {}
      };
    },
    mounted() {
      this.getOrderList(1);
      let orderId = this.$route.params.id;
      if (orderId === 'add') {
        this.add();
        this.purchase = {
          id: this.$route.query.id,
          count: this.$route.query.count
        };
      }
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
      editContract(item) {
        this.action = 'edit';
        this.currentOrderId = item.id;
        this.showItemRight = true;
        this.defaultIndex = 2;
      },
      showContract(item) {
        this.action = 'watch';
        this.currentOrderId = item.id;
        this.showDetail = true;
        this.defaultIndex = 2;
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
        Object.assign(this.filters, this.searchCondition);
        this.getOrderList(1);
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          keyWord: '',
          transactOrgId: ''
        };
        Object.assign(this.searchCondition, temp);
        Object.assign(this.filters, temp);
        this.getOrderList(1);
      },
      resetRightBox: function () {
        this.showDetail = false;
        this.showItemRight = false;
        this.defaultIndex = 0;
        this.action = '';
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
        PurchaseContract.query(param).then(res => {
          this.orderList = res.data.list;
//            this.pager.count = res.data.count;
          if (this.orderList.length === this.pager.pageSize) {
            this.pager.count = this.pager.currentPage * this.pager.pageSize + 1;
          }
          this.loadingData = false;
        });
        this.queryStatusNum(param);
      },
      refreshOrder() {
        this.getOrderList(1);
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
      filterListColor: function (flag) {// 过滤左边列表边角颜色
        let status = -1;
        if (flag) {
          status = 0;
        }
        if (!flag) {
          status = 1;
        }
        return status;
      },
      queryStatusNum: function (params) {
        PurchaseContract.queryStateNum(params).then(res => {
          let data = res.data;
          this.orgType[0].num = this.obtionStatusNum(data['invalid']);
          this.orgType[1].num = this.obtionStatusNum(data['valid']);
        });
      },
      obtionStatusNum: function (num) {
        if (typeof num !== 'number') {
          return 0;
        }
        return num;
      },
      changeStatus: function (item, key) {// 订单分类改变
        this.activeStatus = key;
        this.filters.availabilityStatus = item.availabilityStatus;
      },
      formatTime: function (date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      }
    }
  };
</script>
