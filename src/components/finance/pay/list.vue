<style lang="scss" scoped>
@import "../../../assets/mixins";

.el-form .el-select {
  display: block;
}

.d-table-right {
  .org-name-h2 {
    font-size: 16px;
    font-weight: bold;
  }
}

.d-table-col-wrap {
  overflow: auto;
}

.pov-info {
  margin-bottom: 20px;

  .font-bold {
    font-size: 14px;
  }
}

.oms-row {
  font-size: 14px;
  margin-bottom: 10px;
}

.content-body {
  margin: 20px 0;
}

.el-form--inline .el-form-item {
  margin-right: 0;
}

.order-list-status .status-item {
  cursor: default;
}

.status-item {
  width: 160px;

  > div span.status-num {
    display: block;
    font-size: 18px;
  }
}

.order-list-status .status-item.active, .order-list-status .status-item:hover {
  height: 40px;
  width: 160px;
}

.payForm {
  .el-form-item {
    margin-bottom: 10px;
  }
}

.d-table > div.d-table-left {
  width: 220px;
}
</style>
<template>
  <div class="pay-part">
    <div class="container">
      <div :class="{up:!showSearch}" class="opera-btn-group">
        <div class="opera-icon">
          <span class="pull-left switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起</span>
            <span v-show="!showSearch">展开</span>
          </span>
        </div>
        <el-form class="advanced-query-form clearfix"
                 style="padding-top: 10px; background: #fff; padding: 10px 10px 10px;">
          <el-row>
            <el-col :span="12">
              <oms-form-row :span="4" label="收款单位">
                <el-select v-model="searchWord.receiptOrgId" :clearable="true" :remote-method="filterOrg" filterable placeholder="请输入名称搜索收款单位"
                           popperClass="good-selects" remote
                           @click.native.once="filterOrg('')">
                  <el-option v-for="org in orgList" :key="org.id" :label="org.name" :value="org.id">
                    <div style="overflow: hidden">
                      <span class="pull-left" style="clear: right">{{org.name}}</span>
                      <span class="pull-right" style="color: #999">
                     <dict :dict-group="'orgRelation'" :dict-key="org.relationList[0]"></dict>
                    </span>
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
            <el-col :span="12">
              <oms-form-row :span="4" label="时间">
                <el-date-picker v-model="bizDateAry" :default-time="['00:00:00', '23:59:59']" placeholder="请选择日期"
                                type="datetimerange">
                </el-date-picker>
              </oms-form-row>
            </el-col>
            <el-col :span="24">
              <oms-form-row :span="2" label="">
                <el-button native-type="reset" @click="resetExportForm">重置</el-button>
                <div style="padding: 0 10px; display: inline-block">
                  <perm label="accounts-payable-paid-info-export">
                    <el-button :disabled="isLoading" :plain="true" type="success" @click="exportPayment">
                      导出已付账款
                    </el-button>
                  </perm>
                </div>
                <perm label="accounts-payable-unpaid-info-export">
                  <el-button :disabled="isLoading" :plain="true" type="success" @click="exportUnPayment">
                    按单位导出未付账款
                  </el-button>
                </perm>
                <div style="padding: 0 10px; display: inline-block">
                  <perm label="accounts-payable-month-unpaid-info-export">
                    <el-button :disabled="isLoading" :plain="true" type="success" @click="exportMonthUnPayment">
                      按月导出未付账款
                    </el-button>
                  </perm>
                </div>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="order-list-status container" style="margin-bottom:20px">
        <div v-for="(item,key) in orgType"
             class="status-item active">
          <div :class="['b_color_'+key]" class="status-bg"></div>
          <div class="title">{{item.title}}<span class="status-num">￥{{item.num | formatMoney }}</span></div>
        </div>
      </div>
      <div class="d-table-flex" style="margin-top: 20px">
        <div class="d-table-left">
          <h2 class="header">
            <span class="pull-right">
              <a class="btn-circle" href="#" @click.prevent="searchType">
                <i class="el-icon-t-search"></i>
              </a>
              <!--<perm label="accounts-payable-export">-->
              <!--<el-button :plain="true" type="success" @click="exportFile" :disabled="isLoading">-->
              <!--导出Excel-->
              <!--</el-button>-->
              <!--</perm>-->
              <perm label="accounts-payable-export">
                <a :disabled="isLoading" class="btn-circle" href="#" @click.stop.prevent="exportFile">
                  <i class="el-icon-t-export"></i>
                </a>
              </perm>
            </span>
            <!--<span class="pull-right" style="margin-right: 8px">-->
            <!--<perm label="accounts-payable-add">-->
            <!--<a href="#" class="btn-circle" @click.stop.prevent="addDetail">-->
            <!--<i class="el-icon-t-plus"></i>-->
            <!--</a>-->
            <!--</perm>-->
            <!--</span>-->
            所有应付款
          </h2>
          <div :style="'height:'+ (bodyHeight - 60)  + 'px'" class="d-table-col-wrap" @scroll="scrollLoadingData">

            <div v-show="showTypeSearch" class="search-left-box clearfix">
              <oms-input v-model="filters.keyWord" :showFocus="showTypeSearch" placeholder="请输入名称搜索"></oms-input>
            </div>
            <div v-if="!currentItem.id" class="empty-info">
              暂无信息
            </div>
            <div v-else>
              <ul class="show-list">
                <li v-for="item in showTypeList" :class="{'active':item.id==currentItem.id}" class="list-item"
                    @click="showType(item)">
                  <div class="id-part">
                    应付款总额 <span v-show="item.payableTotal"> ￥{{item.payableTotal | formatMoney }}</span>
                  </div>
                  <div>
                    {{item.remitteeName}}
                  </div>
                </li>
              </ul>
              <div class="btn-left-list-more">
                <bottom-loading></bottom-loading>
                <div v-show="!$store.state.bottomLoading" @click.stop="getOrgMore">
                  <el-button v-show="typePager.currentPage<typePager.totalPage">加载更多</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-table-right">
          <!--<span class="pull-right" style="margin-right: 8px">-->
          <!--<perm label="accounts-payable-detail-add">-->
          <!--<a href="#" class="btn-circle" @click.stop.prevent="add">-->
          <!--<i class="el-icon-t-plus"></i>-->
          <!--</a>-->
          <!--</perm>-->
          <!--</span>-->
          <div v-if="!currentItem.id">
            <div class="empty-info">暂无信息</div>
          </div>
          <div v-else :style="'height:'+bodyHeight   + 'px'" class="d-table-col-wrap">
            <div class="content-body clearfix">
              <el-row>
                <el-col :span="15">
                  <oms-row :span="6" label="收款方">
                    {{currentItem.remitteeName}}
                  </oms-row>
                  <oms-row :span="6" label="未付款总额">
                    <span>￥{{(currentItem.paidTotal ? currentItem.payableTotal - currentItem.paidTotal : currentItem.payableTotal) | formatMoney}}</span>
                  </oms-row>
                </el-col>
                <el-col :span="9">
                  <oms-row :span="8" label="应付款总额">
                    <span>￥{{currentItem.payableTotal | formatMoney}}</span>
                  </oms-row>
                  <oms-row :span="8" label="已付款总额">
                    <span>￥{{(currentItem.paidTotal ? currentItem.paidTotal : 0) | formatMoney}}</span>
                  </oms-row>
                </el-col>
              </el-row>
            </div>
            <div>
              <el-form ref="payForm" class="payForm" label-width="80px" onsubmit="return false">
                <el-form-item label="疫苗">
                  <el-select v-model="searchCondition.orgGoodsId" :clearable="true" filterable
                             placeholder="请输入名称搜索产品" popper-class="good-selects"
                             @focus="searchProduct('')">
                    <el-option v-for="item in goodesList" :key="item.id"
                               :label="item.goodsName"
                               :value="item.id">
                      <div style="overflow: hidden">
                        <span class="pull-left">{{item.goodsName}}</span>
                      </div>
                      <div style="overflow: hidden">
                        <span class="select-other-info pull-left"><span
                          v-show="item.goodsNo">货主货品编号:</span>{{item.goodsNo}}
                        </span>
                        <span class="select-other-info pull-left"><span
                          v-show="item.saleFirmName">供货单位:</span>{{ item.saleFirmName }}
                        </span>
                        <span v-if="item.factoryName" class="select-other-info pull-left">
                          <span v-show="item.factoryName">生产单位:</span>{{ item.factoryName }}
                        </span>
                      </div>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-row>
                  <el-col :span="10">
                    <el-form-item label="发生时间">
                      <el-date-picker
                        v-model="createTimes"
                        placeholder="请选择"
                        type="daterange">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="是否付清" label-width="80px">
                      <el-radio-group v-model="searchCondition.status">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label-width="10px">
                      <el-button native-type="submit" type="primary" @click="searchInOrder">查询</el-button>
                      <el-button native-type="reset" @click="resetExportForm">重置</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <!--<span class="pull-right" style="margin-top: 8px">-->
              <!--<span class="btn-search-toggle open" v-show="showSearch">-->
              <!--<single-input v-model="filterRights.keyWord" placeholder="请输入订单号搜索"-->
              <!--:showFocus="showSearch"></single-input>-->
              <!--<i class="el-icon-t-search" @click.stop="showSearch=(!showSearch)"></i>-->
              <!--</span>-->
              <!--<a href="#" class="btn-circle" @click.stop.prevent="showSearch=(!showSearch)" v-show="!showSearch">-->
              <!--<i class="el-icon-t-search"></i>-->
              <!--</a>-->
              <!--</span>-->
            </div>
            <el-table v-loading="loadingData" :data="payDetails" :header-row-class-name="'headerClass'"
                      border class="header-list">
              <el-table-column :sortable="true" label="订单号" min-width="85" prop="orderNo"></el-table-column>
              <el-table-column :sortable="true" label="疫苗名称" min-width="120" prop="goodsName"></el-table-column>
              <el-table-column :sortable="true" label="数量" prop="goodsCount" width="80"></el-table-column>
              <el-table-column :sortable="true" label="发生时间" min-width="110" prop="createTime">
                <template slot-scope="scope">
                  {{ scope.row.createTime | date }}
                </template>
              </el-table-column>
              <el-table-column :sortable="true" label="应付金额" prop="billAmount" width="110">
                <template slot-scope="scope">
                  {{ scope.row.billAmount | formatMoney}}
                </template>
              </el-table-column>
              <el-table-column :sortable="true" label="待付金额" prop="salePrice" width="100">
                <template slot-scope="scope">
                  {{ (scope.row.billAmount - scope.row.prepaidAccounts) | formatMoney}}
                </template>
              </el-table-column>
              <el-table-column :sortable="true" label="发票已到" prop="invoceId" width="100">
                <template slot-scope="scope">
                  {{ scope.row.invoiceId ? '是' : '否' }}
                </template>
              </el-table-column>
              <el-table-column :filter-method="filterStatusMethod" :filters="filterStatus" :sortable="true" label="状态" prop="saleMoney"
                               width="80">
                <template slot-scope="scope">
                  {{statusTitle(scope.row.status)}}
                </template>
              </el-table-column>
            </el-table>

            <div v-show="pager.count>pager.pageSize" class="text-center">
              <el-pagination :current-page="pager.currentPage"
                             :pageSize="pager.pageSize"
                             :total="pager.count"
                             layout="prev, pager, next"
                             @current-change="getDetail">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <page-right :css="{'width':'1000px','padding':0}" :show="showRight" @right-close="resetRightBox">
      <add-form :formItem="form" :index="index" @change="onSubmit" @close="resetRightBox"
                @refreshDetails="refreshDetails"></add-form>
    </page-right>
    <page-right :css="{'width':'1000px','padding':0}" :show="showLeft" @right-close="resetRightBox">
      <left-form :index="index" @change="onSubmit" @close="resetRightBox" @refresh="refresh"></left-form>
    </page-right>
    <page-right :css="{'width':'1000px','padding':0}" :show="showPart" partClass="pr-no-animation"
                @right-close="resetRightBox">
      <show-detail :currentDetail="currentDetail" :index="index" :orderId="orderId" @change="onSubmit"
                   @close="resetRightBox"
                   @refresh="refresh"></show-detail>
    </page-right>
  </div>

