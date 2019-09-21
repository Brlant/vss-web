<style scoped="">
  .oms-row {
    margin-bottom: 10px;
  }
</style>
<template>
  <div>
    <div v-if="!currentOrder.id">
      <oms-loading :loading="!currentOrder.id"></oms-loading>
    </div>
    <div v-else="" class="page-main-body padding">

      <el-row style="margin-bottom: 0">
        <oms-row label="货主订单号" :span="4">{{ currentOrder.orderNo }}</oms-row>
      </el-row>
      <el-row style="margin-bottom:0">
        <el-col :span="12">
          <oms-row label="货主" :span="span">
            {{currentOrder.orgName}}
          </oms-row>
          <oms-row label="物流商" :span="span"
                   v-show="currentOrder.transportationMeansId === '1' || currentOrder.transportationMeansId === '3'  ">
            {{currentOrder.logisticsProviderName}}
          </oms-row>
          <oms-row label="提货地址" v-show="currentOrder.transportationMeansId === '2'" :span="span">
            {{currentOrder.pickUpWarehouseAddress}}
          </oms-row>
          <oms-row label="运输条件" :span="span">
            <dict :dict-group="'transportationCondition'" :dict-key="currentOrder.transportationCondition"></dict>
          </oms-row>
          <oms-row label="疾控仓库地址" :span="span">
            <span class="goods-span">{{ currentOrder.warehouseAddress}}</span>
          </oms-row>
          <oms-row label="订单状态" :span="span">
            {{ getCurrentOrderStatus(currentOrder.state) }}
            <order-push-status :status="currentOrder.pushStatus" :msg="currentOrder.pushMessage"/>
          </oms-row>
        </el-col>
        <el-col :span="12">
          <oms-row label="业务类型">
            <dict :dict-group="'bizInType'" :dict-key="currentOrder.bizType"></dict>
          </oms-row>
          <oms-row label="订单类型">
            <dict dict-group="orderGoodsType" :dict-key="'' + currentOrder.goodsType"></dict>
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
        </el-col>
      </el-row>
      <el-row v-show="currentOrder.remark">
        <oms-row label="备注" :span="4">{{ currentOrder.remark }}</oms-row>
      </el-row>
      <!--<hr class="hr"/>-->
      <div class="table-product">
        <table class="table no-border table-product-list" v-show="currentOrder.detailDtoList">
          <thead>
          <tr>
            <td></td>
            <td></td>
            <td class="text-center">疫苗</td>
            <td class="text-center">规格</td>
            <td class="text-center">单价</td>
            <td class="text-center">数量</td>
            <td class="text-center">金额</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in currentOrder.detailDtoList" v-if="item.orgGoodsDto">
            <td width="10">{{index + 1}}</td>
            <td width="70px">
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
                <el-tooltip class="item" effect="dark"
                            :content="`货主疫苗编码:${item.orgGoodsDto.goodsNo} 货主疫苗ID:${item.orgGoodsId}`" placement="right">
                  <span style="font-size: 14px;line-height: 20px">{{item.name}}</span>
                </el-tooltip>
              </div>
              <div>
                <el-tooltip class="item" effect="dark"
                            :content="`疫苗主档编号:${item.orgGoodsDto.goodsDto.code} 疫苗主档ID:${item.goodsId}`"
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
                <el-tooltip class="item" effect="dark" content="供货单位" placement="right">
                  <span>{{ item.salesFirmName }}</span>
                </el-tooltip>
              </div>
            </td>
            <td class="text-center" width="70px">
              <span>{{ item.orgGoodsDto.goodsDto.specifications }}</span>
            </td>
            <td width="80px" class="text-center">
              <span v-if="item.unitPrice">￥{{item.unitPrice | formatMoney}}</span>
              <span v-if="!item.unitPrice">-</span>
            </td>
            <td width="100px" class="text-center">
              {{item.amount}}
              <dict :dict-group="'measurementUnit'" :dict-key="item.orgGoodsDto.goodsDto.measurementUnit"></dict>
            </td>
            <td class="text-center">
            <span v-if="item.unitPrice">
              <span>¥</span>{{ item.amount * item.unitPrice | formatMoney }}
            </span>
              <span v-if="!item.unitPrice">-</span>
            </td>
          </tr>
          <tr class="text-center">
            <td colspan="5" align="right">
              <total-count property="amount" :list="currentOrder.detailDtoList"></total-count>
            </td>
            <td colspan="2" align="right">
            <span style="font-weight:600;"
                  v-show="currentOrder.totalAmount">合计: ¥  {{ currentOrder.totalAmount | formatMoney}}</span>
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
