<style lang="scss" scoped>
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
            <el-col :span="7">
              <oms-form-row :span="6" label="出入库类型">
                <el-select v-model="searchWord.typeList" clearable filterable multiple placeholder="请选择">
                  <el-option v-for="(item, index) in typeList" :key="index" :label="item"
                             :value="index"></el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="9">
              <oms-form-row :span="6" label="出入库详细">
                <el-select v-model="searchWord.bizTypeList" clearable filterable multiple placeholder="请选择">
                  <el-option v-for="(item, index) in bizTypeList" :key="index" :label="item.label"
                             :value="item.key"></el-option>
                </el-select>
              </oms-form-row>
            </el-col>
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
          </el-row>
          <el-row>
            <el-col :span="9">
              <oms-form-row :span="6" label="入库/配送日期">
                <el-col :span="24">
                  <el-date-picker
                    v-model="distributionDate"
                    format="yyyy-MM-dd"
                    placeholder="请选择" type="daterange">
                  </el-date-picker>
                </el-col>
              </oms-form-row>
            </el-col>
            <el-col :span="7">
              <oms-form-row :span="6" label="区县">
                <oms-input v-model="searchWord.areaCode" placeholder="请输入区县" type="text"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="供/收货单位">
                <el-select v-model="searchWord.customerId" :clearable="true" :loading="selectLoading" :remote-method="filterRelation"
                           filterable placeholder="请输入供/收货单位名称查询"
                           popperClass="good-selects" remote
                           @click.native.once="filterRelation('')">
                  <el-option v-for="org in orgList" :key="org.id" :label="org.name" :value="org.id">
                    <div style="overflow: hidden">
                      <span class="pull-left" style="clear: right">{{org.name}}</span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left">
                        <span>系统代码:</span>{{org.manufacturerCode}}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <oms-form-row :span="4" label="产品名称">
                <el-select v-model="searchWord.orgGoodsIdList" :clearable="true" :remote-method="filterOrgGoods" filterable
                           multiple placeholder="请输入产品名称"
                           popper-class="good-selects" remote
                           @click.native.once="filterOrgGoods('')">
                  <el-option v-for="item in orgGoods" :key="item.orgGoodsDto.id"
                             :label="item.orgGoodsDto.name"
                             :value="item.orgGoodsDto.id">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{item.orgGoodsDto.name}}</span>
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
            <el-col :span="7">
              <oms-form-row :span="6" label="批号">
                <el-select v-model="searchWord.batchNumberId" :remoteMethod="filterBatchNumber" clearable filterable
                           placeholder="请输入批号名称搜索批号" remote
                           @click.native.once="filterBatchNumber('')">
                  <el-option v-for="item in batchNumberList" :key="item.id" :label="item.batchNumber"
                             :value="item.id"></el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="7">
              <oms-form-row :span="2" label="">
                <perm label="first-vaccine-logistics-export">
                  <el-button :disabled="loadingData" type="primary" @click="search">
                    查询
                  </el-button>
                  <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
                  <el-button :plain="true" type="success" @click="exportFile">
                    导出Excel
                  </el-button>
                </perm>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table ref="reportTable" v-loading="loadingData" :data="reportChildList" :header-row-class-name="'headerClass'" :maxHeight="getHeight"
                :summary-method="getSummaries" border class="header-list" show-summary>
        <el-table-column :sortable="true" label="出入库类型" min-width="120" prop="type"></el-table-column>
        <el-table-column :sortable="true" label="出入库详细" min-width="120" prop="bizType"></el-table-column>
        <el-table-column :sortable="true" label="业务日期" min-width="100" prop="date"></el-table-column>
        <el-table-column :sortable="true" label="入库/配送日期" min-width="150" prop="distributionDate"></el-table-column>
        <el-table-column :sortable="true" label="区县" prop="area" width="100"></el-table-column>
        <el-table-column :sortable="true" label="关联单位" min-width="100" prop="customerCode"></el-table-column>
        <el-table-column :sortable="true" label="供/收货单位名称" min-width="180" prop="factoryName"></el-table-column>
        <el-table-column :sortable="true" label="供/收货单位地址" min-width="150" prop="address"></el-table-column>
        <el-table-column :sortable="true" label="产品名称" min-width="100" prop="orgGoodsName"></el-table-column>
        <el-table-column :sortable="true" label="批号" prop="batchNumber" width="90"></el-table-column>
        <el-table-column :sortable="true" label="有效期至" min-width="120" prop="expirationDate"></el-table-column>
        <el-table-column :sortable="true" label="计量单位" prop="measurementUnit" width="100"></el-table-column>
        <el-table-column :sortable="true" label="数量" prop="count" width="80"></el-table-column>
        <el-table-column :sortable="true" label="单价" prop="price" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.price">￥{{ scope.row.price | formatMoney }}</span>
            <span v-if="!scope.row.price">0</span>
          </template>
        </el-table-column>
        <el-table-column :sortable="true" label="合格/不合格" prop="goodsStatus" width="120"></el-table-column>
        <el-table-column :sortable="true" label="订单备注项" prop="remark" width="120"></el-table-column>
      </el-table>
      <div v-show="reportChildList.length" class="text-center">
        <el-pagination
          :current-page="pager.currentPage" :page-sizes="[10,20,50,100]"
          :pageSize="pager.pageSize"
          :total="pager.count" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import {BaseInfo, Vaccine} from '@/resources';
