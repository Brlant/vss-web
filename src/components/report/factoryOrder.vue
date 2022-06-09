<style lang="scss" scoped>

.align-word {
  letter-spacing: 1em;
  margin-right: -1em;
}

.order-list-item {
  cursor: pointer;
}

.opera-btn-group {
  margin: 10px 0;
}

.header-list {
  overflow: hidden;
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
              <oms-form-row :span="6" label="出入库类型">
                <el-select v-model="searchWord.bizTypeList" clearable filterable multiple placeholder="请选择">
                  <el-option v-for="item in bizTypeList" :key="item.key" :label="item.label"
                             :value="item.key">
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="5" label="单据编号">
                <oms-input v-model="searchWord.orderNo" placeholder="请输入货主订单号" type="text"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="5" label="疫苗主档">
                <el-select v-model="searchWord.goodsId" :clearable="true" :remote-method="filterVaccine" filterable
                           placeholder="请输入名称搜索疫苗"
                           popper-class="good-selects" remote>
                  <el-option v-for="vaccine in vaccineList" :key="vaccine.id"
                             :label="vaccine.name" :value="vaccine.id">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{vaccine.name}}</span>
                      <!--<el-tag type="success" v-if="vaccine.vaccineSign==='1'">免疫规划疫苗</el-tag>-->
                      <!--<el-tag type="success"  v-if="vaccine.vaccineSign==='2'">非免疫规划疫苗</el-tag>-->
                    </div>
                    <div style="overflow: hidden">
                      <!--<span class="select-other-info pull-left"><span-->
                      <!--v-show="vaccine.code">货主货品编号</span>  {{vaccine.code}}-->
                      <!--</span>-->
                      <span class="select-other-info pull-left"><span
                        v-show="vaccine.specifications">疫苗规格:</span>{{vaccine.specifications}}
                        </span>
                      <!--<span class="select-other-info pull-left"><span-->
                      <!--v-show="vaccine.approvalNumber">批准文号</span>  {{vaccine.approvalNumber}}-->
                      <!--</span>-->
                    </div>
                    <div style="overflow: hidden">
                        <span class="select-other-info pull-left"><span
                          v-show="vaccine.factoryName">生产单位:</span>{{ vaccine.factoryName }}
                        </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8" class="clearfix">
              <oms-form-row :span="6" label="批号">
                <oms-input v-model="searchWord.batchNumber" placeholder="请输入批号" type="text"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="5" label="完成时间">
                <el-col :span="24">
                  <el-date-picker
                    v-model="expectedTime"
                    format="yyyy-MM-dd"
                    placeholder="请选择" type="daterange">
                  </el-date-picker>
                </el-col>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="5" label="单位类型">
                <el-select v-model="searchWord.orgTypeList" clearable filterable multiple placeholder="请选择">
                  <el-option v-for="item in kindsMenu" :key="item.key" :label="item.title"
                             :value="item.key">
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="3" label="">
                <el-button native-type="submit" type="primary" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
                <perm label="stock-in-out-form-manager-export">
                  <el-button v-if="batches.length>0" :plain="true" type="success" @click="exportFile">
                    导出Excel
                  </el-button>
                </perm>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <el-table v-show="showTable" ref="orderDetail" :data="batches" :header-row-class-name="'headerClass'" :maxHeight="getHeight"
                :summary-method="getSummaries" border
                class="header-list store" show-summary>
        <el-table-column :sortable="true" label="订单编号" prop="orderNo" width="150"></el-table-column>
        <el-table-column :sortable="true" label="完成时间" prop="createTime"
                         width="120">
          <template slot-scope="scope">
            {{ scope.row.createTime | date}}
          </template>
        </el-table-column>
        <el-table-column :sortable="true" label="订单类型" prop="bizType" width="120">
          <template slot-scope="scope">
            {{showOrderType(scope.row.bizType)}}
            <!--<dict :dict-group="scope.row.type === '0' ? 'bizInType' : 'bizOutType' " :dict-key="scope.row.bizType" ></dict>-->
          </template>
        </el-table-column>
        <el-table-column :sortable="true" label="货主" prop="orgName" width="120">
        </el-table-column>
        <el-table-column :sortable="true" label="客户/供应商" prop="suppliersName" width="120">
          <template slot-scope="scope">
            {{ scope.row.suppliersName }}
          </template>
        </el-table-column>
        <el-table-column :sortable="true" label="单位类型" prop="suppliersName" width="120">
          <template slot-scope="scope">
            {{convertOrgType(scope.row)}}
          </template>
        </el-table-column>
        <el-table-column :sortable="true" label="货主疫苗" prop="orgGoodsName" width="150"></el-table-column>
        <el-table-column :sortable="true" label="疫苗主档" prop="goodsName" width="150"></el-table-column>
        <el-table-column :sortable="true" label="规格" prop="specification" width="120"></el-table-column>
        <el-table-column :sortable="true" label="批号" prop="batchNumber"
                         width="120"></el-table-column>
        <el-table-column :sortable="true" label="有效期" prop="expirationDate" width="120">
          <template slot-scope="scope">
            {{ scope.row.expirationDate | date}}
          </template>
        </el-table-column>
        <el-table-column :sortable="true" label="数量" prop="count" width="120"></el-table-column>
        <el-table-column :sortable="true" label="单位" prop="goodsUnit" width="120"></el-table-column>
        <el-table-column :sortable="true" label="单价" prop="price"
                         width="120">
          <template slot-scope="scope">
            ￥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column :sortable="true" label="金额" prop="totalMoney"
                         width="120">
          <template slot-scope="scope">
            ￥{{ scope.row.totalMoney}}
          </template>
        </el-table-column>
      </el-table>
      <div v-show="pager.count>pager.pageSize && !loadingData" class="text-center">
        <el-cu-pagination
          :current-page="pager.currentPage" :page-sizes="[10,20,50,100]"
          :pageSize="pager.pageSize" :total="pager.count" layout="sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="getBatches">
        </el-cu-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import {Goods} from '@/resources';
