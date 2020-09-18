<style lang="scss" scoped="">

.R {
  word-wrap: break-word;
  word-break: break-all;
}

.good-selects {
  .el-select-dropdown__item {
    height: auto;
    width: 300px;
  }
}

.align-word {
  letter-spacing: 1em;
  margin-right: -1em;
}

.order-list-item {
  cursor: pointer;
}

.good-selects {
  .el-select-dropdown__item {
    width: auto;
  }
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
          <!--<span class="">-->
          <!--<i class="el-icon-t-search"></i> 筛选查询-->
          <!--</span>-->
          <span class="pull-left switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form class="advanced-query-form" onsubmit="return false">
          <el-row>
            <el-col :span="8">
              <oms-form-row :span="6" label="日志操作人">
                <el-select v-model="searchWord.operatorId" :clearable="true" :remote-method="filterUser" filterable
                           placeholder="请输入名称/拼音首字母缩写搜索"
                           popperClass="good-selects" remote>
                  <el-option v-for="user in userList" :key="user.id" :label="user.name" :value="user.id">
                    <div style="overflow: hidden">
                      <span class="pull-left" style="clear: right">{{user.name}}</span>
                      <span class="pull-right">
                        {{user.companyDepartmentName}}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="7" label="日志操作时间">
                <el-col :span="24">
                  <el-date-picker v-model="expectedTime" :default-time="['00:00:00', '23:59:59']"
                                  placeholder="请选择"
                                  type="datetimerange"></el-date-picker>
                </el-col>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="操作类型">
                <oms-input v-model="searchWord.actionType" placeholder="请输入操作类型"/>
              </oms-form-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <oms-form-row :span="2" label="">
                <el-button native-type="submit" type="primary" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <el-table ref="orderDetail" :data="logList" :header-row-class-name="'headerClass'" :v-loading="loadingData" border
                class="clearfix" @row-click="showDetail">
        <el-table-column :sortable="true" label="日志操作时间" prop="operationTime"
                         width="110">
          <template slot-scope="scope">
            {{ scope.row.operationTime | mtime}}
          </template>
        </el-table-column>
        <el-table-column :sortable="true" label="日志操作人" prop="userName" width="80"></el-table-column>
        <el-table-column :sortable="true" label="所属单位" prop="orgName" width="50"></el-table-column>
        <el-table-column :sortable="true" label="日志操作类型" prop="actionType" width="100">
          <template slot-scope="scope">
            {{ showActionType(scope.row.actionType)}}
          </template>
        </el-table-column>
        <el-table-column label="日志内容" min-width="120" prop="logRemarks">

        </el-table-column>
        <el-table-column label="请求内容" prop="body" width="350">
          <div slot-scope="scope" style="max-height: 150px;overflow-y: auto">
            {{scope.row.body}}
          </div>
        </el-table-column>
        <el-table-column label="响应内容" prop="body" width="350">
          <div slot-scope="scope" style="max-height: 150px;overflow-y: auto">
            {{scope.row.response}}
          </div>
        </el-table-column>
        <el-table-column :sortable="true" label="sessionId" prop="sessionId"></el-table-column>
        <el-table-column :sortable="true" label="IP" prop="ip" width="50"></el-table-column>
      </el-table>
      <div v-show="(logList.length || pager.currentPage !== 1) && !loadingData" class="text-center">
        <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                       :page-sizes="[10,20,50,100]"
                       :total="pager.count" layout="sizes, prev, pager, next, jumper"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>

    <!--<page-right :show="showDetailPart" @right-close="resetRightBox" :css="{'width':'1100px','padding':0}">-->
    <!--<detail :currentItem="currentItem" @close="resetRightBox"></detail>-->
    <!--</page-right>-->
  </div>
</template>
<script>
import {BaseInfo, User} from '@/resources';
//  import detail from './detail.vue';

export default {
//    components: {detail},
  data() {
    return {
      loadingData: true,
      showSearch: true,
      logList: [],
      filters: {
        operatorId: '',
        startTime: '',
        endTime: '',
        actionType: ''
      },
      searchWord: {
        operatorId: '',
        startTime: '',
        endTime: '',
        actionType: ''
      },
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10
      },
      expectedTime: '',
      userList: []
    };
  },
  mounted() {
    this.getLogPager(1);
  },
  computed: {},
  watch: {
    filters: {
      handler: function () {
        this.getLogPager(1);
      },
      deep: true
    }
  },
  methods: {
    showActionType: function (item) {
      if (item === 'login') {
        item = '登录';
      }
      return item;
    },
    filterUser: function (query) {
      let data = Object.assign({}, {
        pageNo: 1,
        pageSize: 20,
        keyWord: query
      });
      User.queryAllUser(data).then(res => {
        this.userList = res.data.list;
      });
    },
    handleSizeChange(val) {
      this.pager.pageSize = val;
      window.localStorage.setItem('currentPageSize', val);
      this.getLogPager(1);
    },
    handleCurrentChange(val) {
      this.getLogPager(val);
    },
    filterCustomer: function (query) {// 过滤客户
      BaseInfo.query({keyWord: query, type: 0}).then(res => {
        this.customerList = res.data.list;
      });
    },
    getLogPager: function (pageNo) { // 得到日志列表
      this.pager.currentPage = pageNo;
      let param = Object.assign({}, {
        pageNo: pageNo,
        pageSize: this.pager.pageSize
      }, this.filters);
      this.loadingData = true;
      this.$http.get('/system-log', {params: param}).then(res => {
        this.logList = res.data.list;
        this.pager.count = res.data.count;
        this.loadingData = false;
      });
    },
    showDetail(item) {
      this.currentItemId = item.id;
      this.currentItem = item;
      this.showDetailPart = true;
    },
    resetRightBox() {
      this.showDetailPart = false;
    },
    searchInOrder: function () {// 搜索
      this.searchWord.startTime = this.formatTimeToRangeByFormat(this.$formatAryTime(this.expectedTime, 0));
      this.searchWord.endTime = this.formatTimeToRangeByFormat(this.$formatAryTime(this.expectedTime, 1), 1);
      Object.assign(this.filters, this.searchWord);
    },
    formatTimeToRangeByFormat(time, type) {
      if (!time) return '';
      let str = ' 23:59:59';
      let date = this.$moment(time).format('YYYY-MM-DD');
      return this.$moment(date + (type === 1 ? str : '')).format('YYYY-MM-DD HH:mm:ss');
    },
    resetSearchForm: function () {// 重置表单
      this.searchWord = {
        operatorId: '',
        startTime: '',
        endTime: '',
        actionType: ''
      };
      this.expectedTime = '';
      Object.assign(this.filters, this.searchWord);
    },
    formatTime(date) {
      return date ? this.$moment(date).format('YYYY-MM-DD') : '';
    }
  }
};
</script>
