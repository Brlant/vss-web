<style lang="less" scoped="">
  .advanced-query-form {
    .el-select {
      display: block;
      position: relative;
    }
    .el-date-editor.el-input {
      width: 100%;
    }
    padding-top: 20px;
  }

  .R {
    word-wrap: break-word;
    word-break: break-all;
  }

  .good-selects {
    .el-select-dropdown__item {
      height: auto;
      width: 300px;
    }
  }

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
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div class="mb-15" style="overflow: hidden">
        <el-button class="pull-left" type="primary" :plain="true" @click="$router.push('/purchase/allocation')">返回疫苗采购汇总
        </el-button>
        <perm label="submit-purchansing-plan" v-show="!$route.query.type">
          <el-button class="pull-right" type="primary" @click="submit" v-show="status === 0 ">生成采购合同</el-button>
        </perm>
      </div>
      <div class="order-list clearfix ">
        <el-row class="order-list-header" :gutter="10">
          <el-col :span="6">疫苗</el-col>
          <el-col :span="6">供货厂商</el-col>
          <el-col :span="3">需求数</el-col>
          <el-col :span="3">库存数</el-col>
          <el-col :span="3">库存差额</el-col>
          <el-col :span="3">采购数量</el-col>
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
               :class="[{'active':currentItemId==item.id}]">
            <el-row>
              <el-col :span="6" class="R pt">
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
              <el-col :span="6" class="pt">
                <span>
                  {{ item.saleFactory }}
                </span>
              </el-col>
              <el-col :span="3" class="pt">
                <span>
                  {{ item.requiredQuantity }}
                  <dict :dict-group="'measurementUnit'" :dict-key="item.mixUnit"></dict>
                </span>
              </el-col>
              <el-col :span="3" class="pt">
                <span>
                  {{ item.inventoryQuantity }}
                  <dict :dict-group="'measurementUnit'" :dict-key="item.mixUnit"></dict>
                </span>
              </el-col>
              <el-col :span="3" class="pt">
                <span>
                  {{ item.balanceAmount }}
                  <dict :dict-group="'measurementUnit'" :dict-key="item.mixUnit"></dict>
                </span>
              </el-col>
              <el-col :span="3" class="pt">
                <span v-show="status === 1 ">{{item.purchaseQuantity}}
                <dict :dict-group="'measurementUnit'" :dict-key="item.mixUnit"></dict>
                </span>
                <perm label="purchansing-assignment-update">
                  <el-input v-show="status === 0 " v-model.number="item.purchaseQuantity"
                            @blur="save(item)">
                    <template slot="append">
                      <dict :dict-group="'measurementUnit'" :dict-key="item.mixUnit"></dict>
                    </template>
                  </el-input>
                </perm>
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
  </div>
</template>
<script>
  import { demandAssignment, OrgGoods, procurementCollect } from '@/resources';

  export default {
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
        vaccineType: ''
      };
    },
    mounted () {
      this.queryAllocationList(1);
    },
    methods: {
      queryAllocationList (pageNo) { // 得到需求分配列表
        this.allocationList = [];
        this.status = -1;
        if (!this.$route.query.id) return;
        this.loadingData = true;
        procurementCollect.queryDetailList(this.$route.query.id).then(res => {
          res.data.list.forEach(item => {
            if (item.purchaseQuantity === null && res.data.status === 0) {
              item.purchaseQuantity = Math.abs(item.balanceAmount);
              this.autoSave(item);
            }
          });
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
        this.currentItemId = item.id;
        this.showRight = true;
      },
      showOrderFormPart (item) {
        OrgGoods.queryOneGoods(item.orgGoodsId).then(res => {
          this.vaccineType = res.data.orgGoodsDto.goodsDto.vaccineSign;
          this.currentItem = item;
          this.currentItemId = item.id;
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
      autoSave (item) {
        let obj = {
          id: item.list[0].detailId,
          procurementCount: item.purchaseQuantity
        };
        let list = [];
        list.push(obj);
        demandAssignment.allotVaccine(list);
      },
      save (item) {
        let obj = {
          id: item.list[0].detailId,
          procurementCount: item.purchaseQuantity
        };
        let list = [];
        list.push(obj);
        demandAssignment.allotVaccine(list).then(() => {
          this.$notify.success({
            message: '分配采购数量成功'
          });
        }).catch(error => {
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '分配采购数量失败'
          });
        });
      },
      submit () {
        procurementCollect.createOrder(this.$route.query.id).then(() => {
          this.$notify.success({
            message: '生成采购合同成功'
          });
          this.$router.push('/purchase/allocation');
        }).catch(error => {
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '生成采购合同失败'
          });
        });
      }
    }

  };
</script>
