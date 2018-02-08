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
            <el-col :span="8">
              <oms-form-row label="客户" :span="5">
                <el-select filterable remote placeholder="请输入名称搜索客户" :remote-method="filterPOV" :clearable="true"
                           v-model="searchWord.suppliers" @click.native.once="filterPOV('')" popperClass="good-selects">
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
            <el-col :span="8">
              <oms-form-row label="货主订单号" :span="6">
                <el-input v-model="searchWord.orderNo" placeholder="请输入货主订单号"></el-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="货主货品" :span="5">
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
            <el-col :span="8">
              <oms-form-row label="" :span="1">
                <perm label="sale-detail-form-export">
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
      <el-table :data="reportList" class="header-list" ref="reportTable"  :maxHeight="getHeight"  border
                :header-row-class-name="'headerClass'" v-loading="loadingData">
        <el-table-column prop="orderNo" label="货主订单号" :sortable="true" width="120"></el-table-column>
        <el-table-column prop="createTime" label="业务日期" :sortable="true" width="120"></el-table-column>
        <el-table-column prop="customerName" label="客户" :sortable="true" width="120"></el-table-column>
        <el-table-column prop="orgName" label="保管帐" :sortable="true" width="150"></el-table-column>
        <el-table-column prop="orgGoodsName" label="货品名称" :sortable="true" width="150"></el-table-column>
        <el-table-column prop="count" label="数量" :sortable="true" width="90"></el-table-column>
        <el-table-column prop="price" label="单价" :sortable="true" width="90"></el-table-column>
        <el-table-column prop="totalMoney" label="金额" :sortable="true" width="90"></el-table-column>
        <el-table-column prop="batchNumber" label="批号" :sortable="true" width="120"></el-table-column>
        <el-table-column prop="expirationDate" label="有效期至" :sortable="true" width="120"></el-table-column>
        <el-table-column prop="arriveDate" label="送达日期" :sortable="true" width="100"></el-table-column>
        <el-table-column prop="address" label="送货地址" :sortable="true" width="120"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import { BaseInfo, Vaccine } from '@/resources';
  import utils from '@/tools/utils';
  import ReportMixin from '@/mixins/reportMixin';

  export default {
    mixins: [ReportMixin],
    data () {
      return {
        loadingData: false,
        reportList: [],
        showSearch: true,
        searchWord: {
          suppliers: '',
          orderNo: '',
          createStartTime: '',
          createEndTime: '',
          batchNumberId: '',
          orgGoodsId: ''
        },
        orgList: [],
        orgGoods: [],
        batchNumberList: [],
        bizDateAry: '',
        isLoading: false
      };
    },
    computed: {
      getHeight: function () {
        return parseInt(this.$store.state.bodyHeight, 10) - 110 + this.fixedHeight;
      }
    },
    methods: {
      exportFile: function () {
        this.searchWord.createStartTime = this.formatTime(this.bizDateAry[0]);
        this.searchWord.createEndTime = this.formatTime(this.bizDateAry[1]);
        let params = Object.assign({}, this.searchWord);
        this.isLoading = true;
        this.$store.commit('initPrint', {isPrinting: true, moduleId: '/report/sale'});
        this.$http.get('/erp-statement/sale-detail/export', {params}).then(res => {
          utils.download(res.data.path, '销售明细表');
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/sale'});
        }).catch(error => {
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/sale'});
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },
      search: function () {// 搜索
        this.searchWord.createStartTime = this.formatTime(this.bizDateAry[0]);
        this.searchWord.createEndTime = this.formatTime(this.bizDateAry[1]);
        let params = Object.assign({}, this.searchWord);
        this.loadingData = true;
        this.$http.get('/erp-statement/sale-detail', {params}).then(res => {
          this.reportList = res.data.map(m => {
            m.createTime = this.formatTime(m.createTime);
            m.expirationDate = this.formatTime(m.expirationDate);
            m.arriveDate = this.formatTime(m.arriveDate);
            m.price = m.price ? `￥${m.price}` : '';
            m.totalMoney = `￥${m.totalMoney}`;
            return m;
          });
          this.loadingData = false;
          this.setFixedHeight();
        });
      },
      resetSearchForm: function () {
        this.searchWord = {
          suppliers: '',
          orderNo: '',
          createStartTime: '',
          createEndTime: '',
          batchNumberId: '',
          orgGoodsId: ''
        };
        this.bizDateAry = '';
        this.search();
      },
      filterPOV: function (query) {
        let orgId = this.$store.state.user.userCompanyAddress;
        if (!orgId) return;
        let params = {
          keyWord: query,
          relation: '0'
        };
        BaseInfo.queryOrgByValidReation(orgId, params).then(res => {
          this.orgList = res.data;
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
