<style lang="less" scoped="">
  .advanced-query-form {
    .el-select {
      display: block;
      position: relative;
    }
    .el-date-editor.el-input {
      width: 100%;
    }
    padding-top: 20px;
  }

  .R {
    word-wrap: break-word;
    word-break: break-all;
  }

  .good-selects {
    .el-select-dropdown__item {
      font-size: 14px;
      padding: 8px 10px;
      position: relative;
      white-space: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      color: rgb(72, 94, 106);
      height: auto;
      width: 300px;
      line-height: 1.5;
      box-sizing: border-box;
      cursor: pointer;
    }
  }

  .align-word {
    letter-spacing: 1em;
    margin-right: -1em;
  }

  .opera-btn-group {

    border: 2px solid #eeeeee;
    margin: 10px -5px;
    .opera-icon {
      line-height: 50px;
      height: 50px;
      padding: 0 10px;
      border-bottom: 2px solid #eeeeee;
    }
    .switching-icon {
      cursor: pointer;
      .el-icon-arrow-up {
        transition: all .5s ease-in-out;
      }
    }
    &.up {
      .advanced-query-form {
        display: none;
      }
      .opera-icon {
        border-bottom: 0;
      }
      .el-icon-arrow-up {
        transform: rotate(180deg);
      }
    }
  }

  .order-list-item {
    cursor: pointer;
  }

  .good-selects {
    .el-select-dropdown__item {
      width: auto;
    }
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
          <span class="pull-right switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form class="advanced-query-form">
          <el-row>
            <el-col :span="8">
              <oms-form-row label="生产企业" :span="6">
                <el-select filterable remote placeholder="请输入关键字搜索生产企业" :remote-method="filterFactory" :clearable="true"
                           v-model="searchWord.orgId" popperClass="good-selects">
                  <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in factories">
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
            <el-col :span="8">
              <oms-form-row label="疫苗" :span="6">
                <el-select filterable remote placeholder="请输入关键字搜索疫苗" :remote-method="filterOrgGoods"
                           :clearable="true"
                           v-model="searchWord.goodsId" popper-class="good-selects">
                  <el-option :value="good.id" :key="good.id" :label="good.name"
                             v-for="good in orgGoods">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{good.name}}</span>
                    </div>
                    <div style="overflow: hidden">
                    <span class="select-other-info pull-left"><span
                      v-show="good.id">货品ID</span>  {{good.id}}
                      </span>
                      <span class="select-other-info pull-left"><span
                        v-show="good.specifications">货品规格</span>  {{good.specifications}}
                      </span>
                      <span class="select-other-info pull-left"><span
                        v-show="good.approvalNumber">批准文号</span>  {{good.approvalNumber}}
                      </span>
                    </div>
                    <div style="overflow: hidden">
                  <span class="select-other-info pull-left"><span
                    v-show="good.factoryName">生产厂商</span>  {{ good.factoryName }}
                  </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="批号" :span="6">
                <el-input v-model="searchWord.batchNumber" placeholder="请输入批号"></el-input>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row label="" :span="6">
                <el-button type="primary" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>


      <div class="order-list clearfix " v-if="showFlag">
        <el-row class="order-list-header" :gutter="10">
          <el-col :span="5">疫苗名称</el-col>
          <el-col :span="6">生产厂商</el-col>
          <el-col :span="3">生产日期</el-col>
          <el-col :span="4">批号</el-col>
          <el-col :span="4">批签发号</el-col>
          <el-col :span="2">有效期</el-col>
        </el-row>
        <!--<el-row v-if="loadingData">-->
        <!--<el-col :span="24">-->
        <!--<oms-loading :loading="loadingData"></oms-loading>-->
        <!--</el-col>-->
        <!--</el-row>-->
        <el-row v-if="batches.length == 0">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else="" class="order-list-body flex-list-dom">
          <div class="order-list-item order-list-item-bg" v-for="item in batches"
               :class="[{'active':currentItemId==item.id}]"
               @click.prevent="showDetail(item)">
            <el-row>
              <el-col :span="5" class="pt">
                <span>{{ item.goodsName }}</span>
              </el-col>
              <el-col :span="6" class="pt">
                <span>{{ item.orgName }}</span>
              </el-col>
              <el-col :span="3" class="pt">
                <span>{{ item.productionDate | date }}</span>
              </el-col>
              <el-col :span="4" class="pt">
                <span>{{ item.batchNumber }}</span>
              </el-col>
              <el-col :span="4" class="pt">
                <span>{{ item.batchReleaseNumber }}</span>
              </el-col>
              <el-col :span="2" class="pt" align="center">
                <span>{{ item.expirationDate | date }}</span>
              </el-col>
            </el-row>
          </div>
        </div>

      </div>

      <!--<div class="text-center" v-show="pager.count>pager.pageSize">-->
      <!--<el-pagination-->
      <!--layout="prev, pager, next"-->
      <!--:total="pager.count" :pageSize="pager.pageSize" @current-change="getBatches"-->
      <!--:current-page="pager.currentPage">-->
      <!--</el-pagination>-->
      <!--</div>-->
    </div>

    <page-right :show="showDetailPart" @right-close="resetRightBox" :css="{'width':'1200px','padding':0}">
      <detail :id="currentItemId" @close="resetRightBox"></detail>
    </page-right>
  </div>
