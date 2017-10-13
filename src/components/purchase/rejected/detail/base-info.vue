<style lang="less" scoped="">
  .R {
    word-wrap: break-word;
    word-break: break-all;
  }

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

      <div v-if="currentOrder.state === '0' " class="confirm-order">
        <el-row style="margin-bottom:0;position: relative" v-show=" currentOrder.bizType !== '2' ">
          <el-col :span="12">
            <oms-row label="货主订单号" :span="span">
              {{currentOrder.orderNo}}
            </oms-row>
            <oms-row label="货主" :span="span">
              {{currentOrder.orgName}}
            </oms-row>
            <oms-row label="销售厂商" :span="span">
              {{currentOrder.customerName}}
            </oms-row>
          </el-col>
          <el-col :span="12">
            <oms-row label="业务类型">
              <dict :dict-group="'bizOutType'" :dict-key="currentOrder.bizType"></dict>
            </oms-row>
            <oms-row label="下单时间">
              <span class="goods-span">{{currentOrder.createTime | date}}</span>
            </oms-row>
            <oms-row label="订单状态">
              {{ getOrderStatus(currentOrder) }}
            </oms-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="text-right" style="line-height: 36px">
            物流方式：
          </el-col>
          <el-col :span="21">
            <el-select type="text" v-model="currentOrder.transportationMeansId" placeholder="请选择物流方式">
              <el-option :value="item.key" :key="item.key" :label="item.label"
                         v-for="item in transportationMeansList"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="text-right" style="line-height: 36px">
            销售厂商仓库：
          </el-col>
          <el-col :span="21">
            <el-select placeholder="请选择销售厂商仓库" v-model="currentOrder.transportationAddress" filterable clearable>
              <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in warehouses">
                <span class="pull-left">{{ item.name }}</span>
                <span class="pull-right" style="color: #999">{{ getWarehouseAdress(item) }}</span>
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="text-right" style="line-height: 36px">
            运输条件：
          </el-col>
          <el-col :span="21">
            <el-select type="text" placeholder="请选择运输条件" v-model="currentOrder.transportationCondition">
              <el-option :value="item.key" :key="item.key" :label="item.label"
                         v-for="item in transportationConditionList"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="text-right" style="line-height: 36px">
            预计出库时间：
          </el-col>
          <el-col :span="21">
            <el-date-picker
              v-model="currentOrder.expectedTime"
              type="date"
              placeholder="请选择日期" format="yyyy-MM-dd"
              @change="changeExpectedTime">
            </el-date-picker>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="text-right" style="line-height: 36px">
            物流中心：
          </el-col>
          <el-col :span="21">
            <el-select placeholder="请选择物流中心" v-model="currentOrder.logisticsCentreId" filterable>
              <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in LogisticsCenter"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="text-right" style="line-height: 36px">
            备注：
          </el-col>
          <el-col :span="21">
            <oms-input type="textarea" v-model="currentOrder.remark" placeholder="请输入备注信息"
                       :autosize="{ minRows: 2, maxRows: 5}"></oms-input>
          </el-col>
        </el-row>
      </div>
      <div v-else="">
        <el-row style="margin-bottom:0;position: relative" v-show=" currentOrder.bizType !== '2' ">
          <el-col :span="12">
            <oms-row label="货主订单号" :span="span">
              {{currentOrder.orderNo}}
            </oms-row>
            <oms-row label="货主" :span="span">
              {{currentOrder.orgName}}
            </oms-row>
            <oms-row label="销售厂商" :span="span">
              {{currentOrder.customerName}}
            </oms-row>
            <oms-row label="销售厂商仓库" :span="span">
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
            <oms-row label="预计出库时间" v-show="currentOrder.expectedTime">
              <span class="goods-span">{{currentOrder.expectedTime | date}}</span>
            </oms-row>
            <oms-row label="订单状态">
              {{ getOrderStatus(currentOrder) }}
            </oms-row>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:0">
          <oms-row label="物流中心" :span="3">
            <span class="goods-span">{{currentOrder.centreName}}</span>
          </oms-row>
        </el-row>
        <el-row v-show="currentOrder.remark">
          <oms-row label="备注" :span="3">{{ currentOrder.remark }}</oms-row>
        </el-row>
      </div>


      <hr class="hr"/>

      <table class="table no-border table-product-list" v-show="currentOrder.detailDtoList">
        <thead>
        <tr>
          <td></td>
          <td>名称</td>
          <td class="text-center">销售厂商</td>
          <td>批号</td>
          <td>生产日期</td>
          <td>有效期</td>
          <td class="text-center">数量</td>
          <td class="text-center">单价</td>
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
            {{item.orgGoodsDto.goodsDto.salesFirmName}}
          </td>
          <td width="80px" class="R">{{ item.batchNumber || '无' }}</td>
          <td>{{ item.productionDate | date }}</td>
          <td>{{ item.expiryDate | date }}</td>
          <td width="100px" class="text-center">
            {{item.amount}}
            <dict :dict-group="'measurementUnit'" :dict-key="item.orgGoodsDto.goodsDto.measurementUnit"></dict>
          </td>
          <td width="80px" class="text-center">
            <span v-show="item.unitPrice">￥{{item.unitPrice}}</span>
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
  import { Address, LogisticsCenter } from '@/resources';

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
        span: 6,
        warehouses: [],
        LogisticsCenter: []
      };
    },
    computed: {
      bizTypeList () {
        return this.$store.state.dict['bizOutType'];
      },
      transportationMeansList () {
        return this.$store.state.dict['outTransportMeans'];
      },
      transportationConditionList () {
        return this.$store.state.dict['transportationCondition'];
      },
      shipmentPackingUnit () {
        return this.$store.state.dict['shipmentPackingUnit'];
      },
      measurementUnitList () {
        return this.$store.state.dict['measurementUnit'];
      },
      orgRelationList () {
        return this.$store.state.dict['orgRelation'];
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
      currentOrder (val) {
        if (!val.id) return;
        this.searchWarehouses();
        this.filterLogisticsCenter();
      }
    },
    methods: {
      getTimeTitle: function (item) {
        return item.transportationMeansId === '0' ? item.bizType === '1' ? '预计出库' : '预计送货'
          : item.transportationMeansId === '1' ? '预计提货'
            : item.transportationMeansId === '2' ? '预计发货' : '';
      },
      getWarehouseAdress: function (item) { // 得到仓库地址
        return utils.formatAddress(item.province, item.city, item.region).split('/').join('') + item.detail;
      },
      searchWarehouses () {
        if (!this.currentOrder.customerId) {
          this.warehouses = [];
          return;
        }
        Address.queryAddress(this.currentOrder.customerId, {
          deleteFlag: false,
          orgId: this.currentOrder.customerId
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
        }
        this.currentOrder.expectedTime = this.$moment(date).format('YYYY-MM-DD');
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