//  import detail from './detail.vue';
import utils from '@/tools/utils';
import qs from 'qs';
import ReportMixin from '@/mixins/reportMixin';

export default {
//    components: {detail},
  mixins: [ReportMixin],
  data() {
    return {
      loadingData: true,
      showSearch: true,
      batches: [],
      searchWord: {
        orgTypeList: [],
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
        pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10
      },
      expectedTime: '',
      showTable: false,
      vaccineList: [],
      typeList: ['入库', '出库']
    };
  },
  mounted() {
//      this.getBatches(1);
  },
  computed: {
    bizTypeList() {
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
    dictBizTypeList() {
      let inType = this.$getDict('bizInType') || [];
      let outType = this.$getDict('bizOutType') || [];
      return [].concat(inType, outType);
    },
    getHeight: function () {
      return parseInt(this.$store.state.bodyHeight, 10) - 155 + this.fixedHeight + (this.showSearch ? 0 : 155);
    },
    kindsMenu() {
      return [
        {title: '0接种单位', key: 'POV'},
        {title: '1社区接种门诊', key: 'POV-1'},
        {title: '2医院产科接种室', key: 'POV-2'},
        {title: '3犬伤处置门诊', key: 'POV-3'},
        {title: '4卡介苗接种门诊', key: 'POV-4'},
        {title: '5集体单位接种门诊', key: 'POV-5'},
        {title: '6特需接种门诊', key: 'POV-6'},
        {title: '7疾控中心', key: 'CDC'},
        {title: '8批发企业', key: 'Supplier'},
        {title: '9生产企业', key: 'Manufacture'}
      ];
    }
  },
  methods: {
    showOrderType: function (item) {
      let type = this.dictBizTypeList.find(f => f.key === item);
      return type && type.label || '';
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
    handleSizeChange(val) {
      this.pager.pageSize = val;
      window.localStorage.setItem('currentPageSize', val);
      this.getBatches(1);
    },
    getBatches(pageNo) { // 得到订单列表
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
        paramsSerializer(params) {
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
    getSummaries(param) {
      const {columns, data} = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (column.property !== 'count' &&
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
        if (index > sums.length - 2) {
          sums[index] = '￥' + i && Number(i).toFixed(1) || i;
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
        paramsSerializer(params) {
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
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
        });
      });
    },
    searchInOrder: function () {// 搜索
      this.searchWord.createStartTime = this.$formatAryTime(this.expectedTime, 0);
      this.searchWord.createEndTime = this.$formatAryTime(this.expectedTime, 1);
      this.getBatches(1);
    },
    resetSearchForm: function () {// 重置表单
      this.searchWord = {
        orgTypeList: [],
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
    formatTime(date) {
      return date ? this.$moment(date).format('YYYY-MM-DD') : '';
    },
    convertOrgType(row) {
      let str = '';
      let orgList = [];
      orgList = this.kindsMenu;
      orgList.forEach(value => {
        row.orgTypeList.forEach(value1 => {
          if (value1 === value.key) {
            str = str + '/' + value.title;
          }
        });
      });
      return str.substring(1, str.length);
    }
  }
};
</script>
