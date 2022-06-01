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
              <oms-form-row :span="6" label="所属区">
                <el-select v-model="params.orgAreaCode" :clearable="true" filterable
                           placeholder="支持搜索区域名称">
                  <el-option v-for="item in orgAreas" :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="接种单位">
                <el-select v-model="params.factoryId" :clearable="true" :remote-method="filterInjectionOrgs" filterable
                           placeholder="请输入名称/系统代码"
                           popperClass="good-selects" remote
                           @click.native.once="filterInjectionOrgs('')">
                  <el-option v-for="org in injectionOrgs" :key="org.id" :label="org.name" :value="org.id">
                    <div style="overflow: hidden">
                      <span class="pull-left" style="clear: right">{{ org.name }}</span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left">
                        <span>系统代码:</span>{{ org.manufacturerCode }}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="采购入库单号">
                <el-input v-model="params.orderNo" placeholder="请输入采购入库单号"></el-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="销售出库单号">
                <el-input v-model="params.orderThirdPartyNumber" placeholder="请输入销售出库单号"></el-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="追溯码">
                <el-input v-model="params.traceCode" placeholder="请输入追溯码"></el-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="货主货品名称">
                <el-select v-model="params.orgGoodsId" :clearable="true" :remote-method="filterOrgGoods" filterable
                           placeholder="请输入名称/编号"
                           popper-class="good-selects" remote
                           @click.native.once="filterOrgGoods('')">
                  <el-option v-for="item in orgGoods" :key="item.orgGoodsDto.id"
                             :label="item.orgGoodsDto.name"
                             :value="item.orgGoodsDto.id">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{ item.orgGoodsDto.name }}<el-tag v-show="!item.orgGoodsDto.status"
                                                                                 style="float: none"
                                                                                 type="danger">停用</el-tag></span>
                    </div>
                    <div style="overflow: hidden">
                        <span class="select-other-info pull-left"><span
                          v-show="item.orgGoodsDto.goodsNo">货主货品编号:</span>{{ item.orgGoodsDto.goodsNo }}
                        </span>
                      <span class="select-other-info pull-left"><span
                        v-show="item.orgGoodsDto.salesFirmName">供货单位:</span>{{ item.orgGoodsDto.salesFirmName }}
                        </span>
                      <span v-if="item.orgGoodsDto.goodsDto" class="select-other-info pull-left">
                          <span v-show="item.orgGoodsDto.goodsDto.factoryName">生产单位:</span>{{
                          item.orgGoodsDto.goodsDto.factoryName
                        }}
                </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="货品主档名称">
                <el-select v-model="params.goodsCode" :clearable="true" :remote-method="searchProduct" filterable
                           placeholder="请输入名称或编号搜索"
                           popper-class="good-selects" remote
                           @click.native.once="searchProduct('')">
                  <el-option v-for="org in detailList" :key="org.id" :label="org.name"
                             :value="org.id">
                    <div style="overflow: hidden">
                      <span class="pull-left">
                        {{ org.name }}
                      </span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left">
                        <span v-show="org.specifications">规格:</span>{{ org.specifications }}
                      </span>
                      <span class="select-other-info pull-left">
                        <span v-show="org.code">货品编号:</span>{{ org.code }}
                      </span>
                      <span class="select-other-info pull-left"><span
                        v-show="org.factoryName">生产单位:</span>{{ org.factoryName }}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="是否接种完">
                <el-select v-model="params.injection" placeholder="请选择">
                  <el-option v-for="item in whetherOptions" :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="批号">
                <el-input v-model="params.batchNumber" :clearable="true" filterable
                          placeholder="请输入批号">
                </el-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="是否剩余处置人份">
                <el-select v-model="params.disposalOfRemainingDoses" placeholder="请选择">
                  <el-option v-for="item in whetherOptions" :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="是否有报损">
                <el-select v-model="params.reportedLoss" placeholder="请选择">
                  <el-option v-for="item in whetherOptions" :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="是否有损耗">
                <el-select v-model="params.loss" placeholder="请选择">
                  <el-option v-for="item in whetherOptions" :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="接种单位入库时间">
                <el-col :span="24">
                  <el-date-picker
                    v-model="createTimes"
                    format="yyyy-MM-dd"
                    placeholder="请选择" type="daterange">
                  </el-date-picker>
                </el-col>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="">
                <el-button :disabled="loadingData" type="primary" @click="search">
                  查询
                </el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
                <perm label="wastage-report-export-vss" class="ml-15">
                  <el-button :disabled="isLoading" plain type="success" @click="exportFile">
                    导出Excel
                  </el-button>
                </perm>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table ref="reportTable" v-loading="loadingData" :data="list" :header-row-class-name="'headerClass'"
                :maxHeight="getHeight"
                :summary-method="getSummaries" border
                border class="header-list" show-summary>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column :sortable="true" label="追溯码" prop="traceCode">
        </el-table-column>
        <el-table-column :sortable="false" label="所属区">
          <template v-slot="{row,$index}">
            <dict :dict-group="'areaCode'" :dict-key="row.orgAreaCode"></dict>
          </template>
        </el-table-column>
        <el-table-column :sortable="false" label="接种单位编码" prop="orgCode"></el-table-column>
        <el-table-column :sortable="false" label="接种单位名称" prop="orgName"></el-table-column>
        <el-table-column :sortable="false" label="生产企业" prop="goodsFactoryName"></el-table-column>
        <el-table-column :sortable="false" label="产品编码" prop="orgGoodsNumber"></el-table-column>
        <el-table-column :sortable="false" label="产品名称" prop="orgGoodsName"></el-table-column>
        <el-table-column :sortable="false" label="采购入库单号" prop="orderNo"></el-table-column>

        <el-table-column :sortable="false" label="销售出库单号" prop="orderThirdPartyNumber"></el-table-column>
        <el-table-column :sortable="false" label="批号" prop="batchNumber"></el-table-column>
        <el-table-column :sortable="false" label="生产日期">
          <template v-slot="{row}">
            {{ row.batchNumberProductionDate | date }}
          </template>
        </el-table-column>
        <el-table-column :sortable="false" label="有效期至">

          <template v-slot="{row}">
            {{ row.batchNumberExpirationDate | time }}
          </template>
        </el-table-column>
        <el-table-column :sortable="false" label="单码支数" prop="minTagUnitCount"></el-table-column>
        <el-table-column :sortable="false" label="单码可用人份数" prop="singleCodeAvailablePersons"></el-table-column>
        <el-table-column :sortable="false" label="已注射剂次" prop="injectedTimes"></el-table-column>
        <el-table-column :sortable="false" label="已退货人份" prop="returnedPersons"></el-table-column>
        <el-table-column :sortable="false" label="已报损人份" prop="reportedPersons"></el-table-column>
        <el-table-column :sortable="false" label="已损耗人份" prop="lossPersons"></el-table-column>
        <el-table-column :sortable="false" label="尚未处置人份" prop="notDisposedPersons"></el-table-column>
        <el-table-column :sortable="false" label="采购入库时间">
          <template v-slot="{row}">
            {{ row.purchasingStorageTime | time }}
          </template>
        </el-table-column>
        <el-table-column :sortable="false" label="首次注射时间">
          <template v-slot="{row}">
            {{ row.firstInjectionTime | time }}
          </template>
        </el-table-column>
        <el-table-column :sortable="false" label="末次注射时间">
          <template v-slot="{row}">
            {{ row.lastInjectionTime | time }}
          </template>
        </el-table-column>
        <el-table-column :sortable="false" label="退货时间">
          <template v-slot="{row}">
            {{ row.returnTime | time }}
          </template>
        </el-table-column>
        <el-table-column :sortable="false" label="报损时间">
          <template v-slot="{row}">
            {{ row.lossReportingTime | time }}
          </template>
        </el-table-column>
        <el-table-column :sortable="false" label="损耗时间" prop="orgName">
          <template v-slot="{row}">
            {{ row.lossTime | time }}
          </template>
        </el-table-column>
        <el-table-column :sortable="true" label="最后更新时间">
          <template v-slot="{row}">
            {{ row.lastUpdateTime | time }}
          </template>
        </el-table-column>
      </el-table>
      <div v-show="list.length" class="text-center">
        <el-pagination
          :current-page="params.pageNo" :page-sizes="[10,20,50,100]"
          :pageSize="params.pageSize"
          :total="totalCount" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
