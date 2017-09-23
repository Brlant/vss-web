<style lang="less" scoped>

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
              <span class="pull-right" style="margin-right: 8px">
             <perm label="accounts-payable-add">
               <a href="#" class="btn-circle" @click.stop.prevent="addDetail">
                  <i class="iconfont icon-plus"></i>
              </a>
             </perm>
            </span>
              所有应付款
            </h2>
            <div class="search-left-box clearfix" v-show="showTypeSearch">
              <oms-input v-model="filters.keyWord" placeholder="请输入关键字搜索" :showFocus="showTypeSearch"></oms-input>
            </div>
            <div v-if="!currentItem.id" class="empty-info">
              暂无信息
            </div>
            <div v-else>
              <ul class="show-list">
                <li v-for="item in showTypeList" class="list-item" @click="showType(item)"
                    :class="{'active':item.id==currentItem.id}">
                  <div class="id-part">
                    应付款总额 ￥{{item.payableTotal }}
                  </div>
                  <div>
                    {{item.remitteeName }}
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
            <span class="pull-right" style="margin-right: 8px">
               <perm label="accounts-payable-detail-add">
                 <a href="#" class="btn-circle" @click.stop.prevent="add">
                    <i class="iconfont icon-plus"></i>
                </a>
               </perm>
            </span>
          <div v-if="!currentItem.id">
            <div class="empty-info">暂无信息</div>
          </div>
          <div v-else="" class="d-table-col-wrap">
            <div class="content-body clearfix">
              <span style="font-size: 14px">【应付款详情】</span>
              <el-row>
                <oms-row label="收款方" :span="5">
                  {{currentItem.remitteeName}}
                </oms-row>
                <oms-row label="应付款总额" :span="5">
                  ￥{{currentItem.payableTotal}}
                </oms-row>
              </el-row>
            </div>
            <span style="font-size: 14px">【应付款明细】</span>
            <table class="table "
                   style="margin-top: 10px">
              <thead>
              <tr>
                <th>订单号ID</th>
                <th>单据金额</th>
                <th>剩余应付金额</th>
                <th>创建时间</th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="loadingData">
                <td colspan="3">
                  <oms-loading :loading="loadingData"></oms-loading>
                </td>
              </tr>
              <tr v-else-if="!payDetails.length">
                <td colspan="3">
                  <div class="empty-info">
                    暂无信息
                  </div>
                </td>
              </tr>
              <tr v-else="" v-for="row in payDetails">
                <td>
                  {{row.orderId}}
                </td>
                <td>
                  ￥{{row.billAmount}}
                </td>
                <td>
                  ￥{{row.unpaidAmount}}
                </td>
                <td>
                  {{row.createTime | date }}
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}">
      <add-form @change="onSubmit" :currentItem="currentItem" :index="index" @refreshDetails="refreshDetails"
                @close="resetRightBox"></add-form>
    </page-right>
    <page-right :show="showLeft" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}">
      <left-form @change="onSubmit" :index="index" @close="resetRightBox" @refresh="refresh"></left-form>
    </page-right>
  </div>

</template>
<script>
  import { pay } from '@/resources';
  import addForm from './right-form.vue';
  import leftForm from './letf-form.vue';

  export default {
    components: {addForm, leftForm},
    data: function () {
      return {
        loadingData: false,
        showRight: false,
        showLeft: false,
        showTypeSearch: false,
        showTypeList: [],
        filters: {
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
        currentItem: {}, //  左边列表点击时，添加样式class
        payDetails: [], // 疫苗列表
        index: 0
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
          pageSize: this.pager.pageSize,
        }, this.filters);
        pay.query(params).then(res => {
          if (isContinue) {
            this.showTypeList = this.showTypeList.concat(res.data.list);
          } else {
            this.showTypeList = res.data.list;
            if (this.showTypeList.length !== 0) {
              this.currentItem = res.data.list[0];
              this.getDetail();
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
      },
      getDetail: function () {
        this.payDetails = {};
        if (!this.currentItem.id) return;
        this.loadingData = true;
        pay.queryDetail(this.currentItem.id).then(res => {
          this.loadingData = false;
          this.payDetails = res.data.list;
        });
      },
      getOrgMore: function () {
        this.getOrgsList(this.typePager.currentPage + 1, true);
      },
      showType: function (item) {
        this.currentItem = item;
        this.getDetail();
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
      onSubmit () {
        this.getOrgsList();
      }
    }
  };
</script>
