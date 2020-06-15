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
              <oms-form-row :span="8" label="受种者登记编号">
                <oms-input placeholder="请输入受种者登记编号" type="text" v-model="searchCondition.inoculatorNumber"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="9">
              <oms-form-row :span="4" label="疫苗主档">
                <el-select :clearable="true" :remote-method="queryAllGoodsList" @change="goodsIdChange"
                           @click.native="queryAllGoodsList('')" filterable
                           placeholder="请输入名称或编号搜索疫苗" popper-class="good-selects" remote
                           v-model="searchCondition.vaccineId">
                  <el-option :key="item.goodsId" :label="item.goodsName" :value="item.goodsId"
                             v-for="item in goodsList">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{item.goodsName}}</span>
                    </div>
                    <div style="overflow: hidden">
                        <span class="select-other-info pull-left"><span
                          v-show="item.goodsNo">疫苗编号:</span>{{item.goodsNo}}
                        </span>
                      <span class="select-other-info pull-left">
                          <span v-show="item.saleFirmName">生产厂商:</span>{{ item.factoryName }}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row :span="5" label="批号">
                <el-select :remote-method="queryBatchNumbers"
                           clearable filterable placeholder="请选择批号" popper-class="order-good-selects"
                           remote v-model="searchCondition.batchNumberId">
                  <el-option :key="item.id" :label="item.batchNumber" :value="item.id"
                             v-for="item in batchNumberList">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{item.batchNumber}}</span>
                    </div>
                    <div style="overflow: hidden">
                        <span class="select-other-info pull-left">
                          {{item.goodsName}}
                        </span>
                    </div>
                    <div style="overflow: hidden">
                        <span class="select-other-info pull-left"><span
                          v-show="item.goodsCode">疫苗编号:</span>{{item.goodsCode}}
                        </span>
                      <span class="select-other-info pull-left">
                          <span v-show="item.orgName">生产单位:</span>{{ item.orgName }}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="9">
              <oms-form-row :span="4" label="货主疫苗">
                <el-select :clearable="true" :remote-method="queryAllOrgGoodsList"
                           @change="orgGoodsIdChange"
                           @click.native="queryAllOrgGoodsList('')" filterable
                           placeholder="请输入名称或编号搜索疫苗" popper-class="good-selects" remote
                           v-model="searchCondition.orgGoodsId">
                  <el-option :key="item.id" :label="item.goodsName" :value="item.id"
                             v-for="item in orgGoodsList">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{item.goodsName}}</span>
                    </div>
                    <div style="overflow: hidden">
                        <span class="select-other-info pull-left"><span
                          v-show="item.goodsNo">疫苗编号:</span>{{item.goodsNo}}
                        </span>
                      <span class="select-other-info pull-left">
                          <span v-show="item.saleFirmName">供货单位:</span>{{ item.saleFirmName }}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="9">
              <oms-form-row :span="4" label="追溯码">
                <oms-input placeholder="请输入追溯码" type="text" v-model="searchCondition.actualCode"></oms-input>
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

      <div class="order-list-status container" style="margin-bottom:20px">
        <div :class="{'active':key===activeStatus}" @click="changeStatus(item,key)" class="status-item"
             v-for="(item,key) in injectionType">
          <div :class="['b_color_'+key]" class="status-bg"></div>
          <div><i class="el-icon-caret-right" v-if="key===activeStatus"></i>{{item.title}}<span class="status-num">{{item.num}}</span>
          </div>
        </div>
      </div>
      <div class="order-list clearfix">
        <el-row class="order-list-header">
          <el-col :span="3">登记编号</el-col>
          <el-col :span="3">受种者</el-col>
          <el-col :span="5">疫苗名称</el-col>
          <el-col :span="4">疫苗种类</el-col>
          <el-col :span="3">批号</el-col>
          <el-col :span="4">时间</el-col>
          <el-col :span="2">状态</el-col>
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
          <div :class="[{'active':currentItem.id===item.id}]" @click.prevent="showItem(item)"
               class="order-list-item order-list-item-bg pointer" v-for="item in taskList">
            <el-row>
              <el-col :span="3" v-if="item.inoculatorNumber">
                {{item.inoculatorNumber}}
                <!--<el-tag type="success" v-show="item.payCostType === 1">已缴费</el-tag>-->
                <!--<el-tag type="warning" v-show="item.payCostType === 0">未缴费</el-tag>-->
              </el-col>
              <el-col :span="3" v-if="!item.inoculatorNumber">
                {{item.id}}
                <!--<el-tag type="success" v-show="item.payCostType === 1">已缴费</el-tag>-->
                <!--<el-tag type="warning" v-show="item.payCostType === 0">未缴费</el-tag>-->
              </el-col>
              <el-col :span="3">
                {{item.inoculatorName}}
              </el-col>
              <el-col :span="5">
                <div>{{item.orgGoodsName}}</div>
                <div class="font-gray">{{item.specification}}</div>
              </el-col>
              <el-col :span="4">
                <el-tag class="el-tag--max" type="success" v-if="item.vaccineSign === '2'">
                  <dict :dict-key="'' + item.vaccineSign" dict-group="vaccineSign"></dict>
                </el-tag>
                <dict :dict-key="'' + item.vaccineSign" dict-group="vaccineSign" v-else></dict>
              </el-col>
              <el-col :span="3">
                {{item.batchNumber}}
              </el-col>
              <el-col :span="4">
                <div v-show="item.createTime">创建：{{item.createTime | minute}}</div>
                <div v-show="item.actualTime">接种：{{item.actualTime | minute}}</div>
              </el-col>
              <el-col :span="2">
                {{getStatusTitle(item.status)}}
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
        layout="sizes, prev, pager, next, jumper, total">>
      </el-pagination>
    </div>

    <page-right :css="{width: width + 'px'}" :show="!!defaultIndex" @right-close="resetRightBox">
      <add-form :formItem="form" @change="formChange" @close="resetRightBox" v-show="defaultIndex < 3"></add-form>
      <detail :defaultIndex="defaultIndex" :getStatusTitle="getStatusTitle" :id="currentItem.id"
              @close="resetRightBox" v-show="defaultIndex === 3"></detail>
    </page-right>
  </div>
