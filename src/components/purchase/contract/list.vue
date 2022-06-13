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
            <perm label="purchasing-contract-add">
                  <a class="btn-circle" href="#" @click.prevent=""><i
                    class="el-icon-t-plus"></i> </a>添加
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
              <oms-form-row :span="7" label="合同名称/编号">
                <oms-input v-model="searchCondition.keyWord" placeholder="请输入合同名称/编号" type="text"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="5" label="供货单位">
                <el-select v-model="searchCondition.transactOrgId" :clearable="true" :remote-method="filterOrg" filterable
                           placeholder="请输入名称搜索供货单位"
                           popperClass="good-selects"
                           remote @click.native="filterOrg('')">
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
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="创建时间">
                <el-col :span="24">
                  <el-date-picker v-model="createTimes" format="yyyy-MM-dd" placeholder="请选择" type="daterange">
                  </el-date-picker>
                </el-col>
              </oms-form-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <oms-form-row :span="3" label="">
                <el-button native-type="submit" type="primary" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>


      <div class="order-list-status container" style="margin-bottom:20px">
        <div v-for="(item,key) in orgType"
             :class="{'active':key==activeStatus}"
             class="status-item"
             @click="changeStatus(item,key)">
          <div :class="['b_color_'+key]" class="status-bg"></div>
          <div><i v-if="key==activeStatus" class="el-icon-caret-right"></i>{{item.title}}<span class="status-num">{{item.num}}</span>
          </div>
        </div>
      </div>
      <div class="order-list clearfix">
        <el-row class="order-list-header">
          <el-col :span="4">编号/合同名称</el-col>
          <el-col :span="8">供货单位</el-col>
          <el-col :span="4">创建时间</el-col>
          <el-col :span="4">关联采购订单</el-col>
          <el-col :span="4">操作</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="orderList.length == 0">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else class="order-list-body flex-list-dom">
          <div v-for="item in orderList" :class="['status-'+filterListColor(item.availabilityStatus,item.used),{'active':currentOrderId==item.id}]" class="order-list-item"
               @click.prevent="showContract(item)">
            <el-row>
              <el-col :span="4" class="pt10">
                <div class="f-grey">
                  {{item.no }}
                </div>
                <div>
                  {{item.name }}
                </div>
              </el-col>
              <el-col :span="8" class="pt10">
                <div>{{item.transactOrgName }}</div>
              </el-col>
              <el-col :span="4">
                <div>
                  {{item.createTime | minute }}
                </div>
              </el-col>
              <el-col :span="4" class="opera-btn">
                <div v-for="relation in item.relationList" v-if="item.relationList.length>0">
                    <span v-if="relation.order" @click.stop.prevent="showOrderForm(relation.order,item.id)">
                      <a href="#" @click.prevent=""></a>
                      {{relation.order.orderNo }}
                    </span>
                </div>
                <div v-if="item.relationList.length===0">
                  无
                </div>
              </el-col>
              <el-col :span="4" class="opera-btn">
                <div>
                  <perm label="purchasing-contract-edit">
                    <span v-if="!item.used && item.availabilityStatus" @click.stop.prevent="createOrder(item)">
                      <a class="btn-circle" href="#" @click.prevent=""><i class="el-icon-t-wave"></i></a>
                      批量生成采购订单
                    </span>
                  </perm>
                </div>
                <div>
                  <perm label="purchasing-contract-edit">
                     <span @click.stop.prevent="editContract(item)">
                      <a class="btn-circle" href="#" @click.prevent=""><i
                        class="el-icon-t-edit"></i></a>
                      编辑
                    </span>
                  </perm>
                  <perm label="purchasing-contract-edit">
                    <span v-if="!item.availabilityStatus" @click.stop.prevent="startContract(item)">
                      <a class="btn-circle" href="#" @click.prevent=""><i
                        class="el-icon-t-start"></i></a>
                      启用
                    </span>
                  </perm>
                  <perm label="purchasing-contract-edit">
                    <span v-if="item.availabilityStatus" @click.stop.prevent="stopContract(item)">
                      <a class="btn-circle" href="#" @click.prevent=""><i
                        class="el-icon-t-forbidden"></i></a>
                      停用
                    </span>
                  </perm>
                </div>
              </el-col>
            </el-row>
            <div class="order-list-item-bg"></div>
          </div>
        </div>
      </div>

    </div>
    <div v-show="pager.count>pager.pageSize && !loadingData" class="text-center">
      <el-cu-pagination
        :current-page="pager.currentPage"
        :pageSize="pager.pageSize" :total="pager.count" layout="prev, pager, next"
        @current-change="getOrderList">
      </el-cu-pagination>
    </div>
    <page-right :css="{'width':'1000px','padding':0}" :show="showItemRight" class="specific-part-z-index"
                @right-close="beforeCloseConfirm('合同信息未保存,是否关闭')">
      <add-form :action="action" :orderId="currentOrderId" type="0" @change="onSubmit"
                @right-close="resetRightBox"></add-form>
    </page-right>
    <page-right :css="{'width':'1000px','padding':0}" :show="showEditItemRight"
                class="specific-part-z-index"
                @right-close="beforeCloseConfirm('合同信息未保存,是否关闭')">
      <edit-form :action="action" :orderId="editOrderId" type="0" @change="onSubmit"
                 @right-close="resetRightBox"></edit-form>
    </page-right>
    <page-right :css="{'width':'1000px','padding':0}" :show="showDetail" class="specific-part-z-index"
                @right-close="resetRightBox">
      <show-form :action="action" :orderId="showOrderId" type="0" @right-close="resetRightBox"></show-form>
    </page-right>
    <page-right :css="{'width':'1000px','padding':0}" :show="showOrderRight" class="order-detail-info specific-part-z-index"
                partClass="pr-no-animation" @right-close="resetRightBox">
      <order-form :orderId="orderId" :state="state" :vaccineType="vaccineType"
                  @close="resetRightBox" @refreshOrder="refreshOrder"></order-form>
    </page-right>
  </div>
