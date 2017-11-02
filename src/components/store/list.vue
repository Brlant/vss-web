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
              <oms-form-row label="货主货品" :span="6">
                <el-select filterable remote placeholder="请输入关键字搜索货主货品" :remote-method="filterOrgGoods"
                           :clearable="true"
                           v-model="searchWord.orgGoodsId" popper-class="good-selects">
                  <el-option :value="org.orgGoodsDto.id" :key="org.orgGoodsDto.id" :label="org.orgGoodsDto.name"
                             v-for="org in orgGoods">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{org.orgGoodsDto.name}}</span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left"><span
                        v-show="org.orgGoodsDto.goodsNo">货品编号</span>  {{org.orgGoodsDto.goodsNo}}
                      </span>
                      <span class="select-other-info pull-left"><span
                        v-show="org.orgGoodsDto.salesFirmName">供货厂商</span>  {{ org.orgGoodsDto.salesFirmName }}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="批号" :span="6">
                <el-input v-model="searchWord.keyWord" placeholder="请输入批号"></el-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="生产厂商" :span="6">
                <el-select filterable remote placeholder="请输入关键字生产厂商" :remote-method="filterFactory" :clearable="true"
                           v-model="searchWord.factoryId" popperClass="good-selects">
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
              <oms-form-row label="近效期天数" :span="7">
                <oms-input type="number" v-model.number="searchWord.nearTermDays" :min="0" placeholder="请输入近效期天数">
                  <template slot="append">天</template>
                </oms-input>
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


      <div class="order-list clearfix ">
        <el-row class="order-list-header" :gutter="10">
          <el-col :span="4">货主</el-col>
          <el-col :span="4">生产厂商</el-col>
          <el-col :span="3">批号</el-col>
          <el-col :span="4">货主货品名称</el-col>
          <el-col :span="2">可用数量</el-col>
          <el-col :span="3">实际库存数量</el-col>
          <el-col :span="2">在途库存</el-col>
          <el-col :span="2">有效期</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="batches.length == 0">
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
              <el-col :span="4" class="pt">
                <span>{{ item.orgName }}</span>
              </el-col>
              <el-col :span="4" class="pt">
                <span>{{ item.factoryName }}</span>
              </el-col>
              <el-col :span="3" class="pt">
                <span>{{ item.batchNumber }}</span>
              </el-col>
              <el-col :span="4" class="pt">
                <span>{{ item.goodsName }}</span>
              </el-col>
              <el-col :span="2" class="pt" align="center">
                <span>{{ item.availableCount }}</span>
              </el-col>
              <el-col :span="3">
                <div><span class="align-word">合格</span>：{{ item.qualifiedCount }}</div>
              </el-col>
              <el-col :span="2" class="pt" align="center">
                <span>{{ item.transitCount }}</span>
              </el-col>
              <el-col :span="2" class="pt" align="center">
                <span>{{ item.expiryDate | date }}</span>
              </el-col>
            </el-row>
          </div>
        </div>

      </div>

      <div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">
        <el-pagination
          layout="prev, pager, next"
          :total="pager.count" :pageSize="pager.pageSize" @current-change="getBatches"
          :current-page="pager.currentPage">
        </el-pagination>
      </div>
    </div>

    <page-right :show="showDetailPart" @right-close="resetRightBox" :css="{'width':'1200px','padding':0}">
      <detail :currentItem="currentItem" @close="resetRightBox"></detail>
    </page-right>
  </div>
</template>
<script>
  //  import order from '../../../tools/orderList';
  import { BaseInfo, OrgGoods, erpStock } from '@/resources';
  import detail from './detail.vue';
  export default {
    components: {detail},
    data () {
      return {
        loadingData: true,
        showSearch: true,
        showDetailPart: false,
        batches: [],
        filters: {
          factoryId: '',
          keyWord: '',
          orgGoodsId: '',
          nearTermDays: ''
        },
        searchWord: {
          factoryId: '',
          keyWord: '',
          orgGoodsId: '',
          nearTermDays: ''
        },
        factories: [], // 厂商列表
        orgList: [], // 货主列表,
        orgGoods: [],
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        },
        currentItemId: '',
        currentItem: {}
      };
    },
    mounted () {
      this.getBatches(1);
    },
    watch: {
      filters: {
        handler: function () {
          this.getBatches(1);
        },
        deep: true
      }
    },
    methods: {
      getBatches (pageNo) { // 得到波次列表
        this.pager.currentPage = pageNo;
        let params = Object.assign({
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filters);
        this.loadingData = true;
        erpStock.query(params).then(res => {
          this.batches = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
      },
      showDetail (item) {
        this.currentItemId = item.id;
        this.currentItem = item;
        this.showDetailPart = true;
      },
      resetRightBox () {
        this.showDetailPart = false;
      },
      searchInOrder: function () {// 搜索
        Object.assign(this.filters, this.searchWord);
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          factoryId: '',
          keyWord: '',
          orgGoodsId: '',
          nearTermDays: ''
        };
        Object.assign(this.searchWord, temp);
        Object.assign(this.filters, temp);
      },
      filterFactory (query) { // 生产厂商
        let params = {
          deleteFlag: false,
          keyWord: query
        };
        BaseInfo.query(params).then(res => {
          this.factories = res.data.list;
        });
      },
      filterOrgGoods (query) {
        let orgId = this.$store.state.user.userCompanyAddress;
        let params = Object.assign({}, {
          deleteFlag: false,
          orgId: orgId,
          keyWord: query
        });
        OrgGoods.query(params).then(res => {
          this.orgGoods = res.data.list;
        });
      },
      formatTime (date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      }
    }
  };
</script>
