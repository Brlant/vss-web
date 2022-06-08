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

            <el-col :span="8" offset="6">
              <oms-form-row :span="8" label="">
                <el-button :disabled="loadingData" type="primary" @click="search">
                  查询
                </el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
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

        <el-table-column label="创建时间" min-width="150">
          <template v-slot="{row}">
            {{ row.createTime | time }}
          </template>
        </el-table-column>

        <el-table-column label="完成时间" min-width="150">
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
              <el-col :span="6" offset="3">
                <perm label="trace-code-download-download">
                  <el-button type="success" plain @click="download(row.id,row.fileUrl,row.fileName)">下载</el-button>
                </perm>
              </el-col>
              <el-col :span="6" offset="3">
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
          if (maxDate) {
            this.search();
          }
          console.log(minDate, maxDate)
        },
        disabledDate: (date) => {
          // 只能选择一年内的日期，不可超过一年，也不能选择未来的日期
          // const year = 365 * 3600 * 1000 * 24;
          const now = Date.now();
          const time = date.getTime();

          // let disabled = time > now;
          // if (!disabled && this.minDate) {
          //   const minTime = this.minDate.getTime() - year;
          //   let maxTime = this.minDate.getTime() + year;
          //   if (maxTime > now) {
          //     maxTime = now;
          //   }
          //
          //   disabled = time < minTime || time > maxTime;
          // }

          return time > now;
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
    createTimes(val) {
      if (!val) {
        this.minDate = '';
        this.params.createTime1 = '';
        this.params.createTime2 = '';
        this.search();
      }
    },
    completeTimes(val) {
      if (!val) {
        this.minDate = '';
        this.params.completeTime1 = '';
        this.params.completeTime2 = '';
        this.search();
      }
    }
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
      this.params.completeTime1 = this.$formatAryTime(this.completeTimes, 1);
      this.params.completeTime2 = this.$formatAryTime(this.completeTimes, 1);
    },
    exportFile() {
      this.timesHandle();
      this.isLoading = true;
      this.$store.commit('initPrint', {isPrinting: true, moduleId: '/report/trace-code'});
      this.$http.get('/trace-code/report/export', {params: this.params})
        .then(res => {
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/trace-code'});

          const url = res.data;
          if (!url) {
            this.$notify.error({
              message: '导出失败'
            });

            return;
          }

          utils.download(url, '追溯码使用情况');

        })
        .catch(error => {
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/trace-code'});
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || '导出失败'
          });
        });
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
      this.params = {};
      this.createTimes = [];
      this.totalCount = 0;
      this.search();
    },
    download(id, fileUrl, fileName) {
      utils.download(fileUrl, fileName);
      this.$http.put('/trace-code/download/' + id, {fileUrl, fileName});
    },
    del(id, fileName) {
      this.$http.delete('/trace-code/download/' + id, {params: {fileName}})
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