</template>
<script>
import {BaseInfo, pay, Vaccine} from '@/resources';
import addForm from './right-form.vue';
import leftForm from './letf-form.vue';
import showDetail from './show.order.in.vue';
import utils from '@/tools/utils';

export default {
  components: {
    addForm, leftForm, showDetail
  },
  data: function () {
    return {
      loadingData: false,
      showRight: false,
      showLeft: false,
      showPart: false,
      showTypeSearch: false,
      showSearch: true,
      showTypeList: [],
      filters: {
        keyWord: ''
      },
      filterRights: {
        orgGoodsId: '',
        createStartTime: '',
        createEndTime: '',
        status: ''
      },
      searchCondition: {
        orgGoodsId: '',
        createStartTime: '',
        createEndTime: '',
        status: ''
      },
      createTimes: '',
      isLoading: false,
      action: 'add',
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: 10,
        totalPage: 1
      },
      typePager: {
        currentPage: 1,
        count: 0,
        pageSize: 20,
        totalPage: 1
      },
      form: {},
      currentItem: {}, //  左边列表点击时，添加样式class
      payDetails: [], // 疫苗列表
      index: 0,
      orderId: '',
      currentDetail: {},
      orgGoods: [],
      orgType: {
        0: {title: '已付总额', num: ''},
        1: {title: '未付总额', num: ''}
      },
      filterStatus: [
        {text: '未付清', value: '0'},
        {text: '已付清', value: '1'}
      ],
      goodesList: [],
      searchWord: {
        receiptOrgId: '',
        createStartTime: '',
        createEndTime: '',
        startTime: '',
        endTime: ''
      },
      orgList: [],
      bizDateAry: ''
    };
  },
  computed: {
    bodyHeight: function () {
      let height = parseInt(this.$store.state.bodyHeight, 10);
      height = (height - 140);
      return height;
    },
    user() {
      return this.$store.state.user;
    }
  },
  mounted() {
    this.getOrgsList(1);
    this.queryTotalMoney();
  },
  watch: {
    filters: {
      handler: function () {
        this.getOrgsList(1);
      },
      deep: true
    },
    filterRights: {
      handler: function () {
        this.getDetail(1);
      },
      deep: true
    },
    user(val) {
      if (val.userCompanyAddress) {
        this.getOrgsList(1);
      }
    }
  },
  methods: {
    exportPayment: function () {
      this.searchWord.startTime = this.$formatAryTime(this.bizDateAry, 0, 'YYYY-MM-DD HH:mm:ss');
      this.searchWord.endTime = this.$formatAryTime(this.bizDateAry, 1, 'YYYY-MM-DD HH:mm:ss');
      let params = Object.assign({}, this.searchWord);
      this.isLoading = true;
      this.$store.commit('initPrint', {isPrinting: true, moduleId: '/finance/pay'});
      this.$http.get('/accounts-payable/export/paid-info', {params}).then(res => {
        utils.download(res.data.path, '未付账款表');
        this.isLoading = false;
        this.$store.commit('initPrint', {isPrinting: false, moduleId: '/finance/pay'});
      }).catch(error => {
        this.isLoading = false;
        this.$store.commit('initPrint', {isPrinting: false, moduleId: '/finance/pay'});
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
        });
      });
    },
    exportMonthUnPayment: function () {
      this.searchWord.createStartTime = this.$formatAryTime(this.bizDateAry, 0, 'YYYY-MM-DD HH:mm:ss');
      this.searchWord.createEndTime = this.$formatAryTime(this.bizDateAry, 1, 'YYYY-MM-DD HH:mm:ss');
      let params = Object.assign({}, this.searchWord);
      this.isLoading = true;
      this.$store.commit('initPrint', {isPrinting: true, moduleId: '/finance/pay'});
      this.$http.get('/accounts-payable/export/month-unpaid-info', {params}).then(res => {
        utils.download(res.data.path, '未付账款按月汇总表');
        this.isLoading = false;
        this.$store.commit('initPrint', {isPrinting: false, moduleId: '/finance/pay'});
      }).catch(error => {
        this.isLoading = false;
        this.$store.commit('initPrint', {isPrinting: false, moduleId: '/finance/pay'});
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
        });
      });
    },
    exportUnPayment: function () {
      this.searchWord.createStartTime = this.$formatAryTime(this.bizDateAry, 0, 'YYYY-MM-DD HH:mm:ss');
      this.searchWord.createEndTime = this.$formatAryTime(this.bizDateAry, 1, 'YYYY-MM-DD HH:mm:ss');
      let params = Object.assign({}, this.searchWord);
      this.isLoading = true;
      this.$store.commit('initPrint', {isPrinting: true, moduleId: '/finance/pay'});
      this.$http.get('/accounts-payable/export/unpaid-info', {params}).then(res => {
        utils.download(res.data.path, '未付账款表');
        this.isLoading = false;
        this.$store.commit('initPrint', {isPrinting: false, moduleId: '/finance/pay'});
      }).catch(error => {
        this.isLoading = false;
        this.$store.commit('initPrint', {isPrinting: false, moduleId: '/finance/pay'});
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
        });
      });
    },
    resetExportForm: function () {
      this.searchWord = {
        receiptOrgId: '',
        createStartTime: '',
        createEndTime: '',
        startTime: '',
        endTime: ''
      };
      this.bizDateAry = '';
    },
    filterOrg: function (query) {
      let orgId = this.$store.state.user.userCompanyAddress;
      if (!orgId) {
        return;
      }
      // 过滤来源单位
      let params = {
        keyWord: query
      };
      BaseInfo.queryOrgByValidReation(orgId, params).then(res => {
        this.orgList = res.data;
      });
    },
    formatExportTime: function (date, str = 'YYYY-MM-DD HH:mm:ss') {
      return date ? this.$moment(date).format(str) : '';
    },
    scrollLoadingData(event) {
      this.$scrollLoadingData(event);
    },
    statusTitle: function (status) {
      if (status) {
        let title = '';
        if (status === '0') {
          title = '未付清';
        } else if (status === '1') {
          title = '已付清';
        }
        return title;
      }
    },
    filterStatusMethod(value, row) {
      return row.status === value;
    },
    resetRightBox: function () {
      this.showRight = false;
      this.showLeft = false;
      this.showPart = false;
    },
    searchType: function () {
      this.showTypeSearch = !this.showTypeSearch;
    },
    getOrgsList: function (pageNo, isContinue = false) {
      let orgId = this.user.userCompanyAddress;
      if (!orgId) return;
      this.typePager.currentPage = pageNo;
      let params = Object.assign({}, {
        pageNo: pageNo,
        pageSize: this.pager.pageSize
      }, this.filters);
      pay.query(params).then(res => {
        if (params.keyWord !== this.filters.keyWord) return;
        this.$store.commit('initBottomLoading', false);

        if (isContinue) {
          this.showTypeList = this.showTypeList.concat(res.data.list);
        } else {
          this.showTypeList = res.data.list;
          if (this.showTypeList.length !== 0) {
            this.currentItem = res.data.list[0];
            this.getDetail(1);
          } else {
            this.currentItem = Object.assign({'id': ''});
          }
        }
        this.typePager.totalPage = res.data.totalPage;

      });
    },
    queryTotalMoney() {
      this.$http.get('/accounts-payable/statistics').then(res => {
        this.orgType[0].num = res.data['paidMoney'];
        this.orgType[1].num = res.data['totalMoney'] - res.data['paidMoney'];
      });
    },
    refresh() {
      this.getOrgsList();
      this.resetRightBox();
    },
    refreshDetails() {
      this.getDetail();
      this.resetRightBox();
    },
    searchProduct(keyWord) {
      let params = {
        keyWord: keyWord,
        salesFirm: this.currentItem.remitteeId
      };
      Vaccine.queryVaccineByOrg(params).then(res => {
        this.goodesList = res.data;
      });
    },
    getDetail: function (pageNo) {
      this.payDetails = [];
      if (!this.currentItem.id) return;
      this.pager.currentPage = pageNo;
      this.loadingData = true;
      let params = Object.assign({}, {
        pageNo: pageNo,
        pageSize: this.pager.pageSize
      }, this.filterRights);
      pay.queryDetail(this.currentItem.id, params).then(res => {
        this.loadingData = false;
        this.payDetails = res.data.list;
        this.pager.count = res.data.count;
      });
    },
    searchInOrder: function () {// 搜索
      this.searchCondition.createStartTime = this.$formatAryTime(this.createTimes, 0);
      this.searchCondition.createEndTime = this.$formatAryTime(this.createTimes, 1);
      Object.assign(this.filterRights, this.searchCondition);
    },
    resetSearchForm: function () {// 重置表单
      let temp = {
        orgGoodsId: '',
        createStartTime: '',
        createEndTime: '',
        status: ''
      };
      this.createTimes = '';
      Object.assign(this.searchCondition, temp);
      Object.assign(this.filterRights, temp, {status: ''});
    },
    getOrgMore: function () {
      this.getOrgsList(this.typePager.currentPage + 1, true);
    },
    showType: function (item) {
      this.currentItem = item;
      this.goodesList = [];
      this.getDetail(1);
      this.resetSearchForm();
    },
    showDetail(item) {
      this.orderId = item.orderId;
      this.currentDetail = item.remitteeId;
      this.showPart = true;
    },
    edit(row) {
      this.form = row;
      this.showRight = true;
    },
    addDetail() {
      this.showLeft = true;
    },
    onSubmit() {
      this.getOrgsList();
    },
    formatTime: function (date) {
      return date ? this.$moment(date).format('YYYY-MM-DD') : '';
    },
    exportFile: function () {
      this.isLoading = true;
      this.$store.commit('initPrint', {isPrinting: true, moduleId: '/report/out'});
      this.$http.get('/accounts-payable/export').then(res => {
        utils.download(res.data, '应付账款一览表');
        this.isLoading = false;
        this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/out'});
      }).catch(error => {
        this.isLoading = false;
        this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/out'});
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
        });
      });
    }
  }
};
</script>
