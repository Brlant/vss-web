<template>
  <div class="order-page">
    <div class="container">
      <div :class="{up:!showSearch}" class="opera-btn-group">
        <div class="opera-icon">
          <span @click="showSearch = !showSearch" class="pull-left switching-icon">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form class="advanced-query-form clearfix" onsubmit="return false" style="padding-top: 10px"
                 v-show="showSearch">
          <el-row>
            <el-col :span="9">
              <oms-form-row :span="8" label="接种时间" is-require>
                <el-date-picker
                  v-model="actualTime"
                  type="daterange"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间">
                </el-date-picker>
              </oms-form-row>
            </el-col>
            <el-col :span="15">
              <oms-form-row :span="2" label="">
                <el-button @click="searchInOrder" native-type="submit" type="primary">查询</el-button>
                <el-button @click="resetSearchForm" native-type="reset">重置</el-button>
                <perm label="pov-injection-community-task-export" style="margin-left: 10px">
                  <el-button @click="exportExcel" type="success" plain>导出Excel</el-button>
                </perm>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="order-list clearfix" style="height: 1000px">
        <el-row class="order-list-header">
          <el-col :span="4">接种单位</el-col>
          <el-col :span="3">接种医生</el-col>
          <el-col :span="2">出库日期</el-col>
          <el-col :span="6">疫苗名称</el-col>
          <el-col :span="6">批号</el-col>
          <el-col :span="2">数量</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="!taskList.length">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div class="order-list-body flex-list-dom" v-else="">
          <div class="order-list-item order-list-item-bg" v-for="item in taskList">
            <el-row>
              <el-col :span="4">
                {{item.povName}}
              </el-col>
              <el-col :span="3">
                {{item.taskOperatorName}}
              </el-col>
              <el-col :span="2">
                {{item.outDate | date}}
              </el-col>
              <el-col :span="6">
                <div>{{item.orgGoodsName}}</div>
                <div class="font-gray">{{item.specification}}</div>
                <div class="font-gray">
                  <el-tooltip content="生产厂商" placement="right">
                    <span> {{item.factoryName}}</span>
                  </el-tooltip>
                </div>
              </el-col>
              <el-col :span="6">
                {{item.batchNumber}}
                <div class="font-gray">生产日期：{{item.productionDate | date}}</div>
                <div class="font-gray">有效期：{{item.expirationDate | date}}</div>
                <div class="font-gray" v-show="item.batchReleaseNumber">批签发号：{{item.batchReleaseNumber}}</div>
              </el-col>
              <el-col :span="2">
                <div>损耗：{{item.lossQuantity}}</div>
                <div>使用：{{item.usageQuantity}}</div>
                <div>合计：{{item.allQuantity}}</div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import utils from '@/tools/utils';

  export default {
    data: function () {
      return {
        loadingData: false,
        showSearch: true,
        taskList: [],
        injectionType: utils.injectionType,
        searchCondition: {
          actualStartTime: '',
          actualEndTime: ''
        },
        actualTime: '',
        currentItem: {},
        form: {},
        defaultIndex: 0,
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        },
        width: 800
      };
    },
    mounted() {

    },
    computed: {},
    methods: {
      queryBatchNumbers(query) {
        if (!this.searchCondition.vaccineId) {
          this.$notify.info('请先选择疫苗');
          return;
        }
        this.queryBatchNumberList({
          keyWord: query
        });
      },
      orgGoodsIdChange(val) {
        this.batchNumberList = [];
        this.searchCondition.batchNumberId = '';
        this.queryBatchNumbers();
      },
      searchInOrder: function () {// 搜索
        this.searchCondition.actualStartTime = this.$formatAryTime(this.actualTime, 0);
        this.searchCondition.actualEndTime = this.$formatAryTime(this.actualTime, 1);
        this.queryList(1);
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          actualStartTime: '',
          actualEndTime: ''
        };
        this.actualTime = '';
        Object.assign(this.searchCondition, temp);
        this.taskList = [];
      },
      resetRightBox: function () {
        this.defaultIndex = 0;
        this.currentItem = {};
        this.form = {};
      },
      showItem(item) {
        this.width = 600;
        this.currentItem = item;
        this.defaultIndex = 3;
      },
      handleSizeChange(val) {
        this.pager.pageSize = val;
        this.queryList(1);
      },
      handleCurrentChange(val) {
        this.queryList(val);
      },
      queryList: function (pageNo) {
        if (!this.actualTime) return this.$notify.info('请选择接种时间');
        let params = Object.assign(this.searchCondition);
        this.loadingData = true;
        this.$http.get('/injection-task/injection-task-used-query', {params}).then(res => {
          this.taskList = res.data;
          this.loadingData = false;
        });
      },
      exportExcel() {
        this.searchCondition.actualStartTime = this.$formatAryTime(this.actualTime, 0);
        this.searchCondition.actualEndTime = this.$formatAryTime(this.actualTime, 1);
        let params = Object.assign({}, this.searchCondition);
        if (!this.actualTime) return this.$notify.info('请选择接种时间');
        this.$store.commit('initPrint', {isPrinting: true, moduleId: this.$route.path});
        this.$http.get('/injection-task/community/export', {params}).then(res => {
          utils.download(res.data.path, '疫苗使用情况统计表');
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
        }).catch(error => {
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
          this.$notify.error({
            message: error.response && error.response && error.response.data && error.response.data.msg || '导出失败'
          });
        });
      }
    }
  };
</script>
