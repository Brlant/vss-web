<style lang="scss" scoped>
@import "../../../assets/mixins";

.btn-color {
  a:hover {
    color: $activeColor;
  }
}

.order-list-item {
  cursor: pointer;
}
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div :class="{up:!showSearch}" class="opera-btn-group">
        <div class="opera-icon">
          <span class="pull-right cursor-span" style="margin-left: 10px" @click.prevent="add">
            <perm label="invoice-add">
                  <a class="btn-circle" href="#" @click.prevent=""><i
                    class="el-icon-t-plus"></i> </a>添加
            </perm>
          </span>
          <span class="pull-left switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form v-show="showSearch" class="advanced-query-form clearfix" onsubmit="return false"
                 style="padding-top: 10px">
          <el-row>
            <el-col :span="8">
              <oms-form-row :span="5" label="发票号码">
                <oms-input v-model="searchCondition.invoiceNumber" placeholder="请输入发票号码" type="text"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="5" label="供货单位">
                <el-select v-model="searchCondition.factoryId" :clearable="true" :remote-method="filterOrg" filterable
                           placeholder="请输入名称搜索供货单位"
                           popperClass="good-selects"
                           remote @click.native="filterOrg('')">
                  <el-option v-for="org in orgList" :key="org.id" :label="org.name" :value="org.id">
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
            <el-col :span="6">
              <oms-form-row :span="1" label="">
                <el-button native-type="submit" type="primary" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="order-list-status container" style="margin-bottom:20px">
        <div v-for="(item,key) in orgType"
             :class="{'active':key==activeStatus,'exceptionPosition':key === '5'}"
             class="status-item"
             @click="changeStatus(item,key)">
          <div :class="['b_color_'+key]" class="status-bg"></div>
          <div><i v-if="key==activeStatus" class="el-icon-caret-right"></i>{{item.title}}<span class="status-num">{{item.num}}</span>
          </div>
        </div>
      </div>
      <div class="order-list clearfix" style="margin-top: 10px">
        <el-row class="order-list-header">
          <el-col :span="6">疫苗厂商</el-col>
          <el-col :span="6">发票号码</el-col>
          <el-col :span="3">发票金额</el-col>
          <el-col :span="3">待付金额</el-col>
          <!--<el-col :span="3">是否已到</el-col>-->
          <el-col :span="3">状态</el-col>
          <el-col :span="3">操作</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="invoices.length == 0">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else class="order-list-body flex-list-dom">
          <div v-for="item in invoices" :class="[{'active':currentId==item.id}]"
               class="order-list-item order-list-item-bg" @click="showDetailPart(item)">
            <el-row>
              <el-col :span="6" class="R pt10">
                    <span>
                      {{ item.factoryName }}
                    </span>
              </el-col>
              <el-col :span="6" class="R pt10">
                    <span>
                      {{ item.invoiceNumber }}
                    </span>
              </el-col>
              <el-col :span="3" class="R pt10">
                    <span>
                       ￥{{ item.amount | formatMoney}}
                    </span>
              </el-col>
              <el-col :span="3" class="R pt10">
                    <span>
                       ￥{{ (item.amount - item.paidAmount) | formatMoney}}
                    </span>
              </el-col>
              <!--<el-col :span="3" class="R pt10">-->
              <!--<span>-->
              <!--{{ item.haveTo ? '已到' : '未到'}}-->
              <!--</span>-->
              <!--</el-col>-->
              <el-col :span="3" class="R pt10">
                    <span>
                      {{ item.status === 0 ? '未付清' : '已付清'}}
                    </span>
              </el-col>
              <el-col :span="3" class="R pt10 btn-color">
                <div v-if="item.status === 0">
                  <!--<perm label="invoice-update">-->
                  <!--<a href="#" @click.prevent="edit(item)"><i-->
                  <!--class="el-icon-t-edit"></i>编辑</a>-->
                  <!--</perm>-->
                  <perm label="payment-payable">
                    <a href="#" @click.prevent.stop="deleteItem(item)"><i
                      class="ele-icon-t-delete"></i> 删除</a>
                  </perm>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div v-show="pager.count>pager.pageSize && !loadingData" class="text-center">
        <el-pagination
          :current-page="pager.currentPage"
          :pageSize="pager.pageSize" :total="pager.count" layout="prev, pager, next"
          @current-change="getMaPage">
        </el-pagination>
      </div>
    </div>
    <page-right :css="{'width':'1000px','padding':0}" :show="showPart"
                @right-close="resetRightBox">
      <form-part :formItem="form" @close="resetRightBox" @refresh="refresh"></form-part>
    </page-right>
    <page-right :css="{'width':'1000px','padding':0}" :show="showDetail"
                @right-close="resetRightBox">
      <detail-part :currentId="currentId" :showDetail="showDetail" @close="resetRightBox"
                   @refresh="refresh"></detail-part>
    </page-right>
  </div>
