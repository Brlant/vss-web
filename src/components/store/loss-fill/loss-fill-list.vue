<!--损耗填报-->
<template>
  <div class="order-page">
    <div class="container">
      <div :class="{up:!showSearch}" class="opera-btn-group">
        <div class="opera-icon">
          <span class="pull-right cursor-span" style="margin-left: 10px" @click.prevent="add">
            <perm label="breakage-order-add">
                    <a class="btn-circle" href="#" @click.prevent=""><i
                      class="el-icon-t-plus"></i> </a>添加
            </perm>
          </span>
          <span class="pull-left switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
          <goods-switch class="pull-right"></goods-switch>
        </div>
        <el-form v-show="showSearch" class="advanced-query-form clearfix" onsubmit="return false"
                 style="padding-top: 10px">
          <el-row>
            <el-col :span="8">
              <oms-form-row :span="6" label="货主订单号">
                <oms-input v-model="params.orderNo" placeholder="请输入货主订单号" type="text"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="货主疫苗">
                <el-select v-model="params.orgGoodsId" :clearable="true" :remote-method="searchProduct"
                           filterable
                           placeholder="请输入名称或编号搜索货主疫苗" popper-class="good-selects" remote
                           @click.native.once="searchProduct('')">
                  <el-option v-for="org in goodesList" :key="org.id" :label="org.goodsName"
                             :value="org.id">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{ org.goodsName }}</span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left"><span
                        v-show="org.goodsNo">货主货品编号:</span>{{ org.goodsNo }}
                      </span>
                      <span class="select-other-info pull-left"><span
                        v-show="org.saleFirmName">供货单位:</span>{{ org.saleFirmName }}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="下单时间">
                <el-col :span="24">
                  <el-date-picker
                    v-model="createdTimes"
                    format="yyyy-MM-dd"
                    placeholder="请选择" type="daterange">
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
        <div v-for="(item,key) in lossFillType"
             :class="{'active':key===activeStatus,'exceptionPosition':key === 11,'w90':item.state === '4',
          'cancelPosition': item.state==='5'}"
             class="status-item"
             @click="changeStatus(item,key)">
          <div :class="['b_color_'+key]" class="status-bg"></div>
          <div><i v-if="key===activeStatus" class="el-icon-caret-right"></i>{{ item.title }}<span
            class="status-num">{{ item.num }}</span>
          </div>
        </div>
      </div>
      <div class="order-list clearfix">
        <el-row class="order-list-header">
          <el-col :span="8">货主/订单号</el-col>
          <el-col :span="4">所属区域</el-col>
          <el-col :span="5">损耗时间</el-col>
          <el-col :span="2">状态</el-col>
          <el-col v-if="params.state === 0 " :span="5" class="opera-btn">操作</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="lossList.length === 0">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else class="order-list-body flex-list-dom">
          <div v-for="item in lossList"
               :class="['status-'+filterListColor(item.state),{'active':currentOrderId===item.id}]"
               class="order-list-item"
               @click.prevent="showItem(item)">
            <el-row>
              <el-col :span="8">
                <div class="f-grey">
                  {{ item.orderNo }}
                </div>
                <div>
                  {{ item.orgName }}
                </div>
              </el-col>
              <el-col :span="4">
                <div>
                  {{ item.orgAreaName }}
                </div>
              </el-col>
              <el-col :span="5">
                <div>{{ item.createTime | minute }}</div>
              </el-col>
              <el-col :span="2">
                <div class="vertical-center">
                  <el-tag :type="getTagTypeByStatus(item.state)">{{ getOrderStatus(item.state) }}</el-tag>
                </div>
              </el-col>
              <el-col v-show="params.state === '0'" :span="5" class="opera-btn">
                <perm label="breakage-order-edit">
                  <span @click.stop.prevent="editOrder(item)">
                    <a class="btn-circle" href="#" @click.prevent=""><i
                      class="el-icon-t-edit"></i></a>
                    编辑
                  </span>
                </perm>
              </el-col>
            </el-row>
            <order-goods-info :order-item="item"></order-goods-info>
            <div class="order-list-item-bg"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="params.count>params.pageSize && !loadingData" class="text-center">
      <el-cu-pagination
        :current-page="params.pageNo"
        :pageSize="params.pageSize" :total="totalCount" layout="prev, pager, next"
        @current-change="getOrderList">
      </el-cu-pagination>
    </div>
    <page-right :css="{'width':'1000px','padding':0}" :show="showDetail" class="order-detail-info specific-part-z-index"
                partClass="pr-no-animation" @right-close="resetRightBox">
      <loss-fill-detail :orderId="currentOrderId" :state="state" @close="resetRightBox"
              @refreshOrder="getOrderList"></loss-fill-detail>
    </page-right>

    <page-right :css="{'width':'1000px','padding':0}" :show="showItemRight" @right-close="beforeCloseConfirm">
      <loss-fill-form :action="action" :defaultIndex="defaultIndex" :orderId="currentOrderId" type="1" @change="onSubmit"
                @close="resetRightBox"></loss-fill-form>
    </page-right>
  </div>
