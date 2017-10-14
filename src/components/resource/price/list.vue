<style lang="less" scoped>
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

  .search-input {
    .el-select {
      display: block;
      position: relative;
    }
    .el-date-editor.el-input {
      width: 100%;
    }
  }

  .oms-row {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .content-body {
    margin: 20px 0;
  }

  .tr-right {
    cursor: pointer;
    &:hover, &.active {
      background: @dialog-left-bg;
    }
  }

  .search-input {
    .el-select {
      display: block;
      position: relative;
    }
    .el-date-editor.el-input {
      width: 100%;
    }
  }

  .list-item {
    .edit-li {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      display: none;
    }
    &.active {
      .edit-li {
        display: block;
      }
    }
    .edit-a {
      &:hover {
        color: @activeColor;
      }
      margin-right: 10px;
    }
    .delete-a {
      &:hover {
        color: @activeColor;
      }
    }
    padding-right: 70px;
  }
</style>
<template>
  <div>
    <div class="container">
      <div class="order-list-status container" style="margin-bottom:20px">
        <div class="status-item"
             :class="{'active':item.availabilityStatus===activeStatus}"
             v-for="(item, key) in priceGroupType"
             @click="changeStatus(item)">
          <div class="status-bg" :class="['b_color_'+key]"></div>
          <div>{{item.title}}<span class="status-num">{{item.num}}</span></div>
        </div>
      </div>
      <div class="d-table" style="margin-top: 20px">
        <div class="d-table-left">
          <div class="d-table-col-wrap" :style="'max-height:'+bodyHeight">
            <h2 class="header">
            <span class="pull-right">
                <a href="#" class="btn-circle" @click.prevent="searchType"><i
                  class="iconfont icon-search"></i> </a>
            </span>
              <span class="pull-right" style="margin-right: 8px">
                <perm label="accounts-receivable-add">
                  <a href="#" class="btn-circle" @click.stop.prevent="addDetail">
                  <i class="iconfont icon-plus"></i>
                  </a>
                </perm>
              </span>
              价格组
            </h2>
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
                  {{item.name }}
                  <div class="edit-li">
                    <a class="edit-a" @click.prevent="edit(item)"><i class="iconfont icon-edit"></i></a>
                    <a class="delete-a" @click.prevent="deletePriceGroup(item)"><i class="iconfont icon-delete"></i></a>
                  </div>
                </li>
              </ul>
              <div class="btn-left-list-more" @click.stop="getOrgMore">
                <el-button v-show="typePager.currentPage<typePager.totalPage">加载更多</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="d-table-right">
          <!--<span class="pull-right" style="margin-right: 8px">-->
          <!--<perm label="accounts-receivable-detail-add">-->
          <!--<a href="#" class="btn-circle" @click.stop.prevent="add">-->
          <!--<i class="iconfont icon-plus"></i>-->
          <!--</a>-->
          <!--</perm>-->
          <!--</span>-->
          <div v-if="!currentItem.id">
            <div class="empty-info">暂无信息</div>
          </div>
          <div v-else="" class="d-table-col-wrap">
            <div class="content-body clearfix">
              <el-row>
                <oms-row label="价格组名称" :span="5">
                  {{currentItem.name}}
                </oms-row>
                <oms-row label="货品名称" :span="5">
                  {{currentItem.goodsName}}
                </oms-row>
                <oms-row label="销售单价" :span="5">
                  <span v-show="currentItem.unitPrice">￥{{currentItem.unitPrice}}</span>
                </oms-row>
                <oms-row label="是否可用" :span="5">
                  {{currentItem.availabilityStatus | formatStatus}}
                </oms-row>
              </el-row>
            </div>
            <div style="overflow: hidden">
              <el-row>
                <el-col :span="12" class="search-input" style="padding-right: 10px">
                  <el-select filterable remote placeholder="请输入关键字搜索POV" :remote-method="filterPOV" :clearable="true"
                             v-model="povId" @click.native="filterPOV('')">
                    <el-option :value="org.subordinateId" :key="org.subordinateId" :label="org.subordinateName"
                               v-for="org in showOrgList">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="3">
                  <perm label="vaccine-authorization-add">
                    <el-button type="primary" @click="bindPov">绑定POV</el-button>
                  </perm>
                </el-col>
                <el-col :span="9">
                   <span class="pull-right">
                     <span class="btn-search-toggle open" v-show="showSearch">
                        <single-input style="width: 180px" v-model="filterRights.keyWord" placeholder="请输入POV名称搜索"
                                      :showFocus="showSearch"></single-input>
                        <i class="iconfont icon-search" @click.stop="showSearch=(!showSearch)"></i>
                     </span>
                     <a href="#" class="btn-circle" @click.stop.prevent="showSearch=(!showSearch)" v-show="!showSearch">
                        <i class="iconfont icon-search"></i>
                     </a>
                  </span>
                </el-col>
              </el-row>
            </div>
            <table class="table"
                   style="margin-top: 10px">
              <thead>
              <tr>
                <th>POV</th>
                <th>操作</th>
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
                <td>
                  <perm label="vaccine-authorization-delete">
                    <a href="#" @click.stop.prevent="removePov(row)"><i class="iconfont icon-delete"></i>删除</a>
                  </perm>
                </td>
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
  import { receipt, BriceGroup, cerpAction, BriceGroupPov } from '@/resources';
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
          keyWord: '',
          availabilityStatus: true
        },
        filterRights: {
          keyWord: ''
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
        activeStatus: true
      };
    },
    computed: {
      bodyHeight: function () {
        return this.$store.state.bodyHeight;
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
          pageSize: this.pager.pageSize
        }, this.filters);
        BriceGroup.query(params).then(res => {
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
        this.getOrgsList();
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
      bindPov () {
        let form = {
          'salePriceGroupId': this.currentItem.id,
          'povId': this.povId
        };
        if (!this.povId) {
          this.$notify.info({
            message: '请选择POV'
          });
          return;
        }
        BriceGroupPov.save(form).then(() => {
          this.$notify.success({
            message: '绑定POV成功'
          });
          this.povId = '';
          this.getDetail(1);
        }).catch(error => {
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '绑定POV失败'
          });
        });
      },
      removePov (item) {
        this.$confirm('是否删除POV"' + item.povName + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          BriceGroupPov.delete(item.id).then(res => {
            this.$notify.success({
              message: `删除POV${item.povName}成功`
            });
            this.getDetail(1);
          }).catch(error => {
            this.$notify.error({
              message: error.response.data && error.response.data.msg || `删除POV${item.povName}失败`
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
        let params = Object.assign({}, {
          keyWord: query
        });
        cerpAction.queryAllPov(params).then(res => {
          this.orgList = res.data.list;
          this.filterPOVs();
        });
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
        this.$confirm('是否删除价格组"' + item.name + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          BriceGroup.delete(item.id).then(res => {
            this.$notify.success({
              message: `删除价格组${item.name}成功`
            });
            this.getOrgsList(1);
          }).catch(error => {
            this.$notify.error({
              message: error.response.data && error.response.data.msg || `删除价格组${item.name}失败`
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
