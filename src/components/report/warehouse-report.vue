<style lang="scss" scoped="">

.el-table__body-wrapper, .el-table__footer-wrapper, .el-table__header-wrapper {
  width: auto;
}

.el-table {
  width: inherit;
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
              <oms-form-row :span="5" label="业务日期">
                <el-col :span="24">
                  <el-date-picker
                    v-model="bizDateAry"
                    format="yyyy-MM-dd"
                    placeholder="请选择" type="daterange">
                  </el-date-picker>
                </el-col>
              </oms-form-row>
            </el-col>
            <el-col :span="10">
              <oms-form-row :span="4" label="疫苗名称">
                <el-select v-model="searchWord.orgGoodsIdList" :clearable="true" :remote-method="filterOrgGoods"
                           filterable
                           placeholder="请输入名称或编号搜索疫苗名称"
                           popper-class="good-selects" remote multiple
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
                        v-show="item.orgGoodsDto.salesFirmName">供应商:</span>{{ item.orgGoodsDto.salesFirmName }}
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
              <oms-form-row :span="6" label="疫苗种类" style="height: 36px">
                <el-radio-group v-model="searchWord.vaccineType" size="small">
                  <el-radio-button label="0">免疫规划疫苗</el-radio-button>
                  <el-radio-button label="1">非免疫规划疫苗</el-radio-button>
                </el-radio-group>
              </oms-form-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <oms-form-row :span="5" label="生产厂家">
                <el-select v-model="searchWord.factoryId" :clearable="true" :remote-method="filterOrg" filterable
                           placeholder="请输入名称搜索生产厂家"
                           popperClass="good-selects" remote
                           @click.native.once="filterOrg('')">
                  <el-option v-for="org in factoryList" :key="org.id" :label="org.name" :value="org.id">
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
              <oms-form-row :span="10" label="单据类型">
                <el-select v-model="searchWord.bizType" placeholder="请选择单据类型">
                  <el-option v-for="item in bizTypeList" :key="item.key" :label="item.label"
                             :value="item.key"></el-option>
                </el-select>
              </oms-form-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <oms-form-row :span="5" label="来源单位">
                <el-select v-model="searchWord.sourceOrgId" :clearable="true" :remote-method="filterSourceOrg"
                           filterable
                           placeholder="请输入名称搜索来源单位"
                           popperClass="good-selects" remote
                           @click.native.once="filterSourceOrg('')">
                  <el-option v-for="org in sourceOrgList" :key="org.id" :label="org.name" :value="org.id">
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
              <oms-form-row :span="5" label="去向单位">
                <el-select v-model="searchWord.directOrgId" :clearable="true" :remote-method="filterDirectOrg"
                           filterable
                           placeholder="请输入名称搜索去向单位"
                           popperClass="good-selects" remote
                           @click.native.once="filterDirectOrg('')">
                  <el-option v-for="org in directOrgList" :key="org.id" :label="org.name" :value="org.id">
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
              <oms-form-row :span="10" label="">
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
                <el-button :disabled="isLoading" :plain="true" type="success" @click="exportFile">
                  导出
                </el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import utils from '@/tools/utils';
import ReportMixin from '@/mixins/reportMixin';
import {BaseInfo, Vaccine} from "@/resources";

export default {
  mixins: [ReportMixin],
  data() {
    return {
      loadingData: false,
      outReport: {},
      firstLine: [],
      orgGoods: [],
      factoryList: [],
      batchNumberList: [],
      sourceOrgList: [],
      directOrgList: [],
      showSearch: true,
      searchWord: {
        orgGoodsIdList: [],
        factoryId: '',
        batchNumberId: '',
        vaccineType: '',
        bizType: '',
        sourceOrgId: '',
        directOrgId: '',
        startTime: '',
        endTime: ''
      },
      bizDateAry: '',
      isLoading: false
    };
  },
  computed: {
    currentWidth() {
      let length = this.outReport.map && this.outReport.map.firstLine.length || 0;
      if (!length) return 150;
      if (length > 0 && length < 8) return `${1080 / length}`;
      if (length > 7) return 150;
    },
    getHeight: function () {
      return parseInt(this.$store.state.bodyHeight, 10) - 80 + this.fixedHeight;
    },
    bizTypeList() {
      let ary = this.$getDict('bizType');
      ary.push({key: '3-0', label: '接种'})
      return ary;
    },
    vaccineSignList() {
      let ary = this.$getDict('vaccineType') || [];
      return ary.filter(f => f.key < 2);
    }
  },
  watch: {
    '$route.meta.type'() {
      this.resetSearchForm();
    }
  },
  methods: {
    filterOrgGoods(query) {
      let params = Object.assign({}, {
        keyWord: query
      });
      Vaccine.query(params).then(res => {
        this.orgGoods = res.data.list;
      });
    },
    filterOrg: function (query) {// 过滤供货商
      let orgId = this.$store.state.user.userCompanyAddress;
      if (!orgId) {
        this.searchWord.factoryId = '';
        this.factoryList = [];
        return;
      }
      BaseInfo.queryOrgByReation(orgId, {keyWord: query, relation: '1'}).then(res => {
        this.factoryList = res.data;
      });
    },
    filterSourceOrg: function (query) {
      BaseInfo.query({keyWord: query}).then(res => {
        this.sourceOrgList = res.data.list;
      });
    },
    filterDirectOrg: function (query) {
      BaseInfo.query({keyWord: query}).then(res => {
        this.directOrgList = res.data.list;
      });
    },
    filterBatchNumber(query) {
      this.$http.get('erp-stock/batch-number', {params: {keyWord: query}}).then(res => {
        this.batchNumberList = res.data.list;
      });
    },
    searchProduct(keyWord) {
      if (!this.factoryId) return;
      let params = Object.assign({}, {
        keyWord: keyWord,
        salesFirm: this.factoryId
      });
      Vaccine.query(params).then(res => {
        this.goodesList = res.data.list;
      });
    },
    exportFile: function () {
      if (!this.bizDateAry) {
        this.$notify.info("请选择业务日期");
        return;
      }
      if (!this.searchWord.orgGoodsIdList || this.searchWord.orgGoodsIdList < 1) {
        this.$notify.info("请选择需要查询的疫苗");
        return;
      }
      let moduleId = '/warehouse/report';
      let fileName = '出入库登记表';
      let startTime = this.$formatAryTime(this.bizDateAry, 0);
      let endTime = this.$formatAryTime(this.bizDateAry, 1);
      if (startTime && endTime) {
        fileName = startTime + '至' + endTime + fileName;
      }
      this.searchWord.startTime = startTime ? startTime + ' ' + '00:00:00' : '';
      this.searchWord.endTime = endTime ? endTime + ' ' + '23:59:59' : '';
      let params = Object.assign({}, this.searchWord);
      this.isLoading = true;
      this.$store.commit('initPrint', {isPrinting: true, moduleId: moduleId});
      this.$http.get("/erp-statement/sz-warehouse-detail/export", {params}).then(res => {
        utils.download(res.data.path, fileName);
        this.isLoading = false;
        this.$store.commit('initPrint', {isPrinting: false, moduleId: moduleId});
      }).catch(error => {
        this.isLoading = false;
        this.$store.commit('initPrint', {isPrinting: false, moduleId: moduleId});
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
        });
      });
    },
    resetSearchForm: function () {
      this.searchWord = {
        orgGoodsIdList: [],
        factoryId: '',
        batchNumberId: '',
        vaccineType: '',
        bizType: '',
        sourceOrgId: '',
        directOrgId: '',
        startTime: '',
        endTime: ''
      };
      this.bizDateAry = '';
    },
    formatTime: function (date) {
      return date ? this.$moment(date).format('YYYY-MM-DD') : '';
    }
  }
};
</script>
