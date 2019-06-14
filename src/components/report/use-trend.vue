<template>
  <div class="order-page">
    <div class="container">
      <div :class="{up:!showSearch}" class="opera-btn-group">
        <div class="opera-icon">
          <span @click="showSearch = !showSearch" class="pull-left switching-icon">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form class="advanced-query-form">
          <el-row :gutter="24">
            <el-col :span="8">
              <oms-form-row :span="4" label="时间">
                <el-col :span="24">
                  <el-date-picker
                    format="yyyy"
                    placeholder="请选择时间"
                    type="year"
                    v-model="year">
                  </el-date-picker>
                </el-col>
              </oms-form-row>
            </el-col>
            <el-col :span="10">
              <oms-form-row :span="2" label="">
                <el-button @click="Search" type="primary">查询</el-button>
                <perm label="vaccine-trend-export">
                  <el-button :disabled="isLoading" :plain="true" @click="exportFile" style="margin-left: 10px"
                             type="success">导出Excel
                  </el-button>
                </perm>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table :data="dataList" border class="header-list" v-loading="dataLoading">
        <el-table-column label="疫苗属性" prop="vaccineAttribute"></el-table-column>
        <el-table-column :sortable="true" align="center" label="1月份" prop="jan"></el-table-column>
        <el-table-column :sortable="true" align="center" label="2月份" prop="feb"></el-table-column>
        <el-table-column :sortable="true" align="center" label="3月份" prop="mar"></el-table-column>
        <el-table-column :sortable="true" align="center" label="4月份" prop="apr"></el-table-column>
        <el-table-column :sortable="true" align="center" label="5月份" prop="may"></el-table-column>
        <el-table-column :sortable="true" align="center" label="6月份" prop="jun"></el-table-column>
        <el-table-column :sortable="true" align="center" label="7月份" prop="jul"></el-table-column>
        <el-table-column :sortable="true" align="center" label="8月份" prop="aug"></el-table-column>
        <el-table-column :sortable="true" align="center" label="9月份" prop="sep"></el-table-column>
        <el-table-column :sortable="true" align="center" label="10月份" prop="oct"></el-table-column>
        <el-table-column :sortable="true" align="center" label="11月份" prop="nov"></el-table-column>
        <el-table-column :sortable="true" align="center" label="12月份" prop="dec"></el-table-column>
        <el-table-column :sortable="true" align="center" label="合计" prop="eachCount"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import utils from '@/tools/utils';
  import {Vaccine} from '@/resources';

  export default {
    name: 'use-trend',
    data() {
      return {
        showSearch: true,
        isLoading: false,
        dataLoading: false,
        dataList: [],
        year: ''
      };
    },
    methods: {
      Search: function () {// 搜索
        if (!this.year) {
          return this.$notify.info({
            message: '请选择时间'
          });
        }
        let params = Object.assign({}, {year: this.formatTime(this.year)});
        this.dataLoading = true;
        this.$http.get('erp-order/trend', {params}).then(res => {
          if (!res.data.erpVaccineTrendDtoList) {
            this.$notify({
              type: 'info',
              message: '没有相应数据'
            });
          }
          this.dataList = res.data.erpVaccineTrendDtoList;
          this.dataLoading = false;
        }).catch(error => {
          this.dataLoading = false;
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '查询失败'
          });
        });
      },
      exportFile: function () {// 导出Excel
        if (!this.year) {
          return this.$notify.info({
            message: '请选择时间'
          });
        }
        let params = Object.assign({}, {year: this.formatTime(this.year)});
        this.isLoading = true;
        this.$store.commit('initPrint', {isPrinting: true, moduleId: '/report/trend'});
        this.$http.get('/erp-order/trend-export', {params}).then(res => {
          if (res.data && res.data.path) {
            utils.download(res.data.path, '疫苗使用趋势表');
          }
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/trend'});
        }).catch(error => {
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/trend'});
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },
      formatTime: function (date) {
        return date ? this.$moment(date).format('YYYY') : '';
      }
    }
  };
</script>

<style scoped>

</style>
