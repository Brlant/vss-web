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

  .R {
    word-wrap: break-word;
    word-break: break-all;
  }

  .good-selects {
    .el-select-dropdown__item {
      height: auto;
      width: 300px;
    }
  }

  .align-word {
    letter-spacing: 1em;
    margin-right: -1em;
  }

  .order-list-item {
    cursor: pointer;
  }

  .good-selects {
    .el-select-dropdown__item {
      width: auto;
    }
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
</style>
<template>
  <div class="order-page">
    <div class="container">
      <el-alert
        title="请选择货品和批号输入调整部分库存状态，可用库存可以转换成待确定库存或实际不合格库存，待确定库存可以转成实际不合格库存和可用库存。"
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
              <oms-form-row label="货主货品" :span="4" :isRequire="true">
                <el-select filterable remote placeholder="请输入名称搜索货主货品" :remote-method="filterOrgGoods"
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
                        v-show="org.goodsNo">货品编号:</span>{{org.goodsNo}}
                      </span>
                      <span class="select-other-info pull-left"><span
                        v-show="org.saleFirmName">供货厂商:</span>{{ org.saleFirmName }}
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
          <el-row>
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
              <oms-form-row label="调整类型" :span="5">
                <el-radio-group v-model="adjustType" style="margin-top: 10px; margin-left: 10px">
                  <el-radio label="0">可用库存</el-radio>
                  <el-radio label="1">待确定库存</el-radio>
                </el-radio-group>
              </oms-form-row>
            </el-col>
          </el-row>
          <el-row v-show="adjustType">
            <el-col :span="12">
              <el-col :span="12">
                <oms-form-row label="可用库存" :span="8" v-show="adjustType === '0'">
                  <el-input type="number" v-model.number="form.availableCount"></el-input>
                </oms-form-row>
                <oms-form-row label="待确定库存" :span="8" v-show="adjustType === '1'">
                  <el-input type="number" v-model.number="form.undeterminedCount"></el-input>
                </oms-form-row>
              </el-col>
              <el-col :span="12">
                <oms-form-row label="可用库存" :span="10" v-show="adjustType === '1'">
                  <el-input type="number" v-model.number="form.availableCount"></el-input>
                </oms-form-row>
                <oms-form-row label="待确定库存" :span="8" v-show="adjustType === '0'">
                  <el-input type="number" v-model.number="form.undeterminedCount"></el-input>
                </oms-form-row>
              </el-col>
            </el-col>
            <el-col :span="12">
              <el-col :span="12">
                <oms-form-row label="实际不合格库存" :span="10">
                  <el-input type="number" v-model.number="form.unqualifiedCount"></el-input>
                </oms-form-row>
              </el-col>
              <el-col :span="12">
                <oms-form-row label="" :span="3">
                  <el-button type="primary" @click="onSubmit" :disabled="doing">调整</el-button>
                </oms-form-row>
              </el-col>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table :data="batches" class="header-list store" border @row-click="showDetail"
                :header-row-class-name="'headerClass'" v-loading="loadingData"
                :row-class-name="formatRowClass" :summary-method="getSummaries" show-summary
                :max-height="bodyHeight" style="width: 100%">
        <el-table-column prop="goodsName" label="货主货品名称" :sortable="true"></el-table-column>
        <el-table-column prop="factoryName" label="生产厂商" :sortable="true"></el-table-column>
        <el-table-column prop="batchNumber" label="批号" :sortable="true" width="110"></el-table-column>
        <el-table-column prop="availableCount" label="可用库存" :render-header="formatHeader" :sortable="true"
                         width="100">
          <template slot-scope="scope">
            <span>{{scope.row.availableCount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="undeterminedCount" label="待确定库存" :render-header="formatHeader" :sortable="true"
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

    <page-right :show="showDetailPart" @right-close="resetRightBox" :css="{'width':'1100px','padding':0}">
      <detail :currentItem="currentItem" @close="resetRightBox"></detail>
    </page-right>
  </div>
</template>
<script type="text/jsx">
  //  import order from '../../../tools/orderList';
  import { Address, BaseInfo, erpStock, http } from '@/resources';
  import detail from './detail.vue';
  import utils from '@/tools/utils';

  export default {
    components: {detail},
    data () {
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
        adjustType: '',
        batchNumberList: [],
        warehouses: [],
        form: {
          availableCount: '',
          unqualifiedCount: '',
          undeterminedCount: ''
        },
        doing: false
      };
    },
    mounted () {
      // this.getBatches(1);
      this.queryOrgWarehouse();
    },
    computed: {
      orgLevel () {
        return this.$store.state.orgLevel;
      },
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        height = height - 110;
        return height;
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
      isValid (item) {
        let a = this.$moment();
        let b = this.$moment(item.expiryDate);
        let days = b.diff(a, 'days');
        return a < b ? days > 90 ? 2 : 1 : 0;
      },
      getBatches () { // 得到波次列表
        let params = Object.assign({}, this.filters);
        this.loadingData = true;
        erpStock.query(params).then(res => {
          this.batches = res.data;
          this.loadingData = false;
        });
      },
      formatHeader (h, col) {
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
            content = '仓库内待确定的货品数量';
            title = '待确定库存';
            break;
          }
          case 5: {
            content = '仓库内真实合格货品数量';
            title = '实际合格库存';
            break;
          }
          case 6: {
            content = '在运输中的货品数量';
            title = '在途库存';
            break;
          }
          case 7: {
            content = '仓库内真实不合格货品数量';
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
      formatRowClass (data) {
        if (this.isValid(data.row) === 1) {
          return 'effective-row';
        }
      },
      showDetail (item) {
        this.currentItemId = item.id;
        this.currentItem = item;
        this.showDetailPart = true;
      },
      resetRightBox () {
        this.showDetailPart = false;
      },
      searchInOrder: function () {// 搜索
        Object.assign(this.filters, this.searchWord);
      },
      getSummaries (param) {
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
      filterOrgGoods (query) {
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
      orgGoodsChange (val) {
        this.searchWord.batchNumberId = '';
        this.batchNumberList = [];
        this.batches = [];
        this.filterBatchNumber();
      },
      batchNumberChange (val) {
        if (!val) {
          this.filters.batchNumberId = '';
          this.batches = [];
          return;
        }
        this.searchInOrder();
        this.getBatches(1);
      },
      filterBatchNumber (query) {
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
      queryOrgWarehouse () {
        let param = Object.assign({}, {
          deleteFlag: false,
          auditedStatus: '1',
        });
        Address.queryAddress(param).then(res => {
          this.warehouses = res.data;
        });
      },
      warehouseChange (val) {
        if (!this.searchWord.orgGoodsId || !this.searchWord.batchNumberId) return;
        this.searchInOrder();
        this.getBatches(1);
      },
      formatTime (date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      },
      setDefaultValue (obj, val) {
        Object.keys(obj).forEach(k => obj[k] = obj[k] ? obj[k] : val)
      },
      onSubmit () {
        if (!this.batches.length) {
          this.$notify.info({
            message: '无库存信息，请重新选择'
          });
          return;
        }
        if (this.adjustType === '0') {
          if (!this.form.availableCount) {
            this.$notify.info({
              message: '请输入可用库存'
            });
            return;
          }
          if (this.form.availableCount !== (Number(this.form.unqualifiedCount) + Number(this.form.undeterminedCount))) {
            this.$notify.info({
              message: '需要调整的可用库存数量与分配到其他库存的数量总和不一致'
            });
            return;
          }
        }else {
          if (!this.form.undeterminedCount) {
            this.$notify.info({
              message: '请输入待确定库存'
            });
            return;
          }
          if (this.form.undeterminedCount !== (Number(this.form.unqualifiedCount) + Number(this.form.availableCount))) {
            this.$notify.info({
              message: '需要调整的待确定库存数量与分配到其他库存的数量总和不一致'
            });
            return;
          }
        }
        this.$confirm('是否调整库存状态，请谨慎操作', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let id = this.batches[0].id;
          let url = this.adjustType === '0' ? `/erp-stock/${id}/conversion/qualified`
            : `/erp-stock/${id}/conversion/undetermined`;
          this.doing = true;
          this.setDefaultValue(this.form, 0);
          this.$http.put(url, this.form).then(() => {
            this.doing = false;
            this.$notify.success({
              message: '调整成功'
            });
            this.getBatches(1);
            this.form = {
              availableCount: '',
              unqualifiedCount: '',
              undeterminedCount: ''
            };
          });
        }).catch(error => {
          this.doing = false;
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '调整失败'
          });
        });
      }
    }
  };
</script>
