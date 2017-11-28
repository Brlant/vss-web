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
            <i class="el-icon-t-search"></i> 筛选查询
          </span>
          <span class="pull-right switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form class="advanced-query-form" onsubmit="return false">
          <el-row>
            <el-col :span="8">
              <oms-form-row label="货主货品" :span="5">
                <el-select filterable remote placeholder="请输入名称搜索货主货品" :remote-method="filterOrgGoods"
                           :clearable="true"
                           v-model="searchWord.orgGoodsId" popper-class="good-selects"
                           @click.native.once="filterOrgGoods('')">
                  <el-option :value="org.id" :key="org.id" :label="org.goodsName"
                             v-for="org in orgGoods">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{org.goodsName}}</span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left"><span
                        v-show="org.goodsNo">货品编号</span>  {{org.goodsNo}}
                      </span>
                      <span class="select-other-info pull-left"><span
                        v-show="org.saleFirmName">供货厂商</span>  {{ org.saleFirmName }}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="批号" :span="5">
                <el-input v-model="searchWord.keyWord" placeholder="请输入批号"></el-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="生产厂商" :span="5">
                <el-select filterable remote placeholder="请输入名称生产厂商" :remote-method="filterFactory" :clearable="true"
                           v-model="searchWord.factoryId" popperClass="good-selects"
                           @click.native.once="filterFactory('')">
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
              <oms-form-row label="近效期天数" :span="6">
                <oms-input type="number" v-model.number="searchWord.nearTermDays" :min="0" placeholder="请输入近效期天数">
                  <template slot="append">天</template>
                </oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="" :span="3">
                <el-button type="primary" native-type="submit" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
                <el-button :plain="true" type="success" @click="exportFile">
                  导出Excel
                </el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>


      <div class="order-list clearfix ">
        <el-row class="order-list-header" :gutter="10">
          <el-col :span="6">货主货品名称</el-col>
          <el-col :span="6">生产厂商</el-col>
          <el-col :span=" orgLevel === 3 ? 4: 3">批号</el-col>
          <el-col :span="2" v-show="orgLevel !== 3">可用库存</el-col>
          <el-col :span="orgLevel === 3 ? 4 : 3">实际库存</el-col>
          <el-col :span="2" v-show="orgLevel !== 3">在途库存</el-col>
          <el-col :span="orgLevel === 3 ? 4 : 2">有效期</el-col>
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
              <el-col :span="6" class="pt">
                <span>{{ item.goodsName }}</span>
              </el-col>
              <el-col :span="6" class="pt">
                <span>{{ item.factoryName }}</span>
              </el-col>
              <el-col :span=" orgLevel === 3 ? 4: 3" class="pt">
                <span>{{ item.batchNumber }}</span>
              </el-col>
              <el-col :span="2" class="pt" v-show="orgLevel !== 3" align="center">
                <span>{{ item.availableCount }}</span>
              </el-col>
              <el-col :span=" orgLevel === 3 ? 4: 3">
                <div><span class="align-word">合格</span>：{{ item.qualifiedCount }}</div>
              </el-col>
              <el-col :span="2" v-show="orgLevel !== 3" class="pt" align="center">
                <span>{{ item.transitCount }}</span>
              </el-col>
              <el-col :span=" orgLevel === 3 ? 4: 2" class="pt" align="center">
                <span>{{ item.expiryDate | date }}</span>
              </el-col>
            </el-row>
          </div>
          <el-row class="order-list-item order-list-item-bg" style="background: #f1f1f1">
            <el-col :span="6" class="pt">
              <span>合计</span>
            </el-col>
            <el-col :span="6" class="pt">
            </el-col>
            <el-col :span=" orgLevel === 3 ? 4: 3" class="pt">
            </el-col>
            <el-col :span="2" class="pt" v-show="orgLevel !== 3" align="center" style="padding-left: 5px;">
              <span>{{ totalInfo.availableCount }}</span>
            </el-col>
            <el-col :span=" orgLevel === 3 ? 4: 3" style="padding-left: 5px;">
              <div><span class="align-word">合格</span>：{{ totalInfo.qualifiedCount }}</div>
            </el-col>
            <el-col :span="2" v-show="orgLevel !== 3" class="pt" align="center">
              <span>{{ totalInfo.transitCount }}</span>
            </el-col>
            <el-col :span=" orgLevel === 3 ? 4: 2" class="pt" align="center">
            </el-col>
          </el-row>
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
  import { BaseInfo, OrgGoods, erpStock, http } from '@/resources';
  import detail from './detail.vue';
  import utils from '@/tools/utils';
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
        currentItem: {},
        totalInfo: {}
      };
    },
    mounted () {
      this.getBatches(1);
    },
    computed: {
      orgLevel () {
        return this.$store.state.orgLevel;
      }
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
        this.totalInfo = {};
        this.pager.currentPage = pageNo;
        let params = Object.assign({
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filters);
        this.loadingData = true;
        erpStock.query(params).then(res => {
          if (res.data.list.length > 1) {
            this.batches = res.data.list.filter(f => f.id);
            this.totalInfo = res.data.list[res.data.list.length - 1];
          }
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
      },
      exportFile: function () {
        let params = Object.assign({}, this.filters);
        this.$store.commit('initPrint', {isPrinting: true, moduleId: '/store/request'});
        this.$http.get('/erp-stock/export', {params}).then(res => {
          utils.download(res.data.path, '即时库存查询');
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/store/request'});
        }).catch(error => {
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/store/request'});
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '导出失败'
          });
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
        let orgId = this.$store.state.user.userCompanyAddress;
        if (!orgId) {
          return;
        }
        // 过滤来源单位
        let params = {
          keyWord: query,
          orgRelationTypeList: ['Manufacture', 'Supplier']
        };
        BaseInfo.queryByOrgRelationTypeList(params).then(res => {
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
        http.get('/erp-stock/goods', {params}).then(res => {
          this.orgGoods = res.data.list;
        });
      },
      formatTime (date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      }
    }
  };
</script>
