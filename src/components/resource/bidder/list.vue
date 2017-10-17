<style lang="less" scoped="">

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

  .order-list-item {
    cursor: pointer;
  }

  .pt10 {
    padding-top: 10px;
  }

  .cursor-span {
    cursor: pointer;
  }
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div class="opera-btn-group" :class="{up:!showSearch}">
        <div class="opera-icon">
          <span class="">
            <i class="iconfont icon-search"></i> 筛选查询
          </span>
          <span class="pull-right cursor-span" style="margin-left: 10px" @click.prevent="add">
            <perm label="sales-order-add">
                    <a href="#" class="btn-circle" @click.prevent=""><i
                      class="iconfont icon-plus"></i> </a>添加
            </perm>
          </span>
          <span class="pull-right switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form v-show="showSearch" class="advanced-query-form clearfix" style="padding-top: 10px">
          <el-row>
            <el-col :span="8">
              <oms-form-row label="疫苗" :span="6">
                <el-select filterable remote placeholder="请输入关键字搜索疫苗" :remote-method="filterVaccine"
                           :clearable="true"
                           v-model="searchCondition.goodsId" popper-class="good-selects">
                  <el-option :value="vaccine.id" :key="vaccine.id" :label="vaccine.name"
                             v-for="vaccine in vaccineList"></el-option>
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
              <oms-form-row label="" :span="6">
                <el-button type="primary" @click="searchPage">查询</el-button>
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
             @click="changeStatus(item)">
          <div class="status-bg" :class="['b_color_'+key]"></div>
          <div>{{item.title}}<span class="status-num">{{item.num}}</span></div>
        </div>
      </div>
      <div class="order-list clearfix">
        <el-row class="order-list-header" :gutter="10">
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
               :class="['status-'+filterListColor(item.availabilityStatus),{'active':currentId ==item.id}]" >
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
                <div class="vertical-center">
                  {{item.year}}
                </div>
              </el-col>
              <el-col :span="2">
                <div class="vertical-center">
                  {{formatStatus(item.availabilityStatus)}}
                </div>
              </el-col>
              <el-col :span="4">
                <perm label="erp-user-edit">
                  <a href="#" @click.stop.prevent="edit(item)"><i
                    class="iconfont icon-edit"></i>编辑</a>
                </perm>
                <perm label="vaccine-info-delete">
                  <a href="#" @click.stop.prevent="remove(item.id)"><i class="iconfont icon-remove"></i> 删除</a>
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
  import ElCol from 'element-ui/packages/col/src/col';

  export default {
    components: {
      ElCol,
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
        oldItem: {},
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
          orgName: '',
          factoryName: '',
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
        });
        this.querySum(params);
      },
      querySum(params) {
        let para = Object.assign({}, params);
        para.availabilityStatus = undefined;
        http.get('successful-bidder/count').then(res => {
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
        this.row = item;
      },
      formatStatus: function (value) {
        if (value === true) return '生效';
        else return '未生效';
      },
      itemChange: function (item) {
        if (this.action === 'add') {
          this.getPageList(1);
          this.showRight = false;
        } else {
          let index = this.dataRows.indexOf(this.oldItem);
          if (index !== -1) {
            this.dataRows.splice(index, 1, item);
          }
          this.showRight = false;
        }
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
          keyWord: query
        });
        http.get('/vaccine-info/valid', {params}).then(res => {
          this.vaccineList = res.data.list;
        });
      },
      formatDate(param) {
        this.searchCondition.year = this.$moment(param).format('YYYY');
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          orgName: '',
          factoryName: '',
          year: ''
        };
        Object.assign(this.searchCondition, temp);
      },
      searchPage() {
        this.showFlag = true;
        this.getPageList();
      },
      changeStatus: function (item) {// 订单分类改变
        this.activeStatus = item.availabilityStatus;
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
