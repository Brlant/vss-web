<style lang="scss" scoped="">
.flex-col {
  display: flex;
  align-items: center;

  .el-checkbox {
    margin-right: 5px;
  }
}

.order-list-item, .cursor-span {
  cursor: pointer;
}

.advanced-query-form {
  .el-row {
    display: flex;
    align-items: center;
  }
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
        <el-form v-show="showSearch" class="advanced-query-form clearfix" onsubmit="return false"
                 style="padding-top: 10px">
          <el-row>
            <el-col :span="9">
              <oms-form-row :span="4" label="疫苗">
                <el-select v-model="searchCondition.vaccineId" :clearable="true" :remote-method="queryOrgGoodsList"
                           filterable
                           placeholder="请输入名称或编号搜索疫苗" popper-class="good-selects" remote
                           @click.native="queryOrgGoodsList('')">
                  <el-option v-for="item in orgGoodsList" :key="item.id" :label="item.goodsName"
                             :value="item.goodsId">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{item.goodsName}}</span>
                    </div>
                    <div style="overflow: hidden">
                        <span class="select-other-info pull-left"><span
                          v-show="item.goodsNo">货主货品编号:</span>{{item.goodsNo}}
                        </span>
                      <span class="select-other-info pull-left">
                          <span v-show="item.saleFirmName">供货单位:</span>{{ item.saleFirmName }}
                        </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="7">
              <oms-form-row :span="6" label="追溯码">
                <oms-input v-model.trim="searchCondition.reviewCodeDetail" placeholder="请输入追溯码" type="text"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="7">
              <oms-form-row :span="1" label="">
                <el-button native-type="submit" type="primary" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
                <el-button plain type="success" @click="exportExcel">导出Excel</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="order-list-status container" style="margin-bottom:20px">
        <div v-for="(item,key) in vaccineEachList" :class="{'active':key===activeStatus}" class="status-item"
             @click="changeStatus(item,key)">
          <div :class="['b_color_'+key]" class="status-bg"></div>
          <div><i v-if="key===activeStatus" class="el-icon-caret-right"></i>{{item.title}}<span class="status-num">{{item.num}}</span>
          </div>
        </div>
      </div>
      <div class="order-list clearfix">
        <el-row class="order-list-header">
          <el-col :span="6">疫苗名称</el-col>
          <el-col :span="6">追溯码</el-col>
          <el-col :span="6">时间</el-col>
          <el-col :span="4">剂次</el-col>
          <el-col :span="2">状态</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="!dataList.length">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else="" class="order-list-body flex-list-dom">
          <div v-for="item in dataList" :class="[{'active':currentItem.multiPersonAgingId===item.multiPersonAgingId}]" class="order-list-item order-list-item-bg"
               @click="showItem(item)">
            <el-row>
              <el-col :span="6" class="flex-col">
                <div>{{item.vaccineName}}</div>
              </el-col>
              <el-col :span="6">
                {{item.reviewCodeDetail}}
              </el-col>
              <el-col :span="6">
                <div>开启：{{item.openTime | time}}</div>
                <div>失效：{{item.failureTime | time}}</div>
                <div>最后使用：{{item.lastTime | time}}</div>
              </el-col>
              <el-col :span="4">
                <div>最大使用：{{item.maximumOfPeople}}</div>
                <div>当前使用：{{item.nowNumber}}</div>
                <div>剩余使用：{{item.remainingNumber}}</div>
              </el-col>
              <el-col :span="2">
                {{getStatusTitle(item.recordStatus)}}
                <el-tag v-show="item.type" type="warning">已失效</el-tag>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <div v-show="pager.count>pager.pageSize && !loadingData" class="text-center">
      <el-pagination
        :current-page="pager.currentPage"
        :pageSize="pager.pageSize" :total="pager.count" layout="prev, pager, next"
        @current-change="queryList">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import {multiAging} from '@/resources';
import methods from '../mixin/methods';
import utils from '@/tools/utils';

