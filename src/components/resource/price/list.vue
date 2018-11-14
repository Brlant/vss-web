<style lang="scss" scoped>
  @import "../../../assets/mixins";

  .el-form .el-select {
    display: block;
  }

  .d-table-right {
    .org-name-h2 {
      font-size: 16px;
      font-weight: bold;
    }
  }

  .d-table-col-wrap {
    overflow: auto;
  }

  .pov-info {
    margin-bottom: 20px;
    .font-bold {
      font-size: 14px;
    }
  }

  .oms-row {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .content-body {
    margin: 20px 0;
  }

  .table > tbody > tr:first-child > td {
    border-top: 0;
  }

  .tr-header {
    background: #f1f1f1;
    th {
      border: 0;
    }
  }

</style>
<template>
  <div class="order-page">
    <div class="container">
      <div class="opera-btn-group" :class="{up:!showSearch}">
        <div class="opera-icon">
          <span class="pull-left switching-icon" @click="showSearch = !showSearch" style="margin-right: 20px">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form class="advanced-query-form" onsubmit="return false">
          <el-row>
            <el-col :span="8">
              <oms-form-row label="价格组名称" :span="8">
                <oms-input type="text" v-model="searchWord.name" placeholder="请输入价格组名称"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="10">
              <oms-form-row label="货主疫苗" :span="4">
                <el-select filterable remote placeholder="请输入名称搜索货主疫苗" :remote-method="getGoodsList" :clearable="true"
                           v-model="searchWord.orgGoodsId" @click.native.once="getGoodsList('')">
                  <el-option :value="item.orgGoodsDto.id" :key="item.orgGoodsDto.id" :label="item.orgGoodsDto.name"
                             v-for="item in goodses">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{item.orgGoodsDto.name}}</span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left"><span
                        v-show="item.orgGoodsDto.goodsNo">疫苗编号:</span>{{item.orgGoodsDto.goodsNo}}
                      </span>
                      <span class="select-other-info pull-left">
                      <span>销售价格:</span>{{item.orgGoodsDto.sellPrice | formatMoney}}
                      </span>
                      <span class="select-other-info pull-left"><span
                        v-show="item.orgGoodsDto.salesFirmName">供货厂商:</span>{{ item.orgGoodsDto.salesFirmName }}
                      </span>
                      <span class="select-other-info pull-left" v-if="item.orgGoodsDto.goodsDto">
                          <span v-show="item.orgGoodsDto.goodsDto.factoryName">生产厂商:</span>{{ item.orgGoodsDto.goodsDto.factoryName }}
                </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row label="" :span="1">
                <el-button type="primary" native-type="submit" @click="searchInOrder">查询</el-button>
                <el-button @click="resetSearchForm">重置</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="order-list-status container" style="margin-bottom:20px">
        <div class="status-item"
             :class="{'active':item.availabilityStatus===activeStatus}"
             v-for="(item, key) in priceGroupType"
             @click="changeStatus(item)">
          <div class="status-bg" :class="['b_color_'+key]"></div>
          <div><i class="el-icon-caret-right" v-if="item.availabilityStatus===activeStatus"></i>{{item.title}}<span
            class="status-num">{{item.num}}</span></div>
        </div>
      </div>
      <div class="d-table" style="margin-top: 20px">
        <div class="d-table-left">
          <h2 class="header">
            <!--<span class="pull-right">-->
            <!--<a href="#" class="btn-circle" @click.prevent="searchType"><i-->
            <!--class="el-icon-t-search"></i> </a>-->
            <!--</span>-->
            <span class="pull-right" style="margin-right: 8px">
                <perm label="sale-price-group-add">
                  <a href="#" class="btn-circle" @click.stop.prevent="addDetail">
                  <i class="el-icon-t-plus"></i>
                  </a>
                </perm>
              </span>
            二类苗销售价格组
          </h2>
          <div class="d-table-col-wrap" :style="'height:'+ (bodyHeight - 60)  + 'px'" @scroll="scrollLoadingData">
            <div class="search-left-box clearfix" v-show="showTypeSearch">
              <oms-input v-model="filters.keyWord" placeholder="请输入名称搜索" :showFocus="showTypeSearch"></oms-input>
            </div>
            <div v-if="!currentItem.id" class="empty-info">
              暂无信息
            </div>
            <div v-else>
              <ul class="show-list">
                <li v-for="item in showTypeList" class="list-item" @click="showType(item)"
                    :class="{'active':item.id==currentItem.id}">
                  <div class="id-part">
                    {{item.goodsName }}
                  </div>
                  <div>
                    {{item.name }}
                  </div>
                </li>
              </ul>
              <div class="btn-left-list-more">
                <bottom-loading></bottom-loading>
                <div @click.stop="getOrgMore" v-show="!$store.state.bottomLoading">
                  <el-button v-show="typePager.currentPage<typePager.totalPage">加载更多</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-table-right">
          <div class="d-table-col-wrap" :style="'height:'+bodyHeight  + 'px'">
            <!--<span class="pull-right" style="margin-right: 8px">-->
            <!--<perm label="accounts-receivable-detail-add">-->
            <!--<a href="#" class="btn-circle" @click.stop.prevent="add">-->
            <!--<i class="el-icon-t-plus"></i>-->
            <!--</a>-->
            <!--</perm>-->
            <!--</span>-->
            <div v-if="!currentItem.id">
              <div class="empty-info">暂无信息</div>
            </div>
            <div v-else="">
              <h2 class="clearfix">
                <span class="pull-right">
                  <el-button-group>
                    <perm label="sale-price-group-edit">
                      <el-button @click="edit(currentItem)"><i
                        class="el-icon-t-edit"></i>编辑</el-button>
                    </perm>
                    <perm label="sale-price-group-delete">
                      <el-button @click="deletePriceGroup(currentItem)"><i
                        class="el-icon-t-stop"></i>删除</el-button>
                    </perm>
                  </el-button-group>
                </span>
              </h2>
              <div class="content-body clearfix" style="margin-top: 0;margin-bottom: 0">
                <el-row>
                  <oms-row label="销售价格组名称" :span="5">
                    {{currentItem.name}}
                  </oms-row>
                  <oms-row label="疫苗名称" :span="5">
                    {{currentItem.goodsName}}
                  </oms-row>
                  <oms-row label="销售单价" :span="5">
                    <span>￥{{currentItem.unitPrice | formatMoney}}</span>
                  </oms-row>
                  <oms-row label="是否可用" :span="5">
                    {{currentItem.availabilityStatus | formatStatus}}
                  </oms-row>
                </el-row>
              </div>
              <div style="overflow: hidden;margin-bottom: 5px">
                <!--<el-row>-->
                <!--<el-col :span="12" class="search-input" style="padding-right: 10px">-->
                <!--<el-select filterable remote placeholder="请输入名称搜索接种点" :remote-method="filterPOV" :clearable="true"-->
                <!--v-model="povId" @click.native="filterPOV('')">-->
                <!--<el-option :value="org.subordinateId" :key="org.subordinateId" :label="org.subordinateName"-->
                <!--v-for="org in showOrgList">-->
                <!--</el-option>-->
                <!--</el-select>-->
                <!--</el-col>-->
                <!--<el-col :span="3">-->
                <!--<perm label="sale-price-group-pov-bind">-->
                <!--<el-button type="primary" @click="bindPov">绑定接种点</el-button>-->
                <!--</perm>-->
                <!--</el-col>-->
                <!--<el-col :span="24">-->
                <!---->
                <!--</el-col>-->
                <!--</el-row>-->
                <!--<span class="pull-right">-->
                <!--<span class="btn-search-toggle open" v-show="showSearch">-->
                <!--<single-input style="width: 180px" v-model="filterRights.keyWord" placeholder="请输入接种点名称搜索"-->
                <!--:showFocus="showSearch"></single-input>-->
                <!--<i class="el-icon-t-search" @click.stop="showSearch=(!showSearch)"></i>-->
                <!--</span>-->
                <!--<a href="#" class="btn-circle" @click.stop.prevent="showSearch=(!showSearch)" v-show="!showSearch">-->
                <!--<i class="el-icon-t-search"></i>-->
                <!--</a>-->

                <!--</span>-->
              </div>
              <table class="table">
                <thead>
                <tr class="tr-header">
                  <th>接种点</th>
                  <!--<th>操作</th>-->
                </tr>
                </thead>
                <tbody>
                <tr v-if="loadingData">
                  <td colspan="5">
                    <oms-loading :loading="loadingData"></oms-loading>
                  </td>
                </tr>
                <tr v-else-if="!receiptDetails.length">
                  <td colspan="5">
                    <div class="empty-info">
                      暂无信息
                    </div>
                  </td>
                </tr>
                <tr v-else="" v-for="row in receiptDetails" class="tr-right"
                    :class="{active:orderId === row.orderId}">
                  <td>
                    {{ row.povName }}
                  </td>
                  <!--<td>-->
                  <!--<perm label="sale-price-group-pov-delete">-->
                  <!--<a href="#" @click.stop.prevent="removePov(row)"><i class="el-icon-t-delete"></i>删除</a>-->
                  <!--</perm>-->
                  <!--</td>-->
                </tr>
                </tbody>
              </table>
              <div class="text-center" v-show="pager.count>pager.pageSize">
                <el-pagination layout="prev, pager, next"
                               :total="pager.count"
                               :pageSize="pager.pageSize"
                               @current-change="getDetail"
                               :current-page="pager.currentPage">
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}">
      <add-form @change="onSubmit" :formItem="form" :index="index" @refreshDetails="refreshDetails"
                @close="resetRightBox"></add-form>
    </page-right>
    <page-right :show="showLeft" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}">
      <left-form @change="onSubmit" :formItem="form" :index="index" @close="resetRightBox"
                 @refresh="refresh"></left-form>
    </page-right>
  </div>

