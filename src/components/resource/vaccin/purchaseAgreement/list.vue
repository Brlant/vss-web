<style lang="less" scoped>

  .margin-left {
    margin-left: 15px;
  }

  .margin-left-right {
    margin-left: 38px;
    margin-right: 38px;
  }

  .power-style-part {
    margin: 12px 0;
    background-color: rgb(238, 238, 238);
    padding: 12px 10px 10px 10px;
  }

  .el-form .el-checkbox__label {
    font-size: 12px;
    padding-left: 5px;
  }

  .el-form .el-checkbox__inner {
    width: 14px;
    height: 14px;
  }

  .customize-input {
    border: 1px solid #ffffff;
    border-radius: 5px;
    width: 240px;
    padding: 4px;
    &:hover {
      border-color: #cccccc;
    }
    &:focus {
      outline: none;
    }
  }

  .min-row {
    .el-row {
      margin-bottom: 10px;
    }
  }

  .bill-font {
    font-weight: bold;
  }

  .borderShow {
    height: 20px;
    border-bottom: 1px solid #777777;
    opacity: 0.2;
    margin-right: 20px;
    margin-bottom: 20px;
  }

  .title {
    margin-bottom: 5px;
    color: #999999;
    font-weight: normal;
  }

  .locked {
    border-left: 5px solid #fa0;
    text-indent: -5px;
  }

  .base-pic-item {
    border: 1px solid #eee;
    position: relative;
    cursor: pointer;
    width: 180px;
    margin: 5px;
    padding: 10px;
    font-size: 12px;
    img {
      width: 180px;
      height: 180px;
      display: block;
      background: #ccc;
    }
  }

  .border-show {
    height: 20px;
    border-bottom: 1px solid #777777;
    opacity: 0.2;
    margin-left: 40px;
    margin-right: 40px;
    margin-bottom: 20px;
  }

  .order-list-item {
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
          <span class="pull-right cursor-span" style="margin-left: 10px" @click.prevent="addType">
      <perm label="purchasing-order-add">
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
              <oms-form-row label="疫苗名称" :span="6">
                <oms-input type="text" v-model="searchCondition.keyWord" placeholder="请输入疫苗名称"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="供货厂商" :span="6">
                <el-select filterable remote placeholder="请输入关键字搜索供货厂商" :remote-method="filterOrg" :clearable="true"
                           v-model="searchCondition.factoryId" popperClass="good-selects" style="width: 100%">
                  <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in orgList">
                    <div style="overflow: hidden">
                      <span class="pull-left" style="clear: right">{{org.name}}</span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left">
                        <span>系统代码</span> {{org.manufacturerCode}}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="4">
              <oms-form-row label="" :span="3">
                <el-button type="primary" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>


      <div class="order-list-status container" style="margin-bottom:20px">
        <div class="status-item" :class="{'active':key==activeStatus} "
             v-for="(item,key) in orgType"
             @click="changeType(key,item)">
          <div class="status-bg" :class="['b_color_'+key]"></div>
          <div>{{item.title}}<span class="status-num">{{item.num}}</span></div>
        </div>
      </div>
      <div class="order-list clearfix">
        <el-row class="order-list-header" :gutter="10">
          <el-col :span="6">疫苗名称</el-col>
          <el-col :span="6">供货厂商</el-col>
          <el-col :span="4">采购单价</el-col>
          <el-col :span="4">协议采购数量</el-col>
          <el-col :span="4">协议有效时间</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="showTypeList.length == 0">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else="" class="order-list-body flex-list-dom">
          <div class="order-list-item" v-for="item in showTypeList" @click="edit(item)"
               :class="['status-'+filterListColor(item.availabilityStatus),{'active':currentItem.id==item.id}]">
            <el-row>
              <el-col :span="6">
                <div class="f-grey">
                  {{item.orgGoodsId }}
                </div>
                <div>
                  {{item.orgGoodsName }}
                </div>
              </el-col>
              <el-col :span="6">
                <div>
                  {{item.factoryName}}
                </div>
              </el-col>
              <el-col :span="4" class="pt10">
                <div>
                  <span v-if="item.unitPrice">￥</span>{{item.unitPrice}}
                </div>
              </el-col>
              <el-col :span="4">
                <div>
                  {{ item.amount}} {{item.unit}}
                </div>
              </el-col>
              <el-col :span="4">
                <div>
                  {{ item.expireTime | date}}
                </div>
              </el-col>
            </el-row>
            <div class="order-list-item-bg"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">
      <el-pagination layout="prev, pager, next"
                     :total="pager.count" :pageSize="pager.pageSize" @current-change="getGoodsList"
                     :current-page="pager.currentPage">
      </el-pagination>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox">
      <goods-part :formItem="form" :action="action" @right-close="showRight=false" :actionType="showRight"
                  @change="onSubmit"></goods-part>
    </page-right>
  </div>
</template>
<script>
  import goodsPart from './form/form.vue';
  import {Vaccine, PurchaseAgreement, BaseInfo} from '../../../../resources';
  import utils from '../../../../tools/utils';

  export default {
    components: {goodsPart},
    data: function () {
      return {
        loadingData: true,
        showRight: false,
        showTypeRight: false,
        showTypeSearch: false,
        showSearch: false,
        data: {},
        combinationList: [],
        showTypeList: [],
        typeTxt: '',
        form: {},
        action: '',
        currentItem: {},
        activeStatus: 0,
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20,
          totalPage: 1
        },
        filters: {
          availabilityStatus: true
//          auditedStatus: null
        },
        orgType: {
          0: {'title': '可用', 'num': 0, 'availabilityStatus': true},
          1: {'title': '停用', 'num': 0, 'availabilityStatus': false}
        },
        searchCondition: {
          keyWord: '',
          factoryId: ''
        },
        orgList: []
      };
    },
    mounted() {
      this.$emit('loaded');
      this.getGoodsList(1);
    },
    watch: {
      'typeTxt': function () {
        this.getGoodsList(1);
      },
      filters: {
        handler() {
          this.getGoodsList(1);
        },
        deep: true
      },
      showSearch: function () {
        this.filterOrg();
      }
    },
    methods: {
      filterOrg: function (query) {// 过滤供货商
        let orgId = this.$store.state.user.userCompanyAddress;
        if (!orgId) {
          this.orgList = [];
          return;
        }
        BaseInfo.queryOrgByReation(orgId, {keyWord: query}).then(res => {
          this.orgList = res.data;
        });
      },
      queryStatusNum: function (params) {
        PurchaseAgreement.queryStateNum(params).then(res => {
          let data = res.data;
          this.orgType[0].num = this.obtionStatusNum(data['valid']);
          this.orgType[1].num = this.obtionStatusNum(data['invalid']);
        });
      },
      obtionStatusNum: function (num) {
        if (typeof num !== 'number') {
          return 0;
        }
        return num;
      },
      searchInOrder: function () {// 搜索
        Object.assign(this.filters, this.searchCondition);
        this.getGoodsList(1);
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          keyWord: '',
          factoryId: ''
        };
        Object.assign(this.searchCondition, temp);
        Object.assign(this.filters, temp);
        this.getGoodsList(1);
      },
      filterListColor: function (flag) {// 过滤左边列表边角颜色
        let status = -1;
        if (flag) {
          status = 0;
        }
        if (!flag) {
          status = 1;
        }
        return status;
      },
      resetRightBox: function () {
        this.showRight = false;
      },
      addType: function () {
        this.action = 'add';
        this.form = {
          id: '',
          amount: '',
          unitPrice: '',
          expireTime: null
        };
        this.showRight = true;
        this.combinationList = [];
      },
      searchType: function () {
        this.showTypeSearch = !this.showTypeSearch;
      },
      getGoodsList: function (pageNo) {
        this.pager.currentPage = pageNo;
        let params = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          keyWord: this.typeTxt,
          deleteFlag: false
        }, this.filters);
        this.loadingData = true;
        PurchaseAgreement.query(params).then(res => {
            this.showTypeList = res.data.list;
            if (res.data.list.length > 0) {
              this.currentItem = Object.assign(this.showTypeList[0]);
            } else {
              this.currentItem = Object.assign({'id': ''});
            }
          this.loadingData = false;
          this.pager.totalPage = res.data.totalPage;
        });
        this.queryStatusNum(params);
      },
      edit: function (item) {
        this.action = 'edit';
        this.currentItem = item;
        this.form = JSON.parse(JSON.stringify(item));
        this.form.unitPrice = utils.autoformatDecimalPoint(this.form.unitPrice.toString());
        this.showRight = true;
      },
      changeType: function (key, item) {// 根据当前选中的标签，重置状态等相关参数。
        this.activeStatus = key;
        this.filters.availabilityStatus = item.availabilityStatus;
      },
      onSubmit: function (item) {
        this.getGoodsList(1);
        this.showRight = false;
        this.currentItem = {};
//        } else {
//          let self = this;
//          self.showTypeList.forEach(function (val, index) {
//            if (item.id === val.id) {
//              self.showTypeList.splice(index, 1, item);
//              self.currentItem = item;
//            }
//          });
//          this.showRight = false;
//        }
      }
    }
  };
</script>
