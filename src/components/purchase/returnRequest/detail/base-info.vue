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
            <oms-row label="退后申请单号" :span="span">
              {{currentOrder.id}}
            </oms-row>
            <oms-row label="退货单位" :span="span">
              {{currentOrder.povName}}
            </oms-row>
            <oms-row label="供货单位" :span="span">
              {{currentOrder.cdcName}}
            </oms-row>
            <oms-row label="到货需求日期" :span="8">
              <span class="goods-span">{{currentOrder.demandTime | date}}</span>
            </oms-row>
            <oms-row label="退货单位仓库地址" :span="10">
              <span class="goods-span">{{currentOrder.warehouseAddress}}</span>
            </oms-row>
            <oms-row label="关联采购退货订单" :span="10" v-show="currentOrder.orderNo">
              {{currentOrder.orderNo}}
            </oms-row>
            <oms-row label="关联疾控销售退货订单" :span="10" v-show="currentOrder.orgOrderNo">
              {{currentOrder.orgOrderNo}}
            </oms-row>
            <oms-row label="是否合格" :span="span">
              <span class="goods-span" v-show="currentOrder.qualityFlag">合格</span>
              <span class="goods-span" v-show="!currentOrder.qualityFlag">不合格</span>
            </oms-row>
            <oms-row label="状态" :span="span">
              {{ getOrderStatus(currentOrder) }}
              <order-push-status :status="currentOrder.pushStatus" :msg="currentOrder.pushMessage"/>
            </oms-row>
            <el-row v-show="currentOrder.remark" :span="span">
              <oms-row label="备注" :span="4">{{ currentOrder.remark }}</oms-row>
            </el-row>
          </el-col>
          <el-col :span="12">
            <oms-row label="订单类型">
              <dict dict-group="orderGoodsType" :dict-key="'' + currentOrder.goodsType"></dict>
            </oms-row>
            <oms-row label="物流方式">
              <dict :dict-group="'outTransportMeans'" :dict-key="currentOrder.transportationMeansId"></dict>
            </oms-row>
            <oms-row label="运输条件">
              <dict :dict-group="'transportationCondition'" :dict-key="currentOrder.transportationConditionId"></dict>
            </oms-row>
            <oms-row label="申请人">
              <span class="goods-span">{{currentOrder.applyManName}}</span>
            </oms-row>
            <oms-row label="申请时间">
              <span class="goods-span">{{currentOrder.applyTime | time}}</span>
            </oms-row>

            <div v-if="pageType === 'pov'">
              <oms-row label="审批人" v-show="currentOrder.auditManName">
                {{currentOrder.auditManName}}
              </oms-row>
              <oms-row label="审批时间" v-show="currentOrder.auditManName">
                {{currentOrder.auditTime | time}}
              </oms-row>
              <oms-row label="上级单位审批人" v-show="currentOrder.orgAuditManName">
                {{currentOrder.orgAuditManName}}
              </oms-row>
              <oms-row label="上级单位审批时间" v-show="currentOrder.auditManName">
                {{currentOrder.orgAuditTime | time}}
              </oms-row>
            </div>
            <div v-else>
              <oms-row label="审批人" v-show="currentOrder.orgAuditManName">
                {{currentOrder.orgAuditManName}}
              </oms-row>
              <oms-row label="审批时间" v-show="currentOrder.auditManName">
                {{currentOrder.orgAuditTime | time}}
              </oms-row>
            </div>

            <oms-row label="取消原因" v-show="currentOrder.erpStatus === '3'">
              <span class="goods-span">{{currentOrder.cancelReason}}</span>
            </oms-row>
          </el-col>
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
            <td class="text-center">申请退货数量</td>
            <td class="text-center">单价</td>
            <td class="text-center">申请金额</td>
            <td class="text-center">实际退货数量</td>
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
                <el-tooltip class="item" effect="dark"
                            :content="`货主货品编号:${item.orgGoodsDto.goodsNo} 货主疫苗ID:${item.orgGoodsId}`" placement="right">
                  <span style="font-size: 14px;line-height: 20px">{{item.goodsName}}</span>
                </el-tooltip>
              </div>
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
              <div>{{ item.expirationDate | date }}</div>
            </td>
            <td width="70px" class="text-center">
              {{item.applyCount}}
              <dict :dict-group="'measurementUnit'" :dict-key="item.orgGoodsDto.goodsDto.measurementUnit"></dict>
            </td>
            <td width="80px" class="text-center">
              <span v-if="item.price">￥{{item.price | formatMoney}}</span>
              <span v-if="!item.price">-</span>
            </td>
            <td width="80px" class="text-center">
              <span v-if="item.applyMoney">￥{{item.applyMoney | formatMoney}}</span>
              <span v-if="!item.applyMoney">-</span>
            </td>
            <td width="80px" class="text-center">
              {{item.actualCount}}
              <dict :dict-group="'measurementUnit'" :dict-key="item.orgGoodsDto.goodsDto.measurementUnit"></dict>
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
      },
      pageType() {
        return this.$route.meta.type;
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
      getOrderStatus: function (order) { // 获取状态
        let state = '';
        let orgType = utils[this.$route.meta.type === 'pov' ? 'outReturnRequestType' : 'outCdcReturnRequestType'];

        for (let key in orgType) {
          if (order.status + '' === orgType[key].state) {
            state = orgType[key].title;
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
