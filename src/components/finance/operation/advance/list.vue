<style lang="scss" scoped="">

  .page-right-part {
    box-sizing: content-box;
    width: 800px;
    padding: 30px 0;
    overflow: auto;
    .title {
      margin-left: 30px;
    }
    .order-info-part {
      padding: 0 50px;
    }
    .goods-info-left {
      width: 330px;
      margin-left: 30px;
      padding: 20px;
      float: left;
      border: 1px solid rgb(238, 238, 238);
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    .goods-info-right {
      width: 210px;
      padding: 32px 20px 33px 20px;
      background-color: rgb(238, 238, 238);
      border: 1px solid rgb(238, 238, 238);
      float: left;
      .el-row {
        margin-bottom: 5px;
      }
      margin-bottom: 20px;
    }
    .min-gutter {
      .el-form-item {
        margin-bottom: 4px;
      }
    }
    .border-show {
      height: 15px;
      width: 100%;
      border-bottom: 1px solid #777777;
      opacity: 0.2;
      margin-bottom: 10px;
    }

  }

  .exceptionPosition {
    /*margin-left: 40px;*/
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  .table {
    .order-list-item {
      color: #999;
      line-height: 20px;
    }
    border-collapse: separate;
    border-spacing: 0;
    > tbody > tr > td {
      border-top: 1px solid #eee;
    }

  }

  .empty-position {
    width: 150px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .w90 {
    width: 90px;
  }

  .order-list-item {
    cursor: pointer;
  }

  .cursor-span {
    cursor: pointer;
  }

  .order-list-status {
    .status-item {
      width: 90px;
    }
  }
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div class="opera-btn-group" :class="{up:!showSearch}">
        <div class="opera-icon">
          <span class="pull-right cursor-span" style="margin-left: 10px" @click.prevent="add">
            <perm :label="perms[0]">
                  <a href="#" class="btn-circle" @click.prevent=""><i class="el-icon-t-plus"></i> </a>添加
            </perm>
          </span>
          <span class="pull-left switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form v-show="showSearch" class="advanced-query-form clearfix" style="padding-top: 10px"
                 onsubmit="return false">
          <el-row>
            <el-col :span="8">
              <oms-form-row label="单据编号" :span="7">
                <oms-input type="text" v-model.trim="searchCondition.id" placeholder="请输入单据编号"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :label="`${title}单位`" :span="6">
                <el-select filterable remote :placeholder="`请输入名称搜索${title}单位`" :remote-method="filterOrg"
                           :clearable="true"
                           v-model="searchCondition.orgId" popper-class="good-selects"
                           @click.native.once="filterOrg('')">
                  <div v-if="type === 2">
                    <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in orgList">
                      <div style="overflow: hidden">
                        <span class="pull-left" style="clear: right">{{org.name}}</span>
                      </div>
                      <div style="overflow: hidden">
                      <span class="select-other-info pull-left">
                        <span>系统代码:</span>{{org.manufacturerCode}}
                      </span>
                      </div>
                    </el-option>
                  </div>
                  <div v-else>
                    <el-option :label="item.orgName" :value="item.orgId" :key="item.orgId" v-for="item in orgList">
                    </el-option>
                  </div>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row label="" :span="2">
                <el-button type="primary" native-type="submit" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>


      <div class="order-list-status container" style="margin-bottom:20px">
        <div class="status-item"
             :class="{'active':key==activeStatus,'exceptionPosition':key === '3'}"
             v-for="(item,key) in statusType"
             @click="changeStatus(item,key)">
          <div class="status-bg" :class="['b_color_'+key]"></div>
          <div><i class="el-icon-caret-right" v-if="key==activeStatus"></i>{{item.title}}<span class="status-num">{{item.num}}</span>
          </div>
        </div>
      </div>
      <div class="order-list clearfix">
        <el-row class="order-list-header">
          <el-col :span="3">单据编号</el-col>
          <el-col :span="6">{{`${title}单位`}}</el-col>
          <el-col :span="3">{{`${title}金额`}}</el-col>
          <el-col :span="3">创建人</el-col>
          <el-col :span="4">创建时间</el-col>
          <el-col :span="2">状态</el-col>
          <el-col :span="3">操作</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="!billList.length">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else="" class="order-list-body flex-list-dom">
          <div class="order-list-item" v-for="item in billList"
               :class="['status-'+filterListColor(item.status),{'active':currentId===item.id}]"
               @click.stop="showItem(item)">
            <el-row>
              <el-col :span="3" class="R">{{item.id}}</el-col>
              <el-col :span="6" class="pt10">
                <div>{{item[type === 1 ? 'cdcName' : 'povName'] }}</div>
              </el-col>
              <el-col :span="3">
                <span v-if="item.rechargeAmount">¥</span> {{item.rechargeAmount | formatMoney}}
              </el-col>
              <el-col :span="3">{{item.creatorName}}</el-col>
              <el-col :span="4">{{item.createTime | minute}}</el-col>
              <el-col :span="2">{{getOrderStatus(item)}}</el-col>
              <el-col :span="3">
                <el-button :plain="true" type="success" size="mini" @click.prevent.stop="exportFile(item.id)">
                  生成{{title}}单
                </el-button>
              </el-col>
            </el-row>
            <div class="order-list-item-bg"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">
      <el-pagination
        layout="prev, pager, next"
        :total="pager.count" :pageSize="pager.pageSize" @current-change="getBillList"
        :current-page="pager.currentPage">
      </el-pagination>
    </div>
    <page-right :show="showDetail" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}"
                class="order-detail-info" partClass="pr-no-animation">
      <audit-form :billInfo="billInfo" :title="title" :type="type" :perms="perms" @change="onSubmit"
                  @right-close="resetRightBox" :getOrderStatus="getOrderStatus"></audit-form>
    </page-right>
    <page-right :show="showItemRight" @right-close="resetRightBox" :css="{'width':'900px','padding':0}">
      <add-form @change="onSubmit" :title="title" :type="type"  @right-close="resetRightBox"
                :defaultIndex="defaultIndex"></add-form>
    </page-right>
  </div>
</template>
<script>
  import auditForm from './form/showForm.vue';
  import addForm from './form/addForm.vue';
  import {PaymentPending} from '../../../../resources';
  import methodsMixin from '@/mixins/methodsMixin';
  import utils from '@/tools/utils';

  export default {
    components: {
      auditForm, addForm
    },
    mixins: [methodsMixin],
    data: function () {
      return {
        loadingData: true,
        showItemRight: false,
        showDetail: false,
        showSearch: false,
        billList: [],
        filters: {
          status: '0'
        },
        searchCondition: {
          orgId: '',
          id: ''
        },
        activeStatus: 0,
        currentId: '',
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        },
        billInfo: {},
        orgList: [],
        defaultIndex: -1,
        statusNum: null
      };
    },
    mounted() {
      this.getBillList(1);
    },
    computed: {
      title: function () {
        return this.type === 1 ? '预付款' : '预收款';
      },
      type() {
        return this.$route.meta.type;
      },
      statusType() {
        let ary = this.type === 1 ? {
          0: {'title': '待审批', status: '0', num: ''},
          1: {'title': 'CDC待确认', status: '1', num: ''},
          2: {'title': '已完成', status: '2', num: ''},
          3: {'title': '已取消', status: '4', num: ''}
        } : {
          0: {'title': '待审批', status: '3', num: ''},
          1: {'title': '预收确认', status: '1', num: ''},
          2: {'title': '已完成', status: '2', num: ''},
          3: {'title': '已取消', status: '4', num: ''}
        };
        if (this.statusNum) {
          ary[0].num = this.obtionStatusNum(this.statusNum[this.type === 1 ? 'pov-audit' : 'cdc-audit']);
          ary[1].num = this.obtionStatusNum(this.statusNum['cdc-confirm']);
          ary[2].num = this.obtionStatusNum(this.statusNum['complete']);
          ary[3].num = this.obtionStatusNum(this.statusNum['cancel']);
        }
        return ary;
      },
      perms() {
        return this.$route.meta.perms;
      }
    },
    watch: {
      filters: {
        handler: function () {
          this.getBillList(1);
        },
        deep: true
      },
      type() {
        this.orgList = [];
        this.filterOrg();
        this.getBillList(1);
        this.statusNum = null;
      }
    },
    methods: {
      exportFile: function (id) {
        if (!id) {
          return;
        }
        let params = Object.assign({}, this.filterRights);
        this.$store.commit('initPrint', {
          isPrinting: true,
          moduleId: '/collection/pending'
        });
        this.$http.get('/advance-payment/' + id + '/export', {params}).then(res => {
          utils.download(res.data.path);
          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: '/collection/pending'
          });
        }).catch(error => {
          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: '/collection/pending'
          });
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },
      getOrderStatus: function (order) {
        let state = '';
        for (let key in this.statusType) {
          if (order.status === this.statusType[key].status) {
            state = this.statusType[key].title;
          }
        }
        return state;
      },
      searchInOrder: function () {// 搜索
        Object.assign(this.filters, this.searchCondition);
        this.getBillList(1);
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          orgId: '',
          id: ''
        };
        Object.assign(this.searchCondition, temp);
        Object.assign(this.filters, temp);
        this.getBillList(1);
      },
      resetRightBox: function () {
        this.showDetail = false;
        this.showItemRight = false;
        this.action = '';
        this.billInfo = {};
        this.defaultIndex = -1;
      },
      add: function () {
        this.showItemRight = true;
        this.defaultIndex = 1;
      },
      showItem: function (item) {
        this.showDetail = true;
        this.billInfo = item;
      },
      onSubmit: function () {
        this.getBillList(this.pager.currentPage);
      },
      getBillList: function (pageNo) {
        this.pager.currentPage = pageNo;
        this.loadingData = true;
        this.filters.status === '0' && this.type === 2 && (this.filters.status = 3);
        this.filters[this.type === 1 ? 'cdcId' : 'povId'] = this.filters.orgId;
        this.filters.orgId = null;
        let param = Object.assign({}, this.filters, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        });
        PaymentPending.query(this.type, param).then(res => {
          this.billList = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
        this.queryStatusNum(param);
      },
      queryStatusNum: function (params) {
        const param = Object.assign({}, params, {status: null});
        PaymentPending.queryStateNum(this.type, param).then(res => {
          this.statusNum = res.data;
        });
      },
      obtionStatusNum: function (num) {
        return typeof num !== 'number' ? 0 : num;
      },
      filterListColor: function (index) {// 过滤左边列表边角颜色
        let status = -1;
        for (let key in this.statusType) {
          if (this.statusType[key].status === index) {
            status = key;
          }
        }
        return status;
      },
      changeStatus: function (item, key) {
        this.activeStatus = key;
        this.filters.status = item.status;
      },
      advancedQuery: function () {
        this.showSearch = !this.showSearch;
      },
      formatTime: function (date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      }
    }
  };
</script>
