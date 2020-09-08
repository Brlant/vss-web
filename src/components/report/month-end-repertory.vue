<style lang="scss" scoped="">

.opera-btn-group {
  margin: 10px 0;
}
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div :class="{up:!showSearch}" class="opera-btn-group">
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
              <oms-form-row :span="5" label="业务日期">
                <el-col :span="24">
                  <el-date-picker
                    v-model="bizDateAry"
                    format="yyyy-MM-dd"
                    placeholder="请选择" type="daterange">
                  </el-date-picker>
                </el-col>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row :span="2" label="">
                <perm label="month-stock-inventory-form-export">
                  <el-button :disabled="isLoading" type="primary" @click="search">
                    查询
                  </el-button>
                  <el-button :disabled="isLoading" :plain="true" type="success" @click="exportFile">
                    导出Excel
                  </el-button>
                </perm>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table ref="reportTable" v-loading="loadingData" :data="reportList" :header-row-class-name="'headerClass'" :maxHeight="getHeight"
                border class="header-list">
        <el-table-column :sortable="true" label="序号" prop="no" width="70"></el-table-column>
        <el-table-column :sortable="true" label="疫苗名称" prop="goodsName" width="160"></el-table-column>
        <el-table-column :sortable="true" label="采购单价" prop="goodsPrice" width="100"></el-table-column>
        <el-table-column :sortable="true" label="销售单价" prop="salePrice" width="100"></el-table-column>
        <el-table-column :sortable="true" label="期前库存" prop="beforeStock" width="100"></el-table-column>
        <el-table-column :sortable="true" label="期前金额" prop="restStockMoney" width="100"></el-table-column>
        <el-table-column :sortable="true" label="采购数量" prop="procurementCount" width="100"></el-table-column>
        <el-table-column :sortable="true" label="采购金额" prop="procurementMoney" width="100"></el-table-column>
        <el-table-column :sortable="true" label="销售数量" prop="saleCount" width="100"></el-table-column>
        <el-table-column :sortable="true" label="销售金额" prop="saleMoney" width="100"></el-table-column>
        <el-table-column :sortable="true" label="退区数量" prop="saleReturnCount" width="100"></el-table-column>
        <el-table-column :sortable="true" label="退区金额" prop="saleReturnMoney" width="100"></el-table-column>
        <el-table-column :sortable="true" label="退厂家数量" prop="procurementReturnCount" width="120"></el-table-column>
        <el-table-column :sortable="true" label="退厂家金额" prop="procurementReturnMoney" width="120"></el-table-column>
        <el-table-column :sortable="true" label="报损数量" prop="scarpCount" width="100"></el-table-column>
        <el-table-column :sortable="true" label="期末库存" prop="endStock" width="100"></el-table-column>
        <el-table-column :sortable="true" label="库存金额" prop="stockMoney" width="100"></el-table-column>
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
      this.searchWord.createStartTime = this.$formatAryTime(this.bizDateAry, 0);
      this.searchWord.createEndTime = this.$formatAryTime(this.bizDateAry, 1);
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
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
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
      this.searchWord.createStartTime = this.$formatAryTime(this.bizDateAry, 0);
      this.searchWord.createEndTime = this.$formatAryTime(this.bizDateAry, 1);
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