</template>
<script>
  import AddForm from './form';
  import {inoculateTask} from '@/resources';
  import Detail from './detail';
  import methods from '../mixin/methods';
  import utils from '@/tools/utils';

  export default {
    components: {AddForm, Detail},
    mixins: [methods],
    data: function () {
      return {
        loadingData: false,
        showSearch: false,
        taskList: [],
        goodsList: [],
        filters: {
          status: '0',
          inoculatorNumber: '',
          vaccineId: '',
          orgGoodsId: '',
          batchNumberId: '',
          actualCode: ''
        },
        injectionType: utils.injectionType,
        searchCondition: {
          inoculatorNumber: '',
          vaccineId: '',
          orgGoodsId: '',
          batchNumberId: '',
          actualCode: ''
        },
        activeStatus: '0',
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
      this.queryList();
    },
    computed: {},
    methods: {
      queryBatchNumbers(query) {
        /*
                if (!this.searchCondition.vaccineId) {
                  this.$notify.info('请先选择疫苗');
                  return;
                }
        */
        this.queryBatchNumberList({
          keyWord: query
        });
      },
      orgGoodsIdChange(val) {
        this.batchNumberList = [];
        this.searchCondition.batchNumberId = '';
        this.queryBatchNumbers();
      },
      goodsIdChange(val) {
        this.batchNumberList = [];
        this.searchCondition.batchNumberId = '';
        this.queryBatchNumbers();
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
          inoculatorNumber: '',
          vaccineId: '',
          orgGoodsId: '',
          batchNumberId: '',
          actualCode: ''
        };
        this.expectedTime = '';
        this.batchNumberList = [];
        Object.assign(this.searchCondition, temp);
        Object.assign(this.filters, temp);
        this.queryList(1);
      },
      resetRightBox: function () {
        this.defaultIndex = 0;
        this.currentItem = {};
        this.form = {};
      },
      add: function () {
        this.width = 800;
        this.form = {};
        this.defaultIndex = 1;
      },
      editItem(item) {
        this.width = 800;
        this.currentItem = item;
        this.form = item;
        this.defaultIndex = 2;
      },
      deleteItem(item) {
        this.$confirm(`是否取消"${item.inoculatorName}"的接种任务`, '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          inoculateTask.cancelTask(item.id).then(() => {
            this.$notify.success({
              message: `取消${item.inoculatorName}成功`
            });
            this.queryList(1);
          }).catch(error => {
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || `取消${item.inoculatorName}失败`
            });
          });
        });
      },
      showItem(item) {
        this.width = 600;
        this.currentItem = item;
        this.defaultIndex = 3;
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
        inoculateTask.query(params).then(res => {
          this.taskList = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
        this.queryStatusNum(params);
      },
      queryStatusNum: function (params) {
        let cParams = Object.assign({}, params, {status: null});
        inoculateTask.queryStateNum(cParams).then(res => {
          let data = res.data;
          this.injectionType[0].num = this.obtionStatusNum(data['waiting']);
          this.injectionType[1].num = this.obtionStatusNum(data['confirm']);
          this.injectionType[2].num = this.obtionStatusNum(data['cancel']);
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
        for (let key in this.injectionType) {
          if (status === this.injectionType[key].status * 1) {
            title = this.injectionType[key].title;
          }
        }
        return title;
      }
    }
  };
</script>
