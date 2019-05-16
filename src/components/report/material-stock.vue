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
                <el-button type="primary" @click="search" :disabled="isLoading">
                  查询
                </el-button>
                <perm label="materia-stock-export">
                  <el-button :plain="true" type="success" @click="exportFile" :disabled="isLoading"
                             style="margin-left: 10px">
                    导出Word
                  </el-button>
                </perm>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table :data="reportList" class="header-list" ref="reportTable" :maxHeight="getHeight" border
                :header-row-class-name="'headerClass'" v-loading="loadingData">
        <el-table-column prop="orgGoodsNo" label="商品代码">
        </el-table-column>
        <el-table-column prop="goodsName" label="疫苗名称/规格" width="300px">
          <template slot-scope="scope">
            {{ scope.row.no === '合计' ? '合计':(scope.row.specifications?scope.row.goodsName + scope.row.specifications
            :scope.row.goodsName)}}
          </template>
        </el-table-column>
        <el-table-column prop="measurementUnit" label="单位" width="60px"></el-table-column>
        <el-table-column prop="factoryName" label="生产厂家" width="200px"></el-table-column>
        <el-table-column prop="goodsPrice" label="最新含税进价" width="60"></el-table-column>
        <el-table-column prop="beforeStock" label="期初数量" :sortable="true"></el-table-column>
        <el-table-column prop="restStockMoney" label="期初金额" :sortable="true"></el-table-column>
        <el-table-column prop="procurementCount" label="采购数量" :sortable="true"></el-table-column>
        <el-table-column prop="procurementMoney" label="采购金额" :sortable="true"></el-table-column>
        <el-table-column prop="saleCount" label="销售数量" :sortable="true"></el-table-column>
        <el-table-column prop="saleMoney" label="销售金额" :sortable="true"></el-table-column>
        <el-table-column prop="endStock" label="期末数量" :sortable="true"></el-table-column>
        <el-table-column prop="stockMoney" label="期末金额" :sortable="true"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import ReportMixin from '@/mixins/reportMixin';
  import Perm from '../common/perm';

  export default {
    components: {Perm},
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
        this.$store.commit('initPrint', {isPrinting: true, moduleId: '/report/material-stock'});
        this.$http.get('/erp-statement/cdc/material-stock/export', {params}).then(res => {
          utils.download(res.data.url, '进销存盘点表');
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/material-stock'});
        }).catch(error => {
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/material-stock'});
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
        this.searchWord.createStartTime = this.$formatAryTime(this.bizDateAry, 0);
        this.searchWord.createEndTime = this.$formatAryTime(this.bizDateAry, 1);
        let params = Object.assign({}, this.searchWord);
        this.loadingData = true;
        this.$http.get('/erp-statement/cdc/material-stock', {params}).then(res => {
          if (res.data.length === 1) {
            this.reportList = [];
          } else {
            this.reportList = res.data;
          }
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
