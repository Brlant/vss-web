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

    .title {
      color: red;
    }
  }

  .is-flex {
    display: flex;
    align-items: center;
  }

  .adjust-const-stock-detail {

  }
</style>
<style lang="scss">
  .adjust-const-stock-detail {
    h3 {
      background: #fff;
      margin: 50px 0 0;
      padding: 5px;
      text-align: center;
    }

    .el-table__row {
      cursor: auto;
    }
  }
</style>
<template>
  <div class="order-page">
    <div class="container">
      <el-alert
        title="请选择疫苗和批号输入调整部分库存数，调整库存数必须是散件倍数，如果是正数则增加库存，如果是负数则减少库存。"
        type="warning">
      </el-alert>
      <div class="opera-btn-group" :class="{up:!showSearch}">
        <div class="opera-icon">
          <span>
            <i class="el-icon-t-adjust"></i>
          </span>
        </div>
        <el-form class="advanced-query-form" onsubmit="return false">
          <el-row>
            <el-col :span="12">
              <oms-form-row label="货主疫苗" :span="4" :isRequire="true">
                <el-select filterable remote placeholder="请输入名称或编号搜索货主疫苗"
                           :remote-method="filterOrgGoods"
                           :clearable="true"
                           v-model="searchWord.orgGoodsId" popper-class="good-selects"
                           @click.native.once="filterOrgGoods('')" @change="orgGoodsChange">
                  <el-option :value="org.id" :key="org.id" :label="org.goodsName"
                             v-for="org in orgGoods">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{org.goodsName}}</span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left"><span
                        v-show="org.goodsNo">疫苗编号:</span>{{org.goodsNo}}
                      </span>
                      <span class="select-other-info pull-left"><span
                        v-show="org.saleFirmName">供货单位:</span>{{ org.saleFirmName }}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="12">
              <oms-form-row label="批号" :span="5" :isRequire="true">
                <el-select v-model="searchWord.batchNumberId" filterable clearable remote @change="batchNumberChange"
                           :remoteMethod="filterBatchNumber" placeholder="请输入批号名称搜索批号">
                  <el-option v-for="item in batchNumberList" :value="item.id" :key="item.id"
                             :label="item.batchNumber">
                    {{ item.batchNumber }}
                    <!--<el-tag v-show="isNewBatch(item.createTime)" style="height: 20px">新</el-tag>-->
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
          </el-row>
          <el-row class="is-flex">
            <el-col :span="12">
              <oms-form-row label="仓库" :span="4">
                <el-select v-model="searchWord.warehouseId" filterable clearable
                           @change="warehouseChange"
                           placeholder="请选择仓库">
                  <el-option v-for="item in warehouses" :value="item.id" :key="item.id"
                             :label="item.name">
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="12">
              <el-col :span="12" v-show="searchWord.orgGoodsId">
                <oms-form-row class="is-flex" label="最小包装规格:" :span="10">
                  <div>{{smallPackCount}}</div>
                </oms-form-row>
              </el-col>
              <el-col :span="12">

              </el-col>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-col :span="12">
                <oms-form-row label="可用库存" :span="8">
                  <el-input type="number" v-model.number="form.availableCount"></el-input>
                </oms-form-row>
              </el-col>
              <el-col :span="12">
                <oms-form-row label="在途库存" :span="8">
                  <el-input type="number" v-model.number="form.transitCount"></el-input>
                </oms-form-row>
              </el-col>
            </el-col>
            <el-col :span="12">
              <el-col :span="12">
                <oms-form-row label="实际合格库存" :span="10">
                  <el-input type="number" v-model.number="form.qualifiedCount"></el-input>
                </oms-form-row>
              </el-col>
              <el-col :span="12">
                <oms-form-row label="实际不合格库存" :span="10">
                  <el-input type="number" v-model.number="form.unqualifiedCount"></el-input>
                </oms-form-row>
              </el-col>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <oms-form-row label="" :span="4">
                <el-button type="primary" @click="onSubmit" :disabled="doing">调整库存</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table :data="batches" class="header-list store" border @row-click="showDetail"
                :header-row-class-name="'headerClass'" v-loading="loadingData"
                :row-class-name="formatRowClass" :summary-method="getSummaries" show-summary
                :max-height="bodyHeight" style="width: 100%">
        <el-table-column prop="goodsName" label="货主疫苗名称" :sortable="true"></el-table-column>
        <el-table-column prop="factoryName" label="生产厂商" :sortable="true"></el-table-column>
        <el-table-column prop="batchNumber" label="批号" :sortable="true" width="110"></el-table-column>
        <el-table-column prop="availableCount" label="可用库存" :render-header="formatHeader" :sortable="true"
                         width="100">
          <template slot-scope="scope">
            <span>{{scope.row.availableCount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="undeterminedCount" label="锁定库存" :render-header="formatHeader" :sortable="true"
                         width="110">
          <template slot-scope="scope">
            <span>{{scope.row.undeterminedCount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="qualifiedCount" label="实际合格库存" :render-header="formatHeader" :sortable="true"
                         width="120">
          <template slot-scope="scope">
            <span>{{scope.row.qualifiedCount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="transitCount" label="在途库存" :render-header="formatHeader" :sortable="true"
                         width="100">
          <template slot-scope="scope">
            <span>{{scope.row.transitCount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unqualifiedCount" label="实际不合格库存" :render-header="formatHeader" :sortable="true"
                         width="140">
          <template slot-scope="scope">
            <span>{{scope.row.unqualifiedCount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="expiryDate" label="有效期" :sortable="true" width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.expiryDate | date}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="container adjust-const-stock-detail">
      <h3>操作明细</h3>
      <el-table :data="operateList" class="header-list store" border v-loading="loadingLog"
                :header-row-class-name="'headerClass'" :max-height="bodyHeight" style="width: 100%">
        <el-table-column prop="goodsName" label="货主疫苗名称" :sortable="true"></el-table-column>
        <el-table-column prop="warehouseAddress" label="仓库" :sortable="true" width="110"></el-table-column>
        <el-table-column prop="batchNumber" label="批号" :sortable="true" width="110"></el-table-column>
        <el-table-column prop="availableCount" label="可用库存" :sortable="true" width="100"></el-table-column>
        <el-table-column prop="transitCount" label="在途库存" :sortable="true" width="100"></el-table-column>
        <el-table-column prop="qualifiedActualCount" label="实际合格库存" :sortable="true" width="120"></el-table-column>
        <el-table-column prop="stockUnqualifiedActualCount" label="实际不合格库存" :sortable="true"
                         width="140"></el-table-column>
        <el-table-column prop="unqualifiedCount" label="调整时间" :sortable="true" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | time}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">
        <el-pagination
          :total="pager.count" :pageSize="pager.pageSize"
          @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :page-sizes="[pager.pageSize,20,50,100]" layout="sizes, prev, pager, next, jumper"
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
  import {Address, BaseInfo, erpStock, http, Vaccine} from '@/resources';
  import detail from './detail.vue';
  import utils from '@/tools/utils';
  import OmsRow from '@dtop/dtop-web-common/packages/row';

  export default {
    components: {
      OmsRow,
      detail
    },
    data() {
      return {
        loadingData: false,
        showSearch: true,
        showDetailPart: false,
        batches: [],
        filters: {
          batchNumberId: '',
          orgGoodsId: '',
          warehouseId: ''
        },
        searchWord: {
          batchNumberId: '',
          orgGoodsId: '',
          warehouseId: ''
        },
        factories: [], // 厂商列表
        orgList: [], // 货主列表,
        orgGoods: [],
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 10
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
        warehouses: [],
        form: {
          availableCount: '',
          qualifiedCount: '',
          transitCount: '',
          unqualifiedCount: '',
          undeterminedCount: ''
        },
        doing: false,
        operateList: [],
        loadingLog: false
      };
    },
    mounted() {
      // this.getBatches(1);
      this.queryOrgWarehouse();
      this.queryOperateList(1);
    },
    computed: {
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        height = height - 110;
        return height;
      },
      smallPackCount() {
        let count = '';
        if (!this.searchWord.orgGoodsId) return count;
        this.orgGoods.forEach(i => {
          if (i.id === this.searchWord.orgGoodsId) {
            count = i.smallPackCount;
          }
        });
        return count;
      }
    },
    watch: {
      filters: {
        handler: function () {
          // this.getBatches(1);
        },
        deep: true
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pager.pageSize = val;
        this.queryOperateList(1);
      },
      handleCurrentChange(val) {
        this.queryOperateList(val);
      },
      queryOperateList(pageNo) {
        this.pager.currentPage = pageNo;
        let params = {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
        };
        this.loadingLog = true;
        this.$http.get('/erp-stock/adjust/log', {params}).then(res => {
          this.loadingLog = false;
          this.operateList = res.data.list;
          this.pager.count = res.data.count;
        });
      },
      isValid(item) {
        let a = this.$moment();
        let b = this.$moment(item.expiryDate);
        let days = b.diff(a, 'days');
        return a < b ? days > 90 ? 2 : 1 : 0;
      },
      getBatches() { // 得到波次列表
        let params = Object.assign({}, this.filters);
        this.loadingData = true;
        erpStock.query(params).then(res => {
          this.batches = res.data;
          this.loadingData = false;
        });
      },
      formatHeader(h, col) {
        let index = col.$index;
        let content = '';
        let title = '';
        switch (index) {
          case 3: {
            content = '用于出库订单的控制，表明可销售的数量';
            title = '可用库存';
            break;
          }
          case 4: {
            content = '仓库内质量状态待确定而不允许销售的库存数';
            title = '锁定库存';
            break;
          }
          case 5: {
            content = '仓库内真实合格疫苗数量';
            title = '实际合格库存';
            break;
          }
          case 6: {
            content = '在运输中的疫苗数量';
            title = '在途库存';
            break;
          }
          case 7: {
            content = '仓库内真实不合格疫苗数量';
            title = '实际不合格库存';
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
      },
      exportFile: function () {
        let params = Object.assign({}, this.filters);
        this.$store.commit('initPrint', {isPrinting: true, moduleId: '/store/request'});
        this.$http.get('/erp-stock/export', {params}).then(res => {
          utils.download(res.data.path, '即时库存查询');
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
            sums[index] = '合计';
            return;
          }
          if (column.property !== 'availableCount' && column.property !== 'qualifiedCount' &&
            column.property !== 'transitCount' && column.property !== 'unqualifiedCount'
            && column.property !== 'undeterminedCount') {
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
          batchNumberId: '',
          orgGoodsId: '',
          warehouseId: ''
        };
        Object.assign(this.searchWord, temp);
        Object.assign(this.filters, temp);
        this.batches = [];
      },
      filterFactory(query) { // 生产厂商
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
        let params = Object.assign({}, {
          keyWord: query
        });
        http.get('/erp-stock/pov/all-goods', {params}).then(res => {
          this.orgGoods = res.data.list;
        });
      },
      orgGoodsChange(val) {
        this.searchWord.batchNumberId = '';
        this.batchNumberList = [];
        this.batches = [];
        this.filterBatchNumber();
      },
      batchNumberChange(val) {
        if (!val) {
          this.filters.batchNumberId = '';
          this.batches = [];
          return;
        }
        this.searchInOrder();
        this.getBatches(1);
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
      queryOrgWarehouse() {
        let param = Object.assign({}, {
          deleteFlag: false,
          auditedStatus: '1',
        });
        Address.queryAddress(param).then(res => {
          this.warehouses = res.data;
        });
      },
      warehouseChange(val) {
        if (!this.searchWord.orgGoodsId || !this.searchWord.batchNumberId) return;
        this.searchInOrder();
        this.getBatches(1);
      },
      formatTime(date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      },
      onSubmit() {
        if (!this.searchWord.orgGoodsId) {
          this.$notify.info({
            message: '请选择货主疫苗'
          });
          return;
        }
        if (!this.searchWord.batchNumberId) {
          this.$notify.info({
            message: '请选择批号'
          });
          return;
        }
        this.$confirm('是否调整库存，请谨慎操作', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = Object.assign({}, this.form, this.searchWord);
          this.doing = true;
          this.$http.put('/erp-stock/adjust', obj).then(() => {
            this.doing = false;
            this.$notify.success({
              message: '调整库存成功'
            });
            this.getBatches(1);
            this.queryOperateList(1);
            this.form = {
              availableCount: '',
              qualifiedCount: '',
              transitCount: '',
              unqualifiedCount: ''
            };
          });
        }).catch(error => {
          this.doing = false;
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '调整库存失败'
          });
        });
      }
    }
  };
</script>
