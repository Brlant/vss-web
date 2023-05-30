<style lang="scss" scoped>

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
      <div :class="{up:!showSearch}" class="opera-btn-group">
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
              <oms-form-row :span="5" label="货主疫苗">
                <el-select v-model="searchWord.orgGoodsId" :clearable="true" :remote-method="filterOrgGoods" filterable
                           placeholder="请输入名称或编号搜索货主疫苗"
                           popper-class="good-selects" remote
                           @change="orgGoodsChange" @click.native.once="filterOrgGoods('')">
                  <el-option v-for="org in orgGoods" :key="org.id" :label="org.goodsName"
                             :value="org.id">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{org.goodsName}}<el-tag v-show="!org.status" style="float: none"
                                                                       type="danger">停用</el-tag></span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left"><span
                        v-show="org.goodsNo">货主货品编号:</span>{{org.goodsNo}}
                      </span>
                      <span class="select-other-info pull-left"><span
                        v-show="org.saleFirmName">供货单位:</span>{{ org.saleFirmName }}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="5" label="批号">
                <el-select v-model="searchWord.batchNumberId" :remoteMethod="filterBatchNumber" clearable filterable
                           placeholder="请输入批号名称搜索批号" remote>
                  <el-option v-for="item in batchNumberList" :key="item.id" :label="item.batchNumber"
                             :value="item.id">
                    {{ item.batchNumber }}
                    <!--<el-tag v-show="isNewBatch(item.createTime)" style="height: 20px">新</el-tag>-->
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="5" label="生产单位">
                <el-select v-model="searchWord.factoryId" :clearable="true" :remote-method="filterFactory" filterable placeholder="请输入名称生产单位"
                           popperClass="good-selects" remote
                           @click.native.once="filterFactory('')">
                  <el-option v-for="org in factories" :key="org.id" :label="org.name" :value="org.id">
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
              <oms-form-row :span="6" label="近效期天数">
                <oms-input v-model.number="searchWord.nearTermDays" :min="0" placeholder="请输入近效期天数" type="number">
                  <template slot="append">天</template>
                </oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="疫苗种类" style="height: 36px">
                <el-radio-group v-model="searchWord.vaccineType" size="small">
                  <el-radio-button label="1">免疫规划疫苗</el-radio-button>
                  <el-radio-button label="2">非免疫规划疫苗</el-radio-button>
                  <el-radio-button label="0">非疫苗</el-radio-button>
                </el-radio-group>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="3" label="" style="height: 36px">
                <el-switch
                  v-model="searchWord.showFlag"
                  active-text="显示历史"
                  inactive-text="不显示历史">
                </el-switch>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="3" label="">
                <el-button native-type="submit" type="primary" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
                <el-button :plain="true" type="success" @click="exportFile">
                  导出Excel
                </el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table v-loading="loadingData" :data="batches" :header-row-class-name="'headerClass'" :max-height="bodyHeight"
                :row-class-name="formatRowClass" :summary-method="getSummaries" border
                class="header-list store border-black" show-summary style="width: 100%"
                @row-click="showDetail" @cell-mouse-enter="cellMouseEnter" @cell-mouse-leave="cellMouseLeave">
        <el-table-column :sortable="true" label="货主疫苗名称" min-width="200" prop="goodsName">
          <template slot-scope="scope">
            <el-tooltip :content="`orgGoodsId[${scope.row.orgGoodsId}]`" class="item" effect="dark" placement="right">
              <span>{{scope.row.goodsName}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column :sortable="true" label="货主货品编号" min-width="120" prop="orgGoodsCode">
          <template slot-scope="scope"><span>{{scope.row.orgGoodsCode}}</span></template>
        </el-table-column>
        <el-table-column :sortable="true" label="疫苗种类" min-width="120" prop="factoryName">
          <template slot-scope="scope">
            <dict :dict-key="scope.row.vaccineType" dict-group="vaccineSign"></dict>
          </template>
        </el-table-column>
        <el-table-column :sortable="true" label="疫苗主档通用名称" min-width="200" prop="platformGoodsName">
        </el-table-column>
        <el-table-column :sortable="true" label="规格" min-width="120" prop="specification">
        </el-table-column>
        <el-table-column :sortable="true" label="生产单位" min-width="160" prop="factoryName"></el-table-column>
        <el-table-column :sortable="true" label="批号" prop="batchNumber" width="110"></el-table-column>

        <el-table-column align="center" label="业务库存">
          <el-table-column v-if="isBizServing" :render-header="formatHeader" :sortable="true" label="人份剂次"
                           prop="qualifiedBizServings" width="100">
            <template slot-scope="scope">
              <span>{{scope.row.qualifiedBizServings}}</span>
            </template>
          </el-table-column>
          <el-table-column :render-header="formatHeader" :sortable="true" label="合格" prop="availableCount"
                           width="100">
            <template slot-scope="scope">
              <span>{{scope.row.availableCount}}</span>
            </template>
          </el-table-column>
          <el-table-column :render-header="formatHeader" :sortable="true" label="不合格" prop="unqualifiedBizCount"
                           width="100">
            <template slot-scope="scope">
              <span>{{scope.row.unqualifiedBizCount}}</span>
            </template>
          </el-table-column>
          <el-table-column :render-header="formatHeader" :sortable="true" label="业务停销" prop="undeterminedCount"
                           width="110">
            <template slot-scope="scope">
              <span>{{scope.row.undeterminedCount}}</span>
            </template>
          </el-table-column>
        </el-table-column>


        <el-table-column align="center" label="实物库存">
          <el-table-column v-if="isBizServing" :render-header="formatHeader" :sortable="true" label="人份剂次"
                           prop="qualifiedActualServings" width="100">
            <template slot-scope="scope">
              <span>{{scope.row.qualifiedActualServings}}</span>
            </template>
          </el-table-column>
          <el-table-column :render-header="formatHeader" :sortable="true" label="合格" prop="qualifiedCount"
                           width="100">
            <template slot-scope="scope">
              <span>{{scope.row.qualifiedCount}}</span>
            </template>
          </el-table-column>
          <el-table-column :render-header="formatHeader" :sortable="true" label="不合格" prop="unqualifiedCount"
                           width="100">
            <template slot-scope="scope">
              <span>{{scope.row.unqualifiedCount}}</span>
            </template>
          </el-table-column>
          <el-table-column :render-header="formatHeader" :sortable="true" label="在途库存" prop="transitCount"
                           width="100">
            <template slot-scope="scope">
              <span>{{scope.row.transitCount}}</span>
            </template>
          </el-table-column>
          <el-table-column :render-header="formatHeader" :sortable="true" label="库存总数" prop="totalCount"
                           width="100">
            <template slot-scope="scope">
              <span>{{scope.row.totalCount}}</span>
            </template>
          </el-table-column>
        </el-table-column>


        <el-table-column :sortable="true" label="有效期" prop="expiryDate" width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.expiryDate | date}}</span>
          </template>
        </el-table-column>
      </el-table>

      <!--<div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">-->
      <!--<el-pagination-->
      <!--layout="prev, pager, next"-->
      <!--:total="pager.count" :pageSize="pager.pageSize" @current-change="getBatches"-->
      <!--:current-page="pager.currentPage">-->
      <!--</el-pagination>-->
      <!--</div>-->
    </div>

    <page-right :css="{'width':'1000px','padding':0}" :show="showDetailPart" @right-close="resetRightBox">
