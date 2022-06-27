<style scoped>
.oms-row {
  margin-bottom: 10px;
}
</style>
<template>
  <div>
    <div v-if="!currentOrder.id">
      <oms-loading :loading="!currentOrder.id"></oms-loading>
    </div>
    <div v-else class="page-main-body padding">

      <el-row style="margin-bottom: 0">
        <oms-row :span="4" label="货主订单号">{{ currentOrder.orderNo }}</oms-row>
      </el-row>
      <el-row style="margin-bottom:0">
        <el-col :span="12">
          <oms-row :span="span" label="货主">
            {{currentOrder.orgName}}
          </oms-row>
          <oms-row :span="span" label="退货单位">
            {{currentOrder.supplierName}}
          </oms-row>
          <oms-row v-show="currentOrder.transportationMeansId === '1' || currentOrder.transportationMeansId === '3'  " :span="span"
                   label="物流商">
            {{currentOrder.logisticsProviderName}}
          </oms-row>
          <oms-row v-show="currentOrder.transportationMeansId === '2'" :span="span" label="提货地址">
            {{currentOrder.pickUpWarehouseAddress}}
          </oms-row>
          <oms-row v-show="currentOrder.transportationMeansId === '2' && currentOrder.actualConsignee" :span="span"
                   label="申请人">
            {{currentOrder.actualConsignee}}
          </oms-row>
          <oms-row :span="span" label="运输条件">
            <dict :dict-group="'transportationCondition'" :dict-key="currentOrder.transportationCondition"></dict>
          </oms-row>
          <oms-row :span="span" label="仓库地址">
            <span class="goods-span">{{ getWarehouseAdress(currentOrder)}}</span>
          </oms-row>
          <oms-row :span="span" label="订单状态">
            {{ getCurrentOrderStatus(currentOrder.state) }}
            <order-push-status :msg="currentOrder.pushMessage" :status="currentOrder.pushStatus"/>
          </oms-row>
          <oms-row v-show="currentOrder.erpStatus === '9'" :span="span" label="取消原因">
            <span class="goods-span">{{currentOrder.cancelReason}}</span>
          </oms-row>
          <oms-row v-show="currentOrder.thirdPartyNumber && currentOrder.transportationMeansId === '4'" :span="span"
                   label="来自销售订单">
            {{ currentOrder.thirdPartyNumber }}
          </oms-row>
          <oms-row v-show="currentOrder.returnReason" :span="span" label="退货原因">
            {{ currentOrder.returnReason }}
          </oms-row>
        </el-col>
        <el-col :span="12">
          <oms-row label="业务类型">
            <dict :dict-group="'bizInType'" :dict-key="currentOrder.bizType"></dict>
          </oms-row>
          <oms-row label="订单类型">
            <dict :dict-key="'' + currentOrder.goodsType" dict-group="orderGoodsType"></dict>
          </oms-row>
          <oms-row label="下单时间">
            <span class="goods-span">{{currentOrder.createTime | minute}}</span>
          </oms-row>
          <oms-row label="物流方式">
            <dict :dict-group="'transportationMeans'" :dict-key="currentOrder.transportationMeansId"></dict>
          </oms-row>
          <oms-row label="物流中心">
            <span class="goods-span">{{currentOrder.centreName}}</span>
          </oms-row>
          <oms-row label="预计入库时间">
            <span class="goods-span">{{currentOrder.expectedTime | date}}</span>
          </oms-row>
          <oms-row label="是否合格">
            <span v-show="currentOrder.qualifiedFlag" class="goods-span">合格</span>
            <span v-show="!currentOrder.qualifiedFlag" class="goods-span">不合格</span>
          </oms-row>
        </el-col>
      </el-row>
      <el-row v-show="currentOrder.remark">
        <oms-row :span="4" label="备注">{{ currentOrder.remark }}</oms-row>
      </el-row>
      <!--<hr class="hr"/>-->
      <div class="table-product">
        <table v-show="currentOrder.detailDtoList" class="table no-border table-product-list">
          <thead>
          <tr>
            <td></td>
            <td></td>
            <td class="text-center">疫苗</td>
            <td class="text-center">规格</td>
            <td class="text-center">生产/有效日期</td>
            <!--<td class="text-center">供货单位</td>-->
            <!--<td>批号</td>-->
            <!--<td style="width: 80px">生产日期</td>-->
            <!--<td style="width: 80px">有效期</td>-->
            <td class="text-center">数量</td>
            <td class="text-center">单价</td>
            <td class="text-center">金额</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in currentOrder.detailDtoList" v-if="item.orgGoodsDto">
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
                批号：{{ item.batchNumber || '无' }}
                <!--<el-tag v-show="item.inEffectiveFlag" type="warning">近效期</el-tag>-->
                <goods-status-tag :form="currentOrder" :item="item"/>
              </div>
            </td>
            <!--<td class="text-center" width="160px">-->
            <!--{{item.salesFirmName}}-->
            <!--</td>-->
            <!--<td width="80px" class="R">-->
            <!--{{ item.batchNumber || '无' }}-->
            <!--<el-tag v-show="item.inEffectiveFlag" type="warning">近效期</el-tag>-->
            <!--</td>-->
            <td class="text-center" width="70px">
              <span>{{ item.orgGoodsDto.goodsDto.specifications }}</span>
            </td>
            <td class="text-center">
              <div>{{ item.productionDate | date }}</div>
              <div>{{ item.expiryDate | date }}</div>
            </td>
            <!--<td>{{ item.expiryDate | date }}</td>-->
            <td class="text-center" width="100px">
              {{item.amount}}
              <dict :dict-group="'measurementUnit'" :dict-key="item.orgGoodsDto.goodsDto.measurementUnit"></dict>
            </td>
            <td class="text-center" width="80px">
              <span v-if="item.unitPrice">￥{{item.unitPrice | formatMoney}}</span>
              <span v-if="!item.unitPrice">-</span>
            </td>
            <td class="text-center">
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
                    style="font-weight:600;">合计金额: ¥  {{ currentOrder.totalAmount | formatMoney}}</span>
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
      span: 8
    };
  },
  methods: {
    getCurrentOrderStatus: function (state) {// 获取订单状态
      let retstate = '';
      for (let key in utils.inOrderType) {
        if (state === utils.inOrderType[key].state) {
          retstate = utils.inOrderType[key].title;
        }
      }
      return retstate;
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
