<style lang="scss" scoped="">

  .align-word {
    letter-spacing: 1em;
    margin-right: -1em;
  }

  .order-list-item {
    cursor: pointer;
  }

  .header-list {
    overflow: hidden;
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
              <oms-form-row label="出入库类型" :span="6">
                <el-select v-model="searchWord.bizTypeList" multiple filterable clearable placeholder="请选择">
                  <el-option :value="item.key" :key="item.key" :label="item.label"
                             v-for="item in bizTypeList">
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="单据编号" :span="5">
                <oms-input type="text" v-model="searchWord.orderNo" placeholder="请输入货主订单号"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="平台货品" :span="5">
                <el-select filterable remote placeholder="请输入名称搜索货品" :remote-method="filterVaccine"
                           :clearable="true"
                           v-model="searchWord.goodsId" popper-class="good-selects">
                  <el-option :value="vaccine.id" :key="vaccine.id"
                             :label="vaccine.name" v-for="vaccine in vaccineList">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{vaccine.name}}</span>
                      <!--<el-tag type="success" v-if="vaccine.vaccineSign==='1'">一类疫苗</el-tag>-->
                      <!--<el-tag type="success"  v-if="vaccine.vaccineSign==='2'">二类疫苗</el-tag>-->
                    </div>
                    <div style="overflow: hidden">
                      <!--<span class="select-other-info pull-left"><span-->
                      <!--v-show="vaccine.code">货品编号</span>  {{vaccine.code}}-->
                      <!--</span>-->
                      <span class="select-other-info pull-left"><span
                        v-show="vaccine.specifications">货品规格:</span>{{vaccine.specifications}}
                        </span>
                      <!--<span class="select-other-info pull-left"><span-->
                      <!--v-show="vaccine.approvalNumber">批准文号</span>  {{vaccine.approvalNumber}}-->
                      <!--</span>-->
                    </div>
                    <div style="overflow: hidden">
                        <span class="select-other-info pull-left"><span
                          v-show="vaccine.factoryName">生产厂商:</span>{{ vaccine.factoryName }}
                        </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8" class="clearfix">
              <oms-form-row label="批号" :span="6">
                <oms-input type="text" v-model="searchWord.batchNumber" placeholder="请输入批号"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="完成时间" :span="5">
                <el-col :span="24">
                  <el-date-picker
                    v-model="expectedTime"
                    type="daterange"
                    placeholder="请选择" format="yyyy-MM-dd">
                  </el-date-picker>
                </el-col>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="" :span="3">
                <el-button type="primary" native-type="submit" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
                <perm label="stock-in-out-form-manager-export">
                  <el-button :plain="true" type="success" @click="exportFile" v-if="batches.length>0">
                    导出Excel
                  </el-button>
                </perm>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <el-table :data="batches" class="header-list store" border :summary-method="getSummaries" show-summary
                :header-row-class-name="'headerClass'" ref="orderDetail"
                :maxHeight="getHeight" v-show="showTable">
        <el-table-column prop="orderNo" label="订单编号" :sortable="true" width="150"></el-table-column>
        <el-table-column prop="createTime" label="完成时间" :sortable="true"
                         width="120">
          <template slot-scope="scope">
            {{ scope.row.createTime | date}}
          </template>
        </el-table-column>
        <el-table-column prop="bizType" label="订单类型" :sortable="true" width="120">
          <template slot-scope="scope">
            {{showOrderType(scope.row.bizType)}}
            <!--<dict :dict-group="scope.row.type === '0' ? 'bizInType' : 'bizOutType' " :dict-key="scope.row.bizType" ></dict>-->
          </template>
        </el-table-column>
        <el-table-column prop="orgName" label="货主" :sortable="true" width="120">
        </el-table-column>
        <el-table-column prop="suppliersName" label="客户/供应商" :sortable="true" width="120">
          <template slot-scope="scope">
            {{ scope.row.suppliersName }}
          </template>
        </el-table-column>
        <el-table-column prop="orgGoodsName" label="货主货品" :sortable="true" width="150"></el-table-column>
        <el-table-column prop="goodsName" label="平台货品" :sortable="true" width="150"></el-table-column>
        <el-table-column prop="specification" label="规格" :sortable="true" width="120"></el-table-column>
        <el-table-column prop="batchNumber" label="批号" :sortable="true"
                         width="120"></el-table-column>
        <el-table-column prop="expirationDate" label="有效期" :sortable="true" width="120">
          <template slot-scope="scope">
            {{ scope.row.expirationDate | date}}
          </template>
        </el-table-column>
        <el-table-column prop="count" label="数量" :sortable="true" width="120"></el-table-column>
        <el-table-column prop="goodsUnit" label="单位" :sortable="true" width="120"></el-table-column>
        <el-table-column prop="price" label="单价" :sortable="true"
                         width="120">
          <template slot-scope="scope">
            ￥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="totalMoney" label="金额" :sortable="true"
                         width="120">
          <template slot-scope="scope">
            ￥{{ scope.row.totalMoney}}
          </template>
        </el-table-column>
      </el-table>
      <div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">
        <el-pagination
          layout="sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
          :total="pager.count" :pageSize="pager.pageSize" @current-change="getBatches"
          :current-page="pager.currentPage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import { Goods } from '@/resources';
  //  import detail from './detail.vue';
  import utils from '@/tools/utils';
  import qs from 'qs';
  import ReportMixin from '@/mixins/reportMixin';

  export default {
//    components: {detail},
    mixins: [ReportMixin],
    data () {
      return {
        loadingData: true,
        showSearch: true,
        batches: [],
        searchWord: {
          shipper: '',
          suppliers: '',
          batchNumber: '',
          goodsId: '',
          createStartTime: '',
          createEndTime: '',
          orderNo: '',
          bizTypeList: [],
          typeList: [],
          orgId: ''
        },
        factories: [], // 厂商列表
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        },
        expectedTime: '',
        showTable: false,
        vaccineList: [],
        typeList: ['入库', '出库']
      };
    },
    mounted () {
//      this.getBatches(1);
    },
    computed: {
      orgLevel () {
        return this.$store.state.orgLevel;
      },
      bizTypeList () {
        let inType = JSON.parse(JSON.stringify(this.$getDict('bizInType') || []));
        let outType = JSON.parse(JSON.stringify(this.$getDict('bizOutType') || []));
        inType.forEach(i => {
          i.key = '0|' + i.key;
        });
        outType.forEach(i => {
          i.key = '1|' + i.key;
        });
        return [].concat(inType, outType);
      },
      getHeight: function () {
        return parseInt(this.$store.state.bodyHeight, 10) - 155 + this.fixedHeight + (this.showSearch ? 0 : 155);
      }
    },
    methods: {
      showOrderType: function (item) {
        let title = '';
        if (item === '1-0') {
          title = '采购订单';
        }
        if (item === '1-1') {
          title = '销售退货';
        }
        if (item === '1-2') {
          title = '盘盈入库';
        }
        if (item === '1-3') {
          title = '调拨入库';
        }
        if (item === '2-0') {
          title = '销售出库';
        }
        if (item === '2-1') {
          title = '采购退货';
        }
        if (item === '2-2') {
          title = '盘亏出库';
        }
        if (item === '2-3') {
          title = '调拨出库';
        }
        return title;
      },
      filterVaccine: function (query) {
        let params = Object.assign({}, {
          deleteFlag: false,
          keyWord: query
        });
        Goods.query(params).then(res => {
          this.vaccineList = res.data.list;
        });
      },
      handleSizeChange (val) {
        this.pager.pageSize = val;
        this.getBatches(1);
      },
      getBatches (pageNo) { // 得到订单列表
        this.pager.currentPage = pageNo;
        this.showTable = true;
        this.loadingData = true;
        let loadingInstance = this.$loading({
          target: this.$refs['orderDetail'].$el
        });
        let params = JSON.parse(JSON.stringify(this.searchWord));
        params.goodsList = [];
        this.searchWord.goodsId && params.goodsList.push(this.searchWord.goodsId);
        params.goodsId = undefined;
        params.pageNo = pageNo;
        params.pageSize = this.pager.pageSize;
        params.goodsList = [this.searchWord.goodsId];
        this.$http({
          url: '/erp-statement/city/warehouse-detail',
          params,
          paramsSerializer (params) {
            return qs.stringify(params, {indices: false});
          }
        }).then(res => {
          this.batches = res.data.list;
          // this.pager.count = res.data.count;
          //
          this.pager.count = this.pager.currentPage * this.pager.pageSize + (this.batches.length === this.pager.pageSize ? 1 : 0);
          this.loadingData = false;
          loadingInstance.close();
          this.setFixedHeight();
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
          if (column.property !== 'count' && column.property !== 'price' &&
            column.property !== 'totalMoney') {
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
          if (index > sums.length - 3) {
            sums[index] = '￥' + i;
          }
        });
        return sums;
      },
      exportFile: function () {
        let params = JSON.parse(JSON.stringify(this.searchWord));
        params.goodsList = [];
        this.searchWord.goodsId && params.goodsList.push(this.searchWord.goodsId);
        params.goodsId = undefined;
        this.$store.commit('initPrint', {
          isPrinting: true,
          moduleId: this.$route.path
        });
        this.$http({
          url: '/erp-statement/city/warehouse-detail/export',
          params,
          paramsSerializer (params) {
            return qs.stringify(params, {indices: false});
          }
        }).then(res => {
          utils.download(res.data.path, '出入库明细');
          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: this.$route.path
          });
        }).catch(error => {
          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: this.$route.path
          });
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },
      searchInOrder: function () {// 搜索
        this.searchWord.createStartTime = this.formatTime(this.expectedTime[0]);
        this.searchWord.createEndTime = this.formatTime(this.expectedTime[1]);
        this.getBatches(1);
      },
      resetSearchForm: function () {// 重置表单
        this.searchWord = {
          shipper: '',
          suppliers: '',
          batchNumber: '',
          goodsId: '',
          createStartTime: '',
          createEndTime: '',
          orderNo: '',
          bizTypeList: [],
          typeList: [],
          orgId: ''
        };
        this.expectedTime = '';
        this.getBatches(1);
      },
      formatTime (date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      }
    }
  };
</script>
