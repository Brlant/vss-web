<style lang="less" scoped="">
  @import '../../../assets/mixins';

  .page-right-part {
    box-sizing: content-box;
    width: 800px;
    padding: 30px 0;
    overflow: auto;
    .title {
      margin-left: 30px;
    }
    .order-info-part {
      padding: 0 50px;
    }
    .goods-info-left {
      width: 330px;
      margin-left: 30px;
      padding: 20px;
      float: left;
      border: 1px solid rgb(238, 238, 238);
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    .goods-info-right {
      width: 210px;
      padding: 32px 20px 33px 20px;
      background-color: rgb(238, 238, 238);
      border: 1px solid rgb(238, 238, 238);
      float: left;
      .el-row {
        margin-bottom: 5px;
      }
      margin-bottom: 20px;
    }
    .min-gutter {
      .el-form-item {
        margin-bottom: 4px;
      }
    }
    .border-show {
      height: 15px;
      width: 100%;
      border-bottom: 1px solid #777777;
      opacity: 0.2;
      margin-bottom: 10px;
    }

  }

  .advanced-query-form {
    .el-select {
      display: block;
      position: relative;
    }
    .el-date-editor.el-input {
      width: 100%;
    }
  }

  .exceptionPosition {
    /*margin-left: 40px;*/
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  .table {
    .order-list-item {
      color: #999;
      line-height: 20px;
    }
    border-collapse: separate;
    border-spacing: 0;
    > tbody > tr > td {
      border-top: 1px solid #eee;
    }

  }

  .empty-position {
    width: 150px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .w90 {
    width: 90px;
  }

  /*.order-list-item {*/
  /*cursor: pointer;*/
  /*}*/

  .pt10 {
    padding-top: 10px;
  }

  .cursor-span {
    cursor: pointer;
  }

  .opera-btn-bidder {
    a:hover {
      color: @activeColor;
    }
  }
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div class="opera-btn-group" :class="{up:!showSearch}">
        <div class="opera-icon">
          <span class="">
            <i class="el-icon-t-search"></i> 筛选查询
          </span>
          <span class="pull-right cursor-span" style="margin-left: 10px" @click.prevent="add">
            <perm label="sales-order-add">
                    <a href="#" class="btn-circle" @click.prevent=""><i
                      class="el-icon-t-plus"></i> </a>添加
            </perm>
          </span>
          <span class="pull-right switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form v-show="showSearch" class="advanced-query-form clearfix" style="padding-top: 10px" onsubmit="return false">
          <el-row>
            <el-col :span="8">
              <oms-form-row label="疫苗" :span="4">
                <el-select filterable remote placeholder="请输入名称搜索疫苗" :remote-method="filterVaccine"
                           :clearable="true"
                           v-model="searchCondition.goodsId" popper-class="good-selects">
                  <el-option :value="vaccine.id" :key="vaccine.id" :label="vaccine.name"
                             v-for="vaccine in vaccineList">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{vaccine.name}}</span>
                    </div>
                    <div style="overflow: hidden">
                <span class="select-other-info pull-left"><span
                  v-show="vaccine.code">货品编号:</span>{{vaccine.code}}
                </span>
                      <span class="select-other-info pull-left"><span
                        v-show="vaccine.specifications">货品规格:</span>{{vaccine.specifications}}
                </span>
                      <span class="select-other-info pull-left"><span
                        v-show="vaccine.approvalNumber">批准文号:</span>{{vaccine.approvalNumber}}
                </span>
                    </div>
                    <div style="overflow: hidden">
              <span class="select-other-info pull-left"><span
                v-show="vaccine.factoryName">生产厂商:</span>{{ vaccine.factoryName }}
              </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row label="中标年份" :span="6">
                <el-date-picker
                  v-model="searchCondition.year"
                  align="right"
                  type="year"
                  placeholder="选择年"
                  @change="formatDate"
                >
                </el-date-picker>
              </oms-form-row>
            </el-col>
            <el-col :span="5">
              <oms-form-row label="" :span="3">
                <el-button type="primary" native-type="submit" @click="searchPage">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="order-list-status container" style="margin-bottom:20px">
        <div class="status-item"
             :class="{'active':key===activeStatus}"
             v-for="(item,key) in successBidderType"
             @click="changeStatus(item,key)">
          <div class="status-bg" :class="['b_color_'+key]"></div>
          <div><i class="el-icon-caret-right" v-if="key==activeStatus"></i>{{item.title}}<span class="status-num">{{item.num}}</span></div>
        </div>
      </div>
      <div class="order-list clearfix ">
        <el-row class="order-list-header">
          <el-col :span="5">疫苗名称</el-col>
          <el-col :span="3">规格型号</el-col>
          <el-col :span="5">生产厂商</el-col>
          <el-col :span="3">批准文号</el-col>
          <el-col :span="2">中标年份</el-col>
          <el-col :span="2">状态</el-col>
          <el-col :span="4">操作</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="dataRows.length == 0">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else="" class="order-list-body flex-list-dom">
          <div class="order-list-item" v-for="item in dataRows" @click.prevent=""
               :class="['status-'+filterListColor(item.availabilityStatus),{'active':currentId ==item.id}]">
            <el-row>
              <el-col :span="5">
                <div class="vertical-center">
                  {{item.goodsName }}
                </div>
              </el-col>
              <el-col :span="3">
                <div class="vertical-center">
                  {{item.specifications }}
                </div>
              </el-col>
              <el-col :span="5">
                <div class="vertical-center">{{item.factoryName }}</div>
              </el-col>
              <el-col :span="3">
                <div class="vertical-center">{{item.approvalNumber }}</div>
              </el-col>
              <el-col :span="2">
                {{item.year}}
              </el-col>
              <el-col :span="2">
                <div class="vertical-center">
                  {{formatStatus(item.availabilityStatus)}}
                </div>
              </el-col>
              <el-col :span="4" class="opera-btn-bidder">
                <perm label="erp-user-edit">
                  <a href="#" @click.stop.prevent="edit(item)"><i
                    class="el-icon-t-edit"></i>编辑</a>
                </perm>
                <perm label="vaccine-info-delete">
                  <a href="#" @click.stop.prevent="remove(item.id)">
                    <oms-forbid :item="item" @forbided="remove((item.id))" :tips='"确认删除中标疫苗\""+item.goodsName+"\"?"'>
                      <i class="el-icon-t-remove"></i> 删除
                    </oms-forbid>
                  </a>

                </perm>
              </el-col>
            </el-row>
            <div class="order-list-item-bg"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">
      <el-pagination
        layout="prev, pager, next"
        :total="pager.count" :pageSize="pager.pageSize" @current-change="getPageList"
        :current-page="pager.currentPage">
      </el-pagination>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox" :css="{'width':'550px','padding':'30px'}">
      <edit-form :formItem="row" :title="formTitle" :action="action" :actionType="showRight" @close="showRight=false"
                 @change="itemChange"></edit-form>
    </page-right>

  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import editForm from './form/form.vue';
  import {BaseInfo, http, Vaccine} from '@/resources';

  export default {
    components: {
      editForm
    },
    data: function () {
      return {
        showRight: false,
        showTypeSearch: false,
        showSearch: false,
        loadingData: false,
        successBidderType: utils.successBidderType,
        row: {},
        dataRows: [],
        typeList: [],
        showTypeList: [],
        typeTxt: '',
        formTitle: '新增',
        action: 'add',
        orgGoods: [],
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        },
        orgName: '',
        activeStatus: true,
        roleMenu: [],
        currentItem: {},
        status: {},
        currentId: '',
        searchCondition: {
          goodsId: '',
          year: '',
          availabilityStatus: true
        },
        vaccineList: []
      };

    },
    mounted() {
      this.getPageList(1);

    },
    computed: {},
    watch: {
      filters: {
        handler: function () {
          this.getPageList(1);
        },
        deep: true
      }
    },
    methods: {
      resetRightBox: function () {
        this.showRight = false;
      },
      getPageList: function (pageNo) {
        this.pager.currentPage = pageNo;
        let params = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.searchCondition);
        this.loadingData = true;
        http.get('successful-bidder', {params}).then(res => {
          this.dataRows = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
          this.querySum(params);
        });

      },
      querySum(params) {
        http.get('successful-bidder/count', {params}).then(res => {
          this.successBidderType[0].num = res.data['true'];
          this.successBidderType[1].num = res.data['false'];
        });
      },
      add: function () {
        this.row = {};
        this.action = 'add';
        this.formTitle = '新增';
        this.showRight = true;
      },
      edit: function (item) {
        this.action = 'edit';
        this.formTitle = '编辑';
        this.showRight = true;
        this.currentId = item.id;
        this.availabilityStatus = item.availabilityStatus;
        this.row = JSON.parse(JSON.stringify(item));
      },
      formatStatus: function (value) {
        if (value === true) return '生效';
        else return '未生效';
      },
      itemChange: function (item) {
        this.getPageList(1);
        this.showRight = false;
      },
      filterListColor: function (index) {// 过滤左边列表边角颜色
        let status = -1;
        if (index) {
          return 0;
        }
        return 1;
      },
      filterVaccine: function (query) {
        let params = Object.assign({}, {
          deleteFlag: false,
          vaccineSign: '2',
          keyWord: query
        });
        http.get('/goods', {params}).then(res => {
          this.vaccineList = res.data.list;
        });
      },
      formatDate(param) {
        this.searchCondition.year = param ? this.$moment(param).format('YYYY') : '';
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          goodsId: '',
          year: '',
          availabilityStatus: true
        };
        Object.assign(this.searchCondition, temp);
        this.getPageList(1);
      },
      searchPage() {
        this.showFlag = true;
        this.getPageList();
      },
      changeStatus: function (item, key) {// 订单分类改变
        this.activeStatus = key;
        this.searchCondition.availabilityStatus = item.availabilityStatus;
        this.getPageList(1);
      },
      remove: function (id) {
        http.delete('successful-bidder/' + id, {}).then(() => {
          this.doing = false;
          this.$notify.success({
            duration: 2000,
            name: '成功',
            message: '删除疫苗中标记录成功'
          });
        }).catch(() => {
          this.$notify.error({
            duration: 2000,
            message: '删除疫苗中标记录失败'
          });
          this.doing = false;
        });
        this.getPageList(1);
      }
    }
  };
</script>
