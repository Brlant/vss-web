<template>
  <div class="order-page">
    <div class="container">
      <div :class="{up:!showSearch}" class="opera-btn-group">
        <div class="opera-icon">
          <span @click.prevent="add" class="pull-right cursor-span" style="margin-left: 10px">
         <a @click.prevent="" class="btn-circle" href="#"><i
           class="el-icon-t-plus"></i> </a>添加
          </span>
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
              <oms-form-row :span="8" label="接种者登记编号">
                <oms-input placeholder="请输入接种者登记编号" type="text" v-model="searchCondition.code"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="9">
              <oms-form-row :span="4" label="疫苗">
                <el-select :clearable="true" :remote-method="queryOrgGoodsList" @click.native="queryOrgGoodsList('')"
                           filterable
                           placeholder="请输入名称或编号搜索疫苗" popper-class="good-selects" remote
                           v-model="searchCondition.orgGoodsId">
                  <el-option :key="item.orgGoodsDto.id" :label="item.orgGoodsDto.name"
                             :value="item.orgGoodsDto.id"
                             v-for="item in orgGoodsList">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{item.orgGoodsDto.name}}</span>
                    </div>
                    <div style="overflow: hidden">
                        <span class="select-other-info pull-left"><span
                          v-show="item.orgGoodsDto.goodsNo">疫苗编号:</span>{{item.orgGoodsDto.goodsNo}}
                        </span>
                      <span class="select-other-info pull-left"><span
                        v-show="item.orgGoodsDto.salesFirmName">供货厂商:</span>{{ item.orgGoodsDto.salesFirmName }}
                        </span>
                      <span class="select-other-info pull-left" v-if="item.orgGoodsDto.goodsDto">
                          <span v-show="item.orgGoodsDto.goodsDto.factoryName">生产厂商:</span>
                        {{ item.orgGoodsDto.goodsDto.factoryName }}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row :span="5" label="">
                <el-button @click="searchInOrder" native-type="submit" type="primary">查询</el-button>
                <el-button @click="resetSearchForm" native-type="reset">重置</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="order-list clearfix">
        <el-row class="order-list-header">
          <el-col :span="4">接种者登记编号</el-col>
          <el-col :span="2">姓名</el-col>
          <el-col :span="5">疫苗名称</el-col>
          <el-col :span="3">批号</el-col>
          <el-col :span="3">时间</el-col>
          <el-col :span="3">状态</el-col>
          <el-col :span="4">操作</el-col>
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
          <div :class="[{'active':currentItem.code===item.code}]" @click.prevent="showItem(item)"
               class="order-list-item order-list-item-bg pointer"
               v-for="item in taskList">
            <el-row>
              <el-col :span="4">
                {{item.code}}
              </el-col>
              <el-col :span="2">
                {{item.name}}
              </el-col>
              <el-col :span="5">
              </el-col>
              <el-col :span="3">
              </el-col>
              <el-col :span="3">
              </el-col>
              <el-col :span="3">
              </el-col>
              <el-col :span="4" class="opera-btn">
                  <span @click.stop.prevent="editItem(item)">
                      <a @click.prevent="" class="btn-circle" href="#"><i
                        class="el-icon-t-edit"></i></a>
                    编辑
                  </span>
                <span @click.stop.prevent="deleteItem(item)">
                        <a @click.prevent="" class="btn-circle" href="#"><i
                          class="el-icon-t-delete"></i></a>删除
                  </span>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">
      <el-pagination
        :current-page="pager.currentPage"
        :pageSize="pager.pageSize" :total="pager.count" @current-change="queryList"
        layout="prev, pager, next">
      </el-pagination>
    </div>

    <page-right :show="!!defaultIndex" @right-close="resetRightBox">
      <add-form :formItem="form" @change="formChange" @close="resetRightBox" v-show="defaultIndex < 3"></add-form>
      <detail :defaultIndex="defaultIndex" :formItem="form" @change="formChange"
              @close="resetRightBox" v-show="defaultIndex === 3"></detail>
    </page-right>
  </div>
</template>
<script>
  import AddForm from './form';
  import {inoculateTask} from '@/resources';
  import Detail from './detail';
  import methods from '../mixin/methods';

  export default {
    components: {AddForm, Detail},
    mixins: [methods],
    data: function () {
      return {
        loadingData: false,
        showSearch: true,
        taskList: [],
        filters: {
          code: '',
          orgGoodsId: ''
        },
        searchCondition: {
          code: '',
          orgGoodsId: ''
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
          code: '',
          orgGoodsId: ''
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
        this.$confirm(`是否删除${item.name}`, '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          inoculateTask.delete(item.id).then(() => {
            this.$notify.success({
              message: `删除${item.name}成功`
            });
            this.queryList(1);
          }).catch(error => {
            this.$notify.error({
              message: error.response.data && error.response.data.msg || `删除${item.name}失败`
            });
          });
        });
      },
      showItem(item) {
        this.currentItem = item;
        this.defaultIndex = 3;
      },
      formChange() {
        this.queryList();
      },
      queryList: function (pageNo) {
        this.taskList = [
          {
            name: '张三',
            sex: '男',
            date: '2019-01-01',
            inoculateCode: '001',
            idCard: '341222201910000000',
            lifeCard: '341222201910000000',
            code: '341222201910000000',
            doctor: '李医生',
            list: [
              {goodsName: '06070511A/乙脑-蓉生-0.5ml-L-鼠肾5.4Lg冻西', batchNumber: '20190201'}
            ]
          },
          {
            name: '李四',
            sex: '女',
            date: '2019-01-02',
            inoculateCode: '002',
            idCard: '341222201910000001',
            lifeCard: '341222201910000001',
            code: '341222201910000001',
            doctor: '赵医生',
            list: [
              {goodsName: '07060523A/流脑-兰生-0.5ml-D-AC多糖50ug冻西0.5ml', batchNumber: '20190202'}
            ]
          },
          {
            name: '王二',
            sex: '女',
            date: '2019-01-03',
            inoculateCode: '003',
            idCard: '341222201910000002',
            lifeCard: '341222201910000002',
            code: '341222201910000002',
            doctor: '王医生',
            list: [
              {goodsName: '11010510A/麻腮风-上生-0.5ml-L-3+4.3+3Lg冻西', batchNumber: '20190203'}
            ]
          },
          {
            name: '赵五',
            sex: '男',
            date: '2019-01-05',
            inoculateCode: '004',
            idCard: '341222201910000003',
            lifeCard: '341222201910000003',
            code: '341222201910000003',
            doctor: '江医生',
            list: [
              {goodsName: '07060523A/流脑-兰生-稀释液0.5ml', batchNumber: '20190204'}
            ]
          }
        ];
      }
    }
  };
</script>
