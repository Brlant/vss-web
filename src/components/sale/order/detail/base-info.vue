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
        <el-row style="margin-bottom:0;position: relative" v-show=" currentOrder.bizType !== '2-2' ">
          <el-col :span="12">
            <oms-row label="货主订单号" :span="span">
              {{currentOrder.orderNo}}
            </oms-row>
            <oms-row label="货主" :span="span">
              {{currentOrder.orgName}}
            </oms-row>
            <oms-row label="收货单位" :span="span">
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
        <el-form ref="orderAddForm" :rules="rules" :model="currentOrder"
                 label-width="160px" style="padding-right: 20px">
          <el-form-item label="物流方式" prop="transportationMeansId">
            <el-select type="text" v-model="currentOrder.transportationMeansId" placeholder="请选择物流方式">
              <el-option :value="item.key" :key="item.key" :label="item.label"
                         v-for="item in transportationMeansList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收货地址" prop="transportationAddress">
            <el-select placeholder="请选择收货单位收货地址" v-model="currentOrder.transportationAddress"
                       @change="changeWarehouseAdress"
                       filterable clearable>
              <el-option :label="filterAddressLabel(item)" :value="item.id" :key="item.id" v-for="item in warehouses">
                <span class="pull-left">{{ item.name }}</span>
                <span class="pull-right" style="color: #999">{{ getWarehouseAdress(item) }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实际收货人">
            <oms-input type="text" placeholder="请输入实际收货人" :maxlength="50"
                       v-model="currentOrder.actualConsignee"></oms-input>
          </el-form-item>
          <el-form-item label="收货人联系电话">
            <oms-input type="text" placeholder="请输入收货人联系电话" :maxlength="50"
                       v-model="currentOrder.consigneePhone"></oms-input>
          </el-form-item>
          <el-form-item label="运输条件" prop="transportationCondition">
            <el-select type="text" placeholder="请选择运输条件" v-model="currentOrder.transportationCondition">
              <el-option :value="item.key" :key="item.key" :label="item.label"
                         v-for="item in transportationConditionList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预计送货时间" prop="transportationMeansId">
            <el-date-picker
              v-model="currentOrder.expectedTime"
              placeholder="请选择日期" format="yyyy-MM-dd" :picker-options="pickerOptions"
              value-format="timestamp">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="疾控发货地址" prop="orgAddress">
            <el-select placeholder="请选择疾控发货地址" v-model="currentOrder.orgAddress" filterable :clearable="true">
              <el-option :label="filterAddressLabel(item)" :value="item.id" :key="item.id"
                         v-for="item in LogisticsCenter">
                <span class="pull-left">{{ item.name }}</span>
                <span class="pull-right" style="color: #999">{{ getWarehouseAdress(item) }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物流商">
            <oms-input v-model="currentOrder.logisticsProviderName" placeholder="请输入物流商"></oms-input>
          </el-form-item>
          <material-part @changeRemark="changeRemark" v-if="vaccineType === '1'"></material-part>
          <el-form-item label="备注" class="clearfix">
            <oms-input type="textarea" v-model="currentOrder.remark" placeholder="请输入备注信息"
                       :autosize="{ minRows: 2, maxRows: 5}"></oms-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-else="">
        <el-row style="margin-bottom:0;position: relative" v-show=" currentOrder.bizType !== '2-2' ">
          <el-col :span="12">
            <oms-row label="货主订单号" :span="span">
              {{currentOrder.orderNo}}
            </oms-row>
            <oms-row label="货主" :span="span">
              {{currentOrder.orgName}}
            </oms-row>
            <oms-row label="收货单位" :span="span">
              {{currentOrder.customerName}}
            </oms-row>
            <oms-row label="收货地址" :span="span">
              {{currentOrder.warehouseAddress}}
            </oms-row>
            <oms-row label="物流商" :span="span">
              <span class="goods-span">
                {{currentOrder.logisticsProviderName}}
              </span>
            </oms-row>
            <oms-row label="实际收货人" :span="span">
              <span class="goods-span">{{currentOrder.actualConsignee}}</span>
            </oms-row>
            <oms-row label="收货人联系电话" :span="span">
              <span class="goods-span">{{currentOrder.consigneePhone}}</span>
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
              <span class="goods-span">{{currentOrder.createTime | minute}}</span>
            </oms-row>
            <oms-row :label="getTimeTitle(currentOrder)" v-show="currentOrder.expectedTime">
              <span class="goods-span">{{currentOrder.expectedTime | date}}</span>
            </oms-row>
            <oms-row label="订单状态">
              {{ getOrderStatus(currentOrder) }}
              <order-push-status :status="currentOrder.pushStatus" :msg="currentOrder.pushMessage"/>
            </oms-row>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:0">
          <oms-row label="疾控发货地址" :span="4">
            <span class="goods-span">{{currentOrder.outWarehouseAddress}}</span>
          </oms-row>
        </el-row>
        <el-row v-show="currentOrder.remark">
          <oms-row label="备注" :span="3">{{ currentOrder.remark }}</oms-row>
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
            <td class="text-center">批号</td>
            <!--<td>生产日期</td>-->
            <td class="text-center">有效期</td>
            <td class="text-center" v-show="vaccineType==='2'">单价</td>
            <td class="text-center">数量</td>
            <td class="text-center" v-show="vaccineType==='2'">金额</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in currentOrder.detailDtoList" v-if="item.orgGoodsDto">
            <td width="10">{{index + 1}}</td>
            <td width="80">
              <el-tooltip v-if="$formatPhotoUrl(item)" popperClass="el-tooltip" class="item"
                          effect="light" placement="right">
                <compressed-img :src="$formatPhotoUrl(item) +'?image&action=resize:h_80,w_80,m_2' "
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
              <div>
                <el-tooltip class="item" effect="dark" content="疫苗规格" placement="right">
                  <span style="font-size: 12px;">{{ item.orgGoodsDto.goodsDto.specifications }}</span>
                </el-tooltip>
              </div>
            </td>
            <td width="100px" class="R text-center">
              {{ item.batchNumber || '无' }}
              <!--<el-tag v-show="item.inEffectiveFlag" type="warning">近效期</el-tag>-->
              <goods-status-tag :item="item" :form="currentOrder"/>
            </td>
            <!--<td>{{ item.productionDate | date }}</td>-->
            <td width="90px" class="text-center">{{ item.expiryDate | date }}</td>
            <td width="80px" class="text-center" v-show="vaccineType==='2'">
              <span v-if="item.unitPrice">￥{{item.unitPrice | formatMoney}}</span>
              <span v-if="!item.unitPrice">-</span>
            </td>
            <td width="80px" class="text-center">
              {{item.amount}}
              <dict :dict-group="'measurementUnit'" :dict-key="item.orgGoodsDto.goodsDto.measurementUnit"></dict>
            </td>
            <td class="text-center" v-show="vaccineType==='2'">
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
            <td colspan="2" align="right" v-show="vaccineType==='2'">
            <span style="font-weight:600;"
                  v-show="currentOrder.totalAmount">合计: ¥  {{ currentOrder.totalAmount | formatMoney
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
        rules: {
          transportationMeansId: [
            {required: true, message: '请选择物流方式', trigger: 'change'}
          ],
          transportationAddress: [
            {required: true, message: '请选择收货单位收货地址', trigger: 'change'}
          ],
          orgAddress: [
            {required: true, message: '请选择疾控发货地址', trigger: 'change'}
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
        return name + this.getWarehouseAdress(item);
      },
      getTimeTitle: function (item) {
        return item.transportationMeansId === '0' ? item.bizType === '2-1' ? '预计出库' : '预计送货'
          : item.transportationMeansId === '1' ? '预计提货'
            : item.transportationMeansId === '2' ? '预计发货' : '';
      },
      getWarehouseAdress: function (item) { // 得到仓库地址
        return item.detail;
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
      filterLogisticsCenter: function () {// 过滤物流商
        let param = {
          deleteFlag: false
        };
        LogisticsCenter.query(param).then(res => {
          this.LogisticsCenter = res.data;
        });
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
