<style lang="scss" scoped>

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
</style>
<template>
  <div>
    <div class="container">
      <div class="order-list-status container">
        <div class="status-item" :class="{'active':key==activeStatus}" style="width: 100px"
             v-for="(item,key) in requestType" @click="checkStatus(item, key)">
          <div class="status-bg" :class="['b_color_'+key]"></div>
          <div><i class="el-icon-caret-right" v-if="key==activeStatus"></i>{{item.title}}<span class="status-num">{{item.num}}</span>
          </div>
        </div>
        <span class="pull-right opera-btn" style="margin-top: 8px">
          <span>
             <perm label="pull-signal-add">
             <a href="#" class="btn-circle" @click.stop.prevent="add">
                <i class="el-icon-t-plus"></i>
            </a>添加
           </perm>
          </span>
       </span>
      </div>
      <div class="d-table" style="margin-top: 20px">
        <div class="d-table-left">
          <div class="d-table-col-wrap" :style="'height:'+bodyHeight" @scroll="scrollLoadingData">
            <h2 class="header">
          <span class="pull-right">
              <a href="#" class="btn-circle" @click.prevent="searchType"><i
                class="el-icon-t-search"></i> </a>
          </span>
              要货申请单列表
            </h2>
            <div class="search-left-box" v-show="showTypeSearch">
              <oms-input v-model="filters.keyWord" placeholder="请输入编号搜索" :showFocus="showTypeSearch"></oms-input>
            </div>
            <div v-if="!currentItem.id" class="empty-info">
              暂无信息
            </div>
            <div v-else>
              <ul class="show-list">
                <li v-for="item in showTypeList" class="list-item" @click="showType(item)"
                    :class="{'active':item.id==currentItem.id}">
                  <div class="id-part">
                    申请时间: {{item.applyTime | time }}
                  </div>
                  <div>
                    申请编号: {{item.id }}
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
          <div class="d-table-col-wrap" :style="'height:'+bodyHeight">
            <div v-if="!currentOrder.id">
              <div class="empty-info">暂无信息</div>
            </div>
            <div v-else="">
              <h2 class="clearfix">
              <span class="pull-right">
                <el-button-group>
                   <perm label="pull-signal-add">
                        <el-button @click="addOrder()"><i
                          class="el-icon-t-reset"></i> 再次要货
                        </el-button>
                    </perm>
                    <perm label="pull-signal-audit" v-show="currentOrder.status === 0">
                      <el-button @click="audited()"><i
                        class="el-icon-t-verify"></i>审批</el-button>
                    </perm>
                    <perm label="pull-signal-edit" v-show="currentOrder.status === 0">
                      <el-button @click="editOrder()"><i
                        class="el-icon-t-edit"></i>编辑</el-button>
                    </perm>
                    <perm label="signal-export">
                      <el-button @click="exportExcel" v-show="currentOrder.status === 4" :loading="printing">
                        <i class="el-icon-t-print"></i>{{printing ? '正在导出' : '导出'}}
                      </el-button>
                    </perm>
                    <perm label="pull-signal-cancel" v-show="currentOrder.status === 0">
                      <el-button @click="cancel()"><i
                        class="el-icon-t-verify"></i>取消</el-button>
                    </perm>
                </el-button-group>
              </span>
              </h2>
              <div class="content-body clearfix">
                <el-row>
                  <el-col :span="11">
                    <oms-row label="要货申请编号">
                      {{currentOrder.id }}
                    </oms-row>
                    <oms-row label="供货单位">
                      {{currentOrder.cdcName}}
                    </oms-row>
                    <oms-row label="申请时间">
                      {{currentOrder.applyTime | time}}
                    </oms-row>
                    <oms-row label="到货需求日期">
                      {{currentOrder.demandTime | date }}
                    </oms-row>
                    <oms-row label="接种点仓库">
                      {{currentOrder.warehouseAddress}}
                    </oms-row>
                  </el-col>
                  <el-col :span="13">
                    <oms-row label="申请人">
                      {{currentOrder.applyManName}}
                    </oms-row>
                    <oms-row label="审批人">
                      {{currentOrder.auditManName}}
                    </oms-row>
                    <oms-row label="审批时间">
                      {{currentOrder.auditTime | time}}
                    </oms-row>
                    <oms-row label="关联疾控销售订单">
                      {{currentOrder.orderNo}}
                    </oms-row>
                    <oms-row label="需求单状态">
                      {{ formatStatus(currentOrder.status)}}
                    </oms-row>
                  </el-col>
                </el-row>
                <oms-row label="备注" :span="3" v-show="currentOrder.remark">{{ currentOrder.remark }}</oms-row>
              </div>
              <span style="font-size: 14px">【要货明细】</span>
              <table class="table " :class="{'table-hover':currentOrder.detailDtoList.length !== 0}"
                     style="margin-top: 10px">
                <thead>
                <tr>
                  <th style="width: 240px">疫苗名称</th>
                  <th>规格</th>
                  <th>单价</th>
                  <th>申请数量</th>
                  <th>申请金额</th>
                  <th v-show="filters.status === 4" style="width: 60px">分配数量</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="row in currentOrder.detailDtoList">
                  <td>
                    {{row.goodsName}}
                  </td>
                  <td>
                    <span>{{ row.specification }}</span>
                  </td>
                  <td>
                    <span v-if="row.price">￥{{row.price | formatMoney}}</span>
                    <span v-if="!row.price">-</span>
                  </td>
                  <td>
                    {{row.applyCount}}
                    <dict
                      :dict-group="'measurementUnit'"
                      :dict-key="row.unit"></dict>
                  </td>
                  <td>
                    <span v-if="row.applyMoney">￥{{row.applyMoney | formatMoney}}</span>
                    <span v-if="!row.applyMoney">-</span>
                  </td>
                  <td v-show="filters.status === 4">
                    {{row.actualCount}}
                  </td>
                </tr>
                <tr>
                  <th colspan="5" class="text-right">
                    <total-count property="applyCount" :list="currentOrder.detailDtoList"></total-count>
                    <total-count property="applyMoney" :showIcon="true" title="；合计金额"
                                 :list="currentOrder.detailDtoList"></total-count>
                  </th>
                  <th v-show="filters.status === 4"></th>
                </tr>
                </tbody>
              </table>
            </div>
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
  import {pullSignal} from '@/resources';
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
        activeStatus: 1,
        filters: {
          status: '0',
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
        index: 0,
        printing: false
      };
    },
    computed: {
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        height = (height - 20) + 'px';
        return height;
      },
      user() {
        return this.$store.state.user;
      }
    },
    mounted() {
      this.getOrgsList(1);
    },
    watch: {
      filters: {
        handler: function () {
          this.currentItem = {};
          this.currentOrder = {};
          this.getOrgsList(1);
        },
        deep: true
      },
      user(val) {
        if (val.userCompanyAddress) {
          this.getOrgsList(1);
        }
      }
    },
    methods: {
      scrollLoadingData(event) {
        this.$scrollLoadingData(event);
      },
      resetRightBox: function () {
        this.showRight = false;
        this.index = 0;
      },
      searchType: function () {
        this.showTypeSearch = !this.showTypeSearch;
      },
      getOrgsList: function (pageNo, isContinue = false) {
        let orgId = this.user.userCompanyAddress;
        if (!orgId) return;
        // this.filters.id = this.filters.keyWord;
        this.typePager.currentPage = pageNo;
        let params = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          povId: orgId
        }, this.filters);
        pullSignal.query(params).then(res => {
          if (params.keyWord !== this.filters.keyWord) return;
          this.$store.commit('initBottomLoading', false);

          if (isContinue) {
            this.showTypeList = this.showTypeList.concat(res.data.list);
          } else {
            this.showTypeList = res.data.list;
          }
          if (this.showTypeList.length !== 0) {
            if (this.$route.query.id) {
              let ary = this.showTypeList.filter(f => f.id === this.$route.query.id);
              this.currentItem = ary.length ? ary[0] : res.data.list[0];
              this.$router.push('/pov/request');
            } else {
              this.currentItem = res.data.list[0];
            }
            this.getDetail();
          } else {
            this.currentItem = Object.assign({'id': ''});
          }
          this.typePager.totalPage = res.data.totalPage;
          this.queryCount();
        });
      },
      queryCount() {
        let params = Object.assign({}, {
          povId: this.user.userCompanyAddress
        }, this.filters);
        pullSignal.queryCount(params).then(res => {
          // this.requestType[0].num = res.data['all'];
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
      checkStatus(item, key) {
        this.activeStatus = key;
        this.filters.status = item.status;
      },
      formatStatus(index) {
        let status = -1;
        for (let key in this.requestType) {
          if (this.requestType[key].status === index) {
            status = this.requestType[key].title;
          }
        }
        return status;
      },
      cancel() {
        this.$confirm('是否取消"' + this.currentOrder.id + '" 申请单?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          pullSignal.cancel(this.currentOrder.id, {cancelFlag: 1}).then(() => {
            this.$notify.success({
              message: '已成功取消申请单'
            });
            this.currentItem = {};
            this.currentOrder = {};
            this.getOrgsList(1);
          }).catch(error => {
            this.$notify.error({
              message: error.response.data && error.response.data.msg || '取消申请单失败'
            });
          });
        });
      },
      audited() {
        this.$confirm('是否审核通过"' + this.currentOrder.id + '" 申请单?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          pullSignal.audit(this.currentOrder.id).then(() => {
            this.$notify.success({
              message: '申请单审核通过'
            });
            this.currentItem = {};
            this.currentOrder = {};
            this.getOrgsList(1);
          }).catch(error => {
            this.$notify.error({
              message: error.response.data && error.response.data.msg || '申请单审核失败'
            });
          });
        });
      },
      exportExcel() {
        this.printing = true;
        this.$http(`/pov-order-export/${this.currentOrder.orderId}`).then(res => {
          utils.download(res.data);
          this.printing = false;
        }).catch(error => {
          this.printing = false;
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },
      add() {
        this.showRight = true;
        this.index = 1;
      },
      editOrder(item) {
        this.index = 2;
        this.showRight = true;
      },
      addOrder(item) {
        this.index = 3;
        this.showRight = true;
      },
      onSubmit() {
        this.getOrgsList();
      }
    }
  };
</script>
