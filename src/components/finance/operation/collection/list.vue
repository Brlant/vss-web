<style lang="scss" scoped>

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
      <div :class="{up:!showSearch}" class="opera-btn-group">
        <div class="opera-icon">

          <span class="pull-right cursor-span" style="margin-left: 10px" @click.prevent="add">
            <perm :label="perms[0]">
                  <a class="btn-circle" href="#" @click.prevent=""><i class="el-icon-t-plus"></i> </a>添加
            </perm>
          </span>
          <span class="pull-left switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form v-show="showSearch" class="advanced-query-form clearfix" onsubmit="return false"
                 style="padding-top: 10px">
          <el-row>
            <el-col :span="8">
              <oms-form-row :label="`${titleAry[type][2]}单据编号`" :span="7">
                <oms-input v-model.trim="searchCondition.keyWord" placeholder="请输入收款单据编号" type="text"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :label="`${titleAry[type][3]}`" :span="6">
                <el-select v-model="searchCondition.orgId" :clearable="true" :placeholder="`请输入名称搜索${titleAry[type][3]}`"
                           :remote-method="filterOrg" filterable
                           popper-class="good-selects" remote
                           @click.native.once="filterOrg('')">
                  <div v-if="type === 2">
                    <el-option v-for="org in orgList" :key="org.id" :label="org.name" :value="org.id">
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
                    <el-option v-for="item in orgList" :key="item.orgId" :label="item.orgName" :value="item.orgId"/>
                  </div>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row :span="2" label="">
                <el-button native-type="submit" type="primary" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>


      <div class="order-list-status container" style="margin-bottom:20px">
        <div v-for="(item,key) in orgType"
             :class="{'active':key==activeStatus,'exceptionPosition':key === '3'}"
             class="status-item"
             @click="changeStatus(item,key)">
          <div :class="['b_color_'+key]" class="status-bg"></div>
          <div><i v-if="key==activeStatus" class="el-icon-caret-right"></i>{{item.title}}<span class="status-num">{{item.num}}</span>
          </div>
        </div>
      </div>
      <div class="order-list clearfix">
        <el-row class="order-list-header">
          <el-col :span="3">{{titleAry[type][2]}}单据编号</el-col>
          <el-col :span="5">{{titleAry[type][3]}}</el-col>
          <el-col :span="2">{{titleAry[type][2]}}方式</el-col>
          <el-col :span="4">{{titleAry[type][2]}}金额</el-col>
          <el-col :span="5">{{titleAry[type][2]}}说明</el-col>
          <el-col :span="5">操作</el-col>
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
        <div v-else class="order-list-body flex-list-dom">
          <div v-for="item in billList" :class="['status-'+filterListColor(item.status),{'active':currentId===item.id}]"
               class="order-list-item"
               @click.stop="audit(item)">
            <el-row>
              <el-col :span="3">
                <div>
                  {{item.no }}
                </div>
              </el-col>
              <el-col :span="5" class="pt10">
                <div class="f-grey">
                  系统代码{{item.orgNo }}
                </div>
                <div>{{item[type ===1 ? 'ownerName' : 'orgName'] }}</div>
              </el-col>
              <el-col :span="2">
                <div v-show="item.advancePaymentFlag">
                  <span>预{{titleAry[type][2]}}</span><span v-show="item.payType">、<dict :dict-group="'PaymentMethod'"
                                                                                        :dict-key="item.payType"></dict></span>
                </div>
                <div v-show="!item.advancePaymentFlag">
                  <dict :dict-group="'PaymentMethod'" :dict-key="item.payType"></dict>
                </div>
              </el-col>
              <el-col :span="4">
                <div>
                  <span v-if="item.amount">¥</span> {{item.amount | formatMoney}}
                </div>
              </el-col>
              <el-col :span="5">
                <div>
                  {{item.explain}}
                </div>
              </el-col>
              <el-col :span="5">
                <el-row>
                  <perm label="cdc-payment-receivable-export">
                    <el-button :plain="true" size="mini" type="success" @click.prevent.stop="exportFile(item.id)">
                      生成Word
                    </el-button>
                    <el-button :plain="true" size="mini" type="success" @click.prevent.stop="exportExcelFile(item.id)">
                      生成Excel
                    </el-button>
                  </perm>
                  <perm label="cdc-payment-cs-receivable-export">
                    <el-button :plain="true" size="mini" style="margin-left: 10px"
                               type="success" @click.prevent.stop="exportAccountingVoucher(item.id)">
                      生成Word
                    </el-button>
                  </perm>
                </el-row>
              </el-col>
            </el-row>
            <div class="order-list-item-bg"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="pager.count>pager.pageSize && !loadingData" class="text-center">
      <el-pagination
        :current-page="pager.currentPage"
        :pageSize="pager.pageSize" :total="pager.count" layout="prev, pager, next"
        @current-change="getBillList">
      </el-pagination>
    </div>
    <page-right :css="{'width':'800px','padding':0}" :show="showDetail" class="order-detail-info"
                partClass="pr-no-animation" @right-close="resetRightBox">
      <audit-form :formItem="billInfo" :getOrderStatus="getOrderStatus" :perms="perms" :titleAry="titleAry" :type="type"
                  @change="onSubmit"
                  @right-close="resetRightBox"></audit-form>
    </page-right>
    <page-right :css="{'width':'1000px','padding':0}" :show="showItemRight" @right-close="resetRightBox">
      <add-form :defaultIndex="defaultIndex" :titleAry="titleAry" :type="type" @change="onSubmit"
                @right-close="resetRightBox"></add-form>
    </page-right>
  </div>
