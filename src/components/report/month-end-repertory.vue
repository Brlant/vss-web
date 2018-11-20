<style lang="scss" scoped="">

  .opera-btn-group {
    margin: 10px 0;
  }
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div class="opera-btn-group" :class="{up:!showSearch}">
        <div class="opera-icon">
          <span class="pull-left switching-icon" @click="showSearch = !showSearch">
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
                <perm label="month-stock-inventory-form-export">
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
      <el-table :data="reportList" class="header-list" ref="reportTable" :maxHeight="getHeight" border
                :header-row-class-name="'headerClass'" v-loading="loadingData">
        <el-table-column prop="no" label="序号" width="70" :sortable="true"></el-table-column>
        <el-table-column prop="goodsName" label="疫苗名称" width="160" :sortable="true"></el-table-column>
        <el-table-column prop="goodsPrice" label="采购单价" width="100" :sortable="true"></el-table-column>
        <el-table-column prop="salePrice" label="销售单价" width="100" :sortable="true"></el-table-column>
        <el-table-column prop="beforeStock" label="期前库存" width="100" :sortable="true"></el-table-column>
        <el-table-column prop="restStockMoney" label="期前金额" width="100" :sortable="true"></el-table-column>
        <el-table-column prop="procurementCount" label="采购数量" width="100" :sortable="true"></el-table-column>
        <el-table-column prop="procurementMoney" label="采购金额" width="100" :sortable="true"></el-table-column>
        <el-table-column prop="saleCount" label="销售数量" width="100" :sortable="true"></el-table-column>
        <el-table-column prop="saleMoney" label="销售金额" width="100" :sortable="true"></el-table-column>
        <el-table-column prop="saleReturnCount" label="退区数量" width="100" :sortable="true"></el-table-column>
        <el-table-column prop="saleReturnMoney" label="退区金额" width="100" :sortable="true"></el-table-column>
        <el-table-column prop="procurementReturnCount" label="退厂家数量" width="120" :sortable="true"></el-table-column>
        <el-table-column prop="procurementReturnMoney" label="退厂家金额" width="120" :sortable="true"></el-table-column>
        <el-table-column prop="scarpCount" label="报损数量" width="100" :sortable="true"></el-table-column>
        <el-table-column prop="endStock" label="期末库存" width="100" :sortable="true"></el-table-column>
        <el-table-column prop="stockMoney" label="库存金额" width="100" :sortable="true"></el-table-column>
      </el-table>
    </div>

  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import ReportMixin from '@/mixins/reportMixin';

  export default {
    mixins: [ReportMixin],
    data() {
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
        this.searchWord.createStartTime = this.formatTime(this.bizDateAry[0]);
        this.searchWord.createEndTime = this.formatTime(this.bizDateAry[1]);
        let params = Object.assign({}, this.searchWord);
        this.isLoading = true;
        this.$store.commit('initPrint', {isPrinting: true, moduleId: '/report/month/repertory'});
        this.$http.get('/erp-statement/cdc-stock/export', {params}).then(res => {
          utils.download(res.data.path, '进销存盘点表');
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/month/repertory'});
        }).catch(error => {
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/month/repertory'});
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
        this.$http.get('/erp-statement/cdc-stock', {params}).then(res => {
          res.data[res.data.length - 1].goodsName = '合计';
          this.reportList = res.data;
          this.loadingData = false;
          this.setFixedHeight();
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
