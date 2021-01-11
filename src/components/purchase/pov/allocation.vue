<style lang="scss" scoped="">

.align-word {
  letter-spacing: 1em;
  margin-right: -1em;
}

.color-blue {
  color: #00ff00;
}

.color-red {
  color: red;
}

.mb5 {
  margin-bottom: 5px;
}

.order-list-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding-right: 0;
}
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div class="mb-15" style="overflow: hidden">
        <el-button :plain="true" class="pull-left" type="primary" @click="$router.push('/sale/allocation')">返回销售分配
        </el-button>
        <perm v-show="!$route.query.type" label="submit-allocation-plan">
          <el-button v-show="status === 0" :disabled="doing" class="pull-right" type="primary" @click="submit">提交分配方案
          </el-button>
        </perm>
      </div>
      <div class="order-list clearfix ">
        <el-row class="order-list-header">
          <el-col :span="status === 0 ? 4 : 6">货主疫苗</el-col>
          <el-col :span="status === 0 ? 4 : 6">供货单位</el-col>
          <el-col :span="status === 0 ? 2 : 4">需求数</el-col>
          <el-col :span="status === 0 ? 2 : 4">库存数</el-col>
          <el-col v-show="status === 0" :span="3">调配前库存差额</el-col>
          <el-col v-show="status === 0" :span="3">调配后库存差额</el-col>
          <el-col v-show="status === 0" :span="2">状态</el-col>
          <el-col :span="4">操作</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="!allocationList || allocationList && allocationList.length == 0">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else="" class="order-list-body flex-list-dom">
          <el-row v-for="item in allocationList" :key="item.orgGoodsId" :class="[{'active':currentItemId==item.orgGoodsId}]"
                  class="order-list-item order-list-item-bg" @click.prevent="showPart(item)">
            <el-col :span="status === 0 ? 4 : 6" class="R pt">
              <div>
                <el-tooltip class="item" content="货主疫苗名称" effect="dark" placement="right">
                  <span style="font-size: 14px;line-height: 20px">{{item.orgGoodsName}}</span>
                </el-tooltip>
              </div>
              <div>
                <el-tooltip class="item" content="生产单位" effect="dark" placement="right">
                  <span style="font-size: 12px;color:#999">{{ item.productFactory }}</span>
                </el-tooltip>
              </div>
              <div>
                <el-tooltip class="item" content="疫苗规格" effect="dark" placement="right">
                  <span style="font-size: 12px;">{{ item.specification }}</span>
                </el-tooltip>
              </div>
            </el-col>
            <el-col :span="status === 0 ? 4 : 6" class="pt">
                <span>
                  {{ item.saleFactory }}
                </span>
            </el-col>
            <el-col :span="status === 0 ? 2 : 4" class="pt">
                <span>
                  {{ item.requiredQuantity }}
                  <dict :dict-group="'measurementUnit'" :dict-key="item.mixUnit"></dict>
                </span>
            </el-col>
            <el-col :span="status === 0 ? 2 : 4" class="pt">
                <span>
                  {{ item.inventoryQuantity }}
                  <dict :dict-group="'measurementUnit'" :dict-key="item.mixUnit"></dict>
                </span>
            </el-col>
            <el-col v-show="status === 0" :span="3" class="pt">
                <span>
                  {{ item.balanceAmount }}
                  <dict :dict-group="'measurementUnit'" :dict-key="item.mixUnit"></dict>
                </span>
            </el-col>
            <el-col v-show="status === 0" :span="3" class="pt">
                <span>
                  {{ item.resultAmount }}
                  <dict :dict-group="'measurementUnit'" :dict-key="item.mixUnit"></dict>
                </span>
            </el-col>
            <el-col v-show="status === 0" :span="2" class="pt">
                <span v-show="item.resultAmount>-1 ">
                  <i class="el-icon-t-correct color-blue"></i>
                  正常
                </span>
              <span v-show="item.resultAmount<0 ">
                  <i class="el-icon-t-warning color-red"></i>
                  库存不足
                </span>
            </el-col>
            <el-col :span="4" class="opera-btn">
              <div v-show="status === 0 " class="mb5">
                <span @click.prevent="showPart(item)">
                  <a class="btn-circle" href="#" @click.prevent=""><i
                    class="el-icon-t-detail"></i></a>
                  要货单位分配明细
                </span>
                <perm label="demand-assignment-update-org-goods">
                  <div @click.prevent="editItem(item)">
                    <a class="btn-circle" href="#" @click.prevent=""><i
                      class="el-icon-t-edit"></i></a>
                    修改要货品种
                  </div>
                </perm>
              </div>
              <div class="mb5">
                  <span v-show="status === 1 " @click.prevent="showPart(item)">
                    <a class="btn-circle" href="#" @click.prevent=""><i
                      class="el-icon-t-detail"></i></a>
                  查看详情
                </span>
              </div>
              <!--<div>-->
              <!--<span @click.prevent="showOrderFormPart(item)" v-show="$route.query.type">-->
              <!--<a href="#" class="btn-circle" @click.prevent=""><i-->
              <!--class="el-icon-t-link"></i></a>-->
              <!--生成采购合同-->
              <!--</span>-->
              <!--</div>-->
            </el-col>
          </el-row>
        </div>
      </div>
      <!--<div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">-->
      <!--<el-pagination-->
      <!--layout="prev, pager, next"-->
      <!--:total="pager.count" :pageSize="pager.pageSize" @current-change="queryAllocationList"-->
      <!--:current-page="pager.currentPage">-->
      <!--</el-pagination>-->
      <!--</div>-->
    </div>

    <page-right :css="{'width':'1000px','padding':0}" :show="showRight" @right-close="closeForm">
      <allot-form :TotalAllocationList="allocationList" :currentItem="currentItem" :status="status"
                  @change="change" @close="resetRightBox" @refresh="refresh" @updateItem="showPart"></allot-form>
    </page-right>
    <page-right :css="{'width':'700px','padding':0}" :show="showEditGoodsRight" @right-close="closeForm">
      <edit-goods :currentItem="currentItem" :show="showEditGoodsRight" @close="resetRightBox"
                  @refresh="refresh"></edit-goods>
    </page-right>
    <page-right :css="{'width':'1000px','padding':0}" :show="showOrderForm" class="specific-part-z-index"
                @right-close="resetRightBox">
      <order-form :defaultIndex="defaultIndex" :orderId="currentItemId" :purchase="purchase" :vaccineType="vaccineType"
                  action="add"
                  type="0" @right-close="resetRightBox"></order-form>
    </page-right>
  </div>
