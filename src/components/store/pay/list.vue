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
              所有应付款
            </h2>
            <div class="search-left-box" v-show="showTypeSearch">
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
                    应付款总额 {{item.id }}
                  </div>
                  <div>
                    {{item.povName }}
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

          <div v-if="!currentOrder.id">
            <div class="empty-info">暂无信息</div>
          </div>
          <div v-else="" class="d-table-col-wrap">
            <div class="content-body clearfix">
              <span style="font-size: 14px">【应付款详情】</span>
              <el-row>
                <oms-row label="货主" :span="5">
                  {{currentOrder.orgName}}
                </oms-row>
                <oms-row label="厂商" :span="5">
                  {{currentOrder.factoryName}}
                </oms-row>
                <oms-row label="应付款总额" :span="5">
                  {{currentOrder.amount}}
                </oms-row>
              </el-row>
            </div>
            <span style="font-size: 14px">【应付款明细】</span>
            <table class="table " :class="{'table-hover':currentOrder.detailDtoList.length !== 0}"
                   style="margin-top: 10px">
              <thead>
              <tr>
                <th>货主订单号</th>
                <th>单据金额</th>
                <th>剩余应付金额</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="row in currentOrder.detailDtoList">
                <td>
                  {{row.id}}
                </td>
                <td>
                  {{row.amount}}
                </td>
                <td>
                  {{row.price}}
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}">
      <add-form @change="onSubmit" :index="index" @close="resetRightBox"></add-form>
    </page-right>
  </div>

</template>
<script>
  import utils from '../../../tools/utils';
  import { pullSignal } from '@/resources';
  import addForm from './form.vue';

  export default {
    components: {addForm},
    data: function () {
      return {
        showRight: false,
        showTypeSearch: false,
        showSearch: false,
        dataRows: [],
        showTypeList: [],
        receiptType: utils.receiptType,
        activeStatus: 0,
        filters: {
          status: '',
          keyWord: ''
        },
        form: {list: [{roleId: ''}]},
        formTitle: '新增',
        oldItem: {},
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
        receipt: [], // 疫苗列表
        receiptId: '',
        currentOrder: {},
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
          this.currentOrder = {};
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
          povId: orgId
        }, this.filters);
        pullSignal.query(params).then(res => {
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
          this.queryCount();
        });
      },
      queryCount () {
//        let params = Object.assign({}, {
//          povId: this.user.userCompanyAddress
//        }, this.filters);
//        pullSignal.queryCount(params).then(res => {
//          this.receiptType[0].num = res.data['all'];
//          this.receiptType[1].num = res.data['pending-audit'];
//          this.receiptType[2].num = res.data['audited'];
//          this.receiptType[3].num = res.data['assigned'];
//          this.receiptType[4].num = res.data['canceled'];
//        });
      },
      getDetail: function () {
        this.currentOrder = {};
        if (!this.currentItem.id) return;
        pullSignal.get(this.currentItem.id).then(res => {
          this.currentOrder = res.data;
        });
      },
      getOrgMore: function () {
        this.getOrgsList(this.typePager.currentPage + 1, true);
      },
      showType: function (item) {
        this.currentItem = item;
        this.getDetail();
      },
      checkStatus (item, key) {
        this.activeStatus = key;
        this.filters.status = item.status;
      },
      add () {
        this.showRight = true;
        this.index = 0;
        this.$nextTick(() => {
          this.index = 1;
        });
      },
      onSubmit () {
        this.getOrgsList();
      }
    }
  };
</script>
