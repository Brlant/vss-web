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
              <oms-form-row :span="6" label="货主订单号">
                <el-input v-model="params.orderNo" placeholder="请输入货主订单号"></el-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="5" label="货主疫苗">
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
              <oms-form-row :span="6" label="追溯码">
                <oms-input v-model="params.code"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="生产厂家">
                <el-select v-model="params.factoryId" :clearable="true" :remote-method="filterFactory" filterable
                           placeholder="请输入名称/系统代码"
                           popperClass="good-selects" remote
                           @click.native.once="filterFactory('')">
                  <el-option v-for="org in factories" :key="org.id" :label="org.name" :value="org.id">
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
              <oms-form-row :span="5" label="损耗时间">
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
      <el-table ref="reportTable" v-loading="loadingData" :data="reportList" :header-row-class-name="'headerClass'"
                :maxHeight="getHeight"
                :summary-method="getSummaries" border
                border class="header-list" show-summary>
        <el-table-column :sortable="true" label="货主订单号" prop="orderNo"></el-table-column>
        <el-table-column :sortable="true" label="货主" prop="orgName"></el-table-column>
        <el-table-column :sortable="true" label="所属区域" prop="orgAreaName"></el-table-column>
        <el-table-column :sortable="true" label="追溯码" prop="code"></el-table-column>
        <el-table-column :sortable="true" label="疫苗名称" prop="orgGoodsName"></el-table-column>
        <el-table-column :sortable="true" label="批号" prop="batchNumber"></el-table-column>
        <el-table-column :sortable="true" label="有效期至" prop="expirationDate"></el-table-column>
        <el-table-column :sortable="true" label="损耗人份" prop="amount"></el-table-column>
        <el-table-column :sortable="true" label="损耗时间" prop="createTime"></el-table-column>
        <el-table-column :sortable="true" label="生产厂家" prop="factoryName"></el-table-column>
        <el-table-column :sortable="true" label="状态" prop="status" align="center">
          <template v-slot="{row}">
            <el-tag :type="getTagTypeByStatus(row.status)">{{ getOrderStatus(row.status) }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="reportList.length" class="text-center">
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
import utils from '@/tools/utils'
import {BaseInfo, Vaccine} from '@/resources'
import ReportMixin from '@/mixins/reportMixin'

export default {
  name: "wastage-report-vss",
  mixins: [ReportMixin],
  data() {
    return {
      showSearch: true,
      // 列表和导出的查询参数
      params: {
        // 货主订单号
        orderNo: '',
        // 货主疫苗
        orgGoodsId: '',
        // 追溯码
        code: '',
        // 生产厂家
        factoryId: '',
        // 损耗时间-开始时间
        createStartTime: '',
        // 损耗时间-结束时间
        createEndTime: '',
        pageNo: 1,
        pageSize: 20,
      },
      createTimes: [],
      reportList: [],
      factories: [],
      orgGoods: [],
      isLoading: false,
      loadingData: false,
      totalCount: 0,
    }
  },
  computed: {
    getHeight: function () {
      return parseInt(this.$store.state.bodyHeight, 10) - 140 + this.fixedHeight + (this.showSearch ? 0 : 140);
    }
  },
  methods: {
    getTagTypeByStatus(status) {
      if (status == 0) {
        return '';
      }
      if (status == 4) {
        return 'success';
      }
      if (status == 5) {
        return 'danger';
      }
    },
    getOrderStatus(status) {
      return utils.lossFillType[status].title;
    },
    exportFile() {
      this.params.createStartTime = this.$formatAryTime(this.createTimes, 0);
      this.params.createEndTime = this.$formatAryTime(this.createTimes, 1);
      this.isLoading = true;
      this.$store.commit('initPrint', {isPrinting: true, moduleId: '/report/wastage-report-vss'});
      this.$http.get('/erp-statement/wastage-report/export', {params: this.params}).then(res => {
        utils.download(res.data.path, '损耗报表');
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
      this.params.createStartTime = this.$formatAryTime(this.createTimes, 0);
      this.params.createEndTime = this.$formatAryTime(this.createTimes, 1);
      this.loadingData = true;
      this.$http.get('/erp-statement/wastage-report', {params: this.params}).then(res => {
        this.reportList = res.data.list;
        this.totalCount = res.data.count;
        this.loadingData = false;
        this.setFixedHeight();
      });
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
    filterOrgGoods(keyWord) {
      Vaccine.query({keyWord}).then(res => {
        this.orgGoods = res.data.list;
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
    }
  },
  mounted() {
    this.search();
  }
}
</script>

<style scoped>

</style>
