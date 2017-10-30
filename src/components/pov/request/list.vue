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
    <div class="container" >
      <div class="order-list-status container">
        <div class="status-item" :class="{'active':key==activeStatus}" style="width: 100px"
             v-for="(item,key) in requestType" @click="checkStatus(item, key)">
          <div class="status-bg" :class="['b_color_'+key]"></div>
          <div>{{item.title}}<span class="status-num">{{item.num}}</span></div>
        </div>
        <span class="pull-right" style="margin-top: 8px">
           <perm label="pull-signal-add">
             <a href="#" class="btn-circle" @click.stop.prevent="add">
                <i class="iconfont icon-plus"></i>
            </a>
           </perm>
       </span>
      </div>
      <div class="d-table" style="margin-top: 20px">
        <div class="d-table-left">
          <div class="d-table-col-wrap" :style="'max-height:'+bodyHeight">
            <h2 class="header">
          <span class="pull-right">
              <a href="#" class="btn-circle" @click.prevent="searchType"><i
                class="iconfont icon-search"></i> </a>
          </span>
              要货申请单列表
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
                    要货申请ID {{item.id }}
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
            <h2 class="clearfix">
              <span class="pull-right">
                <el-button-group>
                    <perm label="pull-signal-audit" v-show="currentOrder.status === 0">
                      <el-button @click="audited()"><i
                        class="iconfont icon-verify"></i>审核</el-button>
                    </perm>
                    <perm label="pull-signal-audit" v-show="currentOrder.status === 0">
                      <el-button @click="editOrder()"><i
                        class="iconfont icon-edit"></i>编辑</el-button>
                    </perm>
                    <perm label="pull-signal-cancel" style="margin-left: 10px" v-show="currentOrder.status === 0">
                      <el-button @click="cancel()"><i
                        class="iconfont icon-verify"></i>取消</el-button>
                    </perm>
                </el-button-group>
              </span>
            </h2>
            <div class="content-body clearfix">
              <el-row>
                <el-col :span="8">
                  <oms-row label="要货申请ID">
                    {{currentOrder.id }}
                  </oms-row>
                  <oms-row label="申请时间">
                    {{currentOrder.applyTime | date}}
                  </oms-row>
                  <oms-row label="需求时间">
                    {{currentOrder.demandTime| date}}
                  </oms-row>
                  <oms-row label="POV仓库">
                    {{currentOrder.warehouseName}}
                  </oms-row>
                </el-col>
                <el-col :span="16">
                  <oms-row label="申请人">
                    {{currentOrder.applyManName}}
                  </oms-row>
                  <oms-row label="审批人">
                    {{currentOrder.auditManName}}
                  </oms-row>
                  <oms-row label="审批时间">
                    {{currentOrder.auditTime| date}}
                  </oms-row>
                  <oms-row label="关联CDC销售订单">
                    {{currentOrder.orderId}}
                  </oms-row>
                  <oms-row label="需求单状态">
                    {{ formatStatus(currentOrder.status)}}
                  </oms-row>
                </el-col>
              </el-row>
            </div>
            <span style="font-size: 14px">【要货明细】</span>
            <table class="table " :class="{'table-hover':currentOrder.detailDtoList.length !== 0}" style="margin-top: 10px">
              <thead>
              <tr>
                <th style="width: 300px">货品名称</th>
                <th>单价</th>
                <th>申请数量</th>
                <th>申请金额</th>
                <th v-show="filters.status === 4">分配数量</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="row in currentOrder.detailDtoList">
                <td>
                  {{row.goodsName}}
                </td>
                <td>
                  <span v-if="row.price">￥{{row.price | formatMoney}}</span>
                  <span v-if="!row.price">-</span>
                </td>
                <td>
                  {{row.applyCount}}
                  （
                  <dict
                    :dict-group="'measurementUnit'"
                    :dict-key="row.unit"></dict>
                  ）
                </td>
                <td>
                  <span v-if="row.applyMoney">￥{{row.applyMoney | formatMoney}}</span>
                  <span v-if="!row.applyMoney">-</span>
                </td>
                <td v-show="filters.status === 4">
                  {{row.actualCount}}
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}">
      <add-form @change="onSubmit" :index="index" :currentOrder="currentOrder" @close="resetRightBox"></add-form>
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
        requestType: utils.requestType,
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
        vaccines: [], // 疫苗列表
        vaccineId: '',
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
        this.index = 0;
      },
      searchType: function () {
        this.showTypeSearch = !this.showTypeSearch;
      },
      getOrgsList: function (pageNo, isContinue = false) {
        this.currentItem = {};
        this.currentOrder = {};
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
          }
          if (this.showTypeList.length !== 0) {
            this.currentItem = res.data.list[0];
            this.getDetail();
          } else {
            this.currentItem = Object.assign({'id': ''});
          }
          this.typePager.totalPage = res.data.totalPage;
          this.queryCount();
        });
      },
      queryCount () {
        let params = Object.assign({}, {
          povId: this.user.userCompanyAddress
        }, this.filters);
        pullSignal.queryCount(params).then(res => {
          this.requestType[0].num = res.data['all'];
          this.requestType[1].num = res.data['pending-audit'];
          this.requestType[2].num = res.data['audited'];
          this.requestType[3].num = res.data['create-wave'];
          this.requestType[4].num = res.data['assigned'];
          this.requestType[5].num = res.data['canceled'];
        });
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
      formatStatus (index) {
        let status = -1;
        for (let key in this.requestType) {
          if (this.requestType[key].status === index) {
            status = this.requestType[key].title;
          }
        }
        return status;
      },
      cancel () {
        this.$confirm('是否取消"' + this.currentOrder.id + '" 申请单?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          pullSignal.cancel(this.currentOrder.id).then(() => {
            this.$notify.success({
              message: '已成功取消申请单'
            });
            this.getOrgsList(1);
          }).catch(error => {
            this.$notify.error({
              message: error.response.data && error.response.data.msg || '取消申请单失败'
            });
          });
        });
      },
      audited () {
        this.$confirm('是否审核通过"' + this.currentOrder.id + '" 申请单?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          pullSignal.audit(this.currentOrder.id).then(() => {
            this.$notify.success({
              message: '申请单审核通过'
            });
            this.getOrgsList(1);
          }).catch(error => {
            this.$notify.error({
              message: error.response.data && error.response.data.msg || '申请单审核失败'
            });
          });
        });
      },
      add () {
        this.showRight = true;
        this.index = 1;
      },
      editOrder (item) {
        this.index = 2;
        this.showRight = true;
      },
      onSubmit () {
        this.getOrgsList();
      }
    }
  };
</script>
