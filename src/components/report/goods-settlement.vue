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
            <el-col :span="12">
              <oms-form-row label="货主货品" :span="3">
                <el-select filterable remote placeholder="请输入名称搜索货主货品" :remote-method="filterOrgGoods"
                           :clearable="true"
                           v-model="searchWord.orgGoodsId" popper-class="good-selects"
                           @click.native.once="filterOrgGoods('')">
                  <el-option v-for="item in orgGoods" :key="item.orgGoodsDto.id"
                             :label="item.orgGoodsDto.name"
                             :value="item.orgGoodsDto.id">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{item.orgGoodsDto.name}}</span>
                    </div>
                    <div style="overflow: hidden">
                        <span class="select-other-info pull-left"><span
                          v-show="item.orgGoodsDto.goodsNo">货品编号:</span>{{item.orgGoodsDto.goodsNo}}
                        </span>
                      <span class="select-other-info pull-left"><span
                        v-show="item.orgGoodsDto.salesFirmName">供货厂商:</span>{{ item.orgGoodsDto.salesFirmName }}
                        </span>
                      <span class="select-other-info pull-left" v-if="item.orgGoodsDto.goodsDto">
                          <span v-show="item.orgGoodsDto.goodsDto.factoryName">生产厂商:</span>{{ item.orgGoodsDto.goodsDto.factoryName }}
                </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="4">
              <oms-form-row label="年份" :span="8">
                <el-date-picker v-model="searchWord.year" type="year" value-format="yyyy" placeholder="选择年份">
                </el-date-picker>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="" :span="1">
                <perm label="purchasing-detail-form-export">
                  <el-button type="primary" @click="search" :disabled="loadingData">
                    查询
                  </el-button>
                  <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
                  <el-button :plain="true" type="success" @click="exportFile" :disabled="isLoading">
                    导出Excel
                  </el-button>
                </perm>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table :data="reportChildList" class="header-list" border ref="reportTable" border
                :header-row-class-name="'headerClass'" v-loading="loadingData" :maxHeight="getHeight">
        <el-table-column prop="month" label="月份" :sortable="true"></el-table-column>
        <el-table-column prop="lastMonthCount" label="上月结存" :sortable="true"></el-table-column>
        <el-table-column prop="receiveCount" label="领苗总数" :sortable="true"></el-table-column>
        <el-table-column prop="purchaseReturnCount" label="退出总数" :sortable="true"></el-table-column>
        <el-table-column prop="saleCount" label="发苗总数" :sortable="true"></el-table-column>
        <el-table-column prop="saleReturnCount" label="退入总数" :sortable="true"></el-table-column>
        <el-table-column prop="scrapCount" label="报废数" :sortable="true"></el-table-column>
        <el-table-column prop="monthCount" label="当月结存" :sortable="true"></el-table-column>
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
            message: '请选择货主货品！'
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
            message: error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },
      search: function () {// 搜索
        if (!this.searchWord.orgGoodsId) {
          this.$notify.warning({
            duration: 2000,
            message: '请选择货主货品！'
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
        this.search();
      },
      filterOrgGoods(query) {
        let orgId = this.$store.state.user.userCompanyAddress;
        let params = Object.assign({}, {
          keyWord: query,
          orgId: orgId
        });
        let level = this.$store.state.orgLevel;
        let api = level === 1 ? 'queryFirstVaccine' : 'querySecondVaccine';
        Vaccine[api](params).then(res => {
          this.orgGoods = res.data.list;
        });
      },
      formatTime: function (date, str = 'YYYY-MM-DD') {
        return date ? this.$moment(date).format(str) : '';
      }
    }
  };
</script>
