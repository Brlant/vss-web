<style scoped="">
  .R {
    word-wrap: break-word;
    word-break: break-all;
  }

  .oms-row {
    margin-bottom: 8px;
  }
</style>
<template>
  <div>
    <div v-if="!currentOrder.id">
      <oms-loading :loading="!currentOrder.id"></oms-loading>
    </div>
    <div v-else="" class="page-main-body padding">
      <el-row style="margin-bottom:0;position: relative" v-show=" currentOrder.bizType !== '2' ">
        <el-col :span="12">
          <oms-row label="货主订单号" :span="span">
            {{currentOrder.orderNo}}
          </oms-row>
          <oms-row label="货主" :span="span">
            {{currentOrder.orgName}}
          </oms-row>
          <oms-row label="POV" :span="span">
            {{currentOrder.customerName}}
          </oms-row>
          <oms-row label="POV仓库" :span="span">
            {{currentOrder.warehouseAddress}}
          </oms-row>
          <oms-row label="运输条件" :span="span">
            <dict :dict-group="'transportationCondition'" :dict-key="currentOrder.transportationCondition"></dict>
          </oms-row>
        </el-col>
        <el-col :span="12">
          <oms-row label="业务类型">
            <dict :dict-group="'bizOutType'" :dict-key="currentOrder.bizType"></dict>
          </oms-row>
          <oms-row label="物流方式">
            <dict :dict-group="'outTransportMeans'" :dict-key="currentOrder.transportationMeansId"></dict>
          </oms-row>
          <oms-row label="下单时间">
            <span class="goods-span">{{currentOrder.createTime | date}}</span>
          </oms-row>
          <oms-row :label="getTimeTitle(currentOrder)" v-show="currentOrder.expectedTime">
            <span class="goods-span">{{currentOrder.expectedTime | date}}</span>
          </oms-row>
          <oms-row label="订单状态">
            {{ getOrderStatus(currentOrder) }}
          </oms-row>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:0">
        <oms-row label="物流中心" :span="4">
          <span class="goods-span">{{currentOrder.centreName}}</span>
        </oms-row>
      </el-row>
      <el-row v-show="currentOrder.remark">
        <oms-row label="备注" :span="4">{{ currentOrder.remark }}</oms-row>
      </el-row>

      <hr class="hr"/>

      <table class="table no-border table-product-list" v-show="currentOrder.detailDtoList">
        <thead>
        <tr>
          <td></td>
          <td>名称</td>
          <td class="text-center">生产厂商</td>
          <td>批号</td>
          <td>生产日期</td>
          <td>有效期</td>
          <td class="text-center">数量</td>
          <td class="text-center">金额</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in currentOrder.detailDtoList" v-if="item.orgGoodsDto">
          <td width="70px">
            <img v-if="item.orgGoodsDto.goodsDto.photo" :src="item.orgGoodsDto.goodsDto.photo "
                 class="product-img">
            <img v-else :src="'../../../../static/img/userpic.png'" class="product-img">
          </td>
          <td width="160px">
            <div>
              <el-tooltip class="item" effect="dark" content="货主货品名称" placement="right">
                <span style="font-size: 14px;line-height: 20px">{{item.name}}</span>
              </el-tooltip>
            </div>
            <div>
              <el-tooltip class="item" effect="dark" content="平台货品名称" placement="right">
                <span style="font-size: 12px;color:#999">{{ item.orgGoodsDto.goodsDto.name }}</span>
              </el-tooltip>
            </div>
            <div>
              <el-tooltip class="item" effect="dark" content="货品规格" placement="right">
                <span style="font-size: 12px;">{{ item.orgGoodsDto.goodsDto.specifications }}</span>
              </el-tooltip>
            </div>
          </td>
          <td class="text-center" width="140px">
            {{item.orgGoodsDto.goodsDto.factoryName}}
          </td>
          <td width="80px" class="R">{{ item.batchNumber || '无' }}</td>
          <td>{{ item.productionDate | date }}</td>
          <td>{{ item.expiryDate | date }}</td>
          <td width="100px" class="text-center">
            {{item.amount}}
            <dict :dict-group="'measurementUnit'" :dict-key="item.orgGoodsDto.goodsDto.measurementUnit"></dict>
          </td>
          <td class="text-center">
            <span v-show="item.unitPrice">¥</span>{{ item.amount * item.unitPrice | formatMoney }}
          </td>
        </tr>
        <tr class="text-center">
          <td colspan="5"></td>
          <td colspan="3" align="right"><span style="font-weight:600;"
                                              v-show="currentOrder.totalAmount">合计: ¥  {{ currentOrder.totalAmount | formatMoney
            }}</span>
          </td>
        </tr>
        </tbody>
      </table>

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
    data () {
      return {
        span: 8
      };
    },
    methods: {
      getTimeTitle: function (item) {
        return item.transportationMeansId === '0' ? item.bizType === '1' ? '预计出库' : '预计送货'
          : item.transportationMeansId === '1' ? '预计提货'
            : item.transportationMeansId === '2' ? '预计发货' : '';
      },
      getOrderStatus: function (order) { // 获取订单状态
        let state = '';
        for (let key in utils.outOrderType) {
          if (order.state === utils.outOrderType[key].state) {
            state = utils.outOrderType[key].title;
          }
        }
        return state;
      }

    }
  };
</script>
