<template>
  <div>
    <div v-if="!currentOrder.id">
      <oms-loading :loading="!currentOrder.id"></oms-loading>
    </div>
    <div v-else="" class="page-main-body padding">
      <el-row style="margin-bottom:0;position: relative" v-show=" currentOrder.bizType !== '2' ">
        <el-col :span="12">
          <oms-row label="货主订单号">
            {{currentOrder.orderNo}}
          </oms-row>
          <oms-row label="货主">
            {{currentOrder.orgName}}
          </oms-row>
          <oms-row label="去向单位" v-show=" currentOrder.bizType !== '3' ">
            {{currentOrder.customerName}}
          </oms-row>
          <oms-row label="去向单位仓库地址">
            {{currentOrder.warehouseAddress}}
          </oms-row>
          <oms-row label="运输条件">
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
            {{ getCurrentOrderStatus(currentOrder.state) }}
          </oms-row>
        </el-col>
      </el-row>
      <div v-show=" currentOrder.bizType === '2' ">
        <el-row style="margin-bottom: 0">
          <oms-row label="货主订单号" :span="5">{{ currentOrder.orderNo }}</oms-row>
        </el-row>
        <el-row style="margin-bottom:0">
          <el-col :span="12">
            <oms-row label="货主">
              {{currentOrder.orgName}}
            </oms-row>
            <oms-row label="业务类型">
              <dict :dict-group="'bizOutType'" :dict-key="currentOrder.bizType"></dict>
            </oms-row>
          </el-col>
          <el-col :span="12">
            <oms-row label="下单时间">
              <span class="goods-span">{{currentOrder.createTime | date}}</span>
            </oms-row>
            <oms-row label="订单状态">
              {{ getCurrentOrderStatus(currentOrder.state) }}
            </oms-row>
          </el-col>
        </el-row>
      </div>
      <el-row v-show="currentOrder.remark">
        <oms-row label="备注" :span="5">{{ currentOrder.remark }}</oms-row>
      </el-row>

      <hr class="hr"/>
      <table class="table no-border table-product-list" v-show="currentOrder.detailDtoList">
        <thead>
        <tr>
          <td></td>
          <td>货品</td>
          <td class="text-center">生产厂商</td>
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
          <td width="240px">
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
          <td class="text-center" width="180px">
            {{item.orgGoodsDto.goodsDto.factoryName}}
          </td>
          <td width="100px" class="text-center">
            {{item.amount}}
            <dict :dict-group="'measurementUnit'" :dict-key="item.orgGoodsDto.goodsDto.measurementUnit"></dict>
          </td>
          <td class="text-center">
            <span v-show="item.unitPrice">¥</span>{{ item.amount * item.unitPrice | formatMoney }}
          </td>
        </tr>
        <tr class="text-center">
          <td colspan="4"></td>
          <td colspan="2" align="right"><span style="font-weight:600;"
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
    methods: {
      getCurrentOrderStatus: function (state) {
        let retstate = '';
        for (let key in utils.outOrderType) {
          if (state === utils.outOrderType[key].state) {

            retstate = utils.outOrderType[key].title;
          }
        }
        return retstate;
      },
      getTimeTitle: function (item) {
        let title = '';
        switch (item.transportationMeansId) {
          case '0': {
            title = '预计送货';
            if (item.bizType === '1') {
              title = '预计出库';
            }
            break;
          }
          case '1': {
            title = '预计提货';
            break;
          }
          case '2': {
            title = '预计发货';
            break;
          }
        }
        if (item.bizType === '2') {
          title = '';
        }
        return title;
      }
    }
  };
</script>
