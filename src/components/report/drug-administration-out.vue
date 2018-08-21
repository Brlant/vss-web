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
                  <el-button :plain="true" type="success" @click="exportFile" :disabled="isLoading">
                    导出
                  </el-button>
                </perm>
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

  export default {
    mixins: [ReportMixin],
    data () {
      return {
        loadingData: false,
        outReport: {},
        firstLine: [],
        showSearch: true,
        searchWord: {
          createStartTime: '',
          createEndTime: '',
          type: ''
        },
        bizDateAry: '',
        isLoading: false
      };
    },
    computed: {
      currentWidth () {
        let length = this.outReport.map && this.outReport.map.firstLine.length || 0;
        if (!length) return 150;
        if (length > 0 && length < 8) return `${1080 / length}`;
        if (length > 7) return 150;
      },
      getHeight: function () {
        return parseInt(this.$store.state.bodyHeight, 10) - 80 + this.fixedHeight;
      }
    },
    watch: {
      '$route.meta.type' () {
        this.resetSearchForm();
      }
    },
    methods: {
      exportFile: function () {
        let moduleId = this.$route.meta.type === '0' ? '/drug-administration/report/in' : '/drug-administration/report/out';
        let url = this.$route.meta.type === '0' ? '/erp-statement/drug-administration/in-warehouse/export' : '/erp-statement/drug-administration/out-warehouse/export';
        let fileName = this.$route.meta.type === '0' ? '购进数据.xml' : '销售数据.xml';
        let startTime = this.formatTime(this.bizDateAry ? this.bizDateAry[0] : '');
        let endTime = this.formatTime(this.bizDateAry ? this.bizDateAry[1] : '');
        if (startTime && endTime) {
          fileName = startTime + '至' + endTime + fileName;
        }
        this.searchWord.createStartTime = startTime + ' ' + '00:00:00';
        this.searchWord.createEndTime = endTime + ' ' + '23:59:59';
        this.searchWord.type = this.$route.meta.type;
        let params = Object.assign({}, this.searchWord);
        this.isLoading = true;
        this.$store.commit('initPrint', {isPrinting: true, moduleId: moduleId});
        this.$http.get(url, {params}).then(res => {
          utils.downloadXml.call(this, res.data.path, fileName);
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: moduleId});
        }).catch(error => {
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: moduleId});
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },
      resetSearchForm: function () {
        this.searchWord = {
          createStartTime: '',
          createEndTime: '',
          type: ''
        };
        this.bizDateAry = '';
      },
      formatTime: function (date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      }
    }
  };
</script>