<!--      <detail :currentItem="currentItem" @close="resetRightBox"></detail>-->
      <detail :currentItem="currentItem" :perm="isBizServing?'cerp-stock-log-export':'cerp-stock-bizServing-log-export'"
              @close="resetRightBox"></detail>
    </page-right>
  </div>
</template>
<script type="text/jsx">
//  import order from '../../../tools/orderList';
import {BaseInfo, erpStock, http} from '@/resources';
import detail from './detailList.vue';
import utils from '@/tools/utils';
import validMixin from '@/mixins/vaildMixin';

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
        factoryId: '',
        batchNumberId: '',
        orgGoodsId: '',
        nearTermDays: '',
        showFlag: false,
        vaccineType: ''
      },
      searchWord: {
        factoryId: '',
        batchNumberId: '',
        orgGoodsId: '',
        nearTermDays: '',
        showFlag: false,
        vaccineType: ''
      },
      factories: [], // 厂商列表
      orgList: [], // 货主列表,
      orgGoods: [],
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: 20
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
      fixedHeight: 0
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
      height = height - 110;
      return height + this.fixedHeight + (this.showSearch ? 0 : 150);
    },
    isBizServing() {
      return this.$route.meta.isBizServing;
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
    },
    isBizServing() {
      this.resetSearchForm();
      this.getBatches(1);
    }
  },
  methods: {
    isValid(item) {
      let a = this.$moment();
      let b = this.$moment(item.expiryDate);
      let days = b.diff(a, 'days');
      return a < b ? days > 90 ? 2 : 1 : 0;
    },
    getBatches() { // 得到波次列表
      this.totalInfo = {};
      this.batches = [];
      let params = Object.assign({}, this.filters);
      this.loadingData = true;
      erpStock.query(params).then(res => {
        res.data.forEach(i => {
          i.totalCount = i.undeterminedCount + i.qualifiedCount + i.transitCount + i.unqualifiedCount;
        });
        this.batches = res.data;
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
        case 'qualifiedActualServings': {
          content = '合格库存x人份';
          title = '人份剂次';
          break;
        }
        case 'qualifiedBizServings': {
          content = '合格库存x人份';
          title = '人份剂次';
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
      let params = Object.assign({}, this.filters, this.searchWord);
      this.$store.commit('initPrint', {isPrinting: true, moduleId: '/store/request'});
      this.$http.get('/erp-stock/export', {params}).then(res => {
        utils.download(res.data.path, '即时库存查询');
        this.$store.commit('initPrint', {isPrinting: false, moduleId: '/store/request'});
      }).catch(error => {
        this.$store.commit('initPrint', {isPrinting: false, moduleId: '/store/request'});
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
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
          sums[index] = '合计';
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
        factoryId: '',
        batchNumberId: '',
        orgGoodsId: '',
        nearTermDays: '',
        showFlag: false,
        vaccineType: ''
      };
      Object.assign(this.searchWord, temp);
      Object.assign(this.filters, temp);
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
    filterOrgGoods(query) {
      let orgId = this.$store.state.user.userCompanyAddress;
      let params = Object.assign({}, {
        deleteFlag: false,
        orgId: orgId,
        keyWord: query
      });
      http.get('/erp-stock/goods', {params}).then(res => {
        this.orgGoods = res.data.list;
      });
    },
    orgGoodsChange(val) {
      this.searchWord.batchNumberId = '';
      this.batchNumberList = [];
      this.filterBatchNumber();
    },
    filterBatchNumber(query) {
      if (!this.searchWord.orgGoodsId) return;

      let goodsId = '';
      this.orgGoods.forEach(i => {
        if (i.id === this.searchWord.orgGoodsId) {
          goodsId = i.goodsId;
        }
      });
      if (!goodsId) return;
      this.$http.get('/batch-number/pager', {
        params: {
          keyWord: query,
          goodsId
        }
      }).then(res => {
        this.batchNumberList = res.data.list;
      });
    },
    formatTime(date) {
      return date ? this.$moment(date).format('YYYY-MM-DD') : '';
    }
  }
};
</script>