import {BaseInfo, Vaccine} from '@/resources'
import ReportMixin from '@/mixins/reportMixin'
import utils from '@/tools/utils'

export default {
  mixins: [ReportMixin],
  data() {
    return {
      showSearch: true,
      // 列表和导出的查询参数
      params: {
        //  1)	所属区：根据字典表，获取区下拉列表。a.	接种单位登录，默认：本区，不可切换
        orgAreaCode: '',
        //  2)	接种单位：根据所属区，过滤区下接种单位。模糊搜索、可多选。若不选所属区域，则可选择所有接种单位。
        orgCode: '',
        //  3)	采购入库单号：接种单位采购入库单号，精确查询
        orderNo: '',
        //  4)	销售出库单号：疾控销售出库单号，精确查询
        orderThirdPartyNumber: '',
        //  5)	追溯码：精确查询
        traceCode: '',
        //  6)	货主货品名称：模糊搜索、可多选。与接种单位联动。只可选择该接种单位下货品。
        orgGoodsNumber: '',
        //  7)	货品主档名称：模糊搜索、可多选。
        goodsCode: '',
        //  8)	是否接种完（单码可用人份数=已注射剂次）：下拉选择。枚举：全部/是/否，默认：全部
        injection: '',
        //  9)	批号：精确查询。
        batchNumber: '',
        // 10)	是否剩余处置人份(尚未处置人份是否为0)：下拉选择。枚举：全部/是/否，默认：全部
        disposalOfRemainingDoses: '',
        // 11)	是否有报损（已报损人份不等于0）：下拉选择。枚举：全部/是/否，默认：全部
        reportedLoss: '',
        // 12)	是否有损耗（已损耗人份不等于0）：下拉选择。枚举：全部/是/否，默认：全部
        loss: '',
        // 13)	接种单位入库时间：范围查询（最长可选择一年），精确到天，查询条件包头不包尾。默认：半年，开始时间往前推6月，月初，结束时间取本月末。
        purchasingStorageTime: '',
        pageNo: 1,
        pageSize: 20,
      },
      detailList: [], // 货主
      createTimes: [],
      list: [],
      whetherOptions: [
        {value: '', label: '全部'},
        {value: '1', label: '是'},
        {value: '0', label: '否'},
      ],
      orgGoods: [],
      isLoading: false,
      loadingData: false,
      totalCount: 0,
      injectionOrgs: [],//所有的接种单位
      hasPov: false,
      povOrgId: '',
      orgAreas: []
    }
  },
  computed: {
    getHeight: function () {
      return parseInt(this.$store.state.bodyHeight, 10) - 140 + this.fixedHeight + (this.showSearch ? 0 : 140);
    },
    currOrg() {
      return this.$store.state.org;
    },
    areaCodeDict() {
      return this.$getDict('areaCode');
    }
  },
  watch: {
    currOrg(val) {
      if (!val) return;
      this.hasPov = val.orgRelationTypeList.includes('POV');
      if (!this.hasPov) {
        // 如果是接种单位的话，保存单位编码，过滤接种单位
        this.povOrgId = val.id;
        this.params.orgAreaCode = val.orgAreaCode;
        // 当前是接种单位登录的，取当前单位所在区域
        this.orgAreas = this.areaCodeDict.filter(item => item.value === val.orgAreaCode);
      } else {
        // 默认取字典数据
        this.orgAreas = this.areaCodeDict;
      }
    },
    povOrgId(val) {
      this.filterInjectionOrgs();
    }
  },
  methods: {
    exportFile() {
      this.params.purchasingStorageTime = this.createTimes.toString();
      this.params.purchasingStorageTime1 = this.$formatAryTime(this.createTimes, 0);
      this.params.purchasingStorageTime2 = this.$formatAryTime(this.createTimes, 1);
      this.isLoading = true;
      this.$store.commit('initPrint', {isPrinting: true, moduleId: '/report/wastage-report-vss'});
      this.$http.get('/v1/pt/trace-code/report/export', {params: this.params}).then(res => {
        utils.download(res.data.path, '追溯码报表');
        this.isLoading = false;
        this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/wastage-report-vss'});
      }).catch(error => {
        this.isLoading = false;
        this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/wastage-report-vss'});
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
        });
      });
    },
    search() {
      this.params.purchasingStorageTime = this.createTimes.toString();
      this.params.purchasingStorageTime1 = this.$formatAryTime(this.createTimes, 0);
      this.params.purchasingStorageTime2 = this.$formatAryTime(this.createTimes, 1);
      this.loadingData = true;
      this.$http.get('/v1/pt/trace-code/report', {params: this.params})
        .then(res => {
          this.list = res.data.list;
          this.totalCount = res.data.count;
          this.loadingData = false;
          this.setFixedHeight();
        })
        .catch(err => {
          this.list = [];
          this.totalCount = 0;
          this.loadingData = false;
        })
    },
    filterInjectionOrgs(keyword) { // 生产单位
      // 只查接种单位，即orgRelationTypeList中带有pov的
      let params = {
        keyWord: keyword,
        // 根据所属区，过滤区下接种单位。模糊搜索、可多选。若不选所属区域，则可选择所有接种单位。
        orgAreaCode: this.currOrg.orgAreaCode,
        // a.	接种单位登录，默认：本单位，不可切换,povOrgId只有接种单位登录才有值
        orgId: this.povOrgId,
        orgRelationTypeList: [
          'POV',
          'POV-1',
          'POV-2',
          'POV-3',
          'POV-4',
          'POV-5',
          'POV-6',
        ]
      };
      BaseInfo.queryByOrgRelationTypeList(params).then(res => {
        this.injectionOrgs = res.data.list;
      });
    },
    filterOrgGoods(keyWord) {
      Vaccine.query({keyWord}).then(res => {
        this.orgGoods = res.data.list;
      });
    },
    searchProduct(query) {
      let params = Object.assign({}, {
        deleteFlag: false,
        keyWord: query
      });
      this.$http.get('/goods/main-info-pager', {params}).then(res => {
        this.detailList = res.data.list;
      });
    },
    handleCurrentChange(pageNo) {
      this.params.pageNo = pageNo;
      this.search()
    },
    handleSizeChange(pageSize) {
      this.params.pageSize = pageSize;
      window.localStorage.setItem('currentPageSize', pageSize);
      this.search();
    },

    getSummaries(param) {
      const {columns, data} = param;

      if (data.length == 0) return [];

      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }

        if (column.property === 'amount') {
          sums[index] = data.map(item => item.amount).reduce((sum, n) => sum + n);
          return;
        }

        sums[index] = '';
      });

      return sums;
    },
    resetSearchForm() {
      this.params = {};
      this.createTimes = [];
      this.totalCount = 0;
      this.search();
    },
  },
  mounted() {
    this.search();
  }
}
</script>

<style scoped>

</style>
