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
      <div class="opera-btn-group" :class="{up:!showSearch}">
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
              <oms-form-row label="业务日期" :span="5">
                <el-col :span="24">
                  <el-date-picker
                    v-model="bizDateAry"
                    type="daterange"
                    placeholder="请选择" format="yyyy-MM-dd">
                  </el-date-picker>
                </el-col>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row label="" :span="2">
                <perm label="shipment-form-export">
                  <el-button type="primary" @click="search" :disabled="loadingData">
                    查询
                  </el-button>
                  <el-button :plain="true" type="success" @click="exportFile" :disabled="isLoading">
                    导出Excel
                  </el-button>
                </perm>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table v-show="dataList.length" :data="dataList" class="header-list" ref="reportTable" :maxHeight="getHeight"
                border
                :header-row-class-name="'headerClass'" v-loading="loadingData">
        <el-table-column v-if="firstLine.length===0"></el-table-column>
        <template v-for="(item, index) in firstLine">
          <el-table-column :prop="item.key" :label="item.name"></el-table-column>
        </template>
      </el-table>
      <div class="empty-info" v-show="!dataList.length">暂无数据</div>
    </div>
  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import ReportMixin from '@/mixins/reportMixin';

  export default {
    mixins: [ReportMixin],
    data() {
      return {
        loadingData: false,
        outReport: {},
        firstLine: [],
        dataList: [],
        showSearch: true,
        searchWord: {
          createStartTime: '',
          createEndTime: ''
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
      }
    },
    methods: {
      exportFile: function () {
        this.searchWord.createStartTime = this.formatTime(this.bizDateAry ? this.bizDateAry[0] : '');
        this.searchWord.createEndTime = this.formatTime(this.bizDateAry ? this.bizDateAry[1] : '');
        let params = Object.assign({}, this.searchWord);
        this.isLoading = true;
        this.$store.commit('initPrint', {isPrinting: true, moduleId: '/report/out'});
        this.$http.get('/erp-statement/out-warehouse/export', {params}).then(res => {
          utils.download(res.data.path, '出库一览表');
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/out'});
        }).catch(error => {
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/out'});
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },
      search: function () {// 搜索
        if (!this.bizDateAry) {
          return this.$notify.info({
            message: '请选择业务日期'
          });
        }
        this.searchWord.createStartTime = this.formatTime(this.bizDateAry[0]);
        this.searchWord.createEndTime = this.formatTime(this.bizDateAry[1]);
        let params = Object.assign({}, this.searchWord);
        this.loadingData = true;
        this.$http.get('/erp-statement/out-warehouse', {params}).then(res => {
          this.firstLine = res.data.map && res.data.map.firstLine || [];
          this.dataList = res.data.map && res.data.map.data || [];
          this.loadingData = false;
          this.setFixedHeight();
        });
      },
      resetSearchForm: function () {
        this.searchWord = {
          createStartTime: '',
          createEndTime: ''
        };
        this.bizDateAry = '';
      },
      formatTime: function (date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      }
    }
  };
</script>
