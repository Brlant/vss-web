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

  .good-selects {
    .el-select-dropdown__item {
      width: auto;
    }
  }

  .loading-ht {
    height: 300px;
  }

  .opera-btn-group {
    margin: 10px 0;
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
          <span class="pull-right switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form class="advanced-query-form">
          <el-row>
            <el-col :span="8">
              <oms-form-row label="业务日期" :span="5">
                <el-col :span="24">
                  <el-date-picker
                    v-model="bizDateAry"
                    type="daterange"
                    placeholder="请选择" format="yyyy-MM-dd">
                  </el-date-picker>
                </el-col>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="供货商" :span="5">
                <el-select filterable remote placeholder="请输入名称搜索供货商" :remote-method="filterOrg" :clearable="true"
                           v-model="searchWord.suppliers" popperClass="good-selects" @click.native.once="filterOrg('')">
                  <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in orgList">
                    <div style="overflow: hidden">
                      <span class="pull-left" style="clear: right">{{org.name}}</span>
                      <span class="pull-right" style="color: #999">
                     <dict :dict-group="'orgRelation'" :dict-key="org.relationList[0]"></dict>
                    </span>
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
            <el-col :span="8">
              <oms-form-row label="货主订单号" :span="6">
                <el-input v-model="searchWord.batchNumber" placeholder="请输入货主订单号"></el-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="货主货品" :span="5">
                <el-select filterable remote placeholder="请输入名称搜索货主货品" :remote-method="filterOrgGoods"
                           :clearable="true"
                           v-model="searchWord.orgGoodsId" popper-class="good-selects"
                           @click.native.once="filterOrgGoods('')">
                  <el-option :value="org.id" :key="org.id" :label="org.goodsName"
                             v-for="org in orgGoods">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{org.goodsName}}</span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left"><span
                        v-show="org.goodsNo">货品编号</span>  {{org.goodsNo}}
                      </span>
                      <span class="select-other-info pull-left"><span
                        v-show="org.saleFirmName">供货厂商</span>  {{ org.saleFirmName }}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="批号" :span="5">
                <el-select v-model="searchWord.batchNumberId" filterable clearable remote
                           :remoteMethod="filterBatchNumber" placeholder="请输入批号名称搜索批号"
                           @click.native.once="filterBatchNumber('')">
                  <el-option v-for="item in batchNumberList" :value="item.id" :key="item.id"
                             :label="item.batchNumber"></el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="" :span="1">
                <perm label="purchasing-detail-form-export">
                  <el-button type="primary" @click="search" :disabled="loadingData">
                    查询
                  </el-button>
                  <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
                  <el-button :plain="true" type="success" @click="exportFile" :disabled="isLoading">
                    导出Excel
                  </el-button>
                </perm>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table :data="reportList" class="header-list" border
                :header-row-class-name="'headerClass'" v-loading="loadingData" maxHeight="400">
        <el-table-column prop="orderNo" label="订单编号" :sortable="true"></el-table-column>
        <el-table-column prop="createTime" label="业务日期" :sortable="true"></el-table-column>
        <el-table-column prop="suppliersName" label="供应商" :sortable="true"></el-table-column>
        <el-table-column prop="orgName" label="保管账" :sortable="true"></el-table-column>
        <el-table-column prop="orgGoodsName" label="货品名称" :sortable="true"></el-table-column>
        <el-table-column prop="count" label="数量" :sortable="true"></el-table-column>
        <el-table-column prop="price" label="进货单价" :sortable="true"></el-table-column>
        <el-table-column prop="totalMoney" label="金额" :sortable="true"></el-table-column>
        <el-table-column prop="batchNumber" label="批号" :sortable="true"></el-table-column>
        <el-table-column prop="expirationDate" label="有效期至" :sortable="true"></el-table-column>
      </el-table>
    </div>

  </div>
</template>
<script>
  import { BaseInfo, http } from '@/resources';
  import utils from '@/tools/utils';

  export default {
    data () {
      return {
        loadingData: false,
        reportList: [],
        showSearch: true,
        searchWord: {
          suppliers: '',
          orderNo: '',
          createStartTime: '',
          createEndTime: '',
          batchNumberId: '',
          orgGoodsId: ''
        },
        orgList: [],
        orgGoods: [],
        batchNumberList: [],
        bizDateAry: '',
        isLoading: false
      };
    },
    methods: {
      exportFile: function () {
        this.searchWord.createStartTime = this.formatTime(this.bizDateAry[0]);
        this.searchWord.createEndTime = this.formatTime(this.bizDateAry[1]);
        let params = Object.assign({}, this.searchWord);
        this.isLoading = true;
        this.$store.commit('initPrint', {isPrinting: true, moduleId: '/report/purchase'});
        this.$http.get('/erp-statement/purchase-detail/export', {params}).then(res => {
          utils.download(res.data.path, '采购明细表');
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/purchase'});
        }).catch(error => {
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/purchase'});
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },
      search: function () {// 搜索
        this.searchWord.createStartTime = this.formatTime(this.bizDateAry[0]);
        this.searchWord.createEndTime = this.formatTime(this.bizDateAry[1]);
        let params = Object.assign({}, this.searchWord);
        this.loadingData = true;
        this.$http.get('/erp-statement/purchase-detail', {params}).then(res => {
          this.reportList = res.data.map(m => {
            m.createTime = this.formatTime(m.createTime);
            m.expirationDate = this.formatTime(m.expirationDate);
            m.price = m.price ? `￥${m.price}` : '';
            m.totalMoney = `￥${m.totalMoney}`;
            return m;
          });
          this.loadingData = false;
        });
      },
      resetSearchForm: function () {
        this.searchWord = {
          suppliers: '',
          orderNo: '',
          createStartTime: '',
          createEndTime: '',
          batchNumberId: '',
          orgGoodsId: ''
        };
        this.bizDateAry = '';
        this.search();
      },
      filterOrg: function (query) {
        let orgId = this.$store.state.user.userCompanyAddress;
        if (!orgId) return;
        let params = {
          keyWord: query,
          relation: '1'
        };
        BaseInfo.queryOrgByValidReation(orgId, params).then(res => {
          this.orgList = res.data;
        });
      },
      filterBatchNumber (query) {
        this.$http.get('erp-stock/batch-number', {params: {keyWord: query}}).then(res => {
          this.batchNumberList = res.data.list;
        });
      },
      filterOrgGoods (query) {
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
      formatTime: function (date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      }
    }
  };
</script>
