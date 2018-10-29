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
  }
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div class="mb-15" style="overflow: hidden">
        <el-button class="pull-left" type="primary" :plain="true" @click="$router.push('/sale/allocation')">返回销售分配
        </el-button>
        <perm label="submit-allocation-plan" v-show="!$route.query.type">
          <el-button class="pull-right" type="primary" @click="submit" v-show="status === 0" :disabled="doing">提交分配方案</el-button>
        </perm>
      </div>
      <div class="order-list clearfix ">
        <el-row class="order-list-header">
          <el-col :span="status === 0 ? 4 : 6">疫苗</el-col>
          <el-col :span="status === 0 ? 4 : 6">供货厂商</el-col>
          <el-col :span="status === 0 ? 2 : 4">需求数</el-col>
          <el-col :span="status === 0 ? 2 : 4">库存数</el-col>
          <el-col :span="3" v-show="status === 0">库存差额</el-col>
          <el-col :span="3" v-show="status === 0">调配后剩余库存</el-col>
          <el-col :span="2" v-show="status === 0">状态</el-col>
          <el-col :span="4">操作</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="allocationList.length == 0">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else="" class="order-list-body flex-list-dom">
          <div class="order-list-item order-list-item-bg" v-for="item in allocationList"
               :class="[{'active':currentItemId==item.orgGoodsId}]" @click.prevent="showPart(item)">
            <el-row>
              <el-col :span="status === 0 ? 4 : 6" class="R pt">
                <div>
                  <el-tooltip class="item" effect="dark" content="疫苗名称" placement="right">
                    <span style="font-size: 14px;line-height: 20px">{{item.goodsName}}</span>
                  </el-tooltip>
                </div>
                <div>
                  <el-tooltip class="item" effect="dark" content="生产厂商" placement="right">
                    <span style="font-size: 12px;color:#999">{{ item.productFactory }}</span>
                  </el-tooltip>
                </div>
                <div>
                  <el-tooltip class="item" effect="dark" content="货品规格" placement="right">
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
              <el-col :span="3" class="pt" v-show="status === 0">
                <span>
                  {{ item.balanceAmount }}
                  <dict :dict-group="'measurementUnit'" :dict-key="item.mixUnit"></dict>
                </span>
              </el-col>
              <el-col :span="3" class="pt" v-show="status === 0">
                <span>
                  {{ item.resultAmount }}
                  <dict :dict-group="'measurementUnit'" :dict-key="item.mixUnit"></dict>
                </span>
              </el-col>
              <el-col :span="2" class="pt" v-show="status === 0">
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
                <div class="mb5">
                    <span @click.prevent="showPart(item)" v-show="status === 0 ">
                      <a href="#" class="btn-circle" @click.prevent=""><i
                        class="el-icon-t-detail"></i></a>
                    要货单位分配明细
                    </span>
                </div>
                <div class="mb5">
                  <span @click.prevent="showPart(item)" v-show="status === 1 ">
                    <a href="#" class="btn-circle" @click.prevent=""><i
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
      </div>
      <!--<div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">-->
      <!--<el-pagination-->
      <!--layout="prev, pager, next"-->
      <!--:total="pager.count" :pageSize="pager.pageSize" @current-change="queryAllocationList"-->
      <!--:current-page="pager.currentPage">-->
      <!--</el-pagination>-->
      <!--</div>-->
    </div>

    <page-right :show="showRight" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}">
      <allot-form :currentItem="currentItem" :TotalAllocationList="allocationList" @updateItem="showPart" @change="change" :status="status" @close="resetRightBox"></allot-form>
    </page-right>
    <page-right :show="showOrderForm" class="specific-part-z-index" @right-close="resetRightBox"
                :css="{'width':'1000px','padding':0}">
      <order-form type="0" :defaultIndex="defaultIndex" :orderId="currentItemId" :purchase="purchase"
                  action="add"
                  @right-close="resetRightBox" :vaccineType="vaccineType"></order-form>
    </page-right>
  </div>
</template>
<script>
  import { demandAssignment, OrgGoods } from '@/resources';
  import allotForm from './form.vue';
  import orderForm from '../contract/form/InForm.vue';

  export default {
    components: {
      allotForm,
      orderForm
    },
    data () {
      return {
        loadingData: false,
        allocationList: [],
        showRight: false,
        showOrderForm: false,
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
    mounted () {
      this.queryAllocationList();
    },
    methods: {
      queryAllocationList (pageNo) { // 得到需求分配列表
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
      resetRightBox () {
        this.showRight = false;
        this.showOrderForm = false;
        this.defaultIndex = -1;
        this.purchase = {};
        this.vaccineType = '';
      },
      showPart (item) {
        this.currentItem = item;
        this.currentItemId = item.orgGoodsId;
        this.showRight = true;
      },
      showOrderFormPart (item) {
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
      change (item, count) {
        this.allocationList.forEach(i => {
          if (i.orgGoodsId === item.orgGoodsId) {
            i.resultAmount = i.inventoryQuantity - count;
          }
        });
      },
      goTo (item) {
        OrgGoods.queryOneGoods(item.orgGoodsId).then(res => {
          let type = res.data.orgGoodsDto.goodsDto.vaccineSign;
          if (type === '1') {
            this.$notify.success({
              message: '即将跳转到一类苗采购订单'
            });
            this.$router.push({
              path: '/purchase/order/one/class/add',
              query: {id: item.orgGoodsId, count: item.balanceAmount}
            });
          } else {
            this.$notify.success({
              message: '即将跳转到二类苗采购订单'
            });
            this.$router.push({
              path: '/purchase/order/two/class/add',
              query: {id: item.orgGoodsId, count: item.balanceAmount}
            });
          }
        });
//        this.$router.push('/purchase/order/add');
      },
      submit () {
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
            message: error.response.data && error.response.data.msg || '提交分配方案失败'
          });
        });
      }
    }

  };
</script>