export default {
  mixins: [methods],
  data: function () {
    return {
      loadingData: false,
      showSearch: true,
      dataList: [],
      filters: {
        status: '0',
        vaccineId: '',
        reviewCodeDetail: ''
      },
      searchCondition: {
        vaccineId: '',
        reviewCodeDetail: ''
      },
      activeStatus: '0',
      currentItem: {},
      vaccineEachList: utils.vaccineEachList,
      form: {},
      defaultIndex: 0,
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: 20
      },
      checkAll: false
    };
  },
  mounted() {
    this.queryList();
  },
  computed: {},
  methods: {
    checkAllChange(val) {
      this.dataList.forEach(i => {
        i.checked = val;
      });
    },
    changeStatus: function (item, key) {// 订单分类改变
      this.activeStatus = key;
      this.filters.status = item.status;
      this.queryList(1);
    },
    searchInOrder: function () {// 搜索
      this.searchCondition.createStartTime = this.$formatAryTime(this.expectedTime, 0);
      this.searchCondition.createEndTime = this.$formatAryTime(this.expectedTime, 1);
      Object.assign(this.filters, this.searchCondition);
      this.queryList(1);
    },
    resetSearchForm: function () {// 重置表单
      let temp = {
        vaccineId: '',
        reviewCodeDetail: ''
      };
      this.expectedTime = '';
      Object.assign(this.searchCondition, temp);
      Object.assign(this.filters, temp);
      this.queryList(1);
    },
    resetRightBox: function () {
      this.defaultIndex = 0;
    },
    add: function () {
      this.form = {};
      this.defaultIndex = 1;
    },
    editItem(item) {
      this.currentItem = item;
      this.form = item;
      this.defaultIndex = 2;
    },
    deleteItem(item) {
      this.$confirm(`是否删除${item.birthCertificateNumber}`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        multiAging.delete(item.id).then(() => {
          this.$notify.success({
            message: `删除${item.birthCertificateNumber}成功`
          });
          this.queryList(1);
        }).catch(error => {
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || `删除${item.birthCertificateNumber}失败`
          });
        });
      });
    },
    showItem(item) {
      item.checked = !item.checked;
    },
    formChange() {
      this.resetRightBox();
      this.queryList();
    },
    queryList: function (pageNo) {
      this.pager.currentPage = pageNo;
      let params = Object.assign({
        pageNo: pageNo,
        pageSize: this.pager.pageSize
      }, this.filters, {
        recordStatus: this.filters.status
      });
      this.loadingData = true;
      multiAging.query(params).then(res => {
        res.data.list.forEach(i => {
          i.checked = false;
        });
        this.dataList = res.data.list;
        this.pager.count = res.data.count;
        this.loadingData = false;
      });
      this.queryStatusNum(params);
    },
    queryStatusNum: function (params) {
      let cParams = Object.assign({}, params, {status: null});
      multiAging.queryStateNum(cParams).then(res => {
        let data = res.data;
        this.vaccineEachList[0].num = this.obtionStatusNum(data['waiting']);
        this.vaccineEachList[1].num = this.obtionStatusNum(data['after']);
        this.vaccineEachList[2].num = this.obtionStatusNum(data['scrap']);
      });
    },
    obtionStatusNum: function (num) {
      if (typeof num !== 'number') {
        return 0;
      }
      return num;
    },
    getStatusTitle: function (status) {
      let title = '';
      for (let key in this.vaccineEachList) {
        if (status === this.vaccineEachList[key].status * 1) {
          title = this.vaccineEachList[key].title;
        }
      }
      return title;
    },
    addScrap() {
      let checkList = this.dataList.filter(f => f.checked).map(m => ({
        multiPersonAgingId: m.multiPersonAgingId
      }));
      if (!checkList.length) {
        return this.$notify.info({
          message: '请选择记录'
        });
      }
      this.$confirm('是否报废这些记录', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/multi-person-aging/scrap-multi-person-aging', checkList).then(res => {
          this.$notify.success({
            message: '报废完成'
          });
          this.queryList();
        }).catch((e) => {
          this.$notify.error({
            message: e.response && e.response.data.msg || '无法报废'
          });
        });
      });
    },
    exportExcel() {
      let params = Object.assign({}, this.filters, {
        recordStatus: this.filters.status
      });
      this.$store.commit('initPrint', {isPrinting: true, moduleId: this.$route.path});
      this.$http.get('/multi-person-aging/export', {params}).then(res => {
        utils.download(res.data.path, '多人份剂次时效记录');
        this.isLoading = false;
        this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
      }).catch(error => {
        this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
        });
      });
    }
  }
};
</script>
