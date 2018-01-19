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
                <perm label="pov-stock-form-manager-export">
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
      <el-table :data="reportList" class="header-list" :summary-method="getSummaries" show-summary :row-class-name="formatRowClass"
                @cell-mouse-enter="cellMouseEnter"  @cell-mouse-leave="cellMouseLeave"
                ref="reportTable"  :maxHeight="getHeight()" :header-row-class-name="'headerClass'" v-loading="loadingData">
        <el-table-column prop="orgGoodsName" label="疫苗名称" width="160"></el-table-column>
        <el-table-column prop="batchNumber" label="批号" :sortable="true"></el-table-column>
        <el-table-column prop="expirationDate" label="效期" :sortable="true"></el-table-column>
        <el-table-column prop="restStockCount" label="期前库存" :sortable="true"></el-table-column>
        <el-table-column prop="purchaseCount" label="进苗数量" :sortable="true"></el-table-column>
        <el-table-column prop="injectionCount" label="使用数量" :sortable="true"></el-table-column>
        <el-table-column prop="endStockCount" label="期末库存" :sortable="true"></el-table-column>
        <el-table-column prop="price" label="单价" :sortable="true" v-if="type === 2">
          <template slot-scope="scope">
            <span>￥{{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="restStockMoney" label="期前金额" :sortable="true" v-if="type === 2">
          <template slot-scope="scope">
            <span>￥{{scope.row.restStockMoney}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="purchaseMoney" label="进苗金额" :sortable="true" v-if="type === 2">
          <template slot-scope="scope">
            <span>￥{{scope.row.purchaseMoney}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="injectionMoney" label="使用金额" :sortable="true" v-if="type === 2">
          <template slot-scope="scope">
            <span>￥{{scope.row.injectionMoney}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="endStockMoney" label="期末金额" :sortable="true" v-if="type === 2">
          <template slot-scope="scope">
            <span>￥{{scope.row.endStockMoney}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="returnCount" label="退货数量" :sortable="true">
          <template slot-scope="scope">
            <span>{{scope.row.returnCount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="returnMoney" label="退货金额" :sortable="true" v-if="type === 2">
          <template slot-scope="scope">
            <span>￥{{scope.row.returnMoney}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="scrapCount" label="报废数量" :sortable="true">
          <template slot-scope="scope">
            <span>{{scope.row.scrapCount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="scrapMoney" label="报废金额" :sortable="true" v-if="type === 2">
          <template slot-scope="scope">
            <span>￥{{scope.row.scrapMoney}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import { cerpAction } from '@/resources';
  import utils from '@/tools/utils';
  import validMixin from '@/mixins/vaildMixin';
  export default {
    mixins: [validMixin],
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
      type () {
        return this.$route.meta.type;
      }
    },
    watch: {
      type () {
        this.reportList = [];
        this.bizDateAry = '';
      }
    },
    methods: {
      isValid (item) {
        let a = this.$moment();
        let b = this.$moment(item.expirationDate);
        let days = b.diff(a, 'days');
        return a < b ? days > 90 ? 2 : 1 : 0;
      },
      formatRowClass (data) {
        if (this.isValid(data.row) === 1) {
          return 'effective-row';
        }
      },
      getHeight() {
        return utils.getCurrentHeight(this.$refs['reportTable']);
      },
      exportFile: function () {
        if (!this.bizDateAry || !this.bizDateAry.length) {
          this.$notify.info({
            message: '请选择业务日期'
          });
          return;
        }
        this.searchWord.startTime = this.formatTime(this.bizDateAry[0]);
        this.searchWord.endTime = this.formatTime(this.bizDateAry[1]);
        let params = Object.assign({}, this.searchWord, {type: this.type});
        this.isLoading = true;
        this.$store.commit('initPrint', {isPrinting: true, moduleId: `/report/pov/${this.type === 1 ? 'one' : 'two'}/repertory`});
        this.$http.get('/erp-statement/pov-stock/export', {params}).then(res => {
          utils.download(res.data.path, '接种单位二类疫苗盘点表');
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: `/report/pov/${this.type === 1 ? 'one' : 'two'}/repertory`});
        }).catch(error => {
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: `/report/pov/${this.type === 1 ? 'one' : 'two'}/repertory`});
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
          if (column.property === 'orgGoodsName' || column.property === 'batchNumber' ||
            column.property === 'expirationDate' || column.property === 'price') {
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
        if (this.type === 2) {
          sums.forEach((i, index) => {
            if (index > 7 && index !== 12 && index !== 14) {
              sums[index] = '￥' + i;
            }
          });
        }
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
        let params = Object.assign({}, this.searchWord, {type: this.type});
        this.loadingData = true;
        this.$http.get('/erp-statement/pov-stock', {params}).then(res => {
          res.data.forEach(i => {
            i.expirationDate = this.formatTime(i.expirationDate);
          });
          this.reportList = res.data;
          this.loadingData = false;
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
