<style lang="scss" scoped="">

.align-word {
  letter-spacing: 1em;
  margin-right: -1em;
}

.order-list-status-right {
  justify-content: flex-end;
}

.special-col {
  padding-left: 20px;
  position: relative;

  .el-checkbox {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div class="opera-btn-group" :class="{up:!showSearch}">
        <div class="opera-icon">
          <span class="pull-right" v-show="filters.status === 11">
          <perm label="purchansing-assignment-add" class="opera-btn">
            <span @click="createPurchaseDemand" style="cursor:pointer"><a href="#" @click.prevent="" class="btn-circle"><i
              class="el-icon-t-wave"></i></a><span class="wave-title"> 生成采购汇总单</span></span>
          </perm>
         </span>
          <span class="pull-right" v-show="filters.status === 1">
            <perm label="demand-assignment-add" class="opera-btn">
              <span @click="createDemand" style="cursor:pointer"><a href="#" @click.prevent="" class="btn-circle"><i
                class="el-icon-t-wave"></i></a><span class="wave-title"> 生成销售汇总单</span></span>
            </perm>
         </span>
          <span class="pull-right">
            <perm label="cargo-signal-add" class="opera-btn">
              <span @click="applyOrder" style="cursor:pointer"><a href="#" @click.prevent="" class="btn-circle"><i
                class="el-icon-t-plus"></i></a><span class="wave-title">新增分货</span></span>
            </perm>
         </span>
          <goods-switch class="pull-right"></goods-switch>
          <span class="pull-left switching-icon" @click="showSearch = !showSearch" style="margin-right: 20px">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form class="advanced-query-form" :model="searchWord" onsubmit="return false">
          <el-row>
            <el-col :span="8">
              <oms-form-row :span="5" label="收货单位">
                <el-select placeholder="请输入名称搜索收货单位" v-model="searchWord.povId" filterable remote
                           :remote-method="filterOrg" @click.native="filterOrg('')" :clearable="true"
                           popperClass="good-selects">
                  <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in orgList">
                    <div style="overflow: hidden">
                      <span class="pull-left" style="clear: right">{{ org.name }}</span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left">
                        <span>系统代码:</span>{{ org.manufacturerCode }}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="7">
              <oms-form-row label="申请单编号" :span="8">
                <oms-input type="text" v-model="searchWord.id" placeholder="请输入申请单编号"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="9">
              <el-row>
                <el-col :span="8" style="padding-top: 10px;padding-right:8px;text-align: right">
                  到货需求日期
                </el-col>
                <el-col :span="16">
                  <el-date-picker
                    type="daterange"
                    v-model="demandTime"
                    placeholder="请选择到货需求日期" format="yyyy-MM-dd">
                  </el-date-picker>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8" class="clearfix">
              <oms-form-row label="单位区域代码" :span="7">
                <oms-input type="text" v-model="searchWord.orgAreaCode" placeholder="请输入单位区域代码"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row label="疫苗种类" :span="7">
                <el-select type="text" v-model="searchWord.goodsType" placeholder="请选择疫苗种类">
                  <el-option :value="item.key" :key="item.key" :label="item.label"
                             v-for="item in vaccineSignList"></el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="10">
              <oms-form-row label="" :span="1">
                <el-button type="primary" native-type="submit" @click="searchInOrder">查询</el-button>
                <el-button @click="resetSearchForm">重置</el-button>
                <el-button @click="exportExcel" :plain="true" type="success">导出EXCEL</el-button>
                <el-button @click="exportNoSaleExcel" :plain="true" type="success">导出待生成销售汇总</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-row>
        <el-col :span="13">
          <div class="order-list-status container clearfix">
            <div class="status-item" :class="{'active':key==activeStatus}" style="width: 115px"
                 v-for="(item,key) in assignType" v-show="key < 4" @click="checkStatus(item, key)">
              <div class="status-bg" :class="['b_color_'+key]"></div>
              <div><i class="el-icon-caret-right" v-if="key==activeStatus"></i>{{ item.title }}<span class="status-num">
            {{ item.num }}</span></div>
            </div>
          </div>
        </el-col>
        <el-col :span="11">
          <div class="order-list-status order-list-status-right container clearfix">
            <div class="status-item" v-show="key > 3" :class="{'active':key==activeStatus}" style="width: 115px"
                 v-for="(item,key) in assignType" @click="checkStatus(item, key)">
              <div class="status-bg" :class="['b_color_'+key]"></div>
              <div><i class="el-icon-caret-right" v-if="key==activeStatus"></i>{{ item.title }}<span class="status-num">
            {{ item.num }}</span></div>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="order-list clearfix " style="margin-top: 20px">
        <el-row class="order-list-header">
          <el-col :span="5">
            <el-checkbox @change="checkAll" v-model="isCheckAll" v-show="filters.status === 1 || filters.status === 11">
            </el-checkbox>
            要货申请编号/疫苗种类
          </el-col>
          <el-col :span="6">要货单位</el-col>
          <el-col :span="3">到货需求日期</el-col>
          <el-col :span="5">时间</el-col>
          <el-col :span="5">操作</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="demandList.length == 0">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else="" class="order-list-body flex-list-dom">
          <div class="order-list-item" v-for="item in demandList"
               :class="['status-'+activeStatus,{'active':currentItemId==item.id}]">
            <el-row>
              <el-col :span="5" class="R pt10" :class="{'special-col': filters.status === 1 || filters.status === 11}">
                <div class="el-checkbox-warp" @click.stop.prevent="checkItem(item)"
                     v-show="filters.status === 1 || filters.status === 11">
                  <el-checkbox v-model="item.isChecked"></el-checkbox>
                </div>
                {{ item.id }}
                <div>
                  <dict :dict-key="'' + item.goodsType" dict-group="orderGoodsType"></dict>
                </div>
              </el-col>
              <el-col :span="6" class="pt">
                <span>{{ item.povName }}</span>
              </el-col>
              <el-col :span="3" class="pt pl7">
                <span>{{ item.demandTime | date }}</span>
              </el-col>
              <el-col :span="5" class="pt pl7">
                <div>[建]{{ item.applyTime | time }}</div>
                <div v-if="item.auditTime">[审]{{ item.auditTime | time }}</div>
              </el-col>
              <el-col :span="5" class="opera-btn pl7">
                <div>
                  <span @click.prevent="showDetail(item)">
                    <a href="#" class="btn-circle" @click.prevent=""><i
                      class="el-icon-t-detail"></i></a>
                  查看详情
                  </span>
                </div>
                <div>
                  <perm label="demand-assignment-update">
                    <span @click.prevent="editOrder(item)" v-show="filters.status === 1 || filters.status === 2">
                      <a href="#" class="btn-circle" @click.prevent=""><i
                        class="el-icon-t-edit"></i></a>
                        编辑
                  </span>
                  </perm>
                  <perm label="demand-assignment-cancel" v-show="filters.status === 1 || filters.status === 11">
                     <span @click.prevent="cancel(item)">
                      <a href="#" class="btn-circle" @click.prevent=""><i
                        class="el-icon-t-verify"></i></a>
                        取消需求单
                      </span>
                  </perm>
                  <perm label="demand-assignment-add">
                    <span @click.prevent="createSaleOrder(item)" v-show="filters.status === 2 && item.singleFlag">
                        <a href="#" class="btn-circle" @click.prevent=""><i
                          class="el-icon-t-sale"></i></a>
                          生成销售单
                    </span>
                  </perm>
                </div>
              </el-col>
            </el-row>
            <sale-goods-info :order-item="item"></sale-goods-info>
            <div class="order-list-item-bg"></div>
          </div>
        </div>

      </div>

      <div class="text-center" v-show="demandList.length && !loadingData">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="pager.count" :page-sizes="[10,20,50,100]" :pageSize="pager.pageSize"
          :current-page="pager.currentPage">
        </el-pagination>
      </div>
    </div>
    <page-right :show="showDetailPart" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}"
                class="order-detail-info" partClass="pr-no-animation">
      <show-form :currentItem="currentItem" @close="resetRightBox"></show-form>
    </page-right>
    <page-right :show="showRight" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}">
      <add-form @change="onSubmit" :currentOrder="currentItem" :index="index" @close="resetRightBox"></add-form>
    </page-right>
    <page-right :show="showEditPart" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}">
      <edit-form @change="onSubmit" :currentItem="currentItem" :showEditPart="showEditPart"
                 @close="resetRightBox"></edit-form>
    </page-right>
  </div>
