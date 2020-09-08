<style lang="scss" scoped="">

.loading-ht {
  height: 300px;
}

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
            <el-col :span="12">
              <oms-form-row :span="3" label="货主疫苗">
                <el-select v-model="searchWord.orgGoodsId" :clearable="true" :remote-method="filterOrgGoods" filterable
                           placeholder="请输入名称或编号搜索货主疫苗"
                           popper-class="good-selects" remote
                           @click.native.once="filterOrgGoods('')">
                  <el-option v-for="item in orgGoods" :key="item.orgGoodsDto.id"
                             :label="item.orgGoodsDto.name"
                             :value="item.orgGoodsDto.id">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{item.orgGoodsDto.name}}<el-tag v-show="!item.orgGoodsDto.status" style="float: none"
                                                                               type="danger">停用</el-tag></span>
                    </div>
                    <div style="overflow: hidden">
                        <span class="select-other-info pull-left"><span
                          v-show="item.orgGoodsDto.goodsNo">货主货品编号:</span>{{item.orgGoodsDto.goodsNo}}
                        </span>
                      <span class="select-other-info pull-left"><span
                        v-show="item.orgGoodsDto.salesFirmName">供货单位:</span>{{ item.orgGoodsDto.salesFirmName }}
                        </span>
                      <span v-if="item.orgGoodsDto.goodsDto" class="select-other-info pull-left">
                          <span v-show="item.orgGoodsDto.goodsDto.factoryName">生产单位:</span>{{ item.orgGoodsDto.goodsDto.factoryName }}
                </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="4">
              <oms-form-row :span="8" label="年份">
                <el-date-picker v-model="searchWord.year" placeholder="选择年份" type="year" value-format="yyyy">
                </el-date-picker>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="1" label="">
                <el-button :disabled="loadingData" type="primary" @click="search">
                  查询
                </el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
                <perm label="vaccine-month-settlement-manager-export">
                  <el-button :disabled="isLoading" :plain="true" style="margin-left: 10px" type="success"
                             @click="exportFile">
                    导出Excel
                  </el-button>
                </perm>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table ref="reportTable" v-loading="loadingData" :data="reportChildList" :header-row-class-name="'headerClass'" :maxHeight="getHeight"
                border border class="header-list">
        <el-table-column :sortable="true" label="月份" prop="month"></el-table-column>
        <el-table-column :sortable="true" label="上月结存" prop="lastMonthCount"></el-table-column>
        <el-table-column :sortable="true" label="领苗总数" prop="receiveCount"></el-table-column>
        <el-table-column :sortable="true" label="退出总数" prop="purchaseReturnCount"></el-table-column>
        <el-table-column :sortable="true" label="发苗总数" prop="saleCount"></el-table-column>
        <el-table-column :sortable="true" label="退入总数" prop="saleReturnCount"></el-table-column>
        <el-table-column :sortable="true" label="报废数" prop="scrapCount"></el-table-column>
        <el-table-column :sortable="true" label="当月结存" prop="monthCount"></el-table-column>
      </el-table>
    </div>

  </div>
</template>
<script>
import {Vaccine} from '@/resources';
import utils from '@/tools/utils';
import ReportMixin from '@/mixins/reportMixin';

export default {
  mixins: [ReportMixin],
  data() {
    return {
      loadingData: false,
      reportList: [],
      reportChildList: [],
      showSearch: true,
      searchWord: {
        year: '',
        orgGoodsId: ''
      },
      orgList: [],
      orgGoods: [],
      batchNumberList: [],
      isLoading: false
    };
  },
  computed: {
    getHeight: function () {
      return parseInt(this.$store.state.bodyHeight, 10) - 140 + this.fixedHeight + (this.showSearch ? 0 : 140);
    }
  },
  methods: {
    exportFile: function () {
      if (!this.searchWord.orgGoodsId) {
        this.$notify.warning({
          duration: 2000,
          message: '请选择货主疫苗！'
        });
        return;
      }
      if (!this.searchWord.year) {
        this.$notify.warning({
          duration: 2000,
          message: '请输入年份！'
        });
        return;
      }
      let params = Object.assign({}, this.searchWord);
      this.isLoading = true;
      this.$store.commit('initPrint', {isPrinting: true, moduleId: '/report/goods-settlement'});
      this.$http.get('/erp-statement/year/goods-settlement/export', {params}).then(res => {
        utils.download(res.data.path, '疫苗当月结算表');
        this.isLoading = false;
        this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/goods-settlement'});
      }).catch(error => {
        this.isLoading = false;
        this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/goods-settlement'});
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
        });
      });
    },
    search: function () {// 搜索
      if (!this.searchWord.orgGoodsId) {
        this.$notify.warning({
          duration: 2000,
          message: '请选择货主疫苗！'
        });
        return;
      }
      if (!this.searchWord.year) {
        this.$notify.warning({
          duration: 2000,
          message: '请输入年份！'
        });
        return;
      }
      let params = Object.assign({}, this.searchWord);
      this.loadingData = true;
      this.$http.get('/erp-statement/year/goods-settlement', {params}).then(res => {
        this.reportChildList = res.data.list;
        this.loadingData = false;
        this.setFixedHeight();
      });
    },
    resetSearchForm: function () {
      this.searchWord = {
        year: '',
        orgGoodsId: ''
      };
      this.reportChildList = [];
    },
    filterOrgGoods(query) {
      let params = Object.assign({}, {
        keyWord: query
      });
      Vaccine.query(params).then(res => {
        this.orgGoods = res.data.list;
      });
    },
    formatTime: function (date, str = 'YYYY-MM-DD') {
      return date ? this.$moment(date).format(str) : '';
    }
  }
};
</script>
