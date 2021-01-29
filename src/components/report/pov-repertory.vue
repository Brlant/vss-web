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
            <el-col :span="8">
              <oms-form-row :span="7" label="疫苗种类">
                <el-select v-model="searchWord.type" placeholder="请选择疫苗种类" type="text">
                  <el-option v-for="item in vaccineSignList" :key="item.key" :label="item.label"
                             :value="item.key"></el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="4" label="">
                <perm label="pov-stock-form-manager-export">
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
      <el-table ref="reportTable" v-loading="loadingData" :data="reportList" :header-row-class-name="'headerClass'"
                :maxHeight="getHeight"
                :row-class-name="formatRowClass" :summary-method="getSummaries" border
                class="header-list" show-summary @cell-mouse-enter="cellMouseEnter" @cell-mouse-leave="cellMouseLeave">
        <el-table-column label="疫苗名称" min-width="100" prop="orgGoodsName"></el-table-column>
        <el-table-column :sortable="true" label="批号" prop="batchNumber"></el-table-column>
        <el-table-column :sortable="true" label="效期" prop="expirationDate"></el-table-column>
        <el-table-column :sortable="true" label="期前库存" prop="restStockCount"></el-table-column>
        <el-table-column :sortable="true" label="进苗数量" prop="purchaseCount"></el-table-column>
        <el-table-column :sortable="true" label="使用数量" prop="injectionCount"></el-table-column>
        <el-table-column :sortable="true" label="期末库存" prop="endStockCount"></el-table-column>
        <el-table-column v-if="type === 2" :sortable="true" label="单价" prop="price">
          <template slot-scope="scope">
            <span>￥{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="type === 2" :sortable="true" label="期前金额" prop="restStockMoney">
          <template slot-scope="scope">
            <span>￥{{ scope.row.restStockMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="type === 2" :sortable="true" label="进苗金额" prop="purchaseMoney">
          <template slot-scope="scope">
            <span>￥{{ scope.row.purchaseMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="type === 2" :sortable="true" label="使用金额" prop="injectionMoney">
          <template slot-scope="scope">
            <span>￥{{ scope.row.injectionMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="type === 2" :sortable="true" label="期末金额" prop="endStockMoney">
          <template slot-scope="scope">
            <span>￥{{ scope.row.endStockMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column :sortable="true" label="退货数量" prop="returnCount">
          <template slot-scope="scope">
            <span>{{ scope.row.returnCount }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="type === 2" :sortable="true" label="退货金额" prop="returnMoney">
          <template slot-scope="scope">
            <span>￥{{ scope.row.returnMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column :sortable="true" label="报废数量" prop="scrapCount">
          <template slot-scope="scope">
            <span>{{ scope.row.scrapCount }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="type === 2" :sortable="true" label="报废金额" prop="scrapMoney">
          <template slot-scope="scope">
            <span>￥{{ scope.row.scrapMoney }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import utils from '@/tools/utils';
import validMixin from '@/mixins/vaildMixin';
import ReportMixin from '@/mixins/reportMixin';

export default {
  mixins: [validMixin, ReportMixin],
  data() {
    return {
      loadingData: false,
      reportList: [],
      showSearch: true,
      searchWord: {
        startTime: '',
        endTime: '',
        type: ''
      },
      bizDateAry: '',
      isLoading: false
    };
  },
  computed: {
    type() {
      return this.$route.meta.type;
    },
    vaccineSignList() {
      return this.$getDict('vaccineSign');
    },
    getHeight: function () {
      return parseInt(this.$store.state.bodyHeight, 10) - 70 + this.fixedHeight;
    }
  },
  watch: {
    type() {
      this.reportList = [];
      this.bizDateAry = '';
    }
  },
  methods: {
    isValid(item) {
      let a = this.$moment();
      let b = this.$moment(item.expirationDate);
      let days = b.diff(a, 'days');
      return a < b ? days > 90 ? 2 : 1 : 0;
    },
    formatRowClass(data) {
      if (this.isValid(data.row) === 1) {
        return 'effective-row';
      }
    },
    exportFile: function () {
      if (!this.bizDateAry || !this.bizDateAry.length) {
        this.$notify.info({
          message: '请选择业务日期'
        });
        return;
      }
      this.searchWord.startTime = this.$formatAryTime(this.bizDateAry, 0);
      this.searchWord.endTime = this.$formatAryTime(this.bizDateAry, 1);
      let params = Object.assign({}, this.searchWord);
      this.isLoading = true;
      this.$store.commit('initPrint', {
        isPrinting: true,
        moduleId: `/report/pov/${this.type === 1 ? 'one' : 'two'}/repertory`
      });
      this.$http.get('/erp-statement/pov-stock/export', {params}).then(res => {
        utils.download(res.data.path, '接种单位非免疫规划疫苗盘点表');
        this.isLoading = false;
        this.$store.commit('initPrint', {
          isPrinting: false,
          moduleId: `/report/pov/${this.type === 1 ? 'one' : 'two'}/repertory`
        });
      }).catch(error => {
        this.isLoading = false;
        this.$store.commit('initPrint', {
          isPrinting: false,
          moduleId: `/report/pov/${this.type === 1 ? 'one' : 'two'}/repertory`
        });
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
        });
      });
    },
    getSummaries: function (param) {
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
            if (i != null) {
              i = utils.formatNumber(i, 2);
            }
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
      this.searchWord.startTime = this.$formatAryTime(this.bizDateAry, 0);
      this.searchWord.endTime = this.$formatAryTime(this.bizDateAry, 1);
      let params = Object.assign({}, this.searchWord);
      this.loadingData = true;
      this.$http.get('/erp-statement/pov-stock', {params}).then(res => {
        res.data.forEach(i => {
          i.expirationDate = this.formatTime(i.expirationDate);
        });
        this.reportList = res.data;
        this.loadingData = false;
        this.setFixedHeight();
      });
    },
    resetSearchForm: function () {
      this.searchWord = {
        startTime: '',
        endTime: '',
        type: ''
      };
      this.bizDateAry = '';
    },
    formatTime: function (date) {
      return date ? this.$moment(date).format('YYYY-MM-DD') : '';
    }
  }
};
</script>