import utils from '@/tools/utils';
import qs from 'qs';
import ReportMixin from '@/mixins/reportMixin';

export default {
  mixins: [ReportMixin],
  data() {
    return {
      loadingData: false,
      selectLoading: false,
      reportList: [],
      reportChildList: [],
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10
      },
      showSearch: true,
      searchWord: {
        typeList: [],
        bizTypeList: [],
        orgGoodsIdList: [],
        areaCode: '',
        factoryId: '',
        customerId: '',
        startTime: '',
        endTime: '',
        batchNumberId: '',
        distributionStartTime: '',
        distributionEndTime: ''
      },
      orgList: [],
      provideList: [],
      orgGoods: [],
      batchNumberList: [],
      bizDateAry: '',
      distributionDate: '',
      isLoading: false,
      typeList: ['入库', '出库'],
      goodsStatusList: ['不合格', '合格']
    };
  },
  computed: {
    getHeight: function () {
      return parseInt(this.$store.state.bodyHeight, 10) - 210 + this.fixedHeight + (this.showSearch ? 0 : 210);
    },
    bizTypeList() {
      let inType = this.$getDict('bizInType') || [];
      let outType = this.$getDict('bizOutType') || [];
      return [].concat(inType, outType);
    }
  },
  methods: {
    exportFile: function () {
      this.searchWord.createStartTime = this.$formatAryTime(this.bizDateAry, 0);
      this.searchWord.createEndTime = this.$formatAryTime(this.bizDateAry, 1);
      let params = Object.assign({}, this.searchWord);
      this.isLoading = true;
      this.$store.commit('initPrint', {isPrinting: true, moduleId: '/report/logistics'});
      this.$http({
        url: '/erp-statement/first-vaccine/export',
        params,
        paramsSerializer(params) {
          return qs.stringify(params, {indices: false});
        }
      }).then(res => {
        utils.download(res.data.path, '免费疫苗物流数据库');
        this.isLoading = false;
        this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/logistics'});
      }).catch(error => {
        this.isLoading = false;
        this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/logistics'});
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
        });
      });
    },
    search: function () {// 搜索
      // if (!this.isSelectCondition()) {
      //   return this.$notify.info({message: '请选择查询条件'});
      // }
      this.searchWord.startTime = this.$formatAryTime(this.bizDateAry, 0);
      this.searchWord.endTime = this.$formatAryTime(this.bizDateAry, 1);
      this.searchWord.distributionStartTime = this.$formatAryTime(this.distributionDate, 0, 'YYYY-MM-DD 00:00:00');
      this.searchWord.distributionEndTime = this.$formatAryTime(this.distributionDate, 1, 'YYYY-MM-DD 23:59:59');
      let params = Object.assign({}, this.searchWord);
      this.loadingData = true;
      this.$http({
        url: 'erp-statement/first-vaccine',
        params,
        paramsSerializer(params) {
          return qs.stringify(params, {indices: false});
        }
      }).then(res => {
        this.reportList = res.data.map(m => {
          m.type = this.typeList[m.type];
          m.bizType = this.showOrderType(m.bizType);
          m.date = this.formatTime(m.date);
          m.expirationDate = this.formatTime(m.expirationDate);
          m.distributionDate = this.formatTime(m.distributionDate);
          m.goodsStatus = this.goodsStatusList[m.goodsStatus];
          return m;
        });
        this.pager.count = this.reportList.length;
        this.getCurrentList(1);
        this.loadingData = false;
        this.setFixedHeight();
      });
    },
    handleSizeChange(val) {
      this.pager.pageSize = val;
      window.localStorage.setItem('currentPageSize', val);
      this.getCurrentList(1);
    },
    handleCurrentChange(val) {
      this.getCurrentList(val);
    },
    getCurrentList(pageNo) {
      this.loadingData = true;
      this.pager.currentPage = pageNo;
      const {pager} = this;
      let start = (pageNo - 1) * pager.pageSize;
      let end = pageNo * pager.pageSize;
      this.reportChildList = this.reportList.slice(start, end > pager.count ? pager.count : end);
      setTimeout(() => {
        this.loadingData = false;
      }, 300);
    },
    // isSelectCondition () {
    //   let isSelected = false;
    //   let s = this.searchWord;
    //   if (this.bizDateAry && this.bizDateAry.length) return true;
    //   Object.keys(s).forEach(k => {
    //     Array.isArray(s[k]) ? s[k].length && (isSelected = true) : s[k] && (isSelected = true);
    //   });
    //   return isSelected;
    // },
    showOrderType: function (item) {
      let type = this.bizTypeList.find(f => f.key === item);
      return type && type.label || '';
    },
    getSummaries(param) {
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
    resetSearchForm: function () {
      this.searchWord = {
        typeList: [],
        bizTypeList: [],
        orgGoodsIdList: [],
        areaCode: '',
        factoryId: '',
        customerId: '',
        startTime: '',
        endTime: '',
        batchNumberId: '',
        distributionStartTime: '',
        distributionEndTime: ''
      };
      this.bizDateAry = '';
      this.distributionDate = '';
      this.reportList = [];
      this.search();
    },
    filterRelation: function (query) {
      let orgId = this.$store.state.user.userCompanyAddress;
      if (!orgId) return;
      let params = {
        keyWord: query
      };
      this.selectLoading = true;
      BaseInfo.queryOrgByValidReation(orgId, params).then(res => {
        this.orgList = res.data;
        this.selectLoading = false;
      });
    },
    filterProvide: function (query) {
      let orgId = this.$store.state.user.userCompanyAddress;
      if (!orgId) return;
      let params = {
        keyWord: query
      };
      this.selectLoading = true;
      BaseInfo.queryOrgByValidReation(orgId, params).then(res => {
        this.provideList = res.data;
        this.selectLoading = false;
      });
    },
    filterBatchNumber(query) {
      this.$http.get('erp-stock/all/batch-number', {params: {keyWord: query}}).then(res => {
        this.batchNumberList = res.data.list;
      });
    },
    filterOrgGoods(query) {
      let params = Object.assign({}, {
        keyWord: query
      });
      Vaccine.query(params).then(res => {
        this.orgGoods = res.data.list;
      });
    },
    formatTime: function (date) {
      return date ? this.$moment(date).format('YYYY-MM-DD') : '';
    }
  }
};
</script>
