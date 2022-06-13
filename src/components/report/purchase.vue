<style lang="scss" scoped>

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
            <el-col :span="8">
              <oms-form-row :span="5" label="上架时间">
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
              <oms-form-row :span="5" label="供货单位">
                <el-select v-model="searchWord.suppliers" :clearable="true" :remote-method="filterOrg" filterable placeholder="请输入名称搜索供货单位"
                           popperClass="good-selects" remote @click.native.once="filterOrg('')">
                  <el-option v-for="org in orgList" :key="org.id" :label="org.name" :value="org.id">
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
              <oms-form-row :span="6" label="货主订单号">
                <el-input v-model="searchWord.orderNo" placeholder="请输入货主订单号"></el-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="5" label="货主疫苗">
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
            <el-col :span="8">
              <oms-form-row :span="5" label="批号">
                <el-select v-model="searchWord.batchNumberId" :remoteMethod="filterBatchNumber" clearable filterable
                           placeholder="请输入批号名称搜索批号" remote
                           @click.native.once="filterBatchNumber('')">
                  <el-option v-for="item in batchNumberList" :key="item.id" :label="item.batchNumber"
                             :value="item.id"></el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="疫苗种类" style="height: 36px">
                <el-radio-group v-model="searchWord.orderGoodsType" size="small">
                  <el-radio-button label="0">免疫规划疫苗</el-radio-button>
                  <el-radio-button label="1">非免疫规划疫苗</el-radio-button>
                </el-radio-group>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="">
                <perm label="purchasing-detail-form-export">
                  <el-button :disabled="loadingData" type="primary" @click="search">
                    查询
                  </el-button>
                  <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
                  <el-button :disabled="isLoading" :plain="true" type="success" @click="exportFile">
                    导出Excel
                  </el-button>
                </perm>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table ref="reportTable" v-loading="loadingData" :data="reportChildList" :header-row-class-name="'headerClass'" :maxHeight="getHeight"
                :summary-method="getSummaries" border
                border class="header-list" show-summary>
        <el-table-column :sortable="true" label="订单编号" prop="orderNo"></el-table-column>
        <el-table-column :sortable="true" label="业务日期" prop="createTime"></el-table-column>
        <el-table-column :sortable="true" label="供应商" prop="suppliersName"></el-table-column>
        <el-table-column :sortable="true" label="保管帐" prop="orgName"></el-table-column>
        <el-table-column :sortable="true" label="疫苗名称" prop="orgGoodsName"></el-table-column>
        <el-table-column :sortable="true" label="数量" prop="count"></el-table-column>
        <el-table-column :sortable="true" label="进货单价" prop="price">
          <template slot-scope="scope">
            <span>￥{{scope.row.price ? scope.row.price : 0}}</span>
          </template>
        </el-table-column>
        <el-table-column :sortable="true" label="金额" prop="totalMoney">
          <template slot-scope="scope">
            <span>￥{{scope.row.totalMoney}}</span>
          </template>
        </el-table-column>
        <el-table-column :sortable="true" label="批号" prop="batchNumber"></el-table-column>
        <el-table-column :sortable="true" label="有效期至" prop="expirationDate"></el-table-column>
        <el-table-column :sortable="true" label="上架时间" prop="operateTime"></el-table-column>
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
        orgGoodsId: '',
        orderGoodsType: ''
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
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
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
        orgGoodsId: '',
        orderGoodsType: ''
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
