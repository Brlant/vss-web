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
              <oms-form-row label="出入库类型" :span="5">
                <el-select v-model="searchWord.typeList" multiple filterable clearable placeholder="请选择">
                  <el-option v-for="(item, index) in typeList" :value="index" :key="index"
                             :label="item"></el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="出入库详细" :span="5">
                <el-select v-model="searchWord.bizTypeList" multiple filterable clearable placeholder="请选择">
                  <el-option v-for="(item, index) in bizTypeList" :value="index" :key="index"
                             :label="item"></el-option>
                </el-select>
              </oms-form-row>
            </el-col>
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
            <el-col :span="4" class="clearfix">
              <oms-form-row label="区县" :span="5">
                <oms-input type="text" v-model="searchWord.areaCode" placeholder="请输入区县"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="9">
              <oms-form-row label="关联单位" :span="5">
                <el-select filterable remote placeholder="请输入关联单位查询" :remote-method="filterRelation" :clearable="true"
                           v-model="searchWord.customerId" @click.native.once="filterRelation('')" popperClass="good-selects">
                  <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in orgList">
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
            <el-col :span="11">
              <oms-form-row label="供/收货单位名称" :span="6">
                <el-select filterable remote placeholder="请输入供/收货单位名称查询" :remote-method="filterProvide" :clearable="true"
                           v-model="searchWord.factoryId" @click.native.once="filterProvide('')" popperClass="good-selects">
                  <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in provideList">
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
            <el-col :span="10">
              <oms-form-row label="产品名称" :span="4">
                <el-select filterable remote placeholder="请输入产品名称" :remote-method="filterOrgGoods"
                           :clearable="true" multiple
                           v-model="searchWord.orgGoodsIdList" popper-class="good-selects"
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
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="批号" :span="5">
                <el-select v-model="searchWord.batchNumberId" filterable clearable remote
                           :remoteMethod="filterBatchNumber" placeholder="请输入批号名称搜索批号"
                           @click.native.once="filterBatchNumber('')">
                  <el-option v-for="item in batchNumberList" :value="item.id" :key="item.id"
                             :label="item.batchNumber"></el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row label="" :span="1">
                <perm label="first-vaccine-logistics-export">
                  <el-button type="primary" @click="search" :disabled="loadingData">
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
      <el-table :data="reportList" class="header-list" :summary-method="getSummaries" show-summary border
                :header-row-class-name="'headerClass'" v-loading="loadingData" ref="reportTable"  :maxHeight="getHeight()">
        <el-table-column prop="type" label="出入库类型" :sortable="true" width="120"></el-table-column>
        <el-table-column prop="bizType" label="出入库详细" :sortable="true" width="120"></el-table-column>
        <el-table-column prop="date" label="日期" :sortable="true" width="100"></el-table-column>
        <el-table-column prop="area" label="区县" :sortable="true" width="80"></el-table-column>
        <el-table-column prop="customerCode" label="关联单位" :sortable="true" width="100"></el-table-column>
        <el-table-column prop="factoryName" label="供/收货单位名称" :sortable="true" width="180"></el-table-column>
        <el-table-column prop="orgGoodsName" label="产品名称" :sortable="true" width="200"></el-table-column>
        <el-table-column prop="batchNumber" label="批号" :sortable="true" width="90"></el-table-column>
        <el-table-column prop="expirationDate" label="有效期至" :sortable="true" width="120"></el-table-column>
        <el-table-column prop="measurementUnit" label="计量单位" :sortable="true" width="100"></el-table-column>
        <el-table-column prop="count" label="数量" :sortable="true" width="80"></el-table-column>
        <el-table-column prop="goodsStatus" label="合格/不合格" :sortable="true" width="120"></el-table-column>
        <el-table-column prop="remark" label="订单备注项" :sortable="true" width="120"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import { BaseInfo, Vaccine } from '@/resources';
  import utils from '@/tools/utils';
  import qs from 'qs';
  export default {
    data () {
      return {
        loadingData: false,
        reportList: [],
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
          batchNumberId: ''
        },
        orgList: [],
        provideList: [],
        orgGoods: [],
        batchNumberList: [],
        bizDateAry: '',
        isLoading: false,
        typeList: ['入库', '出库'],
        bizTypeList: ['采购订单', '销售退货', '盘盈入库', '调拨入库', '销售出库', '采购退货', '盘亏出库', '调拨出库'],
        goodsStatusList: ['不合格', '合格']
      };
    },
    methods: {
      getHeight() {
        return utils.getCurrentHeight(this.$refs['reportTable']);
      },
      exportFile: function () {
        this.searchWord.createStartTime = this.formatTime(this.bizDateAry[0]);
        this.searchWord.createEndTime = this.formatTime(this.bizDateAry[1]);
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
            message: error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },
      search: function () {// 搜索
        this.searchWord.startTime = this.formatTime(this.bizDateAry[0]);
        this.searchWord.endTime = this.formatTime(this.bizDateAry[1]);
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
            m.bizType = this.bizTypeList[m.bizType];
            m.date = this.formatTime(m.date);
            m.expirationDate = this.formatTime(m.expirationDate);
            m.goodsStatus = this.goodsStatusList[m.goodsStatus];
            return m;
          });
          this.loadingData = false;
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
          batchNumberId: ''
        };
        this.bizDateAry = '';
        this.search();
      },
      filterRelation: function (query) {
        let orgId = this.$store.state.user.userCompanyAddress;
        if (!orgId) return;
        let params = {
          keyWord: query
        };
        BaseInfo.queryOrgByValidReation(orgId, params).then(res => {
          this.orgList = res.data;
        });
      },
      filterProvide: function (query) {
        let orgId = this.$store.state.user.userCompanyAddress;
        if (!orgId) return;
        let params = {
          keyWord: query
        };
        BaseInfo.queryOrgByValidReation(orgId, params).then(res => {
          this.provideList = res.data;
        });
      },
      filterBatchNumber (query) {
        this.$http.get('erp-stock/batch-number', {params: {keyWord: query}}).then(res => {
          this.batchNumberList = res.data.list;
        });
      },
      filterOrgGoods (query) {
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
      formatTime: function (date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      }
    }
  };
</script>
