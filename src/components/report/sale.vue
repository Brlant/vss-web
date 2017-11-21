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
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div class="opera-btn-group" :class="{up:!showSearch}">
        <div class="opera-icon">
          <span class="">
            <i class="iconfont icon-search"></i> 筛选查询
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
              <oms-form-row label="业务日期" :span="8">
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
              <oms-form-row label="客户" :span="6">
                <el-select filterable remote placeholder="请输入名称搜索客户" :remote-method="filterPOV" :clearable="true"
                           v-model="searchWord.suppliers" @click.native.once="filterPOV('')" popperClass="good-selects">
                  <el-option :value="org.subordinateId" :key="org.subordinateId" :label="org.subordinateName"
                             v-for="org in orgList">
                    <div style="overflow: hidden">
                      <span class="pull-left" style="clear: right">{{org.subordinateName}}</span>
                    </div>
                    <div style="overflow: hidden">
                  <span class="select-other-info pull-left">
                    <span>系统代码</span> {{org.subordinateCode}}
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
            <el-col :span="10">
              <oms-form-row label="" :span="6">
                <perm label="sale-detail-form-export">
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
      <el-table :data="reportList" style="width: 100%;" class="header-list"
                :header-row-class-name="'headerClass'" v-loading="loadingData">
        <el-table-column prop="orderNo" label="货主订单号" width="160"></el-table-column>
        <el-table-column prop="createTime" label="业务日期" width="90"></el-table-column>
        <el-table-column prop="customerName" label="客户" width="150"></el-table-column>
        <el-table-column prop="orgName" label="保管账" width="150"></el-table-column>
        <el-table-column prop="orgGoodsName" label="货品名称" width="150"></el-table-column>
        <el-table-column prop="count" label="数量" width="80"></el-table-column>
        <el-table-column prop="price" label="单价" width="100"></el-table-column>
        <el-table-column prop="totalMoney" label="金额" width="100"></el-table-column>
        <el-table-column prop="batchNumber" label="批号" width="100"></el-table-column>
        <el-table-column prop="expirationDate" label="有效期至" width="90"></el-table-column>
        <el-table-column prop="arriveDate" label="送达日期" width="90"></el-table-column>
        <el-table-column prop="address" label="送货地址" width="150"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import { cerpAction } from '@/resources';
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
          createEndTime: ''
        },
        orgList: [],
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
        this.$store.commit('initPrint', {isPrinting: true, moduleId: '/report/sale'});
        this.$http.get('/erp-statement/sale-detail/export', {params}).then(res => {
          utils.download(res.data.path, '销售明细表');
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/sale'});
        }).catch(error => {
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/sale'});
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
        this.$http.get('/erp-statement/sale-detail', {params}).then(res => {
          this.reportList = res.data.map(m => {
            m.createTime = this.formatTime(m.createTime);
            m.expirationDate = this.formatTime(m.expirationDate);
            m.arriveDate = this.formatTime(m.arriveDate);
            m.price = `￥${m.price}`;
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
          createEndTime: ''
        };
        this.bizDateAry = '';
      },
      filterPOV: function (query) {
        let params = Object.assign({}, {
          keyWord: query
        });
        cerpAction.queryAllPov(params).then(res => {
          this.orgList = res.data.list;
        });
      },
      formatTime: function (date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      }
    }
  };
</script>
