<style lang="scss" scoped="">

</style>
<template>
  <div class="order-page">
    <div class="container">
      <div class="opera-btn-group" :class="{up:!showSearch}">
        <div class="opera-icon">
          <perm label="add-inoculator-info">
              <span class="pull-right cursor-span" style="margin-left: 10px" @click.prevent="add">
           <a href="#" class="btn-circle" @click.prevent=""><i
             class="el-icon-t-plus"></i> </a>添加
            </span>
          </perm>

          <span class="pull-left switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form v-show="showSearch" class="advanced-query-form clearfix" style="padding-top: 10px"
                 onsubmit="return false">
          <el-row>
            <el-col :span="9">
              <oms-form-row :span="4" label="疫苗">
                <el-select :clearable="true" :remote-method="queryOrgGoodsList" @click.native="queryOrgGoodsList('')"
                           filterable
                           placeholder="请输入名称或编号搜索疫苗" popper-class="good-selects" remote
                           v-model="searchCondition.vaccineId">
                  <el-option :key="item.id" :label="item.goodsName" :value="item.goodsId"
                             v-for="item in orgGoodsList">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{item.goodsName}}</span>
                    </div>
                    <div style="overflow: hidden">
                        <span class="select-other-info pull-left"><span
                          v-show="item.goodsNo">疫苗编号:</span>{{item.goodsNo}}
                        </span>
                      <span class="select-other-info pull-left">
                          <span v-show="item.saleFirmName">供货厂商:</span>{{ item.saleFirmName }}
                        </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="追溯码" :span="8">
                <oms-input type="text" v-model="searchCondition.reviewCodeDetail" placeholder="请输入追溯码"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row label="" :span="5">
                <el-button type="primary" native-type="submit" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="order-list clearfix">
        <el-row class="order-list-header">
          <el-col :span="6">疫苗名称</el-col>
          <el-col :span="6">追溯码</el-col>
          <el-col :span="6">时间</el-col>
          <el-col :span="6">剂次</el-col>
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
          <div class="order-list-item order-list-item-bg" v-for="item in dataList" @click.prevent="showItem(item)"
               :class="[{'active':currentItem.multiPersonAgingId===item.multiPersonAgingId}]">
            <el-row>
              <el-col :span="6">
                {{item.vaccineName}}
              </el-col>
              <el-col :span="6">
                {{item.reviewCodeDetail}}
              </el-col>
              <el-col :span="6">
                <div>开启：{{item.openTime | time}}</div>
                <div>失效：{{item.failureTime | time}}</div>
                <div>最后使用：{{item.lastTime | time}}</div>
              </el-col>
              <el-col :span="6">
                <div>最大使用：{{item.maximumOfPeople}}</div>
                <div>当前使用：{{item.nowNumber}}</div>
                <div>剩余使用：{{item.remainingNumber}}</div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">
      <el-pagination
        layout="prev, pager, next"
        :total="pager.count" :pageSize="pager.pageSize" @current-change="queryList"
        :current-page="pager.currentPage">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {multiAging} from '@/resources';
  import methods from '../mixin/methods';

  export default {
    mixins: [methods],
    data: function () {
      return {
        loadingData: false,
        showSearch: true,
        dataList: [],
        filters: {},
        searchCondition: {
          vaccineId: '',
          reviewCodeDetail: ''
        },
        currentItem: {},
        form: {},
        defaultIndex: 0,
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        }
      };
    },
    mounted() {
      this.queryList();
    },
    computed: {},
    methods: {
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
              message: error.response.data && error.response.data.msg || `删除${item.birthCertificateNumber}失败`
            });
          });
        });
      },
      showItem(item) {
        // this.currentItem = item;
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
        }, this.filters);
        this.loadingData = true;
        multiAging.query(params).then(res => {
          this.dataList = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
      }
    }
  };
</script>
