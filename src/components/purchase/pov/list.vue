<style lang="scss" scoped>

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
.returnTitle{
  font-size: 18px;
  margin-bottom: 5px;
  i{
    font-size: 22px;
    margin-right: 8px;
  }
}
</style>
<style lang="scss">
.returnShow{
  .el-dialog__wrapper {
      text-align: center;
      white-space: nowrap;
      overflow: auto;
      &:after {
        content: "";
        display: inline-block;
        vertical-align: middle;
        height: 100%;
      }
      .el-dialog {
        margin: 30px auto !important;
        display: inline-block;
        vertical-align: middle;
        text-align: left;
        white-space: normal;
        .el-dialog__header{
          display: none !important;
        }  
      }
}
}
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div :class="{up:!showSearch}" class="opera-btn-group">
        <div class="opera-icon">
          <span v-show="filters.status === 11" class="pull-right">
          <perm class="opera-btn" label="purchansing-assignment-add">
            <span style="cursor:pointer" @click="createPurchaseDemand"><a class="btn-circle" href="#" @click.prevent=""><i
              class="el-icon-t-wave"></i></a><span class="wave-title"> 生成采购汇总单</span></span>
          </perm>
         </span>
          <span v-show="filters.status === 1" class="pull-right">
            <perm class="opera-btn" label="demand-assignment-add">
              <span style="cursor:pointer" @click="createDemand"><a class="btn-circle" href="#" @click.prevent=""><i
                class="el-icon-t-wave"></i></a><span class="wave-title"> 生成销售汇总单</span></span>
            </perm>
         </span>
          <span class="pull-right">
            <perm class="opera-btn" label="cargo-signal-add">
              <span style="cursor:pointer" @click="applyOrder"><a class="btn-circle" href="#" @click.prevent=""><i
                class="el-icon-t-plus"></i></a><span class="wave-title">新增分货</span></span>
            </perm>
         </span>
          <goods-switch class="pull-right"></goods-switch>
          <span class="pull-left switching-icon" style="margin-right: 20px" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form :model="searchWord" class="advanced-query-form" onsubmit="return false">
          <el-row>
            <el-col :span="8">
              <oms-form-row :span="5" label="收货单位">
                <el-select v-model="searchWord.povId" :clearable="true" :remote-method="filterOrg" filterable
                           placeholder="请输入名称搜索收货单位" popperClass="good-selects" remote
                           @click.native="filterOrg('')">
                  <el-option v-for="org in orgList" :key="org.id" :label="org.name" :value="org.id">
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
              <oms-form-row :span="8" label="申请单编号">
                <oms-input v-model="searchWord.id" placeholder="请输入申请单编号" type="text"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="9">
              <el-row>
                <el-col :span="8" style="padding-top: 10px;padding-right:8px;text-align: right">
                  到货需求日期
                </el-col>
                <el-col :span="16">
                  <el-date-picker
                    v-model="demandTime"
                    format="yyyy-MM-dd"
                    placeholder="请选择到货需求日期" type="daterange">
                  </el-date-picker>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8" class="clearfix">
              <oms-form-row :span="7" label="单位区域代码">
                <oms-input v-model="searchWord.orgAreaCode" placeholder="请输入单位区域代码" type="text"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="7">
              <oms-form-row :span="7" label="疫苗种类">
                <el-select v-model="searchWord.goodsType" placeholder="请选择疫苗种类" type="text">
                  <el-option v-for="item in vaccineSignList" :key="item.key" :label="item.label"
                             :value="item.key"></el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="9">
              <oms-form-row :span="5" label="货主疫苗">
                <el-select v-model="searchWord.orgGoodsId" :clearable="true" :remote-method="filterOrgGoods" filterable
                           placeholder="请输入名称或编号搜索货主疫苗"
                           popper-class="good-selects" remote
                           @click.native.once="filterOrgGoods('')">
                  <el-option v-for="org in orgGoods" :key="org.id" :label="org.goodsName"
                             :value="org.id">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{ org.goodsName }}<el-tag v-show="!org.status" style="float: none"
                                                                         type="danger">停用</el-tag></span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left"><span
                        v-show="org.goodsNo">货主货品编号:</span>{{ org.goodsNo }}
                      </span>
                      <span class="select-other-info pull-left"><span
                        v-show="org.saleFirmName">供货单位:</span>{{ org.saleFirmName }}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14"></el-col>
            <el-col :span="10">
              <oms-form-row :span="3" label="">
                <el-button native-type="submit" type="primary" @click="searchInOrder">查询</el-button>
                <el-button @click="resetSearchForm">重置</el-button>
                <el-button :plain="true" type="success" @click="exportExcel">导出EXCEL</el-button>
                <el-button :plain="true" type="success" @click="exportNoSaleExcel">导出待生成销售汇总</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-row>
        <el-col :span="13">
          <div class="order-list-status container clearfix">
            <div v-for="(item,key) in assignType" v-show="key < 4" :class="{'active':key==activeStatus}"
                 class="status-item" style="width: 115px" @click="checkStatus(item, key)">
              <div :class="['b_color_'+key]" class="status-bg"></div>
              <div><i v-if="key==activeStatus" class="el-icon-caret-right"></i>{{ item.title }}<span class="status-num">
            {{ item.num }}</span></div>
            </div>
          </div>
        </el-col>
        <el-col :span="11">
          <div class="order-list-status order-list-status-right container clearfix">
            <div v-for="(item,key) in assignType" v-show="key > 3" :class="{'active':key==activeStatus}"
                 class="status-item"
                 style="width: 115px" @click="checkStatus(item, key)">
              <div :class="['b_color_'+key]" class="status-bg"></div>
              <div><i v-if="key==activeStatus" class="el-icon-caret-right"></i>{{ item.title }}<span class="status-num">
            {{ item.num }}</span></div>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="order-list clearfix " style="margin-top: 20px">
        <el-row class="order-list-header">
          <el-col :span="5">
            <el-checkbox v-show="filters.status === 1 || filters.status === 11" v-model="isCheckAll" @change="checkAll">
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
        <div v-else class="order-list-body flex-list-dom">
          <div v-for="item in demandList" :class="['status-'+activeStatus,{'active':currentItemId==item.id}]"
               class="order-list-item">
            <el-row>
              <el-col :class="{'special-col': filters.status === 1 || filters.status === 11}" :span="5" class="R pt10">
                <div v-show="filters.status === 1 || filters.status === 11" class="el-checkbox-warp"
                     @click.stop.prevent="checkItem(item)">
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
                    <a class="btn-circle" href="#" @click.prevent=""><i
                      class="el-icon-t-detail"></i></a>
                  查看详情
                  </span>
                  <perm label="pull-signal-return">
                    <span v-show="filters.status === 1" @click.prevent="backDemand(item)">
                        <a class="btn-circle" href="#" @click.prevent=""><i
                          class="el-icon-t-forbidden"></i></a>
                          退回需求单
                    </span>
                  </perm>
                </div>
                <div>
                  <perm label="demand-assignment-update">
                    <span v-show="filters.status === 1 || filters.status === 2" @click.prevent="editOrder(item)">
                      <a class="btn-circle" href="#" @click.prevent=""><i
                        class="el-icon-t-edit"></i></a>
                        编辑
                  </span>
                  </perm>
                  <perm v-show="filters.status === 1 || filters.status === 11" label="demand-assignment-cancel">
                     <span @click.prevent="cancel(item)">
                      <a class="btn-circle" href="#" @click.prevent=""><i
                        class="el-icon-t-verify"></i></a>
                        取消需求单
                      </span>
                  </perm>
                  <perm label="demand-assignment-add">
                    <span v-show="filters.status === 2 && item.singleFlag" @click.prevent="createSaleOrder(item)">
                        <a class="btn-circle" href="#" @click.prevent=""><i
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

      <div v-show="demandList.length && !loadingData" class="text-center">
        <el-pagination
          :current-page="pager.currentPage" :page-sizes="[10,20,50,100]"
          :pageSize="pager.pageSize"
          :total="pager.count" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
    <page-right :css="{'width':'1000px','padding':0}" :show="showDetailPart" class="order-detail-info"
                partClass="pr-no-animation" @right-close="resetRightBox">
      <show-form :currentItem="currentItem" @close="resetRightBox"></show-form>
    </page-right>
    <page-right :css="{'width':'1000px','padding':0}" :show="showRight" @right-close="closeForm">
      <add-form :currentOrder="currentItem" :index="index" @change="onSubmit" @close="resetRightBox"></add-form>
    </page-right>
    <page-right :css="{'width':'1000px','padding':0}" :show="showEditPart" @right-close="closeForm">
      <edit-form :currentItem="currentItem" :showEditPart="showEditPart" @change="resetRightBox"
                 @close="resetRightBox"></edit-form>
    </page-right>
    <!-- 退回需求单弹窗 -->
    <div class="returnShow">
    <el-dialog
      :visible.sync="returnDialogVisible"
      width="30%"
      :show-close="false"
      >
      <div >
        <div class="returnTitle"><i class="el-icon-warning-outline"></i>是否退回“{{OrderNumber}}”的申请单?</div>
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入退回原因"
          v-model="reason">
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="returnDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureReturn">确 定</el-button>
      </span>
    </el-dialog>
    </div>
  </div>
