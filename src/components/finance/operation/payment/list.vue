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
      <div :class="{up:!showSearch}" class="opera-btn-group">
        <div class="opera-icon">
          <span class="pull-right cursor-span" style="margin-left: 10px" @click.prevent="add">
            <perm label="payment-payable-add">
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
              <oms-form-row :span="7" label="付款单据编号">
                <oms-input v-model="searchCondition.keyWord" placeholder="请输入付款单据编号" type="text"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="收款单位">
                <el-select v-model="searchCondition.orgId" :clearable="true" :remote-method="filterOrg" filterable
                           placeholder="请输入名称搜索收款单位"
                           remote
                           @click.native="filterOrg('')">
                  <el-option v-for="org in orgList" :key="org.id" :label="org.name" :value="org.id">
                    <div style="overflow: hidden">
                      <span class="pull-left" style="clear: right">{{org.name}}</span>
                      <span class="pull-right" style="color: #999"></span>
                    </div>
                    <div style="overflow: hidden">
                        <span class="select-other-info pull-left">
                          <span>系统代码:</span>{{org.manufacturerCode}}
                        </span>
                    </div>
                  </el-option>
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
             :class="{'active':key==activeStatus,'exceptionPosition':key === '5'}"
             class="status-item"
             @click="changeStatus(item,key)">
          <div :class="['b_color_'+key]" class="status-bg"></div>
          <div><i v-if="key==activeStatus" class="el-icon-caret-right"></i>{{item.title}}<span class="status-num">{{item.num}}</span>
          </div>
        </div>
      </div>
      <div class="order-list clearfix">
        <el-row class="order-list-header">
          <el-col :span="3">付款单据编号</el-col>
          <el-col :span="6">收款单位</el-col>
          <el-col :span="2">付款方式</el-col>
          <el-col :span="4">付款金额</el-col>
          <el-col :span="5">付款说明</el-col>
          <el-col :span="4">创建时间</el-col>
          <!--<el-col :span="3">操作</el-col>-->
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="billList.length == 0">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else="" class="order-list-body flex-list-dom">
          <div v-for="item in billList" :class="['status-'+filterListColor(item.status),{'active':currentId==item.id}]"
               class="order-list-item"
               @click.stop="showItem(item)">
            <el-row>
              <el-col :span="3">
                <div>
                  {{item.no }}
                </div>
              </el-col>
              <el-col :span="6" class="pt10">
                <div class="f-grey">
                  系统代码{{item.orgNo }}
                </div>
                <div>{{item.orgName }}</div>
              </el-col>
              <el-col :span="2">
                <div>
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
              <el-col :span="4">
                <div>
                  {{item.createTime | time}}
                </div>
              </el-col>
              <!--<el-col :span="3" class="opera-btn">-->
              <!--<div>-->
              <!--&lt;!&ndash;<perm label="payment-payable-audit">&ndash;&gt;-->
              <!--&lt;!&ndash;<span @click.stop="showItem(item)" v-if="item.status==='0'">&ndash;&gt;-->
              <!--&lt;!&ndash;<a @click.pervent="" class="btn-circle btn-opera">&ndash;&gt;-->
              <!--&lt;!&ndash;<i class="el-icon-t-verify"></i>&ndash;&gt;-->
              <!--&lt;!&ndash;</a>&ndash;&gt;-->
              <!--&lt;!&ndash;审核&ndash;&gt;-->
              <!--&lt;!&ndash;</span>&ndash;&gt;-->
              <!--&lt;!&ndash;</perm>&ndash;&gt;-->
              <!--&lt;!&ndash;<perm label="payment-payable-allotment">&ndash;&gt;-->
              <!--&lt;!&ndash;<span @click.stop="allotmentBill(item)" v-if="item.status==='1'">&ndash;&gt;-->
              <!--&lt;!&ndash;<a @click.pervent="" class="btn-circle btn-opera">&ndash;&gt;-->
              <!--&lt;!&ndash;<i class="el-icon-t-edit"></i>&ndash;&gt;-->
              <!--&lt;!&ndash;</a>&ndash;&gt;-->
              <!--&lt;!&ndash;分配&ndash;&gt;-->
              <!--&lt;!&ndash;</span>&ndash;&gt;-->
              <!--&lt;!&ndash;</perm>&ndash;&gt;-->
              <!--</div>-->
              <!--</el-col>-->
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
      <audit-form :detailId="billInfo.id" @change="onSubmit" @right-close="resetRightBox"></audit-form>
    </page-right>
    <page-right :css="{'width':'1000px','padding':0}" :show="showItemRight" @right-close="resetRightBox">
      <add-form :defaultIndex="defaultIndex" @change="onSubmit" @right-close="resetRightBox"></add-form>
    </page-right>
  </div>
</template>
<script>
import utils from '../../../../tools/utils';
import auditForm from './form/auditForm.vue';
import addForm from './form/addForm.vue';
import {BaseInfo, BillPayable} from '../../../../resources';

export default {
  components: {
    auditForm, addForm
  },
  data: function () {
    return {
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
      orgType: utils.paymentOperation,
      activeStatus: 0,
      currentId: '',
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: 20
      },
      billInfo: {},
      orgList: [],
      defaultIndex: -1
    };
  },
  mounted() {
    this.getBillList(1);
  },
  computed: {
    transportationMeansList: function () {
      return this.$getDict('transportationMeans');
    },
    bizInTypes: function () {
      return this.$getDict('bizInType');
    }
  },
  watch: {
    filters: {
      handler: function () {
        this.getBillList(1);
      },
      deep: true
    }
  },
  methods: {
    filterOrg: function (query) {// 过滤来源单位
      let orgId = this.$store.state.user.userCompanyAddress;
      if (!orgId) {
        return;
      }
      // 过滤来源单位
      let params = {
        keyWord: query
      };
      BaseInfo.queryOrgByValidReation(orgId, params).then(res => {
        this.orgList = res.data;
      });
    },
    billPayType: function (value) {
      let title = '';
      if (value === '0') {
        title = '疫苗厂商付款';
      } else {
        title = '物流厂商付款';
      }
      return title;
    },
    getOrderStatus: function (order) {
      let state = '';
      for (let key in this.orgType) {
        if (order.state === this.orgType[key].state) {
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
    showItem: function (item) {
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
      let param = Object.assign({}, this.filters, {
        pageNo: pageNo,
        pageSize: this.pager.pageSize,
        type: '0'
      });
      BillPayable.query(param).then(res => {
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
    queryStatusNum: function (params) {
      BillPayable.queryStateNum(params).then(res => {
        let data = res.data;
        this.orgType[0].num = this.obtionStatusNum(data['audit']);
        this.orgType[1].num = this.obtionStatusNum(data['review']);
        this.orgType[2].num = this.obtionStatusNum(data['complete']);
        this.orgType[3].num = this.obtionStatusNum(data['notAudit']);
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