</template>
<script>
import addForm from './form/InForm.vue';
import showForm from './form/showForm.vue';
import editForm from './form/editForm.vue';
import orderForm from '../order/show.order.in.vue';
import {BaseInfo, PurchaseContract} from '@/resources';
import OrderMixin from '@/mixins/orderMixin';

export default {
  components: {
    addForm, showForm, orderForm, editForm
  },
  data: function () {
    return {
      createTimes: '',
      loadingData: true,
      showItemRight: false,
      showDetail: false,
      showOrderRight: false,
      showEditItemRight: false,
      showSearch: false,
      currentOrderId: '',
      editOrderId: '',
      showOrderId: '',
      orderId: '',
      state: '',
      orderList: [],
      filters: {
        availabilityStatus: true,
        used: false
      },
      searchCondition: {
        keyWord: '',
        transactOrgId: '',
        startDate: '',
        endDate: ''
      },
      expectedTime: '',
      orgType: {
        0: {'title': '待生成订单', 'num': '', 'used': false, 'availabilityStatus': true},
        1: {'title': '正常', 'num': '', 'used': true, 'availabilityStatus': true},
        2: {'title': '停用', 'num': '', 'availabilityStatus': false}
      },
      activeStatus: 0,
      orgList: [], // 来源单位列表
      logisticsList: [], // 物流商列表
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: 20
      },
      action: '',
      user: {},
      purchase: {}
    };
  },
  mixins: [OrderMixin],
  mounted() {
    this.getOrderList(1);
  },
  computed: {
    transportationMeansList: function () {
      return this.$getDict('transportationMeans');
    },
    bizInTypes: function () {
      return this.$getDict('bizInType');
    },
    vaccineType() {
      return this.$route.meta.type;
    }
  },
  watch: {
    filters: {
      handler: function () {
        this.getOrderList(1);
      },
      deep: true
    },
    vaccineType() {
      this.getOrderList(1);
    }
  },
  methods: {
    startContract: function (item) {
      this.$confirm('确认启用采购合同《' + item.name + '》?', '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        PurchaseContract.start(item.id).then(() => {
          this.$notify({
            duration: 2000,
            message: '启用采购合同成功',
            type: 'success'
          });
          this.getOrderList(1);
        }).catch(error => {
          this.$notify.error({
            duration: 2000,
            message: error.response && error.response.data && error.response.data.msg || '启用采购合同失败'
          });
        });
      });
    },
    stopContract: function (item) {
      this.$confirm('确认停用采购合同《' + item.name + '》?', '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        PurchaseContract.stop(item.id).then(() => {
          this.$notify({
            duration: 2000,
            message: '停用采购合同成功',
            type: 'success'
          });
          this.getOrderList(1);
        }).catch(error => {
          this.$notify.error({
            duration: 2000,
            message: error.response && error.response.data && error.response.data.msg || '停用采购合同失败'
          });
        });
      });
    },
    createOrder: function (item) {
      if (!item) {
        return;
      }
      let title = '';
      if (item.name) {
        title = '《' + item.name + '》';
      }
      this.$confirm('确认按照采购合同' + title + '的信息批量生成采购订单?', '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        PurchaseContract.batchCreateOrder(item.id).then(() => {
          this.$notify.success({
            duration: 2000,
            title: '成功',
            message: '批量生成采购订单成功'
          });
          this.getOrderList(1);
        }).catch(error => {
          this.$notify.error({
            duration: 2000,
            message: error.response && error.response.data && error.response.data.msg || '批量生成采购订单失败'
          });
        });
      });
    },
    refreshOrder() {
      this.currentOrderId = '';
      this.getOrderList(this.pager.currentPage);
    },
    showOrderForm: function (order, contractId) {
      this.orderId = order.id;
      this.showOrderRight = true;
      this.state = order.state;
      this.currentOrderId = contractId;
//        this.$router.push(`${order.id}`);
    },
    editContract(item) {
      if (item.used) {
        this.showEditItemRight = true;
        this.editOrderId = item.id;
        this.currentOrderId = item.id;
      } else {
        this.showItemRight = true;
        this.currentOrderId = item.id;
      }
      this.action = 'edit';
    },
    showContract(item) {
      this.action = 'watch';
      this.showOrderId = item.id;
      this.currentOrderId = item.id;
      this.showDetail = true;
    },
    searchInOrder: function () {// 搜索
      this.searchCondition.startDate = this.$formatAryTime(this.createTimes, 0);
      this.searchCondition.endDate = this.$formatAryTime(this.createTimes, 1);
      Object.assign(this.filters, this.searchCondition);
      this.getOrderList(1);
    },
    resetSearchForm: function () {// 重置表单
      let temp = {
        keyWord: '',
        transactOrgId: '',
        startDate: '',
        endDate: ''
      };
      this.createTimes = '';
      Object.assign(this.searchCondition, temp);
      Object.assign(this.filters, temp);
      this.getOrderList(1);
    },
    resetRightBox: function () {
      this.showDetail = false;
      this.showItemRight = false;
      this.showOrderRight = false;
      this.showEditItemRight = false;
      this.action = '';
    },
    add: function () {
      this.showItemRight = true;
      this.currentOrderId = '';
      this.action = 'add';
    },
    onSubmit: function () {
      this.getOrderList(1);
      if (this.defaultIndex === 2) {
        let orderId = this.currentOrderId;
        this.currentOrderId = '';
        this.$nextTick(() => {
          this.currentOrderId = orderId;
        });
      }
    },
    getOrderList: function (pageNo) {
      if (pageNo === 1) {
        this.pager.count = 0;
      }
      this.pager.currentPage = pageNo;
      let param = {};
      this.loadingData = true;
      param = Object.assign({}, this.filters, {
        pageNo: pageNo,
        pageSize: this.pager.pageSize
      });
      PurchaseContract.query(param).then(res => {
        this.orderList = res.data.list;
//            this.pager.count = res.data.count;
        if (this.orderList.length === this.pager.pageSize) {
          this.pager.count = this.pager.currentPage * this.pager.pageSize + 1;
        }
        this.loadingData = false;
      });
      this.queryStatusNum(param);
    },
    filterOrg: function (query) {// 过滤供货商
      let orgId = this.$store.state.user.userCompanyAddress;
      if (!orgId) {
        this.searchCondition.transactOrgId = '';
        this.orgList = [];
        return;
      }
      BaseInfo.queryOrgByReation(orgId, {keyWord: query, relation: '1'}).then(res => {
        this.orgList = res.data;
      });
    },
    filterListColor: function (availabilityStatus, used) {// 过滤左边列表边角颜色
      let status = -1;
      if (availabilityStatus === true && used === false) {
        status = 0;
      } else if (availabilityStatus === true && used === true) {
        status = 1;
      } else {
        status = 2;
      }
      return status;
    },
    queryStatusNum: function (params) {
      PurchaseContract.queryStateNum(params).then(res => {
        let data = res.data;
        this.orgType[0].num = this.obtionStatusNum(data['unused']);
        this.orgType[1].num = this.obtionStatusNum(data['valid']);
        this.orgType[2].num = this.obtionStatusNum(data['invalid']);
      });
    },
    obtionStatusNum: function (num) {
      if (typeof num !== 'number') {
        return 0;
      }
      return num;
    },
    changeStatus: function (item, key) {// 订单分类改变
      this.activeStatus = key;
      this.filters.availabilityStatus = item.availabilityStatus;
      this.filters.used = item.used;
    },
    formatTime: function (date) {
      return date ? this.$moment(date).format('YYYY-MM-DD') : '';
    }
  }
};
</script>