</template>
<script>
  import utils from '@/tools/utils';
  import { BriceGroup, BriceGroupPov } from '@/resources';
  import addForm from './right-form.vue';
  import leftForm from './letf-form.vue';

  export default {
    components: {
      addForm, leftForm
    },
    data: function () {
      return {
        loadingData: false,
        showRight: false,
        showLeft: false,
        showPart: false,
        showTypeSearch: false,
        showSearch: false,
        showTypeList: [],
        priceGroupType: utils.priceGroupType,
        filters: {
          name: '',
          orgGoodsId: '',
          availabilityStatus: true
        },
        filterRights: {
          keyWord: ''
        },
        searchWord: {
          name: '',
          orgGoodsId: ''
        },
        action: 'add',
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20,
          totalPage: 1
        },
        typePager: {
          currentPage: 1,
          count: 0,
          pageSize: 20,
          totalPage: 1
        },
        form: {},
        currentItem: {}, //  左边列表点击时，添加样式class
        receiptDetails: [], // 疫苗列表
        index: 0,
        orderId: '',
        currentDetail: {},
        orgList: [],
        showOrgList: [],
        povId: '',
        activeStatus: true,
        goodses: []
      };
    },
    computed: {
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        height = (height - 90);
        return height;
      },
      user () {
        return this.$store.state.user;
      }
    },
    mounted () {
      this.getOrgsList(1);
    },
    watch: {
      filters: {
        handler: function () {
          this.getOrgsList(1);
        },
        deep: true
      },
      filterRights: {
        handler: function () {
          this.getDetail(1);
        },
        deep: true
      },
      user (val) {
        if (val.userCompanyAddress) {
          this.getOrgsList(1);
        }
      }
    },
    methods: {
      scrollLoadingData (event) {
        this.$scrollLoadingData(event);
      },
      resetRightBox: function () {
        this.showRight = false;
        this.showLeft = false;
        this.showPart = false;
      },
      searchType: function () {
        this.showTypeSearch = !this.showTypeSearch;
      },
      getOrgsList: function (pageNo, isContinue = false) {
        let orgId = this.user.userCompanyAddress;
        if (!orgId) return;
        this.typePager.currentPage = pageNo;
        let params = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.typePager.pageSize
        }, this.filters);
        BriceGroup.query(params).then(res => {
          if (params.keyWord !== this.filters.keyWord) return;
          this.$store.commit('initBottomLoading', false);
          if (isContinue) {
            this.showTypeList = this.showTypeList.concat(res.data.list);
          } else {
            this.showTypeList = res.data.list;
            if (this.showTypeList.length !== 0) {
              this.currentItem = res.data.list[0];
              this.getDetail(1);
            } else {
              this.currentItem = Object.assign({'id': ''});
            }
          }
          this.typePager.totalPage = res.data.totalPage;
        });
        this.querySum(params);
      },
      querySum (params) {
        let para = Object.assign({}, params);
        para.availabilityStatus = undefined;
        BriceGroup.querySum(para).then(res => {
          this.priceGroupType[0].num = res.data['valid'];
          this.priceGroupType[1].num = res.data['invalid'];
        });
      },
      refresh () {
        this.getOrgsList(1);
        this.resetRightBox();
      },
      refreshDetails () {
        this.getDetail();
        this.resetRightBox();
      },
      getDetail: function (pageNo) {
        this.receiptDetails = {};
        if (!this.currentItem.id) return;
        this.pager.currentPage = pageNo;
        this.loadingData = true;
        let params = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          salePriceGroupId: this.currentItem.id
        }, this.filterRights);
        BriceGroupPov.query(params).then(res => {
          this.loadingData = false;
          this.receiptDetails = res.data.list;
          this.pager.count = res.data.count;
        });
      },
      getGoodsList: function (query) {
        let params = Object.assign({}, {
          keyWord: query,
          deleteFlag: false
        });
        this.$http.get('/vaccine-info/second-vaccine/valid/org-goods', {params}).then(res => {
          this.goodses = res.data.list;
        });
      },
      searchInOrder: function () {// 搜索
        Object.assign(this.filters, this.searchWord);
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          name: '',
          orgGoodsId: ''
        };
        Object.assign(this.searchWord, temp);
        Object.assign(this.filters, temp);
      },
      bindPov () {
        let form = {
          'salePriceGroupId': this.currentItem.id,
          'povId': this.povId
        };
        if (!this.povId) {
          this.$notify.info({
            message: '请选择接种点'
          });
          return;
        }
        BriceGroupPov.save(form).then(() => {
          this.$notify.success({
            message: '绑定接种点成功'
          });
          this.povId = '';
          this.getDetail(1);
        }).catch(error => {
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '绑定接种点失败'
          });
        });
      },
      removePov (item) {
        this.$confirm('是否删除接种点"' + item.povName + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          BriceGroupPov.delete(item.id).then(res => {
            this.$notify.success({
              message: `删除接种点${item.povName}成功`
            });
            this.getDetail(1);
          }).catch(error => {
            this.$notify.error({
              message: error.response.data && error.response.data.msg || `删除接种点${item.povName}失败`
            });
          });
        });
      },
      getOrgMore: function () {
        this.getOrgsList(this.typePager.currentPage + 1, true);
      },
      showType: function (item) {
        this.currentItem = item;
        this.getDetail(1);
      },
      showDetail (item) {
        this.orderId = item.orderId;
        this.showPart = true;
        this.currentDetail = item;
      },
      filterPOV: function (query) {// 过滤POV
        // let params = Object.assign({}, {
        //   keyWord: query
        // });
        // cerpAction.queryAllPov(params).then(res => {
        //   this.orgList = res.data.list;
        //   this.filterPOVs();
        // });
      },
      filterPOVs () {
        this.showOrgList = this.orgList.filter(f => !this.receiptDetails.some(s => f.subordinateId === s.povId));
      },
      add () {
        if (!this.currentItem.id) {
          this.$notify.info({
            message: '请先添加付款方'
          });
          return;
        }
        this.showRight = true;
      },
      addDetail () {
        this.showLeft = true;
        this.form = {};
      },
      edit (row) {
        this.form = row;
        this.showLeft = true;
      },
      deletePriceGroup (item) {
        this.$confirm('是否删除销售价格组"' + item.name + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          BriceGroup.delete(item.id).then(res => {
            this.$notify.success({
              message: `删除销售价格组${item.name}成功`
            });
            this.getOrgsList(1);
          }).catch(error => {
            this.$notify.error({
              message: error.response.data && error.response.data.msg || `删除销售价格组${item.name}失败`
            });
          });
        });
      },
      changeStatus: function (item) {// 订单分类改变
        this.activeStatus = item.availabilityStatus;
        this.filters.availabilityStatus = item.availabilityStatus;
      },
      onSubmit () {
        this.getOrgsList();
      }
    }
  };
</script>