</template>
<script>
  //  import order from '../../../tools/orderList';
  import {BatchNumber, BaseInfo, Vaccine} from '../../../resources';
  import detail from './detail.vue';

  export default {
    components: {detail},
    data() {
      return {
//        loadingData: true,
        showFlag: false,
        showSearch: true,
        showDetailPart: false,
        batches: [],
        filters: {
          orgId: '',
          batchNumber: '',
          goodsId: ''
        },
        searchWord: {
          orgId: '',
          batchNumber: '',
          goodsId: ''
        },
        factories: [], // 厂商列表
        orgList: [], // 货主列表,
        orgGoods: [],
//        pager: {
//          currentPage: 1,
//          count: 0,
//          pageSize: 20
//        },
        currentItemId: ''
      };
    },
    mounted() {
      this.filterFactory();
      this.filterOrgGoods();
    },
    watch: {
      filters: {
        handler: function () {
            this.getBatcheNumbers();
        },
        deep: true
      }
    },
    methods: {
      getBatcheNumbers() { // 得到批次列表
//        this.pager.currentPage = pageNo;
//        if (this.filter.orgId !== '' || this.filter.batchNumber !== '' || this.filter.goodsId !== '') {
        let params = Object.assign({}, this.filters);
//        this.loadingData = true;
        BatchNumber.query(params).then(res => {
          this.batches = res.data;
//          this.pager.count = res.data.count;
//          this.loadingData = false;
        });
//        }
      },
      showDetail(item) {
        this.currentItemId = item.id;
        this.showDetailPart = true;
      },
      resetRightBox() {
        this.showDetailPart = false;
      },
      searchInOrder: function () {// 搜索
        this.showFlag = true;
        Object.assign(this.filters, this.searchWord);
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          orgId: '',
          batchNumber: '',
          goodsId: ''
        };
        Object.assign(this.searchWord, temp);
        Object.assign(this.filters, temp);
      },
      filterFactory(query) { // 查询厂商
        let params = {
          deleteFlag: false,
          keyWord: query,
          orgRelationType: 'Manufacture'
        };
        BaseInfo.query(params).then(res => {
          this.factories = res.data.list;
        });
      },
      filterOrgGoods(query) {
        this.orgGoods = [];
        let params = Object.assign({}, {
          deleteFlag: false,
          keyWord: query
        });
        Vaccine.queryAvaliableVaccine(params).then(res => {
          this.orgGoods = res.data.list;
        });
      }
    }
  };
</script>
