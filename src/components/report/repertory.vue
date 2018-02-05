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
            <el-col :span="6">
              <oms-form-row label="" :span="2">
                <perm label="inventory-form-export">
                  <el-button type="primary" @click="search" :disabled="isLoading">
                    查询
                  </el-button>
                  <el-button :plain="true" type="success" @click="exportFile" :disabled="isLoading">
                    导出Excel
                  </el-button>
                </perm>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table :data="reportList" class="header-list" ref="reportTable"  :height="getHeight" border
                :header-row-class-name="'headerClass'" v-loading="loadingData">
        <el-table-column prop="goodsName" label="疫苗名称" width="160" :sortable="true"></el-table-column>
        <el-table-column prop="restStockCount" label="期前库存" :sortable="true"></el-table-column>
        <el-table-column prop="purchaseCount" label="进苗数量" :sortable="true"></el-table-column>
        <el-table-column prop="saleCount" label="发苗数量" :sortable="true"></el-table-column>
        <el-table-column prop="saleReturnCount" label="销退数量" :sortable="true"></el-table-column>
        <el-table-column prop="purchaseReturnCount" label="购退数量" :sortable="true"></el-table-column>
        <el-table-column prop="scarpCount" label="报损数量" :sortable="true"></el-table-column>
        <el-table-column prop="endStockCount" label="期末库存" :sortable="true"></el-table-column>
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
          createStartTime: '',
          createEndTime: ''
        },
        bizDateAry: '',
        isLoading: false
      };
    },
    computed: {
      getHeight: function () {
        return parseInt(this.$store.state.bodyHeight, 10) - 70;
      }
    },
    methods: {
      exportFile: function () {
        if (!this.bizDateAry || !this.bizDateAry.length) {
          this.$notify.info({
            message: '请选择业务日期'
          });
          return;
        }
        this.searchWord.createStartTime = this.formatTime(this.bizDateAry[0]);
        this.searchWord.createEndTime = this.formatTime(this.bizDateAry[1]);
        let params = Object.assign({}, this.searchWord);
        this.isLoading = true;
        this.$store.commit('initPrint', {isPrinting: true, moduleId: '/report/repertory'});
        this.$http.get('/erp-statement/stock-detail/export', {params}).then(res => {
          utils.download(res.data.path, '进销存盘点表');
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/repertory'});
        }).catch(error => {
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/repertory'});
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },
      search: function () {// 搜索
        if (!this.bizDateAry || !this.bizDateAry.length) {
          this.$notify.info({
            message: '请选择业务日期'
          });
          return;
        }
        this.searchWord.createStartTime = this.formatTime(this.bizDateAry[0]);
        this.searchWord.createEndTime = this.formatTime(this.bizDateAry[1]);
        let params = Object.assign({}, this.searchWord);
        this.loadingData = true;
        this.$http.get('/erp-statement/stock-detail', {params}).then(res => {
          this.reportList = res.data;
          this.loadingData = false;
        });
      },
      resetSearchForm: function () {
        this.searchWord = {
          createStartTime: '',
          createEndTime: ''
        };
        this.bizDateAry = '';
      },
      formatTime: function (date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      }
    }
  };
</script>
