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
            <el-col :span="6">
              <oms-form-row :span="8" label="所属区">
                <el-select v-model="params.orgAreaCode" :clearable="!hasPov" filterable
                           placeholder="支持搜索区域名称">
                  <el-option v-for="item in orgAreas" :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row :span="8" label="接种单位">
                <el-select v-model="params.orgManufacturerCode" :clearable="!hasPov"
                           :remote-method="filterInjectionOrgs"
                           filterable
                           placeholder="请输入名称/系统代码"
                           popperClass="good-selects" remote
                           @click.native.once="filterInjectionOrgs('')">
                  <el-option v-for="org in injectionOrgs" :key="org.id" :label="org.name" :value="org.manufacturerCode">
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
            <el-col :span="6">
              <oms-form-row :span="8" label="采购入库单号">
                <el-input v-model="params.orderNo" placeholder="请输入采购入库单号"></el-input>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row :span="8" label="销售出库单号">
                <el-input v-model="params.orderThirdPartyNumber" placeholder="请输入销售出库单号"></el-input>
              </oms-form-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <oms-form-row :span="8" label="追溯码">
                <el-input v-model="params.traceCode" placeholder="请输入追溯码"></el-input>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row :span="8" label="货主货品名称">
                <el-select v-model="params.orgGoodsNumber" :clearable="true" :remote-method="filterOrgGoods" filterable
                           placeholder="请输入名称/编号"
                           popper-class="good-selects" remote
                           @click.native.once="filterOrgGoods('')">
                  <el-option v-for="item in orgGoods" :key="item.orgGoodsDto.id"
                             :label="item.orgGoodsDto.name"
                             :value="item.orgGoodsDto.goodsNo">
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
            <el-col :span="6">
              <oms-form-row :span="8" label="货品主档名称">
                <el-select v-model="params.goodsCode" :clearable="true" :remote-method="searchProduct" filterable
                           placeholder="请输入名称或编号搜索"
                           popper-class="good-selects" remote
                           @click.native.once="searchProduct('')">
                  <el-option v-for="org in detailList" :key="org.id" :label="org.name"
                             :value="org.code">
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
            <el-col :span="6">
              <oms-form-row :span="8" label="批号">
                <el-input v-model="params.batchNumber" :clearable="true" filterable
                          placeholder="请输入批号">
                </el-input>
              </oms-form-row>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="6">
              <oms-form-row :span="8" label="是否接种完">
                <el-select v-model="params.injection" placeholder="请选择">
                  <el-option v-for="item in whetherOptions" :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row :span="8" label="是否剩余处置人份">
                <el-select v-model="params.disposalOfRemainingDoses" placeholder="请选择">
                  <el-option v-for="item in whetherOptions" :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row :span="8" label="是否有报损">
                <el-select v-model="params.reportedLoss" placeholder="请选择">
                  <el-option v-for="item in whetherOptions" :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row :span="8" label="是否有损耗">
                <el-select v-model="params.loss" placeholder="请选择">
                  <el-option v-for="item in whetherOptions" :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <oms-form-row :span="8" label="接种单位入库时间">
                <el-date-picker title="范围查询（最长可选择一年）,默认半年"
                                v-model="purchasingStorageTimes"
                                type="daterange"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions">
                </el-date-picker>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row :span="8" label="">
                <el-button :disabled="loadingData" type="primary" @click="query">
                  查询
                </el-button>
                <el-button @click="resetSearchForm">重置</el-button>
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
      <el-table ref="reportTable" v-loading="loadingData"
                :data="list" border class="header-list"
                max-height="400">
        <el-table-column label="序号" type="index" :index="serialGen" fixed></el-table-column>
        <el-table-column :sortable="true" label="追溯码" prop="traceCode" width="180" fixed>
        </el-table-column>
        <el-table-column label="所属区">
          <template v-slot="{row,$index}">
            <dict :dict-group="'areaCode'" :dict-key="row.orgAreaCode"></dict>
          </template>
        </el-table-column>
        <el-table-column label="接种单位编码" prop="orgManufacturerCode" min-width="100"></el-table-column>
        <el-table-column label="接种单位名称" prop="orgName" min-width="150"></el-table-column>
        <el-table-column label="生产企业" prop="goodsFactoryName" min-width="120"></el-table-column>
        <el-table-column label="产品编码" prop="orgGoodsNumber" min-width="100"></el-table-column>
        <el-table-column label="产品名称" prop="orgGoodsName" min-width="100"></el-table-column>
        <el-table-column label="采购入库单号" prop="orderNo" min-width="180"></el-table-column>

        <el-table-column label="销售出库单号" prop="orderThirdPartyNumber"
                         min-width="180"></el-table-column>
        <el-table-column label="批号" prop="batchNumber" min-width="100"></el-table-column>
        <el-table-column label="生产日期" min-width="100">
          <template v-slot="{row}">
            {{ row.batchNumberProductionDate | date }}
          </template>
        </el-table-column>
        <el-table-column label="有效期至" min-width="100">

          <template v-slot="{row}">
            {{ row.batchNumberExpirationDate | date }}
          </template>
        </el-table-column>
        <el-table-column label="单码支数" prop="minTagUnitCount" min-width="100"></el-table-column>
        <el-table-column label="单码可用人份数" prop="singleCodeAvailablePersons" min-width="110"></el-table-column>
        <el-table-column label="已注射剂次" prop="injectedTimes" min-width="100"></el-table-column>
        <el-table-column label="已退货人份" prop="returnedPersons" min-width="100"></el-table-column>
        <el-table-column label="已报损人份" prop="reportedPersons" min-width="100"></el-table-column>
        <el-table-column label="已损耗人份" prop="lossPersons" min-width="100"></el-table-column>
        <el-table-column label="尚未处置人份" prop="notDisposedPersons" min-width="100"></el-table-column>
        <el-table-column label="采购入库时间" min-width="150">
          <template v-slot="{row}">
            {{ row.purchasingStorageTime | time }}
          </template>
        </el-table-column>
        <el-table-column label="首次注射时间" min-width="150">
          <template v-slot="{row}">
            {{ row.firstInjectionTime | time }}
          </template>
        </el-table-column>
        <el-table-column label="末次注射时间" min-width="150">
          <template v-slot="{row}">
            {{ row.lastInjectionTime | time }}
          </template>
        </el-table-column>
        <el-table-column label="退货时间" min-width="150">
          <template v-slot="{row}">
            {{ row.returnTime | time }}
          </template>
        </el-table-column>
        <el-table-column label="报损时间" min-width="150">
          <template v-slot="{row}">
            {{ row.lossReportingTime | time }}
          </template>
        </el-table-column>
        <el-table-column label="损耗时间" prop="orgName" min-width="150">
          <template v-slot="{row}">
            {{ row.lossTime | time }}
          </template>
        </el-table-column>
        <el-table-column :sortable="true" label="最后更新时间" min-width="150">
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
        orgManufacturerCode: '',
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
        purchasingStorageTime1: '',
        purchasingStorageTime2: '',
        pageNo: 1,
        pageSize: 20,
      },
      detailList: [], // 货主
      // 默认半年，即180天
      purchasingStorageTimes: [new Date(Date.now() - 3600 * 1000 * 24 * 180), new Date()],
      list: [],
      minDate: '',
      pickerOptions: {
        onPick: ({maxDate, minDate}) => {
          this.minDate = minDate;
        },
        disabledDate: (date) => {
          // 只能选择一年内的日期，不可超过一年，也不能选择未来的日期
          const year = 365 * 3600 * 1000 * 24;
          const max = Date.now();
          const time = date.getTime();

          let disabled = time > max;
          if (!disabled && this.minDate) {
            const minTime = this.minDate.getTime() - year;
            let maxTime = this.minDate.getTime() + year;
            if (maxTime > max) {
              maxTime = max;
            }

            disabled = time < minTime || time > maxTime;
          }

          return disabled;
        },
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近半年',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一年',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
            picker.$emit('pick', [start, end]);
          }
        },
          {
            text: '去年',
            onClick(picker) {
              const today = new Date();
              const year = today.getFullYear() - 1;
              const start = new Date(year, 0, 1);
              const end = new Date(year, 11, 31);
              picker.$emit('pick', [start, end]);
            }
          }]
      },
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
      manufacturerCode: ''
    }
  },
  computed: {
    orgAreas() {
      const areas = this.$getDict('areaCode').map(item => ({value: item.key, label: item.label}));
      if (!this.hasPov) {
        return areas;
      }

      return areas.filter(item => item.value === this.currOrg.orgAreaCode);
    },
    currOrg() {
      return this.$store.state.org;
    },
    hasPov() {
      return this.currOrg.orgRelationTypeList && this.currOrg.orgRelationTypeList.includes('POV');
    },
  },
  watch: {
    hasPov(val) {
      if (this.hasPov) {
        // 如果是接种单位的话，保存单位编码，过滤接种单位
        this.manufacturerCode = this.currOrg.manufacturerCode;
        this.params.orgAreaCode = this.currOrg.orgAreaCode;
        // 显示当前接种单位
        this.filterInjectionOrgs("")
        this.params.orgManufacturerCode = this.manufacturerCode;
      }

      this.search();
    },
    purchasingStorageTimes(val) {
      if (!val) {
        this.purchasingStorageTimes = [new Date(Date.now() - 3600 * 1000 * 24 * 180), new Date()];
      } else {
        this.query();
      }
    },
    "params.orgAreaCode": function (val) {
      this.params.orgManufacturerCode = '';
      this.filterInjectionOrgs('');
    },
    "params.orgManufacturerCode": function (val) {
      if (!val) return;
      this.search();
    }
  },
  methods: {

    // 序号从1开始，翻页不重置
    serialGen(index) {
      const {pageNo, pageSize} = this.params;
      return index + 1 + (pageNo - 1) * pageSize;
    },
    timesHandle() {
      if (this.purchasingStorageTimes.length == 2) {
        this.params.purchasingStorageTime1 = this.$formatAryTime(this.purchasingStorageTimes, 0) + ' 00:00:00';
        this.params.purchasingStorageTime1 = this.$formatAryTime(this.purchasingStorageTimes, 1) + ' 23:59:59';
      } else {
        this.params.createTime1 = '';
        this.params.createTime2 = '';
      }
    },
    exportFile() {
      this.timesHandle();
      this.isLoading = true;
      this.$store.commit('initPrint', {isPrinting: true, moduleId: '/report/trace-code'});
      this.$http.get('/trace-code/report/export', {params: this.params})
        .then(res => {
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/trace-code'});
          if (!res.data) {
            // 如果超过5s获取不到结果就等异步处理完再去我的下载里面手动下载
            this.$notify.success('异步导出处理中，请稍后去【我的下载】查看');
          } else {
            // utils.download(res.data,'追溯码使用情况');
            utils.download(res.data);
          }
        })
        .catch(error => {
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/trace-code'});
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || '导出失败'
          });
        });
    },
    query() {
      this.params.pageNo = 1;
      this.search();
    },
    search() {
      this.timesHandle();
      this.loadingData = true;
      const params = {...this.params};
      this.$http.get('/trace-code/report', {params})
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
        orgAreaCode: this.params.orgAreaCode,
        //接种单位登录，默认：本单位，不可切换,manufacturerCode只有接种单位登录才有值
        manufacturerCode: this.manufacturerCode,
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

      this.$http.post('/queryOrgList',params).then(res => {
        this.injectionOrgs = res.data.map(item => ({
          id: item.id,
          name: item.name,
          manufacturerCode: item.manufacturerCode
        }));
      });
    },
    filterOrgGoods(keyWord) {
      Vaccine.query({keyWord, orgId: this.manufacturerCode}).then(res => {
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
    resetSearchForm() {

      this.totalCount = 0;

      //  3)	采购入库单号：接种单位采购入库单号，精确查询
      this.params.orderNo = '';
      //  4)	销售出库单号：疾控销售出库单号，精确查询
      this.params.orderThirdPartyNumber = '';
      //  5)	追溯码：精确查询
      this.params.traceCode = '';
      //  6)	货主货品名称：模糊搜索、可多选。与接种单位联动。只可选择该接种单位下货品。
      this.params.orgGoodsNumber = '';
      //  7)	货品主档名称：模糊搜索、可多选。
      this.params.goodsCode = '';
      //  8)	是否接种完（单码可用人份数=已注射剂次）：下拉选择。枚举：全部/是/否，默认：全部
      this.params.injection = '';
      //  9)	批号：精确查询。
      this.params.batchNumber = '';
      // 10)	是否剩余处置人份(尚未处置人份是否为0)：下拉选择。枚举：全部/是/否，默认：全部
      this.params.disposalOfRemainingDoses = '';
      // 11)	是否有报损（已报损人份不等于0）：下拉选择。枚举：全部/是/否，默认：全部
      this.params.reportedLoss = '';
      // 12)	是否有损耗（已损耗人份不等于0）：下拉选择。枚举：全部/是/否，默认：全部
      this.params.loss = '';
      this.params.pageNo = 1;
      this.params.pageSize = 20;

      if (!this.hasPov) {
        // 只有当前登录的用户不是接种单位的时候，才清空所在区域和接种单位
        this.params.orgAreaCode = '';
        this.params.orgManufacturerCode = '';
      }

      // 这个会触发监听
      this.purchasingStorageTimes = [new Date(Date.now() - 3600 * 1000 * 24 * 180), new Date()];
    },
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
