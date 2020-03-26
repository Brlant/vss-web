<style lang="scss" scoped="">

  .order-list-item {
    cursor: pointer;
  }

  .header-list {
    overflow: hidden;
  }

  .opera-btn-group {
    margin-left: 0;
    margin-right: 0;
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
        <el-form class="advanced-query-form" onsubmit="return false">
          <el-row>
            <el-col :span="8">
              <oms-form-row label="货主" :span="5">
                <el-select multiple filterable remote placeholder="请输入名称搜索货主信息" :remote-method="queryOrg"
                           :clearable="true"
                           @click.native.once="queryOrg('')"
                           v-model="searchWord.orgIdList" popperClass="good-selects">
                  <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in orgList">
                    <slot :row="org">
                      <div style="overflow: hidden">
                        <span class="pull-left" style="clear: right">{{org.name}}</span>
                      </div>
                      <div style="overflow: hidden">
                          <span class="select-other-info pull-left">
                            <span>系统代码:</span>{{org.manufacturerCode}}
                          </span>
                      </div>
                    </slot>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="疫苗主档" :span="5">
                <el-select filterable remote placeholder="请输入名称搜索疫苗主档" :remote-method="filterVaccine"
                           :clearable="true" @change="goodsChange" @click.native.once="filterVaccine('')"
                           v-model="searchWord.goodsId" popper-class="good-selects">
                  <el-option :value="vaccine.goodsId" :key="vaccine.goodsId"
                             :label="vaccine.goodsName" v-for="vaccine in vaccineList">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{vaccine.goodsName}}</span>
                    </div>
                    <div style="overflow: hidden">
                        <span class="select-other-info pull-left">
                          生产单位:{{ vaccine.saleFirmName }}
                        </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="批号" :span="5">
                <el-select v-model="searchWord.batchNumberId" filterable clearable remote
                           :remoteMethod="filterBatchNumber" placeholder="请输入批号名称搜索批号">
                  <el-option v-for="item in batchNumberList" :value="item.id" :key="item.id"
                             :label="item.batchNumber">
                    {{ item.batchNumber }}
                    <!--<el-tag v-show="isNewBatch(item.createTime)" style="height: 20px">新</el-tag>-->
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8" class="clearfix">
              <oms-form-row label="生产单位" :span="5">
                <el-select filterable remote placeholder="请输入名称生产单位" :remote-method="filterFactory" :clearable="true"
                           v-model="searchWord.factoryId" popperClass="good-selects"
                           @click.native.once="filterFactory('')">
                  <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in factories">
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
              <oms-form-row label="近效期天数" :span="6">
                <oms-input type="number" v-model.number="searchWord.nearTermDays" :min="0" placeholder="请输入近效期天数">
                  <template slot="append">天</template>
                </oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="" :span="3">
                <el-button type="primary" native-type="submit" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
                <el-button :plain="true" type="success" v-show="batches.length" @click="exportFile">
                  导出Excel
                </el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table :data="batches" class="header-list store border-black" border @row-click="showDetail"
                :header-row-class-name="'headerClass'" v-loading="loadingData" :summary-method="getSummaries"
                :row-class-name="formatRowClass" @cell-mouse-enter="cellMouseEnter" @cell-mouse-leave="cellMouseLeave"
                show-summary :max-height="bodyHeight" style="width: 100%">
        <el-table-column prop="orgName" label="货主" min-width="160" :sortable="true"></el-table-column>
        <el-table-column prop="goodsName" label="货主疫苗名称" min-width="160" :sortable="true"></el-table-column>
        <el-table-column prop="platformGoodsName" label="疫苗主档名称" min-width="160" :sortable="true"></el-table-column>
        <el-table-column prop="factoryName" label="生产单位" min-width="160" :sortable="true"></el-table-column>
        <el-table-column prop="batchNumber" label="批号" :sortable="true" width="110"></el-table-column>
        <el-table-column label="业务库存" align="center">
          <el-table-column prop="availableCount" label="合格" :render-header="formatHeader" :sortable="true"
                           width="100">
            <template slot-scope="scope">
              <span>{{scope.row.availableCount}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="unqualifiedBizCount" label="不合格" :render-header="formatHeader" :sortable="true"
                           width="100">
            <template slot-scope="scope">
              <span>{{scope.row.unqualifiedBizCount}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="undeterminedCount" label="业务停销" :render-header="formatHeader" :sortable="true"
                           width="110">
            <template slot-scope="scope">
              <span>{{scope.row.undeterminedCount}}</span>
            </template>
          </el-table-column>
        </el-table-column>


        <el-table-column label="实物库存" align="center">
          <el-table-column prop="qualifiedCount" label="合格" :render-header="formatHeader" :sortable="true"
                           width="100">
            <template slot-scope="scope">
              <span>{{scope.row.qualifiedCount}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="unqualifiedCount" label="不合格" :render-header="formatHeader" :sortable="true"
                           width="100">
            <template slot-scope="scope">
              <span>{{scope.row.unqualifiedCount}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="transitCount" label="在途库存" :render-header="formatHeader" :sortable="true"
                           width="100">
            <template slot-scope="scope">
              <span>{{scope.row.transitCount}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalCount" label="库存总数" :render-header="formatHeader" :sortable="true"
                           width="100">
            <template slot-scope="scope">
              <span>{{scope.row.totalCount}}</span>
            </template>
          </el-table-column>
        </el-table-column>


        <el-table-column prop="expiryDate" label="有效期" :sortable="true" width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.expiryDate | date}}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
          :page-sizes="[10,20,50,100]"
          :total="pager.count" :pageSize="pager.pageSize" @current-change="getBatches"
          :current-page="pager.currentPage">
        </el-pagination>
      </div>
    </div>

    <page-right :show="showDetailPart" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}">
      <detail :currentItem="currentItem" @close="resetRightBox"></detail>
    </page-right>
  </div>
</template>
<script type="text/jsx">
  //  import order from '../../../tools/orderList';
  import {BaseInfo} from '@/resources';
  import detail from './detail.vue';
  import utils from '@/tools/utils';
  import validMixin from '@/mixins/vaildMixin';
  import qs from 'qs';

  export default {
    components: {detail},
    mixins: [validMixin],
    data() {
      return {
        loadingData: true,
        showSearch: true,
        showDetailPart: false,
        batches: [],
        filters: {
          orgIdList: [],
          factoryId: '',
          batchNumberId: '',
          goodsId: '',
          nearTermDays: ''
        },
        searchWord: {
          orgIdList: [],
          factoryId: '',
          batchNumberId: '',
          goodsId: '',
          nearTermDays: ''
        },
        factories: [], // 厂商列表
        orgList: [], // 货主列表,
        orgGoods: [],
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10
        },
        currentItemId: '',
        currentItem: {},
        totalInfo: {},
        statusTitle: [
          '已过期',
          '即将到期',
          '正常'
        ],
        statusType: [
          'danger',
          'warning',
          'primary'
        ],
        batchNumberList: [],
        fixedHeight: 0,
        vaccineList: []
      };
    },
    mounted() {
      this.getBatches(1);
      let showSearch = JSON.parse(window.localStorage.getItem(this.$route.path));
      if (typeof showSearch === 'boolean') {
        this.showSearch = showSearch;
      }
    },
    computed: {
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        height = height - 140;
        return height + this.fixedHeight + (this.showSearch ? 0 : 140);
      }
    },
    watch: {
      filters: {
        handler: function () {
          this.getBatches(1);
        },
        deep: true
      },
      showSearch(val) {
        window.localStorage.setItem(this.$route.path, val);
      }
    },
    methods: {
      queryOrg: function (query) {// 查询货主
        BaseInfo.query({keyWord: query}).then(res => {
          this.orgList = res.data.list;
        });
      },
      isValid(item) {
        let a = this.$moment();
        let b = this.$moment(item.expiryDate);
        let days = b.diff(a, 'days');
        return a < b ? days > 90 ? 2 : 1 : 0;
      },
      handleSizeChange(val) {
        this.pager.pageSize = val;
        window.localStorage.setItem('currentPageSize', val);
        this.getBatches(1);
      },
      getBatches(pageNo) { // 得到波次列表
        this.totalInfo = {};
        this.batches = [];
        this.pager.currentPage = pageNo;
        let params = Object.assign({
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filters);
        this.loadingData = true;
        this.$http({
          url: 'erp-stock/total',
          params,
          paramsSerializer(params) {
            return qs.stringify(params, {indices: false});
          }
        }).then(res => {
          res.data.list.forEach(i => {
            i.totalCount = i.undeterminedCount + i.qualifiedCount + i.transitCount + i.unqualifiedCount;
          });
          this.batches = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
          setTimeout(() => {
            this.fixedHeight = Math.abs(this.fixedHeight - 1);
          }, 100);
        });
      },
      formatHeader(h, col) {
        let property = col.column.property;
        let content = '';
        let title = '';
        switch (property) {
          case 'qualifiedCount': {
            content = '仓库内真实合格疫苗数量';
            title = '合格';
            break;
          }
          case 'unqualifiedCount': {
            content = '仓库内真实不合格疫苗数量';
            title = '不合格';
            break;
          }
          case 'transitCount': {
            content = '在运输中的疫苗数量';
            title = '在途库存';
            break;
          }
          case 'totalCount': {
            content = '用于计算资产';
            title = '库存总数';
            break;
          }
          case 'availableCount': {
            content = '用于出库订单的控制，表明可销售的数量';
            title = '合格';
            break;
          }
          case 'unqualifiedBizCount': {
            content = '用于不合格品退货订单控制';
            title = '不合格';
            break;
          }
          case 'undeterminedCount': {
            content = '仓库内质量状态待确定而不允许销售的库存数';
            title = '业务停销';
            break;
          }
        }
        return (
          <el-tooltip effect="dark" content={content} placement="top">
            <span>{title}</span>
          </el-tooltip>
        );
      },
      formatRowClass(data) {
        if (this.isValid(data.row) === 1) {
          return 'effective-row';
        }
        if (this.isValid(data.row) === 0) {
          return 'danger-row';
        }
      },
      exportFile: function () {
        let params = Object.assign({}, this.filters);
        this.$store.commit('initPrint', {isPrinting: true, moduleId: '/store/request'});
        this.$http({
          url: '/erp-stock/regulatory/export',
          params,
          paramsSerializer(params) {
            return qs.stringify(params, {indices: false});
          }
        }).then(res => {
          utils.download(res.data.path, '即时库存');
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/store/request'});
        }).catch(error => {
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/store/request'});
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },
      showDetail(item) {
        this.currentItemId = item.id;
        this.currentItem = item;
        this.showDetailPart = true;
      },
      resetRightBox() {
        this.showDetailPart = false;
      },
      searchInOrder: function () {// 搜索
        Object.assign(this.filters, this.searchWord);
      },
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '小计';
            return;
          }
          if (column.property !== 'availableCount' && column.property !== 'qualifiedCount' &&
            column.property !== 'transitCount' && column.property !== 'unqualifiedCount'
            && column.property !== 'undeterminedCount' && column.property !== 'totalCount' && column.property !== 'unqualifiedBizCount') {
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
      resetSearchForm: function () {// 重置表单
        let temp = {
          orgIdList: [],
          factoryId: '',
          batchNumberId: '',
          goodsId: '',
          nearTermDays: ''
        };
        Object.assign(this.searchWord, temp);
        Object.assign(this.filters, temp);
        this.batchNumberList = [];
      },
      filterFactory(query) { // 生产单位
        let orgId = this.$store.state.user.userCompanyAddress;
        if (!orgId) {
          return;
        }
        // 过滤来源单位
        let params = {
          keyWord: query,
          orgRelationTypeList: ['Manufacture', 'Supplier']
        };
        BaseInfo.queryByOrgRelationTypeList(params).then(res => {
          this.factories = res.data.list;
        });
      },
      goodsChange(val) {
        this.searchWord.batchNumberId = '';
        this.batchNumberList = [];
        this.filterBatchNumber();
      },
      filterBatchNumber(query) {
        if (!this.searchWord.goodsId) return;
        this.$http.get('/batch-number/pager', {
          params: {
            keyWord: query,
            goodsId: this.searchWord.goodsId
          }
        }).then(res => {
          this.batchNumberList = res.data.list;
        });
      },
      filterVaccine: function (query) {
        let params = Object.assign({}, {
          deleteFlag: false,
          keyWord: query
        });
        this.$http.get('erp-stock/regulatory/goods', {params}).then(res => {
          this.vaccineList = res.data.list;
        });
      },
      formatTime(date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      }
    }
  };
</script>
