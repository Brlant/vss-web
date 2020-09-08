<style lang="scss" scoped="">
.order-list-item {
  cursor: pointer;
}
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div :class="{up:!showSearch}" class="opera-btn-group">
        <div class="opera-icon">
          <perm class="opera-btn pull-right" label="erp-stock-inventory-add">
            <span style="cursor:pointer" @click.prevent="add">
              <a class="btn-circle" href="#" @click.prevent=""><i class="el-icon-t-plus"></i></a> 增加</span>
          </perm>
          <span class="pull-left switching-icon" style="margin-right: 30px" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>

        <el-form v-show="showSearch" class="advanced-query-form" onsubmit="return false">
          <el-row>
            <el-col :span="6">
              <oms-form-row :span="6" label="操作人">
                <el-select v-model="filters.createdBy" :remote-method="filterOperators" clearable filterable placeholder="请输入名称搜索"
                           remote @focus="filterOperators('')">
                  <el-option v-for="o in operators" :key="o.id" :label="o.name" :value="o.id"></el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="10">
              <oms-form-row :span="4" label="创建时间">
                <el-date-picker v-model="createTimes" :default-time="['00:00:00', '23:59:59']" placeholder="请选择日期"
                                type="datetimerange">
                </el-date-picker>
              </oms-form-row>
            </el-col>
            <el-col :span="4">
              <oms-form-row :span="3" label="">
                <el-button type="primary" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="order-list clearfix" style="margin-top: 20px">
        <el-row class="order-list-header">
          <el-col :span="8">创建人</el-col>
          <el-col :span="8">创建时间</el-col>
          <el-col :span="8">操作</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <oms-loading :loading="loadingData"></oms-loading>
        </el-row>
        <el-row v-else-if="!inventories.length">
          <div class="empty-info">暂无信息</div>
        </el-row>
        <div v-else class="order-list-body flex-list-dom">
          <div v-for="item in inventories" :class="[{'active':currentOrderId===item.id}]"
               class="order-list-item order-list-item-bg" @click.prevent="showDetail(item)">
            <el-row>
              <el-col :span="8" class="pt5">{{ item.creatorName }}</el-col>
              <el-col :span="8" class="pt5">{{ item.createTime | minute }}</el-col>
              <el-col :span="6" class="opera-btn">
                <perm label="erp-stock-inventory-delete">
                    <span @click.stop="deleteDetail(item)">
                       <a class="btn-circle" href="#" @click.prevent=""><i class="el-icon-t-delete"></i></a>删除
                    </span>
                </perm>
                <span @click.stop="showDetail(item)">
                       <a class="btn-circle" href="#" @click.prevent=""><i class="el-icon-t-detail"></i></a>查看详情
                </span>
                <perm label="erp-stock-inventory-export">
                   <span @click.stop.prevent="exportExcel(item)">
                    <a class="btn-circle" href="#"><i class="el-icon-t-export"></i></a>导出Excel
                  </span>
                </perm>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <div v-show="inventories.length && !loadingData" class="text-center">
      <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                     :page-sizes="[10,20,50,100]"
                     :total="pager.count" layout="total, sizes, prev, pager, next, jumper"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import {Inventory, OrgUser} from '@/resources';
import utils from '@/tools/utils';

export default {
  data() {
    return {
      loadingData: false,
      showSearch: true,
      inventories: [],
      currentOrderId: '',
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10
      },
      filters: {
        startTime: '',
        endTime: '',
        createdBy: ''
      },
      createTimes: '',
      operators: []
    };
  },
  mounted() {
    this.getOrders(1);
  },
  methods: {
    filterOperators(query) {
      let orgId = this.$store.state.user.userCompanyAddress;
      if (!orgId) return;
      let params = {keyWord: query};
      OrgUser.queryUsers(orgId, params).then(res => {
        this.operators = res.data.list;
      });
    },
    add: function () { // 增加盘点作业
      this.$confirm('是否创建库存盘点作业?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('initPrint', {isPrinting: true, moduleId: this.$route.path, text: '正在创建盘点作业'});
        Inventory.save().then(res => {
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
          this.$notify.info({message: '盘点作业创建成功'});
          this.getOrders(1);
        }).catch(e => {
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
          this.$notify.error({
            message: e.response.data && e.response.data.msg && '盘点作业创建失败'
          });
        });
      });
    },
    formatTime(date) {
      return date ? this.$moment(date).format('YYYY-MM-DD HH:mm:ss') : '';
    },
    searchInOrder: function () {// 搜索
      this.filters.startTime = this.$formatAryTime(this.createTimes, 0, 'YYYY-MM-DD HH:mm:ss');
      this.filters.endTime = this.$formatAryTime(this.createTimes, 1, 'YYYY-MM-DD HH:mm:ss');
      this.getOrders(1);
    },
    resetSearchForm: function () {// 重置表单
      this.filters = {
        startTime: '',
        endTime: '',
        createdBy: ''
      };
      this.createTimes = '';
      this.getOrders(1);
    },
    getOrders(pageNo) { // 查询盘点作业列表
      this.pager.currentPage = pageNo;
      let params = Object.assign({}, {
        pageNo: pageNo,
        pageSize: this.pager.pageSize
      }, this.filters);
      this.loadingData = true;
      Inventory.query(params).then(res => {
        this.inventories = res.data.list;
        this.pager.count = res.data.count;
        this.loadingData = false;
      });
    },
    showDetail(item) {
      this.currentOrderId = item.id;
      this.$router.push({path: '/store/inventory/detail', query: {id: item.id}});
    },
    deleteDetail: function (item) {
      this.$confirm('删除盘点信息会一并删除关联的详情，确认删除盘点信息?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('initPrint', {isPrinting: true, moduleId: this.$route.path, text: '正在删除盘点作业'});
        Inventory.delete(item.id).then(res => {
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
          this.$notify.info({message: '盘点作业删除成功'});
          this.getOrders(1);
        }).catch(e => {
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
          this.$notify.error({
            message: e.response.data && e.response.data.msg && '盘点作业删除失败'
          });
        });
      });
    },
    exportExcel(item) {
      this.$store.commit('initPrint', {isPrinting: true, moduleId: this.$route.path});
      this.$http.get(`/erp-inventory/${item.id}/detail/export`).then(res => {
        utils.download(res.data.path, '库存盘点详情');
        this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
      }).catch(error => {
        this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
        });
      });
    },
    handleSizeChange(val) {
      this.pager.pageSize = val;
      window.localStorage.setItem('currentPageSize', val);
      this.getOrders(1);
    },
    handleCurrentChange(val) {
      this.getOrders(val);
    }
  }
};
</script>
