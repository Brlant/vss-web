<style lang="less" scoped="">
  @import "../../../assets/mixins";

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

  .pt {
    padding-top: 15px;
  }

  .opera-btn-group {

    border: 2px solid #eeeeee;
    margin: 10px -5px;
    .opera-icon {
      line-height: 50px;
      height: 50px;
      padding: 0 10px;
      border-bottom: 2px solid #eeeeee;
    }
    .switching-icon {
      cursor: pointer;
      .el-icon-arrow-up {
        transition: all .5s ease-in-out;
      }
    }
    &.up {
      .advanced-query-form {
        display: none;
      }
      .opera-icon {
        border-bottom: 0;
      }
      .el-icon-arrow-up {
        transform: rotate(180deg);
      }
    }
  }

  .search-input {
    .el-select {
      display: block;
      position: relative;
    }
    .el-date-editor.el-input {
      width: 100%;
    }
  }

  .good-selects {
    .el-select-dropdown__item {
      width: auto;
    }
  }

  .btn-color {
    a:hover {
      color: @activeColor;
    }
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
            <perm label="invoice-add">
                  <a href="#" class="btn-circle" @click.prevent=""><i
                    class="iconfont icon-plus"></i> </a>添加
            </perm>
          </span>
          <span class="pull-right switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form v-show="showSearch" class="advanced-query-form clearfix" style="padding-top: 10px">
          <el-row>
            <el-col :span="8">
              <oms-form-row label="发票号码" :span="6">
                <oms-input type="text" v-model="searchCondition.invoiceNumber" placeholder="请输入货主订单号"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="供货厂商" :span="6">
                <el-select filterable remote placeholder="请输入名称搜索供货厂商" :remote-method="filterOrg" :clearable="true"
                           v-model="searchCondition.factoryId" popperClass="good-selects">
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
              <oms-form-row label="" :span="6">
                <el-button type="primary" @click="searchInOrder">查询</el-button>
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
      <div class="order-list clearfix" style="margin-top: 10px">
        <el-row class="order-list-header" :gutter="10">
          <el-col :span="5">疫苗厂商</el-col>
          <el-col :span="5">发票号码</el-col>
          <el-col :span="5">发票类型</el-col>
          <el-col :span="4">发票金额</el-col>
          <el-col :span="2">状态</el-col>
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
        <div v-else="" class="order-list-body flex-list-dom">
          <div class="order-list-item order-list-item-bg" v-for="item in invoices"
               :class="[{'active':currentId==item.id}]">
            <el-row>
              <el-col :span="5" class="R pt10">
                    <span>
                      {{ item.factoryName }}
                    </span>
              </el-col>
              <el-col :span="5" class="R pt10">
                    <span>
                      {{ item.invoiceNumber }}
                    </span>
              </el-col>
              <el-col :span="5" class="R pt10">
                    <span>
                       <dict :dict-group="'invoiceType'" :dict-key="item.type"></dict>
                    </span>
              </el-col>
              <el-col :span="4" class="R pt10">
                    <span>
                       ￥{{ item.amount | formatMoney}}
                    </span>
              </el-col>
              <el-col :span="2" class="R pt10">
                    <span>
                      {{ item.status === 0 ? '未付款' : '已付款'}}
                    </span>
              </el-col>
              <el-col :span="3" class="R pt10 btn-color">
                <div v-if="item.status === 0">
                  <perm label="invoice-update">
                    <a href="#" @click.prevent="edit(item)"><i
                      class="iconfont icon-edit"></i>编辑</a>
                  </perm>
                  <perm label="payment-payable">
                    <a href="#" @click.prevent="deleteItem(item)"><i
                      class="iconfont invoice-delete"></i> 删除</a>
                  </perm>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">
        <el-pagination
          layout="prev, pager, next"
          :total="pager.count" :pageSize="pager.pageSize" @current-change="getMaPage"
          :current-page="pager.currentPage">
        </el-pagination>
      </div>
    </div>
    <page-right :show="showPart" @right-close="resetRightBox"
                :css="{'width':'1000px','padding':0}">
      <form-part :formItem="form" @close="resetRightBox" @refresh="refresh"></form-part>
    </page-right>
  </div>
</template>
<script>
  import { invoiceManage, BaseInfo } from '@/resources';
  import formPart from './form.vue';
  import utils from '@/tools/utils';

  export default {
    components: {formPart},
    data () {
      return {
        loadingData: true,
        showSearch: true,
        showPart: false,
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
    mounted () {
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
      },
      getMaPage (pageNo) { // 得到波次列表
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
      queryCount (params) {
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
        BaseInfo.queryOrgByReation(orgId, {keyWord: query}).then(res => {
          this.orgList = res.data;
        });
      },
      refresh () {
        this.getMaPage(1);
        this.showPart = false;
      },
      add () {
        this.form = {};
        this.showPart = true;
      },
      edit (item) {
        this.currentId = item.id;
        this.form = item;
        this.showPart = true;
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
      deleteItem (item) {
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
              message: error.response.data && error.response.data.msg || '删除失败'
            });
          });
        });
      }
    }
  };
</script>
