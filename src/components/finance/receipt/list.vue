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
</style>
<template>
  <div>
    <div class="container">
      <div class="d-table clearfix" style="margin-top: 20px">
        <div class="d-table-left">
          <div class="d-table-col-wrap" :style="'max-height:'+bodyHeight">
            <h2 class="header">
            <span class="pull-right">
                <a href="#" class="btn-circle" @click.prevent="searchType"><i
                  class="iconfont icon-search"></i> </a>
            </span>
              <!--<span class="pull-right" style="margin-right: 8px">-->
              <!--<perm label="accounts-receivable-add">-->
              <!--<a href="#" class="btn-circle" @click.stop.prevent="addDetail">-->
              <!--<i class="iconfont icon-plus"></i>-->
              <!--</a>-->
              <!--</perm>-->
              <!--</span>-->
              所有应收款
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
                  <div class="id-part">
                    应收款总额 <span v-show="item.payableTotal"> ￥{{item.payableTotal }}</span>
                  </div>
                  <div>
                    {{item.payerName }}
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
              <span style="font-size: 14px">【应收款详情】</span>
              <el-row>
                <oms-row label="POV" :span="5">
                  {{currentItem.payerName}}
                </oms-row>
                <oms-row label="应收款总额" :span="5">
                  <span v-show="currentItem.payableTotal">￥{{currentItem.payableTotal}}</span>
                </oms-row>
              </el-row>
            </div>
            <div style="overflow: hidden">
              <span style="font-size: 14px" class="pull-left">【应收款明细】</span>
              <span class="pull-right" style="margin-top: 8px">
               <span class="btn-search-toggle open" v-show="showSearch">
                  <single-input v-model="filterRights.keyWord" placeholder="请输入订单号搜索"
                                :showFocus="showSearch"></single-input>
                  <i class="iconfont icon-search" @click.stop="showSearch=(!showSearch)"></i>
               </span>
               <a href="#" class="btn-circle" @click.stop.prevent="showSearch=(!showSearch)" v-show="!showSearch">
                  <i class="iconfont icon-search"></i>
               </a>
            </span>
            </div>
            <table class="table"
                   style="margin-top: 10px">
              <thead>
              <tr>
                <th>订单号</th>
                <th>单据金额</th>
                <th>实收金额</th>
                <th>创建时间</th>
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
              <tr v-else="" v-for="row in receiptDetails" @click="showDetail(row)" class="tr-right"
                  :class="{active:orderId === row.orderId}">
                <td>
                  {{row.orderNo}}
                </td>
                <td>
                    <span v-show="row.billAmount">
                    ￥{{row.billAmount}}
                  </span>
                </td>
                <td>
                  <span v-show="row.prepaidAccounts">
                    <span v-show="row.prepaidAccounts"> ￥{{row.prepaidAccounts}}</span>
                  </span>
                </td>
                <td>
                  {{row.createTime | date }}
                </td>
                <td>
                  <perm label="accounts-receivable-update">
                  <a href="#" @click.stop.prevent="edit(row)"><i class="iconfont icon-edit"></i>增加实收金额</a>
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
      <left-form @change="onSubmit" :index="index" @close="resetRightBox" @refresh="refresh"></left-form>
    </page-right>

    <page-right :show="showPart" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}"
                partClass="pr-no-animation">
      <show-detail @change="onSubmit" :orderId="orderId" :currentDetail="currentDetail" :index="index"
                   @close="resetRightBox"
                   @refresh="refresh"></show-detail>
    </page-right>
  </div>

</template>
<script>
  import { receipt } from '@/resources';
  import addForm from './right-form.vue';
  import leftForm from './letf-form.vue';
  import showDetail from './show.order.out.vue';
  export default {
    components: {addForm, leftForm, showDetail},
    data: function () {
      return {
        loadingData: false,
        showRight: false,
        showLeft: false,
        showPart: false,
        showTypeSearch: false,
        showSearch: false,
        showTypeList: [],
        filters: {
          keyWord: ''
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
        currentDetail: {}
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
        receipt.query(params).then(res => {
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
        this.loadingData = true;
        let params = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filterRights);
        receipt.queryDetail(this.currentItem.id, params).then(res => {
          this.loadingData = false;
          this.receiptDetails = res.data.list;
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
      },
      edit (row) {
        this.form = row;
        this.showRight = true;
      },
      onSubmit () {
        this.getOrgsList();
      }
    }
  };
</script>
