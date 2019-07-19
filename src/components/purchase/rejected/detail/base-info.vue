<style lang="scss" scoped="">

  .oms-row {
    margin-bottom: 8px;
  }

  .confirm-order {
    .el-select {
      display: block;
      position: relative;
      width: 500px;
    }
  }
</style>
<template>
  <div>
    <div v-if="!currentOrder.id">
      <oms-loading :loading="!currentOrder.id"></oms-loading>
    </div>
    <div v-else="" class="page-main-body padding">
      <div>
        <el-row style="margin-bottom:0;position: relative" v-show=" currentOrder.bizType !== '2-2' ">
          <el-col :span="12">
            <oms-row label="货主订单号" :span="span">
              {{currentOrder.orderNo}}
            </oms-row>
            <oms-row label="货主" :span="span">
              {{currentOrder.orgName}}
            </oms-row>
            <oms-row label="供货单位" :span="span">
              {{currentOrder.customerName}}
            </oms-row>
            <oms-row label="供货单位仓库" :span="span">
              {{ getWarehouseAdress(currentOrder)}}
            </oms-row>
            <oms-row label="运输条件" :span="span">
              <dict :dict-group="'transportationCondition'" :dict-key="currentOrder.transportationCondition"></dict>
            </oms-row>
            <oms-row label="疾控仓库地址" :span="span">
              <span class="goods-span">{{currentOrder.outWarehouseAddress}}</span>
            </oms-row>
            <oms-row label="物流中心" :span="span">
              {{currentOrder.centreName}}
            </oms-row>
          </el-col>
          <el-col :span="12">
            <oms-row label="业务类型">
              <dict :dict-group="'bizOutType'" :dict-key="currentOrder.bizType"></dict>
            </oms-row>
            <oms-row label="订单类型">
              <dict dict-group="orderGoodsType" :dict-key="'' + currentOrder.goodsType"></dict>
            </oms-row>
            <oms-row label="物流方式">
              <dict :dict-group="'outTransportMeans'" :dict-key="currentOrder.transportationMeansId"></dict>
            </oms-row>
            <oms-row label="下单时间">
              <span class="goods-span">{{currentOrder.createTime | minute}}</span>
            </oms-row>
            <oms-row label="预计出库时间" v-show="currentOrder.expectedTime">
              <span class="goods-span">{{currentOrder.expectedTime | date}}</span>
            </oms-row>
            <oms-row label="是否合格">
              <span class="goods-span" v-show="currentOrder.qualifiedFlag">合格</span>
              <span class="goods-span" v-show="!currentOrder.qualifiedFlag">不合格</span>
            </oms-row>
            <oms-row label="订单状态">
              {{ getOrderStatus(currentOrder) }}
              <order-push-status :status="currentOrder.pushStatus"/>
            </oms-row>
            <oms-row label="退货原因" v-show="currentOrder.returnReason">
              {{ currentOrder.returnReason }}
            </oms-row>
          </el-col>
        </el-row>
        <el-row v-show="currentOrder.remark">
          <oms-row label="备注" :span="4">{{ currentOrder.remark }}</oms-row>
        </el-row>
      </div>


      <!--<hr class="hr"/>-->
      <div class="table-product">
        <table class="table no-border table-product-list" v-show="currentOrder.detailDtoList">
          <thead>
          <tr>
            <td></td>
            <td></td>
            <td class="text-center">疫苗</td>
            <td class="text-center">规格</td>
            <!--<td>批号</td>-->
            <td class="text-center">生产/有效日期</td>
            <!--<td>有效期</td>-->
            <td class="text-center">数量</td>
            <td class="text-center">单价</td>
            <td class="text-center">金额</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in currentOrder.detailDtoList" v-if="item.orgGoodsDto">
            <td width="10">{{index + 1}}</td>
            <td width="80">
              <el-tooltip v-if="$formatPhotoUrl(item)" popperClass="el-tooltip" class="item"
                          effect="light" placement="right">
                <compressed-img :src="$formatPhotoUrl(item) +'?image&action=resize:w_80,h_80,m_2' "
                                class="product-img"/>
                <compressed-img slot="content" :src="$formatPhotoUrl(item) +'?image&action=resize:h_200,m_2' "
                                class="product-img"/>
              </el-tooltip>
              <el-tooltip v-else class="item" effect="light" popperClass="el-tooltip" placement="right">
                <img :src="'../../../../static/img/userpic.png'" class="product-img">
                <img :src="'../../../../static/img/userpic.png'" slot="content" class="product-img">
              </el-tooltip>
            </td>
            <td>
              <div>
                <el-tooltip class="item" effect="dark" content="货主疫苗名称" placement="right">
                  <span style="font-size: 14px;line-height: 20px">{{item.name}}</span>
                </el-tooltip>
              </div>
              <div>
                <el-tooltip class="item" effect="dark" content="平台疫苗名称" placement="right">
                  <span style="font-size: 12px;color:#999">{{ item.goodsName }}</span>
                </el-tooltip>
              </div>
              <!--<div>-->
              <!--<el-tooltip class="item" effect="dark" content="疫苗规格" placement="right">-->
              <!--<span style="font-size: 12px;">{{ item.orgGoodsDto.goodsDto.specifications }}</span>-->
              <!--</el-tooltip>-->
              <!--</div>-->
              <div>
                <el-tooltip class="item" effect="dark" content="供货单位" placement="right">
                  <span>{{ item.salesFirmName }}</span>
                </el-tooltip>
              </div>
              <div>
                批号：{{item.batchNumber || '无' }}
                <goods-status-tag :item="item" :form="currentOrder"/>
              </div>
            </td>
            <td class="text-center" width="70px">
              <span>{{ item.orgGoodsDto.goodsDto.specifications }}</span>
            </td>
            <!--<td width="80px" class="R">{{ item.batchNumber || '无' }}</td>-->
            <td class="text-center" style="width: 85px">
              <div>{{ item.productionDate | date }}</div>
              <div>{{ item.expiryDate | date }}</div>
            </td>
            <td width="70px" class="text-center">
              {{item.amount}}
              <dict :dict-group="'measurementUnit'" :dict-key="item.orgGoodsDto.goodsDto.measurementUnit"></dict>
            </td>
            <td width="80px" class="text-center">
              <span v-if="item.unitPrice">￥{{item.unitPrice | formatMoney}}</span>
              <span v-if="!item.unitPrice">-</span>
            </td>
            <td width="80px" class="text-center">
            <span v-if="item.unitPrice">
            <span>¥</span>{{ item.amount * item.unitPrice | formatMoney }}
            </span>
              <span v-if="!item.unitPrice">-</span>
            </td>
          </tr>
          <tr class="text-center">
            <td colspan="6" align="right">
              <total-count property="amount" :list="currentOrder.detailDtoList"></total-count>
            </td>
            <td colspan="2" align="right">
              <span style="font-weight:600;"
                    v-show="currentOrder.totalAmount">合计金额: ¥  {{ currentOrder.totalAmount | formatMoney
              }}</span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import {Address, LogisticsCenter} from '@/resources';

  export default {
    props: {
      currentOrder: {
        type: Object,
        default: function () {
          return {};
        }
      }
    },
    data() {
      return {
        span: 8,
        warehouses: [],
        LogisticsCenter: []
      };
    },
    computed: {
      bizTypeList() {
        return this.$getDict('bizOutType');
      },
      transportationMeansList() {
        return this.$getDict('outTransportMeans');
      },
      transportationConditionList() {
        return this.$getDict('transportationCondition');
      },
      shipmentPackingUnit() {
        return this.$getDict('shipmentPackingUnit');
      },
      measurementUnitList() {
        return this.$getDict('measurementUnit');
      },
      orgRelationList() {
        return this.$getDict('orgRelation');
      },
      totalMoney: function () {
        let totalMoney = 0.00;
        if (!this.form.detailDtoList.length) return totalMoney;
        this.form.detailDtoList.forEach(item => {
          totalMoney += item.amount * item.unitPrice;
        });
        return totalMoney;
      }
    },
    watch: {
      currentOrder(val) {
        if (!val.id) return;
        this.searchWarehouses();
        this.filterLogisticsCenter();
      }
    },
    methods: {
      getTimeTitle: function (item) {
        return item.transportationMeansId === '0' ? item.bizType === '2-1' ? '预计出库' : '预计送货'
          : item.transportationMeansId === '1' ? '预计提货'
            : item.transportationMeansId === '2' ? '预计发货' : '';
      },
//      getWarehouseAdress: function (item) { // 得到仓库地址
//        return utils.formatAddress(item.province, item.city, item.region).split('/').join('') + item.detail;
//      },
      searchWarehouses() {
        if (!this.currentOrder.customerId) {
          this.warehouses = [];
          return;
        }
        Address.queryAddress(this.currentOrder.customerId, {
          deleteFlag: false,
          auditedStatus: '1',
          orgId: this.currentOrder.customerId, status: 0
        }).then(res => {
          this.warehouses = res.data || [];
        });
      },
      filterLogisticsCenter: function () {// 过滤物流中心
        let param = {
          deleteFlag: false
        };
        LogisticsCenter.query(param).then(res => {
          this.LogisticsCenter = res.data;
        });
      },
      changeExpectedTime: function (date) {// 格式化日期
        if (!date) {
          this.currentOrder.expectedTime = '';
          return;
        }
        this.currentOrder.expectedTime = this.$moment(date).format('YYYY-MM-DD');
      },
      getOrderStatus: function (order) { // 获取订单状态
        let state = '';
        for (let key in utils.outReturnOrderType) {
          if (order.state === utils.outReturnOrderType[key].state) {
            state = utils.outReturnOrderType[key].title;
          }
        }
        return state;
      },
      getWarehouseAdress: function (item) { // 得到仓库地址
        if (!item.warehouseAddress) {
          return '';
        }
        return item.warehouseAddress;
      }
    }
  };
</script>
