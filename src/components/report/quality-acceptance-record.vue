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
          <el-row>
            <el-col :span="8">
              <oms-form-row :span="5" label="业务日期">
                <el-col :span="24">
                  <el-date-picker
                    placeholder="选择日期"
                    type="date"
                    v-model="time"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-col>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row :span="2" label="">
                <el-button :disabled="loadingData" @click="search" type="primary">
                  查询
                </el-button>
                <perm label="vaccine-quality-check-record-export">
                  <el-button :disabled="isLoading" :plain="true" @click="exportFile" style="margin-left: 10px"
                             type="success">
                    {{isLoading? '正在导出': '导出Word'}}
                  </el-button>
                </perm>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table :data="reportList" :header-row-class-name="'headerClass'" :maxHeight="getHeight" border
                class="header-list"
                ref="reportTable" v-loading="loadingData">
        <el-table-column label="供货单位" min-width="100" prop="counterparty" width="260px"></el-table-column>
        <el-table-column label="疫苗名称" min-width="100" prop="goodsName" width="300px"></el-table-column>
        <el-table-column label="批号" prop="batchNumber"></el-table-column>
        <el-table-column :sortable="true" label="数量" prop="count" width="70px"></el-table-column>
        <el-table-column label="温度记录" prop="purchaseCount"></el-table-column>
        <el-table-column label="批签发" prop="batchReleaseNumber"></el-table-column>
        <el-table-column label="批准文号" prop="approveNumber" width="200px"></el-table-column>
        <el-table-column label="质量状况" prop="temperatureFlag" width="100px"></el-table-column>
        <el-table-column label="验收结论" prop="temperatureFlag" width="100px"></el-table-column>
        <el-table-column label="验收人" prop="checkerName" width="80px"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import utils from '@/tools/utils';
  import ReportMixin from '@/mixins/reportMixin';

  export default {
    name: 'quality-acceptance-record',
    mixins: [ReportMixin],
    data() {
      return {
        loadingData: false,
        reportList: [],
        showSearch: true,
        time: '',
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
        if (!this.time) {
          this.$notify.info({
            message: '请选择业务日期'
          });
          return;
        }
        this.isLoading = true;
        this.$store.commit('initPrint', {isPrinting: true, moduleId: '/report/repertory'});
        this.$http.get('erp-export-record/export?time=' + this.time).then(res => {
          if (res.data.url) {
            utils.download(res.data.url, '质量验收记录表');
          } else {
            this.$notify({
              title: '导出错误',
              type: 'info',
              message: '该条件下没有相关数据'
            });
          }
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/quality-acceptance'});
        }).catch(error => {
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/quality-acceptance'});
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },
      search: function () {// 搜索
        if (!this.time) {
          this.$notify.info({
            message: '请选择业务日期'
          });
          return;
        }
        this.loadingData = true;
        this.$http.get('/erp-export-record/query?time=' + this.time).then(res => {
          this.reportList = res.data;
          if (this.reportList.length === 0) {
            this.$notify({
              title: '提示',
              type: 'info',
              message: '没有查询到相关数据'
            });
          }
          this.loadingData = false;
          this.setFixedHeight();
        }).catch(error => {
          this.loadingData = false;
          this.reportList = [];
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '查询失败'
          });
        });
      },
      formatTime: function (date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      }
    }
  };
</script>

<style scoped>

</style>