</template>
<script>
import utils from '@/tools/utils';
import auditForm from './form/auditForm.vue';
import addForm from './form/addForm.vue';
import {CDCReceipt, POVPayment} from '@/resources';
import methodsMixin from '@/mixins/methodsMixin';

export default {
  components: {
    auditForm, addForm
  },
  mixins: [methodsMixin],
  data: function () {
    return {
      orgList: [],
      payOrgList: [],
      loadingData: true,
      showItemRight: false,
      showDetail: false,
      showSearch: false,
      showAllotmentRight: false,
      billList: [],
      filters: {
        status: '0'
      },
      searchCondition: {
        keyWord: '',
        orgId: ''
      },
      expectedTime: '',
      activeStatus: 0,
      currentId: '',
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: 20
      },
      billInfo: {},
      defaultIndex: -1,
      titleAry: {
        1: ['POV付款作业', 'POV付款', '付款', '收款单位'],
        2: ['收款作业', 'CDC收款', '收款', '付款单位']
      },
      statusNum: null
    };
  },
  mounted() {
    this.getBillList(1);
  },
  computed: {
    type() {
      return this.$route.meta.type;
    },
    perms() {
      return this.$route.meta.perms;
    },
    orgType() {
      let ary = this.type === 1 ? {
        0: {'title': '待审核', status: '0', num: ''},
        1: {'title': 'CDC待确认', status: '1', num: ''},
        2: {'title': '已完成', status: '2', num: ''},
        3: {'title': '已取消', status: '3', num: ''}
      } : {
        0: {'title': '待审核', status: '-1', num: ''},
        1: {'title': '收款确认', status: '1', num: ''},
        2: {'title': '已完成', status: '2', num: ''},
        3: {'title': '已取消', status: '3', num: ''}
      };
      if (this.statusNum) {
        ary[0].num = this.obtionStatusNum(this.statusNum[this.type === 1 ? 'pov_audit' : 'cdc_audit']);
        ary[1].num = this.obtionStatusNum(this.statusNum['review']);
        ary[2].num = this.obtionStatusNum(this.statusNum['complete']);
        ary[3].num = this.obtionStatusNum(this.statusNum['cancel']);
      }
      return ary;
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
      this.getBillList(1);
      this.filterOrg();
      this.searchCondition.orgId = '';
      this.statusNum = null;
    }
  },
  methods: {
    exportExcelFile: function (id) {
      if (!id) {
        return;
      }
      let params = Object.assign({}, this.filterRights);
      this.$store.commit('initPrint', {
        isPrinting: true,
        moduleId: '/collection/operation'
      });
      this.$http.get('/bill-receivable/' + id + '/export/excel', {params}).then(res => {
        utils.download(res.data.path);
        this.$store.commit('initPrint', {
          isPrinting: false,
          moduleId: '/collection/operation'
        });
      }).catch(error => {
        this.$store.commit('initPrint', {
          isPrinting: false,
          moduleId: '/collection/operation'
        });
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
        });
      });
    },
    exportFile: function (id) {
      if (!id) {
        return;
      }
      let params = Object.assign({}, this.filterRights);
      this.$store.commit('initPrint', {
        isPrinting: true,
        moduleId: '/collection/operation'
      });
      this.$http.get('/bill-receivable/' + id + '/export', {params}).then(res => {
        utils.download(res.data.path);
        this.$store.commit('initPrint', {
          isPrinting: false,
          moduleId: '/collection/operation'
        });
      }).catch(error => {
        this.$store.commit('initPrint', {
          isPrinting: false,
          moduleId: '/collection/operation'
        });
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
        });
      });
    },
    exportAccountingVoucher: function (id) {
      if (!id) {
        return;
      }
      let params = Object.assign({}, this.filterRights);
      this.$store.commit('initPrint', {
        isPrinting: true,
        moduleId: '/collection/operation'
      });
      this.$http.get('/bill-receivable/' + id + '/cs/export', {params}).then(res => {
        utils.download(res.data.path);
        this.$store.commit('initPrint', {
          isPrinting: false,
          moduleId: '/collection/operation'
        });
      }).catch(error => {
        this.$store.commit('initPrint', {
          isPrinting: false,
          moduleId: '/collection/operation'
        });
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
        });
      });
    },
    getOrderStatus: function (order) {
      let state = '';
      for (let key in this.orgType) {
        if (order.status === this.orgType[key].status) {
          state = this.orgType[key].title;
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
        keyWord: '',
        orgId: ''
      };
      Object.assign(this.searchCondition, temp);
      Object.assign(this.filters, temp);
      this.getBillList(1);
    },
    resetRightBox: function () {
      this.showDetail = false;
      this.showItemRight = false;
      this.showAllotmentRight = false;
      this.action = '';
      this.billInfo = {};
      this.defaultIndex = -1;
    },
    add: function () {
      this.showItemRight = true;
      this.defaultIndex = 1;
    },
    audit: function (item) {
      this.showDetail = true;
      this.billInfo = item;
    },
    allotmentBill: function (item) {
      this.showAllotmentRight = true;
      this.billInfo = item;
    },
    onSubmit: function () {
      this.getBillList(this.pager.currentPage);
    },
    getBillList: function (pageNo) {
      this.pager.currentPage = pageNo;
      this.loadingData = true;
      this.filters.status === '0' && this.type === 2 && (this.filters.status = '-1');
      if (this.type === 1) {
        this.filters.ownerId = this.filters.orgId;
        this.filters.orgId = null;
      }
      let param = Object.assign({}, this.filters, {
        pageNo: pageNo,
        pageSize: this.pager.pageSize
      });
      const http = this.type === 1 ? POVPayment.query : CDCReceipt.query;
      http(param).then(res => {
        this.billList = res.data.list;
        this.pager.count = res.data.count;
        this.loadingData = false;
      });
      this.queryStatusNum(param);
    },
    filterListColor: function (index) {// 过滤左边列表边角颜色
      let status = -1;
      for (let key in this.orgType) {
        if (this.orgType[key].status === index) {
          status = key;
        }
      }
      return status;
    },
    queryStatusNum: function (param) {
      const params = Object.assign({}, param, {status: null});
      this.$http.get(this.type === 1 ? '/pov-bill/count' : 'cdc-bill/count', {params}).then(res => {
        this.statusNum = res.data;
      });
    },
    obtionStatusNum: function (num) {
      if (typeof num !== 'number') {
        return 0;
      }
      return num;
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
