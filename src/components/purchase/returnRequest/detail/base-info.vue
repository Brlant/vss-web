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
        <el-row v-show=" currentOrder.bizType !== '2-2' " style="margin-bottom:0;position: relative">
          <el-col :span="12">
            <oms-row :span="span" label="退货申请单号">
              {{ currentOrder.id }}
            </oms-row>
            <oms-row :span="span" label="退货单位">
              {{ currentOrder.povName }}
            </oms-row>
            <oms-row :span="span" label="供货单位">
              {{ currentOrder.cdcName }}
            </oms-row>
            <oms-row :span="8" label="预计退货日期">
              <span class="goods-span">{{ currentOrder.demandTime | date }}</span>
            </oms-row>
            <oms-row :span="10" label="退货单位仓库地址">
              <span class="goods-span">{{ currentOrder.warehouseAddress }}</span>
            </oms-row>
            <oms-row v-show="currentOrder.orderNo" :span="10" label="关联采购退货订单">
              {{ currentOrder.orderNo }}
            </oms-row>
            <oms-row v-show="currentOrder.orgOrderNo" :span="11" label="关联疾控销售退货订单">
              {{ currentOrder.orgOrderNo }}
            </oms-row>
            <oms-row :span="span" label="是否合格">
              <span v-show="currentOrder.qualityFlag" class="goods-span">合格</span>
              <span v-show="!currentOrder.qualityFlag" class="goods-span">不合格</span>
            </oms-row>
            <oms-row :span="span" label="状态">
              {{ getOrderStatus(currentOrder) }}
              <order-push-status :msg="currentOrder.pushMessage" :status="currentOrder.pushStatus"/>
            </oms-row>
            <el-row v-show="currentOrder.remark" :span="span">
              <oms-row :span="8" label="备注">{{ currentOrder.remark }}</oms-row>
            </el-row>
          </el-col>
          <el-col :span="12">
            <oms-row label="订单类型">
              <dict :dict-key="'' + currentOrder.goodsType" dict-group="orderGoodsType"></dict>
            </oms-row>
            <oms-row label="物流方式">
              <dict :dict-group="'outTransportMeans'" :dict-key="currentOrder.transportationMeansId"></dict>
            </oms-row>
            <oms-row label="运输条件">
              <dict :dict-group="'transportationCondition'" :dict-key="currentOrder.transportationConditionId"></dict>
            </oms-row>
            <oms-row label="申请人">
              <span class="goods-span">{{ currentOrder.applyManName }}</span>
            </oms-row>
            <oms-row label="申请时间">
              <span class="goods-span">{{ currentOrder.applyTime | time }}</span>
            </oms-row>

            <div v-if="pageType === 'pov'">
              <oms-row v-show="currentOrder.auditManName" label="审批人">
                {{ currentOrder.auditManName }}
              </oms-row>
              <oms-row v-show="currentOrder.auditTime" label="审批时间">
                {{ currentOrder.auditTime | time }}
              </oms-row>
              <oms-row v-show="currentOrder.orgAuditManName" label="上级单位审批人">
                {{ currentOrder.orgAuditManName }}
              </oms-row>
              <oms-row v-show="currentOrder.orgAuditTime" label="上级单位审批时间">
                {{ currentOrder.orgAuditTime | time }}
              </oms-row>
            </div>
            <div v-else>
              <oms-row v-show="currentOrder.orgAuditManName" label="审批人">
                {{ currentOrder.orgAuditManName }}
              </oms-row>
              <oms-row v-show="currentOrder.orgAuditTime" label="审批时间">
                {{ currentOrder.orgAuditTime | time }}
              </oms-row>
            </div>

            <oms-row v-show="currentOrder.erpStatus === '3'" label="取消原因">
              <span class="goods-span">{{ currentOrder.cancelReason }}</span>
            </oms-row>
          </el-col>
        </el-row>

        <el-row v-show="[0,1,4].indexOf(currentOrder.status)!==-1">
          <el-col :span="24">
            <oms-row label="附件" :span="4" v-show="formType==='pov'">
              <oms-upload :fileList="attachmentList"
                          :formData="{ objectId: currentOrder.id, objectType: 'returnApplicationFile'}"
                          @change="changeFiles"></oms-upload>
            </oms-row>
            <oms-row label="附件" :span="4" v-show="formType==='cdc'">
              <attachment-lists :attachmentIdList="attachmentList" :objectId="currentOrder.id"
                                :objectType="'returnApplicationFile'"
                                :permission="'show'"></attachment-lists>
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
              生产日期<br/>
              有效期至
            </td>
            <!--<td>有效期</td>-->
            <td class="text-center">申请退货<br/>数量</td>
            <td class="text-center">单价</td>
            <td class="text-center">申请金额</td>
            <td class="text-center">实际退货<br/>数量</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in currentOrder.detailDtoList" v-if="item.orgGoodsDto">
            <td width="10">{{ index + 1 }}</td>
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
                  <span style="font-size: 14px;line-height: 20px">{{ item.goodsName }}</span>
                </el-tooltip>
              </div>
              <div>
                <el-tooltip class="item" content="供货单位" effect="dark" placement="right">
                  <span>{{ item.salesFirmName }}</span>
                </el-tooltip>
              </div>
              <div v-if="item.orgGoodsDataDto.orgGoodsDto.goodsDto">
                <el-tooltip class="item" content="生产单位" effect="dark" placement="right">
                  <span class="font-gray">{{ item.orgGoodsDataDto.orgGoodsDto.goodsDto.factoryName }}</span>
                </el-tooltip>
              </div>
              <div>
                批号：{{ item.batchNumber || '无' }}
                <goods-status-tag :form="currentOrder" :item="item"/>
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
            <td class="text-center" width="70px">
              {{ item.applyCount }}
              <dict :dict-group="'measurementUnit'" :dict-key="item.orgGoodsDto.goodsDto.measurementUnit"></dict>
            </td>
            <td class="text-center" width="80px">
              <span v-if="item.price">￥{{ item.price | formatMoney }}</span>
              <span v-if="!item.price">-</span>
            </td>
            <td class="text-center" width="80px">
              <span v-if="item.applyMoney">￥{{ item.applyMoney | formatMoney }}</span>
              <span v-if="!item.applyMoney">-</span>
            </td>
            <td class="text-center" width="80px">
              {{ item.actualCount }}
              <dict :dict-group="'measurementUnit'" :dict-key="item.orgGoodsDto.goodsDto.measurementUnit"></dict>
            </td>
          </tr>
          <tr class="text-center">
            <td align="right" colspan="6">
              <total-count :list="currentOrder.detailDtoList" property="amount"></total-count>
            </td>
            <td align="right" colspan="2">
              <span v-show="currentOrder.totalAmount"
                    style="font-weight:600;">合计金额: ¥  {{
                  currentOrder.totalAmount | formatMoney
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
import {Address, OmsAttachment, LogisticsCenter} from '@/resources';
import attachmentLists from '@/components/common/attachmentList.vue';

export default {
  components: {
    attachmentLists
  },
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
      LogisticsCenter: [],
      attachmentList: [],
      formType: this.$route.meta.type
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
      this.queryAttachmentList();
    }
  },
  methods: {
    queryAttachmentList: function () {// 附件管理
      if (!this.currentOrder.id) return;
      OmsAttachment.queryOneAttachmentList(this.currentOrder.id, 'returnApplicationFile').then(res => {
        this.attachmentList = res.data;
      });
    },
    changeFiles: function (fileList) {
      let ids = [];
      fileList.forEach(file => {
        ids.push(file.attachmentId);
      });
      this.form.fileIdList = ids;
    },
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
