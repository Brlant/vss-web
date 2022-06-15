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
              <oms-form-row :span="8" label="任务类型">
                <el-select v-model="params.taskType" :clearable="true" filterable
                           placeholder="支持搜索区域名称">
                  <el-option v-for="item in taskTypes" :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="10">
              <oms-form-row :span="10" label="创建时间">
                <el-date-picker v-model="createTimes"
                                type="daterange"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions">
                </el-date-picker>
              </oms-form-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <oms-form-row :span="8" label="状态">
                <el-select v-model="params.taskStatus" :clearable="true" filterable
                           placeholder="支持搜索区域名称">
                  <el-option v-for="item in taskStatusList" :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="10">
              <oms-form-row :span="10" label="完成时间">
                <el-date-picker v-model="completeTimes"
                                type="daterange"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions">
                </el-date-picker>
              </oms-form-row>
            </el-col>
          </el-row>
          <el-row>

            <el-col :span="8" :offset="6">
              <oms-form-row :span="8" label="">
                <el-button :disabled="loadingData" type="primary" @click="search">
                  查询
                </el-button>
                <el-button @click="resetSearchForm">重置</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table ref="reportTable" v-loading="loadingData"
                :data="list" border class="header-list"
                max-height="400">
        <el-table-column label="序号" type="index" :index="serialGen" fixed min-width="80"></el-table-column>
        <el-table-column label="任务类型" min-width="100">
          <template v-slot="{row,$index}">
            <div v-if="row.taskType == 0">追溯码使用情况表</div>
            <div v-else>未知</div>
          </template>
        </el-table-column>

        <el-table-column :sortable="true" prop="createTime" label="创建时间" min-width="150">
          <template v-slot="{row}">
            {{ row.createTime | time }}
          </template>
        </el-table-column>

        <el-table-column :sortable="true" prop="completeTime" label="完成时间" min-width="150">
          <template v-slot="{row}">
            {{ row.completeTime | time }}
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="150" align="center">
          <template v-slot="{row}">
            <el-tag type="info" v-if="row.taskStatus == 0">待处理</el-tag>
            <el-tag type="warn" v-else-if="row.taskStatus == 1">处理中</el-tag>
            <el-tag type="success" v-else-if="row.taskStatus == 2">已完成</el-tag>
            <el-tag v-else>未知</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="creator" min-width="100"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template v-slot="{row}">
            <el-row :gutter="15">
              <el-col :span="6" :offset="3">
                <perm label="trace-code-download-download">
                  <el-button v-if="row.taskStatus == 2" type="success" plain
                             @click="download(row.id)">下载
                  </el-button>
                </perm>
              </el-col>
              <el-col :span="6" :offset="3">
                <perm label="trace-code-download-del">
                  <el-button type="danger" plain @click="del(row.id,row.fileName)">删除</el-button>
                </perm>
              </el-col>
            </el-row>

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
import ReportMixin from '@/mixins/reportMixin'
import utils from '@/tools/utils'
import Perm from '@/components/common/perm'

export default {
  components: {Perm},
  mixins: [ReportMixin],
  data() {
    return {
      showSearch: true,
      // 列表和导出的查询参数
      params: {
        // 任务类型
        taskType: '',
        // 状态：全部/待处理/处理中/已完成   默认：全部，即''
        taskStatus: '',
        // 创建时间与完成时间的范围筛选
        createTime1: '',
        createTime2: '',
        completeTime1: '',
        completeTime2: '',
        pageNo: 1,
        pageSize: 20,
      },
      detailList: [], // 货主
      createTimes: [],
      completeTimes: [],
      list: [],
      minDate: '',
      pickerOptions: {
        onPick: ({maxDate, minDate}) => {
          this.minDate = minDate;
        },
        disabledDate: (date) => {
          // 只能选择一年内的日期，不可超过一年，也不能选择未来的日期
          const max = Date.now() + 24 * 60 * 60 * 1000;
          const time = date.getTime();
          return time > max;
        },
      },
      whetherOptions: [
        {value: '', label: '全部'},
        {value: '1', label: '是'},
        {value: '0', label: '否'},
      ],
      taskTypes: [
        {value: '', label: '全部'},
        {value: '1', label: '追溯码使用情况表'},
      ],
      taskStatusList: [
        {value: '', label: '全部'},
        {value: '0', label: '待处理'},
        {value: '1', label: '处理中'},
        {value: '2', label: '已完成'},
      ],
      orgGoods: [],
      isLoading: false,
      loadingData: false,
      totalCount: 0,
      injectionOrgs: [],//所有的接种单位
      povOrgId: '',
      orgAreas: []
    }
  },
  computed: {
    areaCodeDict() {
      return this.$getDict('areaCode').map(item => ({value: item.key, label: item.label}));
    },
    currOrg() {
      return this.$store.state.org;
    },
    hasPov() {
      const types = this.currOrg.orgRelationTypeList;
      if (!types) return false;
      return this.areaCodeDict.length > 0 && types.includes('POV');
    },
  },
  watch: {
    hasPov(val) {
      if (this.hasPov) {
        // 如果是接种单位的话，保存单位编码，过滤接种单位
        this.povOrgId = this.currOrg.id;
        this.params.orgAreaCode = this.currOrg.orgAreaCode;
        // 当前是接种单位登录的，取当前单位所在区域
        console.log(this.areaCodeDict);
        this.orgAreas = this.areaCodeDict.filter(item => item.value === this.currOrg.orgAreaCode);
        console.log(this.currOrg.orgAreaCode);
        console.log(this.orgAreas);
      } else {
        // 默认取字典数据
        this.orgAreas = this.areaCodeDict;
      }
    },
    povOrgId(val) {
      this.filterInjectionOrgs();
    },
  },
  methods: {
    // 序号从1开始，翻页不重置
    serialGen(index) {
      const {pageNo, pageSize} = this.params;
      return index + 1 + (pageNo - 1) * pageSize;
    },
    timesHandle() {
      this.params.createTime1 = this.$formatAryTime(this.createTimes, 0);
      this.params.createTime2 = this.$formatAryTime(this.createTimes, 1);
      this.params.completeTime1 = this.$formatAryTime(this.completeTimes, 0);
      this.params.completeTime2 = this.$formatAryTime(this.completeTimes, 1);
    },
    search() {
      this.timesHandle();
      this.loadingData = true;
      this.$http.get('/trace-code/download', {params: this.params})
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
      this.params = {
        // 任务类型
        taskType: '',
        // 状态：全部/待处理/处理中/已完成   默认：全部，即''
        taskStatus: '',
        // 创建时间与完成时间的范围筛选
        createTime1: '',
        createTime2: '',
        completeTime1: '',
        completeTime2: '',
        pageNo: 1,
        pageSize: 20,
      };
      this.createTimes = [];
      this.completeTimes = [];
      this.totalCount = 0;
      this.search();
    },
    download(id) {
      this.$http.put(`/trace-code/download/download/${id}`)
        .then(res => {
          const {fileUrl} = res.data;
          utils.download(fileUrl);
        })
        .catch(err => {
          console.error({...err});
        });
    },
    del(id, fileName) {
      let index = this.list.findIndex(item => item.id === id);
      this.list.splice(index, 1);

      this.$http.delete(`/trace-code/download/${id}?fileName=${fileName || ''}`)
        .then(res => {
          this.$notify.success('删除成功');
        });
    }
  },
  mounted() {
    this.search();
  }
}
</script>

<style scoped>

</style>