</template>

<script>
import utils from '@/tools/utils';
import lossFillDetail from './loss-fill-detail.vue';
import lossFillForm from './loss-fill-form.vue';
import OrderMixin from '@/mixins/orderMixin';

export default {
  components: {
    lossFillDetail, lossFillForm
  },
  data: function () {
    return {
      loadingData: true,
      showItemRight: false,
      showPart: false,
      showDetail: false,
      showSearch: false,
      lossList: [],
      params: {
        type: 1,
        state: '0',
        bizType: '2-5',
        deleteFlag: false,
        searchType: 1,
        orderNo: '',
        logisticsProviderName: '',
        createStartTime: '',
        createEndTime: '',
        transportationMeansId: '',
        transactOrgId: '',
        orgGoodsId: '',
        orgAreaCode: '',
        thirdPartyNumber: '',
        expectedStartTime: '',
        expectedEndTime: '',
        pushStatus: '',
        pageNo:1,
        pageSize:20
      },
      totalCount:0,
      createdTimes: [],
      expectedTimes: [],
      lossFillType: utils.lossFillType,
      activeStatus: '0',
      currentOrderId: '',
      orgList: [], // 来源单位列表
      logisticsList: [], // 物流商列表
      defaultIndex: 0, // 添加订单默认选中第一个tab
      action: '',
      user: {},
      state: '',
      goodesList: []
    };
  },
  mixins: [OrderMixin],
  mounted() {
    this.getOrderList(1);
    let orderId = this.$route.params.id;
    if (orderId && orderId !== 'list') {
      this.currentOrderId = orderId;
      this.showDetail = true;
    }
  },
  methods: {
    getTagTypeByStatus(status) {
      if (status == 0) {
        return '';
      }
      if (status == 4) {
        return 'success';
      }
      if (status == 5) {
        return 'danger';
      }
    },
    editOrder(item) {
      this.action = 'edit';
      this.currentOrderId = item.id;
      this.showItemRight = true;
      this.defaultIndex = 2;
    },
    showPartItem(item) {
      this.currentOrderId = item.id;
      this.showPart = true;
    },
    getOrderStatus: function (state) {
      return this.lossFillType[state].title;
    },
    searchInOrder: function () {
      this.params.createStartTime = this.$formatAryTime(this.createdTime, 0);
      this.params.createEndTime = this.$formatAryTime(this.createdTime, 1);
      this.params.expectedStartTime = this.$formatAryTime(this.expectedTimes, 0);
      this.params.expectedEndTime = this.$formatAryTime(this.expectedTimes, 1);
      this.getOrderList();
    },
    resetSearchForm: function () {
      // this.params = {};
      this.params.orderNo=''
      this.params.orgGoodsId=''
      this.createdTimes = [];
      this.expectedTimes = [];
      this.getOrderList();
    },
    searchProduct(keyWord) {
      let orgId = this.$store.state.user.userCompanyAddress;
      let params = Object.assign({}, {
        deleteFlag: false,
        orgId: orgId,
        keyWord: keyWord
      });

      // 查询即时库存
      this.$http.get('/erp-stock/goods-list', {params}).then(res => {
        this.goodesList = res.data.list;
      });
    },
    resetRightBox: function () {
      this.showDetail = false;
      this.showItemRight = false;
      this.defaultIndex = 0;
      this.action = '';
      this.showPart = false;
      this.$router.push('list');
    },
    add: function () {
      this.showItemRight = true;
      this.defaultIndex = 1;
      this.action = 'add';
    },
    onSubmit: function () {
      this.currentOrderId = '';
      this.getOrderList(1);
    },
    getOrderList() {
      this.loadingData = true;
      // 明细查询
      this.params.isShowDetail = !!JSON.parse(window.localStorage.getItem('isShowGoodsList'));

      this.$http.get('/erp-order', {params: this.params}).then(res => {
        this.lossList = res.data.list;
        this.params.count = res.data.count;
        this.loadingData = false;
      })

      this.$http.get('/erp-order/count', {params: this.params}).then(res => {
        let data = res.data;
        this.lossFillType[0].num =data['out-pend-confirm'];
        this.lossFillType[4].num =data['out-complete'];
        this.lossFillType[5].num =data['out-cancel'];
      });
    },
    // 过滤左边列表边角颜色
    filterListColor: function (index) {
      let status = -1;
      for (let key in this.lossFillType) {
        if (this.lossFillType[key].state === index) {
          status = key;
        }
      }
      return status;
    },
    showItem: function (order) {
      this.currentOrderId = order.id;
      this.state = order.state;
      this.showDetail = true;
      this.$router.push(`${order.id}`);
    },
    changeStatus: function (item, key) {
      this.activeStatus = key;
      this.params.state = item.state;
      this.getOrderList();
    },
  }
};
</script>

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
    cursor: pointer;
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

</style>
