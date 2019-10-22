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
            <el-col :span="8">
              <oms-form-row label="上架时间" :span="5">
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
              <oms-form-row label="供货单位" :span="5">
                <el-select filterable remote placeholder="请输入名称搜索供货单位" :remote-method="filterOrg" :clearable="true"
                           v-model="searchWord.suppliers" popperClass="good-selects" @click.native.once="filterOrg('')">
                  <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in orgList">
                    <div style="overflow: hidden">
                      <span class="pull-left" style="clear: right">{{org.name}}</span>
                      <span class="pull-right" style="color: #999">
                     <dict :dict-group="'orgRelation'" :dict-key="org.relationList[0]"></dict>
                    </span>
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
              <oms-form-row label="货主疫苗" :span="5">
                <el-select filterable remote placeholder="请输入名称或编号搜索货主疫苗" :remote-method="filterOrgGoods"
                           :clearable="true"
                           v-model="searchWord.orgGoodsId" popper-class="good-selects"
                           @click.native.once="filterOrgGoods('')">
                  <el-option v-for="item in orgGoods" :key="item.orgGoodsDto.id"
                             :label="item.orgGoodsDto.name"
                             :value="item.orgGoodsDto.id">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{item.orgGoodsDto.name}}<el-tag style="float: none" type="danger"
                                                                               v-show="!item.orgGoodsDto.status">停用</el-tag></span>
                    </div>
                    <div style="overflow: hidden">
                        <span class="select-other-info pull-left"><span
                          v-show="item.orgGoodsDto.goodsNo">疫苗编号:</span>{{item.orgGoodsDto.goodsNo}}
                        </span>
                      <span class="select-other-info pull-left"><span
                        v-show="item.orgGoodsDto.salesFirmName">供货单位:</span>{{ item.orgGoodsDto.salesFirmName }}
                        </span>
                      <span class="select-other-info pull-left" v-if="item.orgGoodsDto.goodsDto">
                          <span v-show="item.orgGoodsDto.goodsDto.factoryName">生产厂商:</span>{{ item.orgGoodsDto.goodsDto.factoryName }}
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
                :summary-method="getSummaries" show-summary
                :header-row-class-name="'headerClass'" v-loading="loadingData" :maxHeight="getHeight">
        <el-table-column prop="orderNo" label="订单编号" :sortable="true"></el-table-column>
        <el-table-column prop="createTime" label="业务日期" :sortable="true"></el-table-column>
        <el-table-column prop="suppliersName" label="供应商" :sortable="true"></el-table-column>
        <el-table-column prop="orgName" label="保管帐" :sortable="true"></el-table-column>
        <el-table-column prop="orgGoodsName" label="疫苗名称" :sortable="true"></el-table-column>
        <el-table-column prop="count" label="数量" :sortable="true"></el-table-column>
        <el-table-column prop="price" label="进货单价" :sortable="true">
          <template slot-scope="scope">
            <span>￥{{scope.row.price ? scope.row.price : 0}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalMoney" label="金额" :sortable="true">
          <template slot-scope="scope">
            <span>￥{{scope.row.totalMoney}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="batchNumber" label="批号" :sortable="true"></el-table-column>
        <el-table-column prop="expirationDate" label="有效期至" :sortable="true"></el-table-column>
        <el-table-column prop="operateTime" label="上架时间" :sortable="true"></el-table-column>
      </el-table>
      <div class="text-center" v-show="reportChildList.length">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="pager.count" :page-sizes="[10,20,50,100]" :pageSize="pager.pageSize"
          :current-page="pager.currentPage">
        </el-pagination>
      </div>
    </div>

  </div>
</template>
<script>
  import {BaseInfo, Vaccine} from '@/resources';
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
        isLoading: false,
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10
        }
      };
    },
    computed: {
      getHeight: function () {
        return parseInt(this.$store.state.bodyHeight, 10) - 140 + this.fixedHeight + (this.showSearch ? 0 : 140);
      }
    },
    methods: {
      exportFile: function () {
        this.searchWord.createStartTime = this.$formatAryTime(this.bizDateAry, 0);
        this.searchWord.createEndTime = this.$formatAryTime(this.bizDateAry, 1);
        let params = Object.assign({}, this.searchWord);
        this.isLoading = true;
        this.$store.commit('initPrint', {isPrinting: true, moduleId: '/report/purchase'});
        this.$http.get('/erp-statement/purchase-detail/export', {params}).then(res => {
          utils.download(res.data.path, '采购明细表');
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/purchase'});
        }).catch(error => {
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/purchase'});
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },
      search: function () {// 搜索
        this.searchWord.createStartTime = this.$formatAryTime(this.bizDateAry, 0);
        this.searchWord.createEndTime = this.$formatAryTime(this.bizDateAry, 1);
        let params = Object.assign({}, this.searchWord);
        this.loadingData = true;
        this.$http.get('/erp-statement/purchase-detail', {params}).then(res => {
          this.reportList = res.data.map(m => {
            m.createTime = this.formatTime(m.createTime);
            m.expirationDate = this.formatTime(m.expirationDate);
            m.operateTime = this.formatTime(m.operateTime, 'YYYY-MM-DD HH:mm');
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
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (column.property !== 'count' && column.property !== 'totalMoney') {
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
        sums.forEach((i, index) => {
          if (index === 7) {
            sums[index] = '￥' + i;
          }
        });
        return sums;
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
      filterOrg: function (query) {
        let orgId = this.$store.state.user.userCompanyAddress;
        if (!orgId) return;
        let params = {
          keyWord: query,
          relation: '1'
        };
        BaseInfo.queryOrgByValidReation(orgId, params).then(res => {
          this.orgList = res.data;
        });
      },
      filterBatchNumber(query) {
        this.$http.get('erp-stock/batch-number', {params: {keyWord: query}}).then(res => {
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
      formatTime: function (date, str = 'YYYY-MM-DD') {
        return date ? this.$moment(date).format(str) : '';
      }
    }
  };
</script>