</template>
<script>
import {BaseInfo, invoiceManage} from '@/resources';
import formPart from './form.vue';
import utils from '@/tools/utils';
import detailPart from './detail.vue';

export default {
  components: {formPart, detailPart},
  data() {
    return {
      loadingData: true,
      showSearch: true,
      showPart: false,
      showDetail: false,
      invoices: [],
      filters: {
        deleteFlag: false,
        status: 0,
        invoiceNumber: '',
        factoryId: ''
      },
      activeStatus: 0,
      orgType: utils.invoiceType,
      searchCondition: {
        invoiceNumber: '',
        factoryId: ''
      },
      form: {},
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: 15
      },
      currentId: '',
      orgList: []
    };
  },
  mounted() {
    this.getMaPage(1);
  },
  watch: {
    filters: {
      handler: function () {
        this.getMaPage(1);
      },
      deep: true
    }
  },
  methods: {
    resetRightBox: function () {
      this.showPart = false;
      this.showDetail = false;
    },
    getMaPage(pageNo) { // 得到波次列表
      this.pager.currentPage = pageNo;
      let params = Object.assign({
        pageNo: pageNo,
        pageSize: this.pager.pageSize
      }, this.filters);
      this.loadingData = true;
      invoiceManage.query(params).then(res => {
        this.invoices = res.data.list;
        this.pager.count = res.data.count;
        this.loadingData = false;
      });
      this.queryCount(params);
    },
    queryCount(params) {
      invoiceManage.queryCount(params).then(res => {
        this.orgType[0].num = res.data['non-payment'];
        this.orgType[1].num = res.data['paid'];
      });
    },
    filterOrg: function (query) {// 过滤供货商
      let orgId = this.$store.state.user.userCompanyAddress;
      if (!orgId) {
        this.searchCondition.factoryId = '';
        this.orgList = [];
        return;
      }
      BaseInfo.queryOrgByReation(orgId, {keyWord: query, relation: '1'}).then(res => {
        this.orgList = res.data;
      });
    },
    refresh() {
      this.getMaPage(1);
      this.showPart = false;
    },
    add() {
      this.form = {};
      this.showPart = true;
    },
    edit(item) {
      this.currentId = item.id;
      this.form = item;
      this.showPart = true;
    },
    showDetailPart(item) {
      this.currentId = item.id;
      this.showDetail = true;
    },
    changeStatus: function (item, key) {// 订单分类改变
      this.activeStatus = key;
      this.filters.status = item.status;
    },
    searchInOrder: function () {// 搜索
      Object.assign(this.filters, this.searchCondition);
    },
    resetSearchForm: function () {// 重置表单
      let temp = {
        invoiceNumber: '',
        factoryId: ''
      };
      Object.assign(this.searchCondition, temp);
      Object.assign(this.filters, temp);
    },
    deleteItem(item) {
      this.$confirm('是否删除发票 "' + item.invoiceNumber + '"?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        invoiceManage.delete(item.id).then(() => {
          this.$notify.success({
            message: '删除成功'
          });
          this.getMaPage();
        }).catch(error => {
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || '删除失败'
          });
        });
      });
    }
  }
};
</script>
