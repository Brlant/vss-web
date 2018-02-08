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
                <perm label="first-vaccine-distribution-export">
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
      <el-table :data="reportList" class="header-list" :summary-method="getSummaries" show-summary border
                :header-row-class-name="'headerClass'" v-loading="loadingData" ref="reportTable"  :maxHeight="getHeight">
        <el-table-column prop="orgGoodsName" label="疫苗名称"  :sortable="true"></el-table-column>
        <el-table-column prop="count" label="配送数量" :sortable="true"  width="200"></el-table-column>
        <el-table-column prop="measurementUnit" label="基本单位" width="160" :sortable="true"></el-table-column>
      </el-table>
    </div>

  </div>
</template>
<script>
  import { cerpAction } from '@/resources';
  import utils from '@/tools/utils';
  import ReportMixin from '@/mixins/reportMixin';
  export default {
    mixins: [ReportMixin],
    data () {
      return {
        loadingData: false,
        reportList: [],
        showSearch: true,
        searchWord: {
          startTime: '',
          endTime: ''
        },
        bizDateAry: '',
        isLoading: false
      };
    },
    computed: {
      getHeight: function () {
        return parseInt(this.$store.state.bodyHeight, 10) - 70 + this.fixedHeight;
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
        this.searchWord.startTime = this.formatTime(this.bizDateAry[0]);
        this.searchWord.endTime = this.formatTime(this.bizDateAry[1]);
        let params = Object.assign({}, this.searchWord);
        this.isLoading = true;
        this.$store.commit('initPrint', {isPrinting: true, moduleId: '/report/allotation'});
        this.$http.get('/erp-statement/first-vaccine-distribution/export', {params}).then(res => {
          utils.download(res.data.path, '出货货品统计表');
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/allotation'});
        }).catch(error => {
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/allotation'});
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },
      getSummaries (param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (column.property !== 'count') {
            sums[index] = '';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          } else {
            sums[index] = '';
          }
        });

        return sums;
      },
      search: function () {// 搜索
        if (!this.bizDateAry || !this.bizDateAry.length) {
          this.$notify.info({
            message: '请选择业务日期'
          });
          return;
        }
        this.searchWord.startTime = this.formatTime(this.bizDateAry[0]);
        this.searchWord.endTime = this.formatTime(this.bizDateAry[1]);
        let params = Object.assign({}, this.searchWord);
        this.loadingData = true;
        this.$http.get('/erp-statement/first-vaccine-distribution', {params}).then(res => {
          this.reportList = res.data;
          this.loadingData = false;
          this.setFixedHeight();
        });
      },
      resetSearchForm: function () {
        this.searchWord = {
          startTime: '',
          endTime: ''
        };
        this.bizDateAry = '';
      },
      formatTime: function (date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      }
    }
  };
</script>