</template>
<script>
import {demandAssignment, OrgGoods} from '@/resources';
import allotForm from './form.vue';
import orderForm from '../contract/form/InForm.vue';
import editGoods from './editGoods';

export default {
  components: {
    allotForm,
    orderForm,
    editGoods
  },
  data() {
    return {
      loadingData: false,
      allocationList: [],
      showRight: false,
      showOrderForm: false,
      showEditGoodsRight: false,
      status: -1,
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: 15
      },
      currentItemId: '',
      currentItem: {},
      defaultIndex: -1,
      purchase: {},
      vaccineType: '',
      doing: false
    };
  },
  mounted() {
    this.queryAllocationList();
  },
  methods: {
    queryAllocationList(pageNo) { // 得到需求分配列表
      this.allocationList = [];
      this.status = -1;
      if (!this.$route.query.id) return;
      this.loadingData = true;
      demandAssignment.queryDetailList(this.$route.query.id).then(res => {
        this.allocationList = res.data.list;
        this.status = res.data.status;
        this.loadingData = false;
      });
    },
    resetRightBox() {
      this.showRight = false;
      this.showOrderForm = false;
      this.showEditGoodsRight = false;
      this.defaultIndex = -1;
      this.purchase = {};
      this.vaccineType = '';
    },
    closeForm(item) {
      this.$confirm('确认关闭页面?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.showRight = false;
        this.showEditGoodsRight = false;
      }).catch(error => {

      });
    },
    refresh() {
      this.resetRightBox();
      this.queryAllocationList();
    },
    editItem(item) {
      this.currentItem = item;
      this.currentItemId = item.orgGoodsId;
      this.showEditGoodsRight = true;
    },
    showPart(item) {
      this.currentItem = item;
      this.currentItemId = item.orgGoodsId;
      this.showRight = true;
    },
    showOrderFormPart(item) {
      OrgGoods.queryOneGoods(item.orgGoodsId).then(res => {
        this.vaccineType = res.data.orgGoodsDto.goodsDto.vaccineSign;
        this.currentItem = item;
        this.currentItemId = item.orgGoodsId;
        this.purchase = {
          id: item.orgGoodsId,
          count: item.balanceAmount
        };
        this.showOrderForm = true;
        this.defaultIndex = 1;
      });
    },
    change(item, count) {
      this.allocationList.forEach(i => {
        if (i.orgGoodsId === item.orgGoodsId) {
          i.resultAmount = i.inventoryQuantity - count;
        }
      });
    },
    goTo(item) {
      OrgGoods.queryOneGoods(item.orgGoodsId).then(res => {
        let type = res.data.orgGoodsDto.goodsDto.vaccineSign;
        if (type === '1') {
          this.$notify.success({
            message: '即将跳转到免疫规划苗采购订单'
          });
          this.$router.push({
            path: '/purchase/order/one/class/add',
            query: {id: item.orgGoodsId, count: item.balanceAmount}
          });
        } else {
          this.$notify.success({
            message: '即将跳转到非免疫规划苗采购订单'
          });
          this.$router.push({
            path: '/purchase/order/two/class/add',
            query: {id: item.orgGoodsId, count: item.balanceAmount}
          });
        }
      });
//        this.$router.push('/purchase/order/add');
    },
    submit() {
      let isNotNormal = this.allocationList.some(s => s.resultAmount < 0);
      if (isNotNormal) {
        this.$notify.info({
          message: '库存不足，请重新分配'
        });
        return;
      }
      this.doing = true;
      demandAssignment.createOrder(this.$route.query.id).then(() => {
        this.$notify.success({
          message: '提交分配方案成功'
        });
        this.doing = false;
        this.$router.push('/sale/allocation');
      }).catch(error => {
        this.doing = false;
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '提交分配方案失败'
        });
      });
    }
  }

};
</script>