</template>
<script>
import {BaseInfo, demandAssignment, http, procurementCollect, pullSignal} from '@/resources';
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
        goodsType: '',
        orgGoodsId:''
      },
      searchWord: {
        povId: '',
        demandStartTime: '',
        demandEndTime: '',
        orgAreaCode: '',
        id: '',
        goodsType: '',
        orgGoodsId:''
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
      index: -1,
      orgGoods: [],
      returnDialogVisible:false,
      OrderNumber:"",
      reason:'',
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
    filterOrgGoods(query) {
      let orgId = this.$store.state.user.userCompanyAddress;
      let params = Object.assign({}, {
        deleteFlag: false,
        orgId: orgId,
        keyWord: query
      });
      http.get('/erp-stock/goods', {params}).then(res => {
        this.orgGoods = res.data.list;
      });
    },
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
    // 退回需求单
    backDemand(item){
      this.returnDialogVisible = true
      this.reason = ''
      this.OrderNumber = item.id
    },
    // 确认退回
    sureReturn(){
      if(this.reason == ''){
        this.$message.warning('请填写退回原因')
        return
      }
      this.$http.put(`/pull-signal/return/${this.OrderNumber}`,{reason:this.reason}).then(() => {
            this.$notify.success({
              message: '已成功取消需求单'
            });
            this.getDemandList(1);
          }).catch(error => {
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '取消需求单失败'
            });
          });
    },
    closeForm(item) {
      this.$confirm('信息未保存，是否关闭?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.showRight = false;
        this.showEditPart = false;
      }).catch(error => {

      });
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
        goodsType: '',
        orgGoodsId:''
      };
      this.demandTime = '';
      this.isCheckAll = false;
      Object.assign(this.searchWord, temp);
      Object.assign(this.filters, temp);
    },
    exportExcel() {
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