</template>
<script>
import {BaseInfo, demandAssignment, procurementCollect, pullSignal} from '@/resources';
import utils from '../../../tools/utils';
import showForm from './detail/index.vue';
import addForm from '../request/form';
import editForm from './edit';
import Perm from '@/components/common/perm';

export default {
  components: {
    Perm,
    showForm, addForm, editForm
  },
  data() {
    return {
      loadingData: false,
      showSearch: true,
      showDetailPart: false,
      showEditPart: false,
      showRight: false,
      assignType: utils.assignType,
      activeStatus: 0,
      demandList: [],
      filters: {
        status: 1,
        povId: '',
        demandStartTime: '',
        demandEndTime: '',
        orgAreaCode: '',
        id: '',
        goodsType: ''
      },
      searchWord: {
        povId: '',
        demandStartTime: '',
        demandEndTime: '',
        orgAreaCode: '',
        id: '',
        goodsType: ''
      },
      demandTime: '',
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10
      },
      currentItemId: '',
      currentItem: {},
      checkList: [], // 选中的订单列表
      isCheckAll: false,
      orgList: [],
      isSearch: false,
      index: -1
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    vaccineSignList() {
      return this.$getDict('orderGoodsType');
    },
    isShowGoodsList() {
      return this.$store.state.isShowGoodsList;
    }
  },
  mounted() {
    this.getDemandList(1);
    this.resetSearchForm();
    let orderId = this.$route.params.id;
    if (orderId && orderId !== 'list') {
      this.currentItem = {id: orderId};
      this.showDetailPart = true;
    }
  },
  watch: {
    filters: {
      handler: function () {
        this.getDemandList(1);
      },
      deep: true
    },
    user(val) {
      if (val.userCompanyAddress) {
        this.getDemandList(1);
      }
    },
    isShowGoodsList() {
      this.getDemandList(1);
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pager.pageSize = val;
      window.localStorage.setItem('currentPageSize', val);
      this.getDemandList(1);
    },
    handleCurrentChange(val) {
      this.getDemandList(val);
    },
    getDemandList(pageNo) { // 得到需求列表
      this.isCheckAll = false;
      this.checkList = [];
      let orgId = this.user.userCompanyAddress;
      if (!orgId) return;
      this.pager.currentPage = pageNo;
      let searchCondition = {};
      // 查询采购单
      if (this.filters.status > 10) {
        searchCondition = Object.assign({}, this.filters, {
          procurementStatus: this.filters.status === 11 ? 0 : this.filters.status === 12 ? 1 : 2
        });
        searchCondition.status = undefined;
      } else {
        searchCondition = Object.assign({}, this.filters);
      }
      if (searchCondition.status === 3) searchCondition.cancelFlag = '0';
      let params = Object.assign({
        pageNo: pageNo,
        pageSize: this.pager.pageSize,
        cdcId: orgId
      }, searchCondition);
      params.isShowDetail = !!JSON.parse(window.localStorage.getItem('isShowGoodsList'));
      this.loadingData = true;
      pullSignal.queryCDC(params).then(res => {
        res.data.list.forEach(item => {
          item.isChecked = false;
        });
        this.demandList = res.data.list;
        this.pager.count = res.data.count;
        this.loadingData = false;
        this.queryCount();
      });
    },
    queryCount() {
      let params = Object.assign({}, {
        cdcId: this.user.userCompanyAddress
      }, this.filters);
      pullSignal.queryCount(params).then(res => {
        this.assignType[0].num = res.data['audited'];
        this.assignType[1].num = res.data['create-wave'];
        this.assignType[2].num = res.data['assigned'];
        this.assignType[3].num = res.data['cdc-canceled'];
        this.assignType[4].num = res.data['procurement-pending-audit'];
        this.assignType[5].num = res.data['procurement-audited'];
        this.assignType[6].num = res.data['procurement-canceled'];
      });
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
    showDetail(item) {
      this.currentItemId = item.id;
      this.currentItem = item;
      this.$router.push(`${item.id}`);
      this.showDetailPart = true;
    },
    editOrder(item) {
      this.currentItemId = item.id;
      this.currentItem = item;
      this.showEditPart = true;
    },
    createSaleOrder(item) {
      this.$confirm('是否生成销售订单', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.put(`/pull-signal/${item.id}/sales-ticket`).then(() => {
          this.$notify.success({
            message: '生成销售订单成功'
          });
          this.getDemandList(1);
        }).catch(error => {
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || '生成销售订单失败'
          });
        });
      });
    },
    applyOrder() {
      this.showRight = true;
      this.index = 1;
    },
    onSubmit() {
      this.getDemandList(1);
      this.showRight = false;
    },
    resetRightBox(para) {
      this.index = -1;
      this.showDetailPart = false;
      this.showRight = false;
      this.showEditPart = false;
      this.$router.push('list');
      if (para) {
        this.getDemandList(this.pager.currentPage);
      }
    },
    checkStatus(item, key) {
      this.activeStatus = key;
      this.filters.status = item.status;
    },
    filterListColor: function (index) {// 过滤左边列表边角颜色
      let status = -1;
      for (let key in this.assignType) {
        if (this.assignType[key].status === index) {
          status = key;
        }
      }
      return status;
    },
    searchInOrder: function () {// 搜索
      if (this.demandTime instanceof Array && this.demandTime.length && this.demandTime[0]) {
        this.searchWord.demandStartTime = this.$formatAryTime(this.demandTime, 0);
        this.searchWord.demandEndTime = this.$formatAryTime(this.demandTime, 1);
      }
      Object.assign(this.filters, this.searchWord);
    },
    resetSearchForm: function () {// 重置表单
      let temp = {
        povId: '',
        demandStartTime: '',
        demandEndTime: '',
        orgAreaCode: '',
        id: '',
        goodsType: ''

      };
      this.demandTime = '';
      this.isCheckAll = false;
      Object.assign(this.searchWord, temp);
      Object.assign(this.filters, temp);
    },
    exportExcel() {
      if (!(this.demandTime instanceof Array && this.demandTime.length && this.demandTime[0])) {
        this.$notify.info({
          message: '请选择需求到货日期'
        });
        return;
      }
      this.searchWord.demandStartTime = this.$formatAryTime(this.demandTime, 0);
      this.searchWord.demandEndTime = this.$formatAryTime(this.demandTime, 1);
      let filters = {
        status: this.filters.status,
        povId: this.searchWord.povId,
        demandStartTime: this.searchWord.demandStartTime,
        demandEndTime: this.searchWord.demandEndTime,
        orgAreaCode: this.searchWord.orgAreaCode,
        goodsType: this.searchWord.goodsType,
        id: this.searchWord.id
      };
      Object.assign(this.filters, this.searchWord);
      let params = Object.assign({}, {
        cdcId: this.user.userCompanyAddress
      }, filters);
      this.$store.commit('initPrint', {isPrinting: true, moduleId: '/sale/pov/list'});
      this.$http.get('/pull-signal/export', {params}).then(res => {
        utils.download(res.data.path, '要货需求');
        this.isLoading = false;
        this.$store.commit('initPrint', {isPrinting: false, moduleId: '/sale/pov/list'});
      }).catch(error => {
        this.$store.commit('initPrint', {isPrinting: false, moduleId: '/sale/pov/list'});
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
        });
      });
    },
    exportNoSaleExcel() {
      if (!(this.demandTime instanceof Array && this.demandTime.length && this.demandTime[0])) {
        this.$notify.info({
          message: '请选择需求到货日期'
        });
        return;
      }
      let params = Object.assign({}, {
        cdcId: this.user.userCompanyAddress
      }, this.filters, {
        procurementStatus: '',
        status: '1'
      });
      this.$store.commit('initPrint', {isPrinting: true, moduleId: '/sale/pov/list'});
      this.$http.get('/pull-signal/export', {params}).then(res => {
        utils.download(res.data.path, '要货需求');
        this.isLoading = false;
        this.$store.commit('initPrint', {isPrinting: false, moduleId: '/sale/pov/list'});
      }).catch(error => {
        this.$store.commit('initPrint', {isPrinting: false, moduleId: '/sale/pov/list'});
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
        });
      });
    },
    checkAll() { // 全选
      if (this.isCheckAll) {
        this.demandList.forEach(item => {
          item.isChecked = true;
          let index = this.checkList.indexOf(item);
          if (index === -1) {
            this.checkList.push(item);
          }
        });
      } else {
        this.demandList.forEach(item => {
          item.isChecked = false;
        });
        this.checkList = [];
      }
    },
    checkItem(item) { // 单选
      item.isChecked = !item.isChecked;
      let index = this.checkList.indexOf(item);
      if (item.isChecked) {
        if (index === -1) {
          this.checkList.push(item);
        }
      } else {
        this.checkList.splice(index, 1);
      }
    },
    createPurchaseDemand() {
      if (!this.checkList.length) {
        this.$notify.info({
          message: '请选择申请单'
        });
        return;
      }
      let list = [];
      this.checkList.forEach(i => list.push(i.id));
      procurementCollect.save({list}).then(res => {
        this.$notify.success({
          message: '生产采购汇总单成功'
        });
        this.$router.push({path: '/purchase/allocation/task', query: {id: res.data.id}});
      }).catch(error => {
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '生产采购汇总单失败'
        });
      });
    },
    createDemand() {
      if (!this.checkList.length) {
        this.$notify.info({
          message: '请选择申请单'
        });
        return;
      }
      let list = [];
      this.checkList.forEach(i => !list.includes(i.id) && list.push(i.id));
      demandAssignment.save({list}).then(res => {
        this.$notify.success({
          message: '生成销售汇总单成功'
        });
        this.$router.push({path: '/sale/allocation/pov', query: {id: res.data.id}});
      }).catch(error => {
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '生成销售汇总单失败'
        });
      });
    },
    cancel(item) {
      this.$confirm('是否取消"' + item.id + '" 申请单?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.filters.status === 1) {
          pullSignal.cancel(item.id, {cancelFlag: 0}).then(() => {
            this.$notify.success({
              message: '已成功取消需求单'
            });
            this.getDemandList(1);
          }).catch(error => {
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '取消需求单失败'
            });
          });
        } else {
          this.$http.put(`/pull-signal/cancel/procurement/${item.id} `).then(() => {
            this.$notify.success({
              message: '已成功取消需求单'
            });
            this.getDemandList(1);
          }).catch(error => {
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '取消需求单失败'
            });
          });
        }
      });
    },
    changeTime(date) {
      return date ? this.$moment(date).format('YYYY-MM-DD') : '';
    }
  }
};
</script>
