<style lang="scss" scoped>

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
    <div v-else class="page-main-body padding">
      <div>
        <el-row v-show=" currentOrder.bizType !== '2-2' " style="margin-bottom:0;position: relative">
          <el-col :span="12">
            <oms-row :span="span" label="货主订单号">
              {{currentOrder.orderNo}}
            </oms-row>
            <oms-row :span="span" label="货主">
              {{currentOrder.orgName}}
            </oms-row>
            <oms-row :span="span" label="供货单位">
              {{currentOrder.customerName}}
            </oms-row>
            <oms-row :span="span" label="供货单位仓库">
              {{ getWarehouseAdress(currentOrder)}}
            </oms-row>
            <oms-row :span="span" label="运输条件">
              <dict :dict-group="'transportationCondition'" :dict-key="currentOrder.transportationCondition"></dict>
            </oms-row>
            <oms-row :span="10" label="退货单位仓库地址">
              <span class="goods-span">{{currentOrder.outWarehouseAddress}}</span>
            </oms-row>
            <oms-row :span="span" label="物流商">
              {{currentOrder.logisticsProviderName}}
            </oms-row>
            <oms-row :span="span" label="实际收货人" v-show="currentOrder.actualConsignee">
              {{currentOrder.actualConsignee}}
            </oms-row>
            <el-row v-show="currentOrder.remark" :span="span">
              <oms-row :span="4" label="备注">{{ currentOrder.remark }}</oms-row>
            </el-row>
          </el-col>
          <el-col :span="12">
            <oms-row label="业务类型">
              <dict :dict-group="'bizOutType'" :dict-key="currentOrder.bizType"></dict>
            </oms-row>
            <oms-row label="订单类型">
              <dict :dict-key="'' + currentOrder.goodsType" dict-group="orderGoodsType"></dict>
            </oms-row>
            <oms-row label="物流方式">
              <dict :dict-group="'outTransportMeans'" :dict-key="currentOrder.transportationMeansId"></dict>
            </oms-row>
            <oms-row label="下单时间">
              <span class="goods-span">{{currentOrder.createTime | minute}}</span>
            </oms-row>
            <oms-row v-show="currentOrder.expectedTime" label="预计出库时间">
              <span class="goods-span">{{currentOrder.expectedTime | date}}</span>
            </oms-row>
            <oms-row label="是否合格">
              <span v-show="currentOrder.qualifiedFlag" class="goods-span">合格</span>
              <span v-show="!currentOrder.qualifiedFlag" class="goods-span">不合格</span>
            </oms-row>
            <oms-row label="订单状态">
              {{ getOrderStatus(currentOrder) }}
              <order-push-status :msg="currentOrder.pushMessage" :status="currentOrder.pushStatus"/>
            </oms-row>
            <oms-row v-show="currentOrder.erpStatus === '5'" label="取消原因">
              <span class="goods-span">{{currentOrder.cancelReason}}</span>
            </oms-row>
            <oms-row label="交接时间" v-show="currentOrder.handoverTime">
              {{currentOrder.handoverTime|time}}
            </oms-row>
            <oms-row v-show="currentOrder.returnReason" label="退货原因">
              {{ currentOrder.returnReason }}
            </oms-row>
          </el-col>
        </el-row>
      </div>


      <!--<hr class="hr"/>-->
      <div class="table-product">
        <table v-show="currentOrder.detailDtoList" class="table no-border table-product-list">
          <thead>
          <tr>
            <td></td>
            <td></td>
            <td class="text-center">疫苗</td>
            <td class="text-center">规格</td>
            <!--<td>批号</td>-->
            <td class="text-center">
              生产日期
              <br/>
              有效期至
            </td>
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
              <el-tooltip v-if="$formatPhotoUrl(item)" class="item" effect="light"
                          placement="right" popperClass="el-tooltip">
                <compressed-img :src="$formatPhotoUrl(item) +'?image&action=resize:w_80,h_80,m_2' "
                                class="product-img"/>
                <compressed-img slot="content" :src="$formatPhotoUrl(item) +'?image&action=resize:h_200,m_2' "
                                class="product-img"/>
              </el-tooltip>
              <el-tooltip v-else class="item" effect="light" placement="right" popperClass="el-tooltip">
                <img :src="'../../../../static/img/userpic.png'" class="product-img">
                <img slot="content" :src="'../../../../static/img/userpic.png'" class="product-img">
              </el-tooltip>
            </td>
            <td>
              <div>
                <el-tooltip :content="`货主货品编号:${item.orgGoodsDto.goodsNo} 货主疫苗ID:${item.orgGoodsId}`" class="item"
                            effect="dark" placement="right">
                  <span style="font-size: 14px;line-height: 20px">{{item.name}}</span>
                </el-tooltip>
              </div>
              <div>
                <el-tooltip :content="`疫苗主档编号:${item.orgGoodsDto.goodsDto.code} 疫苗主档ID:${item.goodsId}`" class="item"
                            effect="dark"
                            placement="right">
                  <span style="font-size: 12px;color:#999">{{ item.goodsName }}</span>
                </el-tooltip>
              </div>
              <!--<div>-->
              <!--<el-tooltip class="item" effect="dark" content="疫苗规格" placement="right">-->
              <!--<span style="font-size: 12px;">{{ item.orgGoodsDto.goodsDto.specifications }}</span>-->
              <!--</el-tooltip>-->
              <!--</div>-->
              <div>
                <el-tooltip class="item" content="供货单位" effect="dark" placement="right">
                  <span>{{ item.salesFirmName }}</span>
                </el-tooltip>
              </div>
              <div>
                批号：{{item.batchNumber || '无' }}
                <goods-status-tag :form="currentOrder" :item="item"/>
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
            <td class="text-center" width="70px">
              {{item.amount}}
              <dict :dict-group="'measurementUnit'" :dict-key="item.orgGoodsDto.goodsDto.measurementUnit"></dict>
            </td>
            <td class="text-center" width="80px">
              <span v-if="item.unitPrice">￥{{item.unitPrice | formatMoney}}</span>
              <span v-if="!item.unitPrice">-</span>
            </td>
            <td class="text-center" width="80px">
            <span v-if="item.unitPrice">
            <span>¥</span>{{ item.amount * item.unitPrice | formatMoney }}
            </span>
              <span v-if="!item.unitPrice">-</span>
            </td>
          </tr>
          <tr class="text-center">
            <td align="right" colspan="6">
              <total-count :list="currentOrder.detailDtoList" property="amount"></total-count>
            </td>
            <td align="right" colspan="2">
              <span v-show="currentOrder.totalAmount"
                    style="font-weight:600;">合计金额: ¥  {{ currentOrder.totalAmount | formatMoney
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
    filterLogisticsCenter: function () {// 过滤物流商
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
