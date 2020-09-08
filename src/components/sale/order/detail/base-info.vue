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

      <div v-if="currentOrder.state === '0' " class="confirm-order">
        <el-row v-show=" currentOrder.bizType !== '2-2' " style="margin-bottom:0;position: relative">
          <el-col :span="12">
            <oms-row :span="span" label="货主订单号">
              {{currentOrder.orderNo}}
            </oms-row>
            <oms-row :span="span" label="货主">
              {{currentOrder.orgName}}
            </oms-row>
            <oms-row :span="span" label="收货单位">
              {{currentOrder.customerName}}
            </oms-row>
          </el-col>
          <el-col :span="12">
            <oms-row label="业务类型">
              <dict :dict-group="'bizOutType'" :dict-key="currentOrder.bizType"></dict>
            </oms-row>
            <oms-row label="下单时间">
              <span class="goods-span">{{currentOrder.createTime | minute}}</span>
            </oms-row>
            <oms-row label="订单状态">
              {{ getOrderStatus(currentOrder) }}
            </oms-row>
          </el-col>
        </el-row>
        <el-form ref="orderAddForm" :model="currentOrder" :rules="rules"
                 label-width="160px" style="padding-right: 20px">
          <el-form-item label="物流方式" prop="transportationMeansId">
            <el-select v-model="currentOrder.transportationMeansId" placeholder="请选择物流方式" type="text">
              <el-option v-for="item in transportationMeansList" :key="item.key" :label="item.label"
                         :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收货地址" prop="transportationAddress">
            <el-select v-model="currentOrder.transportationAddress" clearable
                       filterable
                       placeholder="请选择收货单位收货地址" @change="changeWarehouseAdress">
              <el-option v-for="item in warehouses" :key="item.id" :label="filterAddressLabel(item)" :value="item.id">
                <span class="pull-left">{{ item.name }}</span>
                <span class="pull-right" style="color: #999">{{ getWarehouseAdress(item) }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实际收货人">
            <oms-input v-model="currentOrder.actualConsignee" :maxlength="50" placeholder="请输入实际收货人"
                       type="text"></oms-input>
          </el-form-item>
          <el-form-item label="收货人联系电话">
            <oms-input v-model="currentOrder.consigneePhone" :maxlength="50" placeholder="请输入收货人联系电话"
                       type="text"></oms-input>
          </el-form-item>
          <el-form-item label="运输条件" prop="transportationCondition">
            <el-select v-model="currentOrder.transportationCondition" placeholder="请选择运输条件" type="text">
              <el-option v-for="item in transportationConditionList" :key="item.key" :label="item.label"
                         :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预计送货时间" prop="transportationMeansId">
            <el-date-picker
              v-model="currentOrder.expectedTime"
              :picker-options="pickerOptions" format="yyyy-MM-dd" placeholder="请选择日期"
              value-format="timestamp">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="发货地址" prop="orgAddress">
            <el-select v-model="currentOrder.orgAddress" :clearable="true" filterable placeholder="请选择发货地址"
                       @change="transportationAddressChange">
              <el-option v-for="item in LogisticsCenter" :key="item.id" :label="filterAddressLabel(item)"
                         :value="item.id">
                <span class="pull-left">{{ item.name }}</span>
                <span class="pull-right" style="color: #999">{{ getWarehouseAdress(item) }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物流商">
            <oms-input v-model="currentOrder.logisticsProviderName" placeholder="请输入物流商"></oms-input>
          </el-form-item>
          <material-part v-if="vaccineType === '1'" @changeRemark="changeRemark"></material-part>
          <el-form-item class="clearfix" label="备注">
            <oms-input v-model="currentOrder.remark" :autosize="{ minRows: 2, maxRows: 5}" placeholder="请输入备注信息"
                       type="textarea"></oms-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-else="">
        <el-row v-show=" currentOrder.bizType !== '2-2' " style="margin-bottom:0;position: relative">
          <el-col :span="12">
            <oms-row :span="span" label="货主订单号">
              {{currentOrder.orderNo}}
            </oms-row>
            <oms-row :span="span" label="货主">
              {{currentOrder.orgName}}
            </oms-row>
            <oms-row :span="span" label="收货单位">
              {{currentOrder.customerName}}
            </oms-row>
            <oms-row :span="span" label="收货地址">
              {{currentOrder.warehouseAddress}}
            </oms-row>
            <oms-row :span="span" label="物流商">
              <span class="goods-span">
                {{currentOrder.logisticsProviderName}}
              </span>
            </oms-row>
            <oms-row :span="span" label="实际收货人">
              <span class="goods-span">{{currentOrder.actualConsignee}}</span>
            </oms-row>
            <oms-row :span="span" label="收货人联系电话">
              <span class="goods-span">{{currentOrder.consigneePhone}}</span>
            </oms-row>
            <oms-row :span="span" label="运输条件">
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
              <span class="goods-span">{{currentOrder.createTime | minute}}</span>
            </oms-row>
            <oms-row v-show="currentOrder.expectedTime" :label="getTimeTitle(currentOrder)">
              <span class="goods-span">{{currentOrder.expectedTime | date}}</span>
            </oms-row>
            <oms-row label="订单状态">
              {{ getOrderStatus(currentOrder) }}
              <order-push-status :msg="currentOrder.pushMessage" :status="currentOrder.pushStatus"/>
            </oms-row>
            <oms-row v-show="currentOrder.erpStatus === '5'" label="取消原因">
              <span class="goods-span">{{currentOrder.cancelReason}}</span>
            </oms-row>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:0">
          <oms-row :span="4" label="发货地址">
            <span class="goods-span">{{currentOrder.outWarehouseAddress}}</span>
          </oms-row>
        </el-row>
        <el-row v-show="currentOrder.remark">
          <oms-row :span="3" label="备注">{{ currentOrder.remark }}</oms-row>
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
            <td class="text-center">批号</td>
            <!--<td>生产日期</td>-->
            <td class="text-center">有效期</td>
            <td v-show="vaccineType==='2'" class="text-center">单价</td>
            <td class="text-center">数量</td>
            <td v-show="vaccineType==='2'" class="text-center">金额</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in currentOrder.detailDtoList" v-if="item.orgGoodsDto">
            <td width="10">{{index + 1}}</td>
            <td width="80">
              <el-tooltip v-if="$formatPhotoUrl(item)" class="item" effect="light"
                          placement="right" popperClass="el-tooltip">
                <compressed-img :src="$formatPhotoUrl(item) +'?image&action=resize:h_80,w_80,m_2' "
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
              <div>
                <el-tooltip class="item" content="疫苗规格" effect="dark" placement="right">
                  <span style="font-size: 12px;">{{ item.orgGoodsDto.goodsDto.specifications }}</span>
                </el-tooltip>
              </div>
            </td>
            <td class="R text-center" width="100px">
              {{ item.batchNumber || '无' }}
              <!--<el-tag v-show="item.inEffectiveFlag" type="warning">近效期</el-tag>-->
              <goods-status-tag :form="currentOrder" :item="item"/>
            </td>
            <!--<td>{{ item.productionDate | date }}</td>-->
            <td class="text-center" width="90px">{{ item.expiryDate | date }}</td>
            <td v-show="vaccineType==='2'" class="text-center" width="80px">
              <span v-if="item.unitPrice">￥{{item.unitPrice | formatMoney}}</span>
              <span v-if="!item.unitPrice">-</span>
            </td>
            <td class="text-center" width="80px">
              {{item.amount}}
              <dict :dict-group="'measurementUnit'" :dict-key="item.orgGoodsDto.goodsDto.measurementUnit"></dict>
            </td>
            <td v-show="vaccineType==='2'" class="text-center">
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
            <td v-show="vaccineType==='2'" align="right" colspan="2">
            <span v-show="currentOrder.totalAmount"
                  style="font-weight:600;">合计: ¥  {{ currentOrder.totalAmount | formatMoney
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
import {Address} from '@/resources';
import materialPart from '../material.vue';

export default {
  components: {materialPart},
  props: {
    currentOrder: {
      type: Object,
      default: function () {
        return {};
      }
    },
    isCheck: Boolean,
    vaccineType: String
  },
  data() {
    return {
      span: 8,
      warehouses: [],
      LogisticsCenter: [],
      warehouseTypeList: this.$store.state.warehouseType,
      rules: {
        transportationMeansId: [
          {required: true, message: '请选择物流方式', trigger: 'change'}
        ],
        transportationAddress: [
          {required: true, message: '请选择收货单位收货地址', trigger: 'change'}
        ],
        orgAddress: [
          {required: true, message: '请选择发货地址', trigger: 'change'}
        ],
        transportationCondition: [
          {required: true, message: '请选择运输条件', trigger: 'blur'}
        ],
        expectedTime: [
          {required: true, message: '请选择日期', trigger: 'change'}
        ],
        remark: [
          {required: true, message: '请输入备注信息', trigger: 'blur'}
        ]
      },
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() < this.$moment().subtract(1, 'days');
        }
      }
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
      if (val.state === '0') {
        this.searchWarehouses();
        this.filterAddress();
      }
    },
    isCheck(val) {
      if (val) {
        this.check();
      }
    }
  },
  methods: {
    filterAddressLabel(item) {
      let name = item.name ? '【' + item.name + '】' : '';
      return name + item.detail;
    },
    getTimeTitle: function (item) {
      return item.transportationMeansId === '0' ? item.bizType === '2-1' ? '预计出库' : '预计送货'
        : item.transportationMeansId === '1' ? '预计提货'
          : item.transportationMeansId === '2' ? '预计发货' : '';
    },
    getWarehouseAdress: function (item) { // 得到仓库地址
      return item.detail + `（${this.warehouseTypeList[item.warehouseType].label}）`;
    },
    changeRemark(form) {
      if (!this.currentOrder.remark) {
        this.currentOrder.remark = form.count + form.name;
      } else {
        this.currentOrder.remark += '，' + form.count + form.name;
      }
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
    changeWarehouseAdress: function (val) {
      this.currentOrder.actualConsignee = '';
      this.currentOrder.consigneePhone = '';
      this.warehouses.forEach(item => {
        if (val === item.id) {
          this.currentOrder.actualConsignee = item.contact;
          this.currentOrder.consigneePhone = item.consigneePhone;
        }
      });
    },
    transportationAddressChange(val) {
      // 清空物流商
      this.currentOrder.logisticsProvider = '';
      this.currentOrder.logisticsProviderName = '';
      if (!val) return;
      let item = this.LogisticsCenter.find(f => f.id === val);
      if (!item) return;
      this.currentOrder.logisticsProviderName = item.warehouseSourceFirmName;
      this.currentOrder.logisticsProvider = item.warehouseSourceFirm;
    },
    filterAddress() {
      Address.queryAddress(this.currentOrder.orgId, {
        deleteFlag: false,
        orgId: this.currentOrder.orgId,
        auditedStatus: '1', status: 0
      }).then(res => {
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
      for (let key in utils.outOrderType) {
        if (order.state === utils.outOrderType[key].state) {
          state = utils.outOrderType[key].title;
        }
      }
      return state;
    },
    check() {
      this.$refs['orderAddForm'].validate((valid) => {
        if (!valid) {
          return false;
        }
        this.$emit('checkPass');
      });
    }
  }
};
</script>
